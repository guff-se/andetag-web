#!/usr/bin/env node
/**
 * Runs Lighthouse (performance only, mobile) on every built HTML route under dist/.
 *
 * Usage (from repo root or site/):
 *   cd site && npm run build && npm run lighthouse:all
 *
 * Options (env or argv-style):
 *   BASE_URL          If set, skip local static server and use this origin (no trailing slash).
 *   LIGHTHOUSE_OUT    Output JSON path (default: reports/lighthouse-performance.json)
 *   LIGHTHOUSE_MAX    Max pages (for smoke tests)
 *   LIGHTHOUSE_MIN    Exit 1 if any score is below this integer (default: 0 = no fail)
 *   LIGHTHOUSE_PATHS  Comma-separated site paths (for example `/de/berlin/,/sv/stockholm/`) to scan instead of all dist pages
 *
 * Example:
 *   BASE_URL=https://www.andetag.museum LIGHTHOUSE_MIN=85 npm run lighthouse:all
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, "..");
const distDir = join(siteRoot, "dist");

function argValue(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.split("=").slice(1).join("=");
  if (name === "out" && process.env.LIGHTHOUSE_OUT) return process.env.LIGHTHOUSE_OUT;
  if (name === "max" && process.env.LIGHTHOUSE_MAX) return process.env.LIGHTHOUSE_MAX;
  if (name === "min" && process.env.LIGHTHOUSE_MIN) return process.env.LIGHTHOUSE_MIN;
  return fallback;
}

const outRel = argValue("out", "reports/lighthouse-performance.json");
const outPath = join(siteRoot, outRel);
const maxPages = Number(argValue("max", "")) || Infinity;
const minScore = Number(argValue("min", process.env.LIGHTHOUSE_MIN ?? "0")) || 0;

/** @returns {string[]} site paths e.g. `/sv/stockholm/`, `/404.html` */
function collectPaths(dist) {
  const files = [];

  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name === "index.html") files.push(p);
    }
  }
  walk(dist);

  if (existsSync(join(dist, "404.html"))) {
    files.push(join(dist, "404.html"));
  }

  const paths = files.map((abs) => {
    const rel = relative(dist, abs).replace(/\\/g, "/");
    if (rel === "index.html") return "/";
    if (rel === "404.html") return "/404.html";
    if (rel.endsWith("/index.html")) {
      return `/${rel.slice(0, -"/index.html".length)}/`;
    }
    return `/${rel}`;
  });

  return [...new Set(paths)].sort((a, b) => a.localeCompare(b));
}

function pickMetric(lhr, id) {
  const a = lhr.audits[id];
  if (!a || a.numericValue == null) return null;
  return a.numericValue;
}

async function waitForOrigin(origin, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  const probe = `${origin}/`;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(probe, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`Timeout waiting for ${probe}`);
}

function startLocalServe(port) {
  const serveJs = join(siteRoot, "node_modules", "serve", "build", "main.js");
  if (!existsSync(serveJs)) {
    throw new Error("Missing serve; run npm install in site/");
  }
  const proc = spawn(process.execPath, [serveJs, distDir, "-l", String(port), "--no-clipboard"], {
    cwd: siteRoot,
    stdio: "ignore",
    detached: false,
  });
  proc.on("error", (err) => {
    console.error("serve failed:", err);
  });
  return proc;
}

async function main() {
  if (!existsSync(distDir)) {
    console.error("No dist/ — run: npm run build");
    process.exit(1);
  }

  const pathsFilter = process.env.LIGHTHOUSE_PATHS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let paths;
  if (pathsFilter?.length) {
    paths = pathsFilter.map((p) => {
      let x = p.startsWith("/") ? p : `/${p}`;
      if (x !== "/" && !x.endsWith("/")) x += "/";
      return x;
    });
  } else {
    paths = collectPaths(distDir);
  }
  if (Number.isFinite(maxPages)) {
    paths = paths.slice(0, maxPages);
  }

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  let origin;
  let serveProc = null;
  const port = 3847 + Math.floor(Math.random() * 200);

  if (baseUrl) {
    origin = baseUrl;
    await waitForOrigin(origin);
  } else {
    origin = `http://127.0.0.1:${port}`;
    serveProc = startLocalServe(port);
    await waitForOrigin(origin);
  }

  const mobileConfig = {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: ["performance"],
      formFactor: "mobile",
    },
  };

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  const results = [];
  let i = 0;
  for (const path of paths) {
    i += 1;
    const url = `${origin}${path === "/" ? "/" : path}`;
    process.stderr.write(`[${i}/${paths.length}] ${url}\n`);
    try {
      const runner = await lighthouse(
        url,
        {
          logLevel: "error",
          port: chrome.port,
          disableFullPageScreenshot: true,
        },
        mobileConfig,
      );
      const lhr = runner.lhr;
      const perf = lhr.categories.performance;
      const score = perf.score == null ? null : Math.round(perf.score * 100);
      results.push({
        path,
        url,
        performance: score,
        fcpMs: pickMetric(lhr, "first-contentful-paint"),
        lcpMs: pickMetric(lhr, "largest-contentful-paint"),
        tbtMs: pickMetric(lhr, "total-blocking-time"),
        cls: pickMetric(lhr, "cumulative-layout-shift"),
        siMs: pickMetric(lhr, "speed-index"),
      });
    } catch (e) {
      results.push({
        path,
        url,
        performance: null,
        error: String(e?.message || e),
      });
    }
  }

  await chrome.kill();
  if (serveProc) {
    serveProc.kill("SIGTERM");
  }

  mkdirSync(dirname(outPath), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    formFactor: "mobile",
    category: "performance",
    origin,
    results,
  };
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${relative(siteRoot, outPath)}`);

  const sorted = [...results].sort((a, b) => (a.performance ?? -1) - (b.performance ?? -1));
  console.log("\nPath | Perf | LCP (s) | TBT (ms)");
  console.log("-|-|-|-");
  for (const r of sorted) {
    const lcp = r.lcpMs != null ? (r.lcpMs / 1000).toFixed(2) : "—";
    const tbt = r.tbtMs != null ? String(Math.round(r.tbtMs)) : "—";
    const p = r.performance == null ? "ERR" : String(r.performance);
    console.log(`${r.path} | ${p} | ${lcp} | ${tbt}`);
  }

  const below = results.filter((r) => r.performance != null && r.performance < minScore);
  if (minScore > 0 && below.length > 0) {
    console.error(`\n${below.length} page(s) below ${minScore}:`);
    below.forEach((r) => console.error(`  ${r.path} → ${r.performance}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
