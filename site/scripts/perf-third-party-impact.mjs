#!/usr/bin/env node
/**
 * A/B Lighthouse comparison: measures performance with and without third-party
 * scripts (self-hosted CookieConsent bundle, GTM) to isolate their impact.
 *
 * Runs mobile Lighthouse on a set of representative URLs under four scenarios:
 *   1. baseline    — all scripts load normally
 *   2. no-cmp      — CookieConsent-related bundles blocked (`/_astro/` cookie-consent paths)
 *   3. no-gtm      — GTM blocked
 *   4. no-tracking — both CMP and GTM blocked
 *
 * Uses Lighthouse `blockedUrlPatterns` to simulate blocking at the network level.
 *
 * Usage:
 *   cd site && npm run build && node scripts/perf-third-party-impact.mjs
 *
 * Options (env):
 *   BASE_URL          Hit a remote origin instead of local dist/ (no trailing slash)
 *   PERF_PATHS        Comma-separated paths (default: representative sample)
 *   PERF_RUNS         Runs per scenario per URL for stability (default: 3)
 *   PERF_OUT          Output JSON path (default: reports/perf-third-party-impact.json)
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "..");
const distDir = join(siteRoot, "dist");

/** Block Astro-bundled CMP init and vendor CSS (same-origin paths). */
const CMP_PATTERNS = ["*cookie-consent-init*", "*cookieconsent*"];
const GTM_PATTERN = "*googletagmanager.com*";

const SCENARIOS = [
  { id: "baseline", label: "All scripts (baseline)", blocked: [] },
  { id: "no-cmp", label: "CookieConsent bundles blocked", blocked: CMP_PATTERNS },
  { id: "no-gtm", label: "GTM blocked", blocked: [GTM_PATTERN] },
  {
    id: "no-tracking",
    label: "CMP + GTM blocked",
    blocked: [...CMP_PATTERNS, GTM_PATTERN],
  },
];

const DEFAULT_PATHS = [
  "/sv/stockholm/",
  "/en/stockholm/",
  "/sv/stockholm/integritetspolicy/",
  "/en/stockholm/visitor-reviews/",
  "/de/berlin/",
];

const runsPerScenario = Number(process.env.PERF_RUNS) || 3;
const outRel = process.env.PERF_OUT || "reports/perf-third-party-impact.json";
const outPath = join(siteRoot, outRel);

function pickMetric(lhr, id) {
  const a = lhr.audits?.[id];
  return a?.numericValue ?? null;
}

function median(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
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
  throw new Error(`Timeout waiting for ${origin}`);
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

async function runLighthouse(url, chromePort, blockedUrlPatterns) {
  const config = {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: ["performance"],
      formFactor: "mobile",
      blockedUrlPatterns,
    },
  };

  const result = await lighthouse(
    url,
    { logLevel: "error", port: chromePort, disableFullPageScreenshot: true },
    config,
  );
  const lhr = result.lhr;
  return {
    performance: lhr.categories.performance?.score != null
      ? Math.round(lhr.categories.performance.score * 100)
      : null,
    fcpMs: pickMetric(lhr, "first-contentful-paint"),
    lcpMs: pickMetric(lhr, "largest-contentful-paint"),
    tbtMs: pickMetric(lhr, "total-blocking-time"),
    cls: pickMetric(lhr, "cumulative-layout-shift"),
    siMs: pickMetric(lhr, "speed-index"),
    renderBlockingRequests: lhr.audits["render-blocking-resources"]?.details?.items?.length ?? 0,
    renderBlockingMs: lhr.audits["render-blocking-resources"]?.numericValue ?? 0,
    thirdPartyMainThreadMs: lhr.audits["third-party-summary"]?.details?.items?.reduce(
      (sum, item) => sum + (item.mainThreadTime ?? 0),
      0,
    ) ?? 0,
    thirdPartyTransferKb: lhr.audits["third-party-summary"]?.details?.items?.reduce(
      (sum, item) => sum + (item.transferSize ?? 0),
      0,
    ) / 1024 ?? 0,
    thirdPartySummary: lhr.audits["third-party-summary"]?.details?.items?.map((item) => ({
      entity: item.entity,
      transferSizeKb: Math.round((item.transferSize ?? 0) / 1024 * 10) / 10,
      mainThreadMs: Math.round(item.mainThreadTime ?? 0),
    })) ?? [],
  };
}

function formatMs(ms) {
  return ms != null ? `${(ms / 1000).toFixed(2)}s` : "—";
}

function formatScore(s) {
  return s != null ? String(s) : "ERR";
}

function printComparisonTable(pathResults) {
  const header = "Scenario | Perf | FCP | LCP | TBT (ms) | CLS | SI | RB Reqs | RB ms | 3P Thread ms | 3P KB";
  const sep = header.replace(/[^|]/g, "-");

  console.log(`\n${header}`);
  console.log(sep);

  for (const row of pathResults) {
    console.log(
      [
        row.scenario.padEnd(18),
        formatScore(row.performance),
        formatMs(row.fcpMs),
        formatMs(row.lcpMs),
        row.tbtMs != null ? String(Math.round(row.tbtMs)) : "—",
        row.cls != null ? row.cls.toFixed(3) : "—",
        formatMs(row.siMs),
        String(row.renderBlockingRequests),
        String(Math.round(row.renderBlockingMs)),
        String(Math.round(row.thirdPartyMainThreadMs)),
        String(Math.round(row.thirdPartyTransferKb)),
      ].join(" | "),
    );
  }
}

async function main() {
  if (!process.env.BASE_URL && !existsSync(distDir)) {
    console.error("No dist/ — run: npm run build");
    process.exit(1);
  }

  const paths = process.env.PERF_PATHS
    ? process.env.PERF_PATHS.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_PATHS;

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  let origin;
  let serveProc = null;
  const port = 4100 + Math.floor(Math.random() * 200);

  if (baseUrl) {
    origin = baseUrl;
    await waitForOrigin(origin);
  } else {
    origin = `http://127.0.0.1:${port}`;
    serveProc = startLocalServe(port);
    await waitForOrigin(origin);
  }

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  const allResults = {};
  const totalRuns = paths.length * SCENARIOS.length * runsPerScenario;
  let runCount = 0;

  for (const path of paths) {
    const url = `${origin}${path}`;
    allResults[path] = {};

    for (const scenario of SCENARIOS) {
      const runs = [];
      for (let r = 0; r < runsPerScenario; r++) {
        runCount++;
        process.stderr.write(
          `[${runCount}/${totalRuns}] ${scenario.id} | ${path} (run ${r + 1}/${runsPerScenario})\n`,
        );
        try {
          const result = await runLighthouse(url, chrome.port, scenario.blocked);
          runs.push(result);
        } catch (e) {
          process.stderr.write(`  ERROR: ${e.message}\n`);
          runs.push({ error: e.message });
        }
      }

      const validRuns = runs.filter((r) => !r.error);
      const aggregated = validRuns.length > 0
        ? {
            performance: median(validRuns.map((r) => r.performance).filter((v) => v != null)),
            fcpMs: median(validRuns.map((r) => r.fcpMs).filter((v) => v != null)),
            lcpMs: median(validRuns.map((r) => r.lcpMs).filter((v) => v != null)),
            tbtMs: median(validRuns.map((r) => r.tbtMs).filter((v) => v != null)),
            cls: median(validRuns.map((r) => r.cls).filter((v) => v != null)),
            siMs: median(validRuns.map((r) => r.siMs).filter((v) => v != null)),
            renderBlockingRequests: median(validRuns.map((r) => r.renderBlockingRequests)),
            renderBlockingMs: median(validRuns.map((r) => r.renderBlockingMs)),
            thirdPartyMainThreadMs: median(validRuns.map((r) => r.thirdPartyMainThreadMs)),
            thirdPartyTransferKb: median(validRuns.map((r) => r.thirdPartyTransferKb)),
            thirdPartySummary: validRuns[0]?.thirdPartySummary ?? [],
            rawRuns: runs,
          }
        : { error: "all runs failed", rawRuns: runs };

      allResults[path][scenario.id] = aggregated;
    }

    console.log(`\n=== ${path} ===`);
    const rows = SCENARIOS.map((s) => ({
      scenario: s.label,
      ...allResults[path][s.id],
    }));
    printComparisonTable(rows);

    const baseline = allResults[path]["baseline"];
    const noTracking = allResults[path]["no-tracking"];
    if (baseline?.lcpMs != null && noTracking?.lcpMs != null) {
      const lcpDelta = baseline.lcpMs - noTracking.lcpMs;
      const perfDelta = (noTracking.performance ?? 0) - (baseline.performance ?? 0);
      console.log(
        `\n  Combined tracking cost: LCP +${formatMs(lcpDelta)}, Score ${perfDelta > 0 ? "+" : ""}${perfDelta} points`,
      );
    }

    const noCmp = allResults[path]["no-cmp"];
    if (baseline?.lcpMs != null && noCmp?.lcpMs != null) {
      const lcpDelta = baseline.lcpMs - noCmp.lcpMs;
      console.log(`  CMP-only cost:         LCP +${formatMs(lcpDelta)}`);
    }

    const noGtm = allResults[path]["no-gtm"];
    if (baseline?.lcpMs != null && noGtm?.lcpMs != null) {
      const lcpDelta = baseline.lcpMs - noGtm.lcpMs;
      console.log(`  GTM-only cost:         LCP +${formatMs(lcpDelta)}`);
    }
  }

  await chrome.kill();
  if (serveProc) serveProc.kill("SIGTERM");

  console.log("\n\n=== EXECUTIVE SUMMARY ===\n");
  for (const path of paths) {
    const b = allResults[path]["baseline"];
    const nt = allResults[path]["no-tracking"];
    const nCmp = allResults[path]["no-cmp"];
    if (!b || !nt || !nCmp) continue;

    console.log(`${path}:`);
    console.log(`  Baseline:  Perf=${formatScore(b.performance)}, LCP=${formatMs(b.lcpMs)}, TBT=${Math.round(b.tbtMs ?? 0)}ms`);
    console.log(`  No tracking: Perf=${formatScore(nt.performance)}, LCP=${formatMs(nt.lcpMs)}, TBT=${Math.round(nt.tbtMs ?? 0)}ms`);

    if (b.thirdPartySummary?.length) {
      console.log("  Third-party breakdown (baseline):");
      for (const tp of b.thirdPartySummary) {
        console.log(`    ${tp.entity}: ${tp.transferSizeKb}KB, ${tp.mainThreadMs}ms main thread`);
      }
    }
    console.log();
  }

  mkdirSync(dirname(outPath), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    config: { runsPerScenario, formFactor: "mobile", origin, paths },
    scenarios: SCENARIOS.map((s) => ({ id: s.id, label: s.label })),
    results: allResults,
  };
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`\nDetailed results: ${relative(siteRoot, outPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
