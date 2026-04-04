#!/usr/bin/env node
/**
 * HTTP checks for `docs/phase-4-redirect-tests.md` table B (entry router).
 * Default host: staging Workers preview. Override: STAGING_BASE=https://...
 *
 * Usage: npm run verify:staging-entry
 * Exit 0 if all pass, 1 if any fail.
 */

const BASE = (process.env.STAGING_BASE ?? "https://andetag-web.guff.workers.dev").replace(
  /\/$/,
  "",
);

function headersToObject(headers) {
  const o = {};
  headers.forEach((v, k) => {
    o[k.toLowerCase()] = v;
  });
  return o;
}

async function probe(name, url, init, expect) {
  const res = await fetch(url, { method: "GET", redirect: "manual", ...init });
  const h = headersToObject(res.headers);
  const loc = h.location ?? "";
  const issues = [];

  if (res.status !== expect.status) {
    issues.push(`status ${res.status} want ${expect.status}`);
  }
  if (expect.locationPrefix && !loc.startsWith(expect.locationPrefix)) {
    issues.push(`location ${JSON.stringify(loc)} want prefix ${JSON.stringify(expect.locationPrefix)}`);
  }
  if (expect.setCookieIncludes) {
    const sc = h["set-cookie"] ?? "";
    if (!sc.includes(expect.setCookieIncludes)) {
      issues.push(`set-cookie missing ${JSON.stringify(expect.setCookieIncludes)} got ${JSON.stringify(sc)}`);
    }
  }

  if (issues.length) {
    console.error(`FAIL ${name}: ${issues.join("; ")}`);
    return false;
  }
  console.log(`ok ${name}`);
  return true;
}

const humanUA = { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AndetagStagingVerify/1.0" } };

async function main() {
  console.log(`STAGING_BASE=${BASE}`);
  const checks = [
    probe(
      "E1 Googlebot /",
      `${BASE}/`,
      { headers: { "User-Agent": "Googlebot" } },
      { status: 302, locationPrefix: "/en/stockholm/" },
    ),
    probe("E2 human /", `${BASE}/`, humanUA, { status: 302, locationPrefix: "/en/" }),
    probe(
      "E3 Accept-Language sv /",
      `${BASE}/`,
      {
        headers: {
          "User-Agent": humanUA.headers["User-Agent"],
          "Accept-Language": "sv,en;q=0.8",
        },
      },
      {
        status: 302,
        locationPrefix: "/sv/stockholm/",
        setCookieIncludes: "andetag_entry=v1:sv",
      },
    ),
    probe(
      "E4 Accept-Language de /",
      `${BASE}/`,
      {
        headers: {
          "User-Agent": humanUA.headers["User-Agent"],
          "Accept-Language": "de,en;q=0.8",
        },
      },
      {
        status: 302,
        locationPrefix: "/de/berlin/",
        setCookieIncludes: "andetag_entry=v1:de",
      },
    ),
    probe(
      "E5 Accept-Language fr /",
      `${BASE}/`,
      {
        headers: {
          "User-Agent": humanUA.headers["User-Agent"],
          "Accept-Language": "fr,en;q=0.8",
        },
      },
      { status: 302, locationPrefix: "/en/" },
    ),
    probe(
      "E6 cookie en-b /",
      `${BASE}/`,
      {
        headers: {
          "User-Agent": humanUA.headers["User-Agent"],
          Cookie: "andetag_entry=v1:en-b",
        },
      },
      { status: 302, locationPrefix: "/en/berlin/" },
    ),
    probe(
      "E7 utm /",
      `${BASE}/?utm_source=test`,
      humanUA,
      { status: 302, locationPrefix: "/en/?utm_source=test" },
    ),
    probe("E8 /en", `${BASE}/en`, humanUA, { status: 301, locationPrefix: "/en/" }),
    probe(
      "E9 Googlebot /en/",
      `${BASE}/en/`,
      { headers: { "User-Agent": "Googlebot" } },
      { status: 302, locationPrefix: "/en/stockholm/" },
    ),
    probe(
      "E10 cookie en-s /en/",
      `${BASE}/en/`,
      {
        headers: {
          "User-Agent": humanUA.headers["User-Agent"],
          Cookie: "andetag_entry=v1:en-s",
        },
      },
      { status: 302, locationPrefix: "/en/stockholm/" },
    ),
    (async () => {
      const res = await fetch(`${BASE}/en/`, { method: "GET", redirect: "manual", ...humanUA });
      if (res.status !== 200) {
        console.error(`FAIL E11 human /en/: status ${res.status} want 200`);
        return false;
      }
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes("text/html")) {
        console.error(`FAIL E11: content-type ${JSON.stringify(ct)} want text/html`);
        return false;
      }
      console.log("ok E11 human /en/ 200 html");
      return true;
    })(),
  ];

  const results = await Promise.all(checks);
  const failed = results.filter((r) => !r).length;
  if (failed) {
    console.error(`\n${failed} check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll entry-router checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
