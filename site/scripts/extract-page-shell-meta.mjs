/**
 * Extracts <title> and og:description from the archived WordPress HTML mirror into JSON for shells.
 * Run from repo root: node site/scripts/extract-page-shell-meta.mjs
 *
 * Swedish canonical paths use the /sv/ language prefix; legacy HTML filenames are unchanged.
 * Snapshots live under archive/legacy-wordpress-site/site-html/ (the old site is gone; mirror is read-only).
 * This script overwrites `page-shell-meta.json` with **only** the keys in `PATH_TO_HTML`. Do not run a full
 * regen to “refresh” the file unless `PATH_TO_HTML` lists every live shell; prefer editing the catalog + JSON
 * for curated rows (see `docs/meta-texts-catalog.md`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..", "..");
const htmlDir = path.join(repoRoot, "archive", "legacy-wordpress-site", "site-html");
const outFile = path.join(__dirname, "..", "src", "data", "page-shell-meta.json");

/** @type {Record<string, string>} canonical path (with slashes) -> site-html filename */
const PATH_TO_HTML = {
  "/sv/stockholm/": "index.html",
  "/de/berlin/": "de-berlin.html",
  "/de/die-kuenstler-malin-gustaf-tadaa/": "de-die-kuenstler-malin-gustaf-tadaa.html",
  "/de/musik-von-andetag/": "de-musik-von-andetag.html",
  "/de/optische-fasertextil/": "de-optische-fasertextil.html",
  "/de/ueber-andetag/": "de-ueber-andetag.html",
  "/en/": "en.html",
  "/en/about-andetag/": "en-about-andetag.html",
  "/en/about-the-artists-malin-gustaf-tadaa/": "en-about-the-artists-malin-gustaf-tadaa.html",
  "/en/berlin/": "en-berlin-en.html",
  "/en/music/": "en-music.html",
  "/en/optical-fibre-textile/": "en-optical-fibre-textile.html",
  "/en/stockholm/": "en.html",
  "/en/stockholm/accessibility/": "en-stockholm-accessibility.html",
  "/en/stockholm/art-yoga/": "en-stockholm-art-yoga.html",
  "/en/stockholm/corporate-events/": "en-stockholm-corporate-events.html",
  "/en/stockholm/date/": "en-stockholm-date.html",
  "/en/stockholm/faq/": "en-stockholm-faq.html",
  "/en/stockholm/giftcard/": "en-stockholm-giftcard.html",
  "/en/stockholm/group-bookings/": "en-stockholm-group-bookings.html",
  "/en/stockholm/how-to-find-us/": "en-stockholm-how-to-find-us.html",
  "/en/stockholm/opening-hours/": "en-stockholm-opening-hours.html",
  "/en/stockholm/season-pass/": "en-stockholm-season-pass.html",
  "/en/stockholm/tickets/": "en-stockholm-tickets.html",
  "/en/stockholm/visitor-reviews/": "en-stockholm-visitor-reviews.html",
  "/en/stockholm/what-kind-of-experience/": "en-stockholm-what-kind-of-experience.html",
  "/sv/musik/": "musik.html",
  "/sv/om-andetag/": "om-andetag.html",
  "/sv/om-konstnarerna-malin-gustaf-tadaa/": "om-konstnarerna-malin-gustaf-tadaa.html",
  "/sv/optisk-fibertextil/": "optisk-fibertextil.html",
  "/privacy/": "privacy.html",
  "/sv/stockholm/aktivitet-inomhus-stockholm/": "stockholm-aktivitet-inomhus-stockholm.html",
  "/sv/stockholm/art-yoga/": "stockholm-art-yoga.html",
  "/sv/stockholm/att-gora-stockholm/": "stockholm-att-gora-stockholm.html",
  "/sv/stockholm/besokaromdomen/": "stockholm-besokaromdomen.html",
  "/sv/stockholm/biljetter/": "stockholm-biljetter.html",
  "/sv/stockholm/dejt/": "stockholm-dejt.html",
  "/sv/stockholm/foretagsevent/": "stockholm-foretagsevent.html",
  "/sv/stockholm/fragor-svar/": "stockholm-fragor-svar.html",
  "/sv/stockholm/gruppbokning/": "stockholm-gruppbokning.html",
  "/sv/stockholm/hitta-hit/": "stockholm-hitta-hit.html",
  "/sv/stockholm/museum-stockholm/": "stockholm-museum-stockholm.html",
  "/sv/stockholm/npf-stockholm/": "stockholm-npf-stockholm.html",
  "/sv/stockholm/oppettider/": "stockholm-oppettider.html",
  "/sv/stockholm/presentkort/": "stockholm-presentkort.html",
  "/sv/stockholm/sasongskort/": "stockholm-sasongskort.html",
  "/sv/stockholm/tillganglighet/": "stockholm-tillganglighet.html",
  "/sv/stockholm/utstallning-stockholm/": "stockholm-utstallning-stockholm.html",
  "/sv/stockholm/vilken-typ-av-upplevelse/": "stockholm-vilken-typ-av-upplevelse.html",
};

function decodeEntities(text) {
  if (!text) return "";
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&hellip;/gi, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"');
}

function extract(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = decodeEntities(titleMatch?.[1]?.trim() ?? "");
  const ogMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
  let description = decodeEntities(ogMatch?.[1] ?? "");
  if (!description) {
    const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    description = decodeEntities(metaMatch?.[1] ?? "");
  }
  return { title, description };
}

const out = {
  _meta: {
    source: "site-html/*.html via extract-page-shell-meta.mjs",
    notes:
      "Swedish canonical paths use /sv/stockholm/…; legacy unprefixed URLs redirect via site/public/_redirects. /en/stockholm/ shell row uses en.html as source file for title or description (EX-0007 resolved in Phase 6 P6-01). /en/ hub row uses EX-0015 overrides when re-extracting; guard those paths if the script overwrites manual SEO rows.",
  },
  pages: {},
};

for (const [canonicalPath, filename] of Object.entries(PATH_TO_HTML)) {
  const fp = path.join(htmlDir, filename);
  if (!fs.existsSync(fp)) {
    console.error("Missing:", fp);
    process.exit(1);
  }
  const html = fs.readFileSync(fp, "utf8");
  out.pages[canonicalPath] = {
    sourceFile: filename,
    ...extract(html),
  };
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log("Wrote", outFile, "keys:", Object.keys(out.pages).length);
