#!/usr/bin/env node
/**
 * HTTP checks for entry-router behavior (see `docs/seo/url-architecture.md` §4).
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
    const key = k.toLowerCase();
    if (key === "set-cookie") {
      if (!o[key]) {
        o[key] = [v];
      } else {
        o[key].push(v);
      }
    } else {
      o[key] = v;
    }
  });
  return o;
}

function locationPathAndSearch(locationHeader, baseUrl) {
  const u = new URL(locationHeader, baseUrl);
  return u.pathname + u.search;
}

function collectSetCookie(res) {
  if (typeof res.headers.getSetCookie === "function") {
    return res.headers.getSetCookie().join("; ");
  }
  return res.headers.get("set-cookie") ?? "";
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
    const scArr = h["set-cookie"] ?? [];
    const scJoined = scArr.join("; ");
    if (!scJoined.includes(expect.setCookieIncludes)) {
      issues.push(`set-cookie missing ${JSON.stringify(expect.setCookieIncludes)} got ${JSON.stringify(scArr)}`);
    }
  }

  if (issues.length) {
    console.error(`FAIL ${name}: ${issues.join("; ")}`);
    return false;
  }
  console.log(`ok ${name}`);
  return true;
}

/**
 * `/` with no `sv`/`de` in Accept-Language: `302` to `/en/` (hub) or geo lane
 * (`/en/stockholm/` / `/en/berlin/`) depending on client IP country at the edge.
 */
async function probeRootNonLaneLang(name, url, init) {
  const res = await fetch(url, { method: "GET", redirect: "manual", ...init });
  const locHeader = res.headers.get("location") ?? "";
  const issues = [];
  if (res.status !== 302) {
    issues.push(`status ${res.status} want 302`);
  }
  if (!locHeader) {
    issues.push("missing Location");
  }
  if (issues.length) {
    console.error(`FAIL ${name}: ${issues.join("; ")}`);
    return false;
  }
  const ps = locationPathAndSearch(locHeader, BASE);
  const okS = ps.startsWith("/en/stockholm/");
  const okB = ps.startsWith("/en/berlin/");
  const okHub = !okS && !okB && (ps === "/en/" || ps.startsWith("/en/?"));
  if (!okHub && !okS && !okB) {
    console.error(`FAIL ${name}: unexpected Location ${JSON.stringify(ps)}`);
    return false;
  }
  const sc = collectSetCookie(res);
  if (okS && !sc.includes("andetag_entry=v1:en-s")) {
    console.error(`FAIL ${name}: missing en-s Set-Cookie for ${JSON.stringify(ps)}`);
    return false;
  }
  if (okB && !sc.includes("andetag_entry=v1:en-b")) {
    console.error(`FAIL ${name}: missing en-b Set-Cookie for ${JSON.stringify(ps)}`);
    return false;
  }
  if (okHub && sc.includes("andetag_entry=")) {
    console.error(`FAIL ${name}: unexpected Set-Cookie on hub redirect: ${JSON.stringify(sc)}`);
    return false;
  }
  console.log(`ok ${name}`);
  return true;
}

/**
 * `/en/` without routing cookie: `200` hub when geo is not SE/DE, else `302` to English lane + cookie.
 */
async function probeE11HumanEnHub() {
  const res = await fetch(`${BASE}/en/`, {
    method: "GET",
    redirect: "manual",
    headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AndetagStagingVerify/1.0" },
  });
  if (res.status === 200) {
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) {
      console.error(`FAIL E11: content-type ${JSON.stringify(ct)} want text/html`);
      return false;
    }
    console.log("ok E11 human /en/ 200 html (hub, non-SE/DE geo)");
    return true;
  }
  if (res.status !== 302) {
    console.error(`FAIL E11: status ${res.status} want 200 or 302`);
    return false;
  }
  const loc = locationPathAndSearch(res.headers.get("location") ?? "", BASE);
  const sc = collectSetCookie(res);
  if (loc.startsWith("/en/stockholm/")) {
    if (!sc.includes("andetag_entry=v1:en-s")) {
      console.error("FAIL E11: missing en-s Set-Cookie");
      return false;
    }
    console.log("ok E11 human /en/ 302 Stockholm (SE geo)");
    return true;
  }
  if (loc.startsWith("/en/berlin/")) {
    if (!sc.includes("andetag_entry=v1:en-b")) {
      console.error("FAIL E11: missing en-b Set-Cookie");
      return false;
    }
    console.log("ok E11 human /en/ 302 Berlin (DE geo)");
    return true;
  }
  console.error(`FAIL E11: unexpected redirect ${JSON.stringify(loc)}`);
  return false;
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
    probeRootNonLaneLang("E2 human /", `${BASE}/`, humanUA),
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
    probeRootNonLaneLang("E5 Accept-Language fr /", `${BASE}/`, {
      headers: {
        "User-Agent": humanUA.headers["User-Agent"],
        "Accept-Language": "fr,en;q=0.8",
      },
    }),
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
    probeRootNonLaneLang("E7 utm /", `${BASE}/?utm_source=test`, humanUA),
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
    probeE11HumanEnHub(),
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
