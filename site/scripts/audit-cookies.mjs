#!/usr/bin/env node
/**
 * Cookie and localStorage audit for consent migration planning.
 *
 * Launches headless Chrome, navigates to the target URL, interacts with
 * the page (scrolls, clicks the video facade, waits for embeds), then
 * reports every cookie and localStorage entry with domain, path, expiry,
 * and probable setter.
 *
 * Usage:
 *   cd site && node scripts/audit-cookies.mjs
 *
 * Options (env):
 *   AUDIT_URL   Full URL to audit (default: staging EN Stockholm)
 *   AUDIT_WAIT  Seconds to wait for third-party scripts (default: 12)
 */

import * as chromeLauncher from "chrome-launcher";

const TARGET_URL =
  process.env.AUDIT_URL || "https://andetag-web.guff.workers.dev/en/stockholm/#book";
const WAIT_SECONDS = parseInt(process.env.AUDIT_WAIT || "12", 10);

function categorize(cookie) {
  const name = cookie.name;
  const domain = cookie.domain;

  if (name === "andetag_entry") return { category: "necessary", setter: "Entry Worker" };
  if (name === "TERMLY_API_CACHE") return { category: "necessary", setter: "Termly CMP" };
  if (name === "cc_cookie") return { category: "necessary", setter: "CookieConsent" };
  if (name === "__cf_bm") return { category: "necessary", setter: `Cloudflare Bot Mgmt (${domain})` };
  if (name === "_cfuvid") return { category: "necessary", setter: `Cloudflare (${domain})` };
  if (name === "csrf_token") return { category: "necessary", setter: "Unknown (investigate)" };

  if (name === "_ga" || name.startsWith("_ga_"))
    return { category: "analytics", setter: "GA4 via GTM" };
  if (name === "vuid") return { category: "analytics", setter: "Vimeo" };
  if (name === "s7") return { category: "analytics", setter: "Spotify (Adobe Analytics label)" };

  if (name === "_gcl_au" || name === "_gcl_ls")
    return { category: "marketing", setter: "Google Ads via GTM" };
  if (name === "_fbp" || name === "_fbc")
    return { category: "marketing", setter: "Meta Pixel via GTM" };

  return { category: "unknown", setter: "?" };
}

function formatExpiry(cookie) {
  if (cookie.session) return "session";
  if (!cookie.expires || cookie.expires < 0) return "session";
  const d = new Date(cookie.expires * 1000);
  const days = Math.round((d - Date.now()) / 86400000);
  return `${d.toISOString().slice(0, 10)} (~${days}d)`;
}

async function main() {
  console.log(`\n🔍 Cookie audit: ${TARGET_URL}`);
  console.log(`   Wait time: ${WAIT_SECONDS}s for third-party scripts\n`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--window-size=1440,900",
    ],
  });

  const { default: CDP } = await import("chrome-remote-interface");
  const client = await CDP({ port: chrome.port });
  const { Network, Page, Runtime, Storage } = client;

  await Network.enable();
  await Page.enable();
  await Runtime.enable();

  console.log("  Navigating...");
  await Page.navigate({ url: TARGET_URL });
  await Page.loadEventFired();
  console.log("  Page loaded. Waiting for scripts and embeds...");

  // Scroll to trigger lazy embeds (booking widget, video facade, gallery)
  await Runtime.evaluate({
    expression: `
      (async () => {
        const delay = ms => new Promise(r => setTimeout(r, ms));
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += 400) {
          window.scrollTo(0, y);
          await delay(200);
        }
        window.scrollTo(0, 0);
      })()
    `,
    awaitPromise: true,
  });

  // Click video facade if present (triggers Vimeo iframe)
  await Runtime.evaluate({
    expression: `
      (() => {
        const btn = document.querySelector('.video-embed-facade__play, .video-embed-facade');
        if (btn) { btn.click(); return 'clicked video facade'; }
        return 'no video facade found';
      })()
    `,
  }).then((r) => {
    if (r.result?.value) console.log(`  Video facade: ${r.result.value}`);
  });

  // Wait for third-party scripts to settle
  const waitMs = WAIT_SECONDS * 1000;
  const steps = 4;
  for (let i = 1; i <= steps; i++) {
    await new Promise((r) => setTimeout(r, waitMs / steps));
    process.stdout.write(`  Waiting... ${Math.round((i / steps) * 100)}%\r`);
  }
  console.log("  Wait complete.                    ");

  // ── Collect cookies (all domains) ──
  const { cookies } = await Network.getAllCookies();

  // ── Collect localStorage for the page origin ──
  const lsResult = await Runtime.evaluate({
    expression: `
      JSON.stringify(
        Object.keys(localStorage).map(k => ({
          key: k,
          value: localStorage.getItem(k)?.substring(0, 120),
          length: localStorage.getItem(k)?.length || 0,
        }))
      )
    `,
    returnByValue: true,
  });
  const localStorageEntries = JSON.parse(lsResult.result.value || "[]");

  // ── Collect sessionStorage ──
  const ssResult = await Runtime.evaluate({
    expression: `
      JSON.stringify(
        Object.keys(sessionStorage).map(k => ({
          key: k,
          value: sessionStorage.getItem(k)?.substring(0, 120),
          length: sessionStorage.getItem(k)?.length || 0,
        }))
      )
    `,
    returnByValue: true,
  });
  const sessionStorageEntries = JSON.parse(ssResult.result.value || "[]");

  await client.close();
  await chrome.kill();

  // ── Report: Cookies ──
  console.log(`\n${"═".repeat(80)}`);
  console.log(`COOKIES (${cookies.length} total)`);
  console.log(`${"═".repeat(80)}\n`);

  const byCategory = { necessary: [], analytics: [], marketing: [], unknown: [] };
  for (const c of cookies) {
    const info = categorize(c);
    byCategory[info.category] = byCategory[info.category] || [];
    byCategory[info.category].push({ ...c, ...info });
  }

  for (const cat of ["necessary", "analytics", "marketing", "unknown"]) {
    const items = byCategory[cat];
    if (!items || items.length === 0) continue;

    const label =
      cat === "necessary"
        ? "NECESSARY (always on)"
        : cat === "analytics"
          ? "ANALYTICS (opt-in)"
          : cat === "marketing"
            ? "MARKETING (opt-in)"
            : "UNKNOWN (needs classification)";

    console.log(`── ${label} (${ items.length }) ──\n`);

    for (const c of items) {
      console.log(`  ${c.name}`);
      console.log(`    domain:   ${c.domain}`);
      console.log(`    path:     ${c.path}`);
      console.log(`    expires:  ${formatExpiry(c)}`);
      console.log(`    secure:   ${c.secure}   httpOnly: ${c.httpOnly}   sameSite: ${c.sameSite || "None"}`);
      console.log(`    size:     ${c.size} bytes`);
      console.log(`    setter:   ${c.setter}`);
      console.log();
    }
  }

  // ── Report: localStorage ──
  console.log(`${"═".repeat(80)}`);
  console.log(`LOCAL STORAGE (${localStorageEntries.length} entries)`);
  console.log(`${"═".repeat(80)}\n`);

  if (localStorageEntries.length === 0) {
    console.log("  (empty)\n");
  } else {
    for (const e of localStorageEntries) {
      console.log(`  ${e.key}  (${e.length} chars)`);
      console.log(`    preview: ${e.value}`);
      console.log();
    }
  }

  // ── Report: sessionStorage ──
  if (sessionStorageEntries.length > 0) {
    console.log(`${"═".repeat(80)}`);
    console.log(`SESSION STORAGE (${sessionStorageEntries.length} entries)`);
    console.log(`${"═".repeat(80)}\n`);
    for (const e of sessionStorageEntries) {
      console.log(`  ${e.key}  (${e.length} chars)`);
      console.log(`    preview: ${e.value}`);
      console.log();
    }
  }

  // ── Summary ──
  console.log(`${"═".repeat(80)}`);
  console.log("SUMMARY");
  console.log(`${"═".repeat(80)}\n`);

  const firstParty = cookies.filter(
    (c) => c.domain.includes("guff.workers.dev") || c.domain.includes("andetag.museum"),
  );
  const thirdParty = cookies.filter(
    (c) => !c.domain.includes("guff.workers.dev") && !c.domain.includes("andetag.museum"),
  );

  console.log(`  First-party cookies: ${firstParty.length}`);
  for (const c of firstParty) console.log(`    - ${c.name} (${c.domain})`);
  console.log(`  Third-party cookies: ${thirdParty.length}`);
  for (const c of thirdParty) console.log(`    - ${c.name} (${c.domain})`);
  console.log(`  localStorage entries: ${localStorageEntries.length}`);
  console.log(`  sessionStorage entries: ${sessionStorageEntries.length}`);

  const domains = [...new Set(cookies.map((c) => c.domain))].sort();
  console.log(`\n  Cookie domains (${domains.length}):`);
  for (const d of domains) {
    const count = cookies.filter((c) => c.domain === d).length;
    console.log(`    ${d} (${count})`);
  }

  console.log(`\n  Termly artifacts: ${cookies.filter((c) => c.name === "TERMLY_API_CACHE" || c.domain.includes("termly")).length}`);
  console.log("  (These will disappear after CookieConsent migration)\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
