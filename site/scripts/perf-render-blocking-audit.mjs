#!/usr/bin/env node
/**
 * Static HTML audit + network trace analysis for render-blocking resources.
 *
 * Two passes:
 *   1. Parse built HTML files for render-blocking patterns (sync scripts, head
 *      order, preload correctness).
 *   2. Use Chrome DevTools Protocol (via chrome-launcher) to capture a network
 *      trace and identify the actual waterfall: connection time to third-party
 *      domains, script download + parse time, and how they delay FCP/LCP.
 *
 * Usage:
 *   cd site && npm run build && node scripts/perf-render-blocking-audit.mjs
 *
 * Options (env):
 *   BASE_URL    Remote origin (skips local serve + HTML parse)
 *   PERF_PATHS  Comma-separated paths (default: /sv/stockholm/)
 *   PERF_OUT    Output JSON (default: reports/perf-render-blocking-audit.json)
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as chromeLauncher from "chrome-launcher";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "..");
const distDir = join(siteRoot, "dist");
const outRel = process.env.PERF_OUT || "reports/perf-render-blocking-audit.json";
const outPath = join(siteRoot, outRel);

/* ---------- Part 1: Static HTML analysis ---------- */

function findHtmlFiles(dir) {
  const files = [];
  function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".html")) files.push(p);
    }
  }
  walk(dir);
  return files;
}

const SCRIPT_TAG_RE = /<script\b([^>]*)(?:>([\s\S]*?)<\/script>|\/?>)/gi;
const SRC_RE = /\bsrc\s*=\s*["']([^"']+)["']/i;

function analyzeHtml(htmlPath, siteRootPath) {
  const html = readFileSync(htmlPath, "utf8");
  const relPath = relative(siteRootPath, htmlPath);
  const findings = [];

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return { file: relPath, findings: [{ severity: "warn", message: "No <head> found" }] };

  const headContent = headMatch[1];
  let match;
  SCRIPT_TAG_RE.lastIndex = 0;

  while ((match = SCRIPT_TAG_RE.exec(headContent)) !== null) {
    const attrs = match[1] || "";
    const inline = (match[2] || "").trim();
    const srcMatch = attrs.match(SRC_RE);
    const src = srcMatch ? srcMatch[1] : null;
    const hasAsync = /\basync\b/i.test(attrs);
    const hasDefer = /\bdefer\b/i.test(attrs);
    const hasType = /\btype\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const typeVal = hasType ? hasType[1] : null;

    if (typeVal === "application/ld+json" || typeVal === "importmap") continue;

    if (src && !hasAsync && !hasDefer) {
      const isThirdParty = /^https?:\/\//.test(src) && !/127\.0\.0\.1|localhost/.test(src);
      findings.push({
        severity: "critical",
        type: "sync-external-script-in-head",
        src,
        isThirdParty,
        message: `Synchronous <script src="${src}"> in <head> blocks parsing and rendering.${isThirdParty ? " THIRD-PARTY: adds DNS + TLS + download latency to critical path." : ""}`,
        fix: isThirdParty
          ? 'Add async or defer attribute. For consent managers, use async and ensure consent defaults are set BEFORE the async script runs (they already are via the inline dataLayer/gtag script).'
          : "Add async or defer if execution order allows.",
      });
    }

    if (!src && inline) {
      const isGtmBootstrap = inline.includes("gtm.js") || inline.includes("gtm.start");
      const isConsentDefaults = inline.includes("consent") && inline.includes("default");

      if (isGtmBootstrap) {
        findings.push({
          severity: "info",
          type: "gtm-bootstrap-inline",
          message: "GTM bootstrap is inline (good: no extra network request for the loader). The dynamically inserted gtm.js script uses async.",
        });
      } else if (isConsentDefaults) {
        findings.push({
          severity: "info",
          type: "consent-defaults-inline",
          message: "Consent Mode defaults set inline before GTM (correct order).",
        });
      } else if (inline.length > 500) {
        findings.push({
          severity: "warn",
          type: "large-inline-script",
          size: inline.length,
          message: `Large inline script in <head> (${inline.length} chars). Consider moving to a deferred external file if not critical-path.`,
        });
      }
    }
  }

  const cmpBundleIndex = headContent.search(/cookie-consent-init|cookieconsent/i);
  const gtmIndex = headContent.indexOf("googletagmanager.com");
  const firstPreloadIndex = headContent.indexOf('rel="preload"');

  if (cmpBundleIndex > -1 && firstPreloadIndex > -1 && cmpBundleIndex < firstPreloadIndex) {
    findings.push({
      severity: "warn",
      type: "cmp-before-preloads",
      message:
        "CookieConsent-related script reference appears BEFORE LCP preloads in <head>. The browser may discover preloads later than ideal.",
      fix: "Move LCP preload <link> tags above non-critical scripts in <head> so the preload scanner finds them immediately.",
    });
  }

  if (cmpBundleIndex > -1 && gtmIndex > -1 && cmpBundleIndex < gtmIndex) {
    findings.push({
      severity: "info",
      type: "cmp-before-gtm",
      message: "CMP bundle loads before GTM (good: consent defaults and updates should be available when GTM runs).",
    });
  }

  return { file: relPath, findings };
}

/* ---------- Part 2: Network trace via CDP ---------- */

async function captureNetworkTrace(url, chromePort) {
  const { default: CDP } = await import("chrome-remote-interface");
  const client = await CDP({ port: chromePort });
  const { Network, Page, Performance: Perf } = client;

  const requests = new Map();
  const resourceTimings = [];

  Network.requestWillBeSent(({ requestId, request, timestamp, type, initiator }) => {
    requests.set(requestId, {
      url: request.url,
      method: request.method,
      type,
      initiator: initiator?.type,
      initiatorUrl: initiator?.url || initiator?.stack?.callFrames?.[0]?.url || null,
      startTime: timestamp,
      priority: request.initialPriority,
    });
  });

  Network.responseReceived(({ requestId, response, timestamp }) => {
    const req = requests.get(requestId);
    if (req) {
      req.statusCode = response.status;
      req.mimeType = response.mimeType;
      req.protocol = response.protocol;
      req.responseTime = timestamp;
      req.headers = response.headers;
      req.encodedDataLength = response.encodedDataLength;
      req.timing = response.timing;
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

  const loadPromise = new Promise((resolve) => {
    Page.loadEventFired(() => resolve());
  });

  await Page.navigate({ url });
  await loadPromise;
  await new Promise((r) => setTimeout(r, 2000));

  const metrics = await Perf.getMetrics();
  await client.close();

  const entries = [...requests.values()]
    .filter((r) => r.endTime)
    .sort((a, b) => a.startTime - b.startTime);

  const thirdPartyDomains = new Map();
  for (const entry of entries) {
    try {
      const hostname = new URL(entry.url).hostname;
      if (hostname === "127.0.0.1" || hostname === "localhost") continue;
      if (!thirdPartyDomains.has(hostname)) {
        thirdPartyDomains.set(hostname, { requests: 0, totalBytes: 0, totalTimeMs: 0, entries: [] });
      }
      const domain = thirdPartyDomains.get(hostname);
      domain.requests++;
      domain.totalBytes += entry.totalBytes || 0;
      domain.totalTimeMs += ((entry.endTime || 0) - (entry.startTime || 0)) * 1000;
      domain.entries.push({
        url: entry.url.length > 120 ? entry.url.slice(0, 117) + "..." : entry.url,
        type: entry.type,
        priority: entry.priority,
        durationMs: Math.round(((entry.endTime || 0) - (entry.startTime || 0)) * 1000),
        bytes: entry.totalBytes || 0,
        dnsMs: entry.timing?.dnsEnd != null ? Math.round(entry.timing.dnsEnd - (entry.timing.dnsStart || 0)) : null,
        connectMs: entry.timing?.connectEnd != null ? Math.round(entry.timing.connectEnd - (entry.timing.connectStart || 0)) : null,
        sslMs: entry.timing?.sslEnd != null ? Math.round(entry.timing.sslEnd - (entry.timing.sslStart || 0)) : null,
        ttfbMs: entry.timing?.receiveHeadersEnd != null ? Math.round(entry.timing.receiveHeadersEnd) : null,
        initiator: entry.initiator,
        initiatorUrl: entry.initiatorUrl,
      });
    } catch {
      /* non-URL entry */
    }
  }

  const scriptEntries = entries.filter(
    (e) => e.type === "Script" && /^https?:\/\//.test(e.url) && !/127\.0\.0\.1|localhost/.test(e.url),
  );

  const renderBlockingScripts = scriptEntries
    .filter((e) => e.priority === "High" || e.priority === "VeryHigh")
    .map((e) => ({
      url: e.url,
      priority: e.priority,
      durationMs: Math.round(((e.endTime || 0) - (e.startTime || 0)) * 1000),
      bytes: e.totalBytes || 0,
      dnsMs: e.timing?.dnsEnd != null ? Math.round(e.timing.dnsEnd - (e.timing.dnsStart || 0)) : null,
      connectMs: e.timing?.connectEnd != null ? Math.round(e.timing.connectEnd - (e.timing.connectStart || 0)) : null,
      sslMs: e.timing?.sslEnd != null ? Math.round(e.timing.sslEnd - (e.timing.sslStart || 0)) : null,
    }));

  return {
    url,
    totalRequests: entries.length,
    thirdPartyDomains: Object.fromEntries(
      [...thirdPartyDomains.entries()].map(([domain, data]) => [
        domain,
        {
          requests: data.requests,
          totalKb: Math.round((data.totalBytes / 1024) * 10) / 10,
          totalTimeMs: Math.round(data.totalTimeMs),
          entries: data.entries,
        },
      ]),
    ),
    renderBlockingScripts,
    performanceMetrics: Object.fromEntries(metrics.metrics.map((m) => [m.name, m.value])),
  };
}

/* ---------- Serve + orchestrate ---------- */

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

  /* Part 1: static HTML analysis (only for local dist/) */
  const htmlFindings = [];
  if (existsSync(distDir)) {
    console.log("=== Part 1: Static HTML analysis ===\n");
    const htmlFiles = findHtmlFiles(distDir);
    for (const f of htmlFiles) {
      const result = analyzeHtml(f, siteRoot);
      if (result.findings.length > 0) htmlFindings.push(result);
    }

    const criticals = htmlFindings.flatMap((f) =>
      f.findings.filter((x) => x.severity === "critical").map((x) => ({ ...x, file: f.file })),
    );

    if (criticals.length > 0) {
      console.log(`CRITICAL findings (${criticals.length}):\n`);
      for (const c of criticals) {
        console.log(`  [${c.file}]`);
        console.log(`    ${c.message}`);
        if (c.fix) console.log(`    FIX: ${c.fix}`);
        console.log();
      }
    }

    const uniqueFindings = new Map();
    for (const f of htmlFindings) {
      for (const finding of f.findings) {
        const key = `${finding.type}:${finding.src || finding.message}`;
        if (!uniqueFindings.has(key)) {
          uniqueFindings.set(key, { ...finding, affectedFiles: [f.file] });
        } else {
          uniqueFindings.get(key).affectedFiles.push(f.file);
        }
      }
    }

    console.log("Unique findings across all HTML files:\n");
    for (const [, finding] of uniqueFindings) {
      const icon = finding.severity === "critical" ? "!!" : finding.severity === "warn" ? " !" : "  ";
      console.log(
        `  ${icon} [${finding.severity}] ${finding.message} (${finding.affectedFiles.length} file(s))`,
      );
    }
  }

  /* Part 2: Network trace */
  console.log("\n\n=== Part 2: Network waterfall trace ===\n");

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  let origin;
  let serveProc = null;
  const port = 4300 + Math.floor(Math.random() * 200);

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

  const networkResults = {};
  for (const path of paths) {
    const url = `${origin}${path}`;
    process.stderr.write(`Tracing ${url}...\n`);
    try {
      networkResults[path] = await captureNetworkTrace(url, chrome.port);
    } catch (e) {
      networkResults[path] = { error: e.message };
    }
  }

  await chrome.kill();
  if (serveProc) serveProc.kill("SIGTERM");

  for (const [path, trace] of Object.entries(networkResults)) {
    if (trace.error) {
      console.log(`${path}: ERROR: ${trace.error}`);
      continue;
    }
    console.log(`\n--- ${path} (${trace.totalRequests} total requests) ---`);

    if (trace.renderBlockingScripts.length > 0) {
      console.log("\n  Render-blocking external scripts (High/VeryHigh priority):");
      for (const s of trace.renderBlockingScripts) {
        console.log(
          `    ${s.url}\n      duration=${s.durationMs}ms, bytes=${s.bytes}, DNS=${s.dnsMs ?? "?"}ms, connect=${s.connectMs ?? "?"}ms, SSL=${s.sslMs ?? "?"}ms`,
        );
      }
    }

    console.log("\n  Third-party domains:");
    const domains = Object.entries(trace.thirdPartyDomains).sort(
      ([, a], [, b]) => b.totalTimeMs - a.totalTimeMs,
    );
    for (const [domain, data] of domains) {
      console.log(
        `    ${domain}: ${data.requests} reqs, ${data.totalKb}KB, ${data.totalTimeMs}ms total`,
      );
    }
  }

  mkdirSync(dirname(outPath), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    origin,
    htmlFindings,
    networkTraces: networkResults,
  };
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`\nDetailed results: ${relative(siteRoot, outPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
