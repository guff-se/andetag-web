#!/usr/bin/env node
/**
 * Deep-dive performance trace focused on self-hosted CookieConsent timing.
 *
 * Uses Chrome DevTools Protocol Performance domain to capture a CPU profile
 * and Performance timeline, then extracts:
 *   - Time from navigation start to CMP bundle fetch, parse, and execute
 *   - Time from navigation start to GTM script fetch, parse, and execute
 *   - FCP delta vs blocked scenarios
 *   - Resources fetched for CMP (same-origin `/_astro/` bundles)
 *   - Main-thread long tasks attributable to consent/tracking
 *   - Comparison of key timings vs a "no-consent" baseline
 *
 * Usage:
 *   cd site && npm run build && node scripts/perf-consent-timing.mjs
 *
 * Options (env):
 *   BASE_URL    Remote origin (skips local serve)
 *   PERF_PATHS  Comma-separated paths (default: /sv/stockholm/)
 *   PERF_OUT    Output JSON (default: reports/perf-consent-timing.json)
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as chromeLauncher from "chrome-launcher";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "..");
const distDir = join(siteRoot, "dist");
const outRel = process.env.PERF_OUT || "reports/perf-consent-timing.json";
const outPath = join(siteRoot, outRel);

const CMP_BLOCK_PATTERNS = ["*cookie-consent-init*", "*cookieconsent*"];

function isCmpResourceUrl(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes("cookie-consent-init") || u.includes("cookieconsent") || u.includes("vanilla-cookieconsent");
}

async function tracePageWithPerfTimeline(url, chromePort, label) {
  const { default: CDP } = await import("chrome-remote-interface");
  const client = await CDP({ port: chromePort });
  const { Network, Page, Performance: Perf, Tracing, Runtime } = client;

  const networkEvents = [];
  const requests = new Map();

  Network.requestWillBeSent(({ requestId, request, timestamp, type, initiator }) => {
    requests.set(requestId, {
      url: request.url,
      type,
      startTime: timestamp,
      priority: request.initialPriority,
      initiator: initiator?.type,
      initiatorUrl: initiator?.url || initiator?.stack?.callFrames?.[0]?.url || null,
    });
  });

  Network.responseReceived(({ requestId, response }) => {
    const req = requests.get(requestId);
    if (req) {
      req.statusCode = response.status;
      req.timing = response.timing;
      req.encodedDataLength = response.encodedDataLength;
    }
  });

  Network.loadingFinished(({ requestId, timestamp, encodedDataLength }) => {
    const req = requests.get(requestId);
    if (req) {
      req.endTime = timestamp;
      req.totalBytes = encodedDataLength;
    }
  });

  await Network.enable();
  await Page.enable();
  await Perf.enable();
  await Network.setCacheDisabled({ cacheDisabled: true });

  await Network.emulateNetworkConditions({
    offline: false,
    latency: 150,
    downloadThroughput: 1.6 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
  });

  const loadPromise = new Promise((resolve) => Page.loadEventFired(() => resolve()));

  const traceChunks = [];
  Tracing.dataCollected(({ value }) => traceChunks.push(...value));
  await Tracing.start({
    categories: [
      "devtools.timeline",
      "v8.execute",
      "blink.user_timing",
      "loading",
      "disabled-by-default-devtools.timeline",
    ].join(","),
  });

  await Page.navigate({ url });
  await loadPromise;
  await new Promise((r) => setTimeout(r, 3000));

  await Tracing.end();
  await new Promise((resolve) => Tracing.tracingComplete(() => resolve()));

  const perfTimings = await Runtime.evaluate({
    expression: `JSON.stringify(performance.getEntriesByType('navigation').concat(performance.getEntriesByType('resource')).concat(performance.getEntriesByType('paint')))`,
    returnByValue: true,
  });

  const metricsResult = await Perf.getMetrics();
  await client.close();

  const perfEntries = JSON.parse(perfTimings.result.value);

  const navigationEntry = perfEntries.find((e) => e.entryType === "navigation");
  const paintEntries = perfEntries.filter((e) => e.entryType === "paint");
  const resourceEntries = perfEntries.filter((e) => e.entryType === "resource");

  const cmpResources = resourceEntries.filter((e) => isCmpResourceUrl(e.name));
  const gtmResources = resourceEntries.filter((e) => e.name.includes("googletagmanager.com"));

  const fcp = paintEntries.find((e) => e.name === "first-contentful-paint");
  const fp = paintEntries.find((e) => e.name === "first-paint");

  const longTasks = traceChunks.filter(
    (e) => e.cat === "devtools.timeline" && e.name === "RunTask" && (e.dur || 0) > 50_000,
  );

  const evalEvents = traceChunks.filter(
    (e) => e.name === "EvaluateScript" || e.name === "v8.compile",
  );

  const cmpEvals = evalEvents.filter((e) => {
    const u = e.args?.data?.url || "";
    const st = e.args?.data?.stackTrace;
    return isCmpResourceUrl(u) || (Array.isArray(st) && st.some((f) => isCmpResourceUrl(f.url)));
  });
  const gtmEvals = evalEvents.filter(
    (e) => e.args?.data?.url?.includes("googletagmanager.com"),
  );

  const cmpChainedRequests = [];
  const allEntries = [...requests.values()].filter((r) => r.endTime);
  for (const entry of allEntries) {
    if (
      isCmpResourceUrl(entry.initiatorUrl) ||
      (isCmpResourceUrl(entry.url) && entry.url !== cmpResources[0]?.name)
    ) {
      cmpChainedRequests.push({
        url: entry.url.length > 120 ? entry.url.slice(0, 117) + "..." : entry.url,
        type: entry.type,
        durationMs: Math.round(((entry.endTime || 0) - (entry.startTime || 0)) * 1000),
        bytes: entry.totalBytes || 0,
      });
    }
  }

  return {
    label,
    url,
    navigation: navigationEntry
      ? {
          domInteractiveMs: Math.round(navigationEntry.domInteractive),
          domContentLoadedMs: Math.round(navigationEntry.domContentLoadedEventEnd),
          loadEventMs: Math.round(navigationEntry.loadEventEnd),
          ttfbMs: Math.round(navigationEntry.responseStart),
        }
      : null,
    paint: {
      firstPaintMs: fp ? Math.round(fp.startTime) : null,
      firstContentfulPaintMs: fcp ? Math.round(fcp.startTime) : null,
    },
    cmp: {
      resourceCount: cmpResources.length,
      resources: cmpResources.map((r) => ({
        url: r.name.length > 120 ? r.name.slice(0, 117) + "..." : r.name,
        startMs: Math.round(r.startTime),
        durationMs: Math.round(r.duration),
        transferSizeKb: Math.round((r.transferSize || 0) / 1024 * 10) / 10,
        initiatorType: r.initiatorType,
        dnsMs: Math.round((r.domainLookupEnd || 0) - (r.domainLookupStart || 0)),
        connectMs: Math.round((r.connectEnd || 0) - (r.connectStart || 0)),
        sslMs: Math.round((r.secureConnectionStart > 0 ? (r.connectEnd || 0) - r.secureConnectionStart : 0)),
        waitMs: Math.round((r.responseStart || 0) - (r.requestStart || 0)),
        downloadMs: Math.round((r.responseEnd || 0) - (r.responseStart || 0)),
        renderBlocking: r.renderBlockingStatus || "unknown",
      })),
      chainedRequests: cmpChainedRequests,
      evalEventsCount: cmpEvals.length,
      totalEvalDurationMs: cmpEvals.reduce((sum, e) => sum + ((e.dur || 0) / 1000), 0),
    },
    gtm: {
      resourceCount: gtmResources.length,
      resources: gtmResources.map((r) => ({
        url: r.name.length > 120 ? r.name.slice(0, 117) + "..." : r.name,
        startMs: Math.round(r.startTime),
        durationMs: Math.round(r.duration),
        transferSizeKb: Math.round((r.transferSize || 0) / 1024 * 10) / 10,
        initiatorType: r.initiatorType,
        renderBlocking: r.renderBlockingStatus || "unknown",
      })),
      evalEventsCount: gtmEvals.length,
      totalEvalDurationMs: gtmEvals.reduce((sum, e) => sum + ((e.dur || 0) / 1000), 0),
    },
    longTasks: {
      count: longTasks.length,
      totalDurationMs: Math.round(longTasks.reduce((sum, t) => sum + ((t.dur || 0) / 1000), 0)),
    },
    performanceMetrics: Object.fromEntries(metricsResult.metrics.map((m) => [m.name, m.value])),
  };
}

async function traceWithBlocking(url, chromePort, blockedPatterns, label) {
  const { default: CDP } = await import("chrome-remote-interface");
  const client = await CDP({ port: chromePort });
  const { Network, Page, Performance: Perf, Runtime } = client;

  await Network.enable();
  await Page.enable();
  await Perf.enable();
  await Network.setCacheDisabled({ cacheDisabled: true });

  await Network.emulateNetworkConditions({
    offline: false,
    latency: 150,
    downloadThroughput: 1.6 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
  });

  if (blockedPatterns.length > 0) {
    await Network.setBlockedURLs({ urls: blockedPatterns });
  }

  const loadPromise = new Promise((resolve) => Page.loadEventFired(() => resolve()));
  await Page.navigate({ url });
  await loadPromise;
  await new Promise((r) => setTimeout(r, 2000));

  const perfTimings = await Runtime.evaluate({
    expression: `JSON.stringify(performance.getEntriesByType('navigation').concat(performance.getEntriesByType('paint')))`,
    returnByValue: true,
  });
  const metricsResult = await Perf.getMetrics();
  await client.close();

  const perfEntries = JSON.parse(perfTimings.result.value);
  const nav = perfEntries.find((e) => e.entryType === "navigation");
  const fcp = perfEntries.find((e) => e.name === "first-contentful-paint");
  const fp = perfEntries.find((e) => e.name === "first-paint");

  return {
    label,
    url,
    blocked: blockedPatterns,
    navigation: nav
      ? {
          domInteractiveMs: Math.round(nav.domInteractive),
          domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
          loadEventMs: Math.round(nav.loadEventEnd),
          ttfbMs: Math.round(nav.responseStart),
        }
      : null,
    paint: {
      firstPaintMs: fp ? Math.round(fp.startTime) : null,
      firstContentfulPaintMs: fcp ? Math.round(fcp.startTime) : null,
    },
    performanceMetrics: Object.fromEntries(metricsResult.metrics.map((m) => [m.name, m.value])),
  };
}

async function waitForOrigin(origin, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${origin}/`, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Timeout: ${origin}`);
}

function startLocalServe(port) {
  const serveJs = join(siteRoot, "node_modules", "serve", "build", "main.js");
  if (!existsSync(serveJs)) throw new Error("Missing serve; run npm install in site/");
  return spawn(process.execPath, [serveJs, distDir, "-l", String(port), "--no-clipboard"], {
    cwd: siteRoot,
    stdio: "ignore",
    detached: false,
  });
}

async function main() {
  if (!process.env.BASE_URL && !existsSync(distDir)) {
    console.error("No dist/ — run: npm run build");
    process.exit(1);
  }

  const paths = process.env.PERF_PATHS
    ? process.env.PERF_PATHS.split(",").map((s) => s.trim()).filter(Boolean)
    : ["/sv/stockholm/"];

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  let origin;
  let serveProc = null;
  const port = 4500 + Math.floor(Math.random() * 200);

  if (baseUrl) {
    origin = baseUrl;
  } else {
    origin = `http://127.0.0.1:${port}`;
    serveProc = startLocalServe(port);
  }
  await waitForOrigin(origin);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  const allResults = {};

  for (const path of paths) {
    const url = `${origin}${path}`;
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Tracing: ${url}`);
    console.log("=".repeat(60));

    const fullTrace = await tracePageWithPerfTimeline(url, chrome.port, "full-trace");

    const noCmp = await traceWithBlocking(url, chrome.port, CMP_BLOCK_PATTERNS, "no-cmp");
    const noGtm = await traceWithBlocking(url, chrome.port, ["*googletagmanager.com*"], "no-gtm");
    const noTracking = await traceWithBlocking(
      url,
      chrome.port,
      [...CMP_BLOCK_PATTERNS, "*googletagmanager.com*"],
      "no-tracking",
    );

    allResults[path] = { fullTrace, noCmp, noGtm, noTracking };

    console.log("\n--- Navigation Timing ---");
    console.log("Scenario            | TTFB   | FP     | FCP    | DOMi   | DCL    | Load");
    console.log("-".repeat(90));
    for (const [label, data] of [
      ["With all scripts", fullTrace],
      ["No CMP", noCmp],
      ["No GTM", noGtm],
      ["No tracking", noTracking],
    ]) {
      const n = data.navigation;
      const p = data.paint;
      console.log(
        [
          label.padEnd(20),
          n?.ttfbMs != null ? `${n.ttfbMs}ms` : "—",
          p?.firstPaintMs != null ? `${p.firstPaintMs}ms` : "—",
          p?.firstContentfulPaintMs != null ? `${p.firstContentfulPaintMs}ms` : "—",
          n?.domInteractiveMs != null ? `${n.domInteractiveMs}ms` : "—",
          n?.domContentLoadedMs != null ? `${n.domContentLoadedMs}ms` : "—",
          n?.loadEventMs != null ? `${n.loadEventMs}ms` : "—",
        ]
          .map((s) => s.padEnd(8))
          .join("| "),
      );
    }

    if (fullTrace.paint.firstContentfulPaintMs != null && noTracking.paint.firstContentfulPaintMs != null) {
      const fcpDelta = fullTrace.paint.firstContentfulPaintMs - noTracking.paint.firstContentfulPaintMs;
      console.log(`\n  FCP penalty from tracking scripts: ${fcpDelta}ms`);
    }
    if (fullTrace.paint.firstContentfulPaintMs != null && noCmp.paint.firstContentfulPaintMs != null) {
      const fcpDelta = fullTrace.paint.firstContentfulPaintMs - noCmp.paint.firstContentfulPaintMs;
      console.log(`  FCP penalty from CMP alone:        ${fcpDelta}ms`);
    }

    console.log("\n--- CookieConsent (CMP) resource cascade ---");
    console.log(`  Primary resources: ${fullTrace.cmp.resourceCount}`);
    for (const r of fullTrace.cmp.resources) {
      console.log(
        `    ${r.url}\n      start=${r.startMs}ms, dur=${r.durationMs}ms, size=${r.transferSizeKb}KB, ` +
          `DNS=${r.dnsMs}ms, connect=${r.connectMs}ms, SSL=${r.sslMs}ms, wait=${r.waitMs}ms, dl=${r.downloadMs}ms, ` +
          `blocking=${r.renderBlocking}`,
      );
    }
    if (fullTrace.cmp.chainedRequests.length > 0) {
      console.log(`  Chained (initiated by CMP): ${fullTrace.cmp.chainedRequests.length}`);
      for (const r of fullTrace.cmp.chainedRequests) {
        console.log(`    ${r.url} (${r.type}, ${r.durationMs}ms, ${r.bytes}B)`);
      }
    }
    console.log(`  Script evaluation events: ${fullTrace.cmp.evalEventsCount}, total=${Math.round(fullTrace.cmp.totalEvalDurationMs)}ms`);

    console.log("\n--- GTM resource cascade ---");
    console.log(`  Primary resources: ${fullTrace.gtm.resourceCount}`);
    for (const r of fullTrace.gtm.resources) {
      console.log(`    ${r.url}\n      start=${r.startMs}ms, dur=${r.durationMs}ms, size=${r.transferSizeKb}KB, blocking=${r.renderBlocking}`);
    }
    console.log(`  Script evaluation events: ${fullTrace.gtm.evalEventsCount}, total=${Math.round(fullTrace.gtm.totalEvalDurationMs)}ms`);

    console.log(`\n--- Long tasks: ${fullTrace.longTasks.count}, total ${fullTrace.longTasks.totalDurationMs}ms ---`);
  }

  await chrome.kill();
  if (serveProc) serveProc.kill("SIGTERM");

  console.log("\n\n=== DIAGNOSIS ===\n");
  for (const [path, data] of Object.entries(allResults)) {
    const full = data.fullTrace;
    const noT = data.noCmp;
    const noAll = data.noTracking;

    console.log(`${path}:`);

    const cmpFcpCost =
      full.paint.firstContentfulPaintMs != null && noT.paint.firstContentfulPaintMs != null
        ? full.paint.firstContentfulPaintMs - noT.paint.firstContentfulPaintMs
        : null;
    const totalFcpCost =
      full.paint.firstContentfulPaintMs != null && noAll.paint.firstContentfulPaintMs != null
        ? full.paint.firstContentfulPaintMs - noAll.paint.firstContentfulPaintMs
        : null;

    if (cmpFcpCost != null) {
      console.log(`  CMP FCP cost: ${cmpFcpCost}ms`);
      if (cmpFcpCost > 200) {
        console.log("  >> SIGNIFICANT: CMP adds >200ms to FCP. Check load order (async client bundles, preloads).");
      }
    }
    if (totalFcpCost != null) {
      console.log(`  Total tracking FCP cost: ${totalFcpCost}ms`);
    }

    const cmpResources = full.cmp.resources;
    if (cmpResources.length > 0) {
      const primary = cmpResources[0];
      if (primary.renderBlocking === "blocking") {
        console.log(`  >> CONFIRMED: CMP primary resource is render-blocking (${primary.durationMs}ms)`);
      }
      if (primary.dnsMs > 50 || primary.connectMs > 100) {
        console.log(`  >> CONNECTION OVERHEAD: DNS=${primary.dnsMs}ms, connect=${primary.connectMs}ms, SSL=${primary.sslMs}ms`);
      }
    }

    if (full.cmp.chainedRequests.length > 2) {
      console.log(`  >> RESOURCE CASCADE: CMP triggers ${full.cmp.chainedRequests.length} additional requests.`);
      console.log("  >> This amplifies the render-blocking cost as the browser must wait for the full chain.");
    }

    console.log();
  }

  mkdirSync(dirname(outPath), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    origin,
    paths,
    results: allResults,
  };
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Detailed results: ${relative(siteRoot, outPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
