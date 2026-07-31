#!/usr/bin/env node
/**
 * Copy linter for English copy under site/src and the text files in
 * site/public (llms.txt, robots.txt).
 *
 * Enforces docs/Tone of Voice.md §Spelling: English copy uses British
 * spelling and vocabulary, in Oxford spelling (`-ize`/`-ization`, but `-yse`
 * in the analyse group and `-ise` in the never--izein verbs).
 *
 * Also enforces §Punctuation: no em or en dash in prose. Dashes that mean
 * "to" between two values (times, days, numbers, reference ranges) are
 * intervals and are allowed.
 *
 * Scope and deliberate blind spots
 * --------------------------------
 * The linter reads source, not rendered prose, so it only flags words that
 * cannot collide with code. Words such as `color`, `center`, `behavior`,
 * `catalog`, `dialog`, `normalize`, `serialize` and `personalization` are
 * real CSS properties, DOM values, schema.org keys or identifiers, and are
 * therefore NOT checked (or are checked only in a narrow form). A clean run
 * is not a substitute for reading the copy.
 *
 * Words that are also correct Swedish are handled two ways: `fiber` and
 * `meter` are checked only in English-only files, while `program` is not
 * checked at all (it is valid Swedish *and* the correct English spelling in
 * the computing sense).
 *
 * Suppressing a line
 * ------------------
 * Verbatim visitor quotes must keep the spelling the visitor used. Put
 * `uk-copy-lint-ignore-next-line` in a comment on the preceding line, or
 * `uk-copy-lint-ignore-file` anywhere in the file.
 */

import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const SRC = join(ROOT, "src");
const PUBLIC = join(ROOT, "public");
/** Text files under public/ that carry English copy (llms.txt, robots.txt). */
const PUBLIC_TEXT_RX = /\.(txt|md)$/i;

const SKIP_DIRS = new Set(["styles", "vendor", "node_modules"]);
const SKIP_FILE_RX = /\.(css|svg|png|jpg|jpeg|webp|woff2?)$/i;
const IS_TEST_RX = /\.test\.ts$/;

/** Files whose English text is verbatim third-party quotation. */
const VERBATIM_FILES = new Set(["src/lib/content/stockholm-reviews.ts"]);

/** English-only files: safe to check words that are also valid Swedish. */
const ENGLISH_ONLY_RX = /(En|-en|-en-berlin|EnBerlin)\.(astro|ts)$/;

/**
 * US -> UK. Every entry here is a word with no code, CSS, schema.org or
 * Swedish collision, so a match is always real prose.
 */
const GENERAL = {
  // -yse keeps s even in Oxford spelling (Greek -lusis, not -izein).
  analyze: "analyse", analyzed: "analysed", analyzing: "analysing",
  analyzes: "analyses", paralyze: "paralyse", paralyzed: "paralysed",
  catalyze: "catalyse", dialyze: "dialyse",
  // -our
  behavioral: "behavioural",
  colors: "colours", colored: "coloured", colorful: "colourful",
  favorite: "favourite", favorites: "favourites",
  favor: "favour", favors: "favours", favored: "favoured",
  honor: "honour", honored: "honoured", humor: "humour",
  flavor: "flavour", odor: "odour", vapor: "vapour", harbor: "harbour",
  neighbor: "neighbour", neighbors: "neighbours",
  neighboring: "neighbouring",
  // -re
  centered: "centred", centering: "centring",
  theater: "theatre", liter: "litre", liters: "litres",
  caliber: "calibre",
  // -ogue / -ce
  catalogs: "catalogues", defense: "defence", offense: "offence",
  pretense: "pretence",
  // doubling
  traveled: "travelled", traveling: "travelling",
  canceled: "cancelled", canceling: "cancelling",
  labeled: "labelled", modeling: "modelling",
  marvelous: "marvellous", jewelry: "jewellery",
  counselor: "counsellor", fueled: "fuelled",
  fulfill: "fulfil", fulfills: "fulfils", fulfillment: "fulfilment",
  skillful: "skilful", enrollment: "enrolment",
  installment: "instalment", installments: "instalments",
  // misc
  esthetic: "aesthetic", maneuver: "manoeuvre",
  judgment: "judgement", judgments: "judgements",
  aging: "ageing", ambiance: "ambience",
  gray: "grey", sulfur: "sulphur", aluminum: "aluminium",
  mustache: "moustache", cozy: "cosy",
  toward: "towards",
  // vocabulary
  elevator: "lift", elevators: "lifts",
  restroom: "toilet", restrooms: "toilets",
  subway: "metro", subways: "metros",
  stroller: "pushchair", strollers: "pushchairs",
};

/**
 * Oxford spelling: the Greek -izein verb family takes `-ize`, so an `-ise`
 * spelling of one of these stems is the error. Deliberately absent: the -yse
 * group (handled above) and verbs that were never -izein (advertise, advise,
 * comprise, exercise, supervise, surprise, ...), which are `-ise` in British
 * English too. A bare stem never matches: a suffix is always required, so the
 * noun `emphasis` is not mistaken for the verb `emphasise`.
 */
const OXFORD_STEMS = [
  "synchronis", "recognis", "organis", "visualis", "optimis", "localis",
  "normalis", "prioritis", "centralis", "standardis", "summaris", "finalis",
  "capitalis", "initialis", "sanitis", "tokenis", "pluralis", "customis",
  "emphasis", "minimis", "maximis", "specialis", "personalis", "categoris",
  "apologis", "anonymis", "utilis", "canonicalis", "modernis", "realis",
];
const OXFORD_SUFFIXES = ["e", "es", "ed", "ing", "ation", "ations", "er", "ers"];
for (const stem of OXFORD_STEMS) {
  for (const suffix of OXFORD_SUFFIXES) {
    GENERAL[stem + suffix] = `${stem.slice(0, -1)}z${suffix}`;
  }
}

/**
 * Terms deliberately written as a British/international pair for clarity, such
 * as "pushchair / stroller". Swedish speakers routinely say stroller for
 * barnvagn, so the dual form removes ambiguity on the visitor FAQ. The
 * non-British half is allowed only when its British partner appears on the
 * same line; a bare "stroller" is still flagged.
 */
const PAIRED_PARTNER = { stroller: "pushchair", strollers: "pushchair" };

/** Checked only in English-only files (also valid Swedish otherwise). */
const ENGLISH_ONLY = {
  fiber: "fibre", fibers: "fibres",
  meter: "metre", meters: "metres",
};

/**
 * §Punctuation: a dash is allowed only as an interval ("to" between two
 * values) -- 12.00 - 20.00, Tuesday-Saturday, 8-17 years, 231-239. Anywhere
 * else it is prose and must become a comma, colon or parentheses.
 *
 * Classified by what flanks the dash: both sides must contain a digit, or both
 * must be day/month names. "inspiration - perfect" therefore fails, while
 * "L1-L6" and "Mon-Fri" pass.
 */
const DASH_RX = /[\u2014\u2013]/g;
const RANGE_WORDS = new Set([
  "mon", "tue", "tues", "wed", "thu", "thur", "thurs", "fri", "sat", "sun",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "sept", "oct",
  "nov", "dec", "january", "february", "march", "april", "june", "july",
  "august", "september", "october", "november", "december",
]);

/** Nearest whitespace-delimited token on one side of the dash. */
function edgeToken(text, side) {
  const cleaned = text.replace(/[^\S\n]+$/, "").replace(/^[^\S\n]+/, "");
  const parts = cleaned.split(/\s/);
  const token = side === "before" ? parts[parts.length - 1] : parts[0];
  return (token || "").replace(/^[^\w§~]+|[^\w]+$/g, "");
}

function isInterval(line, index) {
  const before = edgeToken(line.slice(0, index), "before");
  const after = edgeToken(line.slice(index + 1), "after");
  if (!before || !after) return false;
  const numeric = (t) => /\d/.test(t);
  if (numeric(before) && numeric(after)) return true;
  return RANGE_WORDS.has(before.toLowerCase()) && RANGE_WORDS.has(after.toLowerCase());
}

const GENERAL_RX = wordRegex(Object.keys(GENERAL).filter((k) => GENERAL[k]));
const ENGLISH_ONLY_WORD_RX = wordRegex(Object.keys(ENGLISH_ONLY));
/** `color` only when it is not part of a CSS property or custom property. */
const BARE_COLOR_RX = /(?<![-\w])color(?![-:\w])/gi;

function wordRegex(words) {
  const sorted = [...words].sort((a, b) => b.length - a.length);
  return new RegExp(`\\b(${sorted.join("|")})\\b`, "gi");
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(join(dir, entry.name), out);
    } else if (!SKIP_FILE_RX.test(entry.name) && !IS_TEST_RX.test(entry.name)) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

function checkFile(absPath) {
  const rel = relative(ROOT, absPath).split(sep).join("/");
  const relFromSrc = `src/${relative(SRC, absPath).split(sep).join("/")}`;
  if (VERBATIM_FILES.has(relFromSrc)) return [];

  const text = readFileSync(absPath, "utf8");
  if (text.includes("uk-copy-lint-ignore-file")) return [];

  const englishOnly = ENGLISH_ONLY_RX.test(absPath);
  const lines = text.split("\n");
  const findings = [];

  lines.forEach((line, i) => {
    const prev = i > 0 ? lines[i - 1] : "";
    if (prev.includes("uk-copy-lint-ignore-next-line")) return;
    if (line.includes("uk-copy-lint-ignore-line")) return;

    const report = (found, suggestion) => {
      findings.push({ file: rel, line: i + 1, found, suggestion });
    };

    const lowerLine = line.toLowerCase();
    for (const m of line.matchAll(GENERAL_RX)) {
      const partner = PAIRED_PARTNER[m[0].toLowerCase()];
      if (partner && lowerLine.includes(partner)) continue;
      report(m[0], GENERAL[m[0].toLowerCase()]);
    }
    if (englishOnly) {
      for (const m of line.matchAll(ENGLISH_ONLY_WORD_RX)) {
        report(m[0], ENGLISH_ONLY[m[0].toLowerCase()]);
      }
      for (const m of line.matchAll(BARE_COLOR_RX)) {
        report(m[0], "colour");
      }
    }
    for (const m of line.matchAll(DASH_RX)) {
      if (isInterval(line, m.index)) continue;
      findings.push({
        file: rel,
        line: i + 1,
        found: m[0] === "\u2014" ? "em dash in prose" : "en dash in prose",
        suggestion: "comma, colon or parentheses",
      });
    }
  });

  return findings;
}

const files = [
  ...(await walk(SRC)),
  ...(await walk(PUBLIC)).filter((f) => PUBLIC_TEXT_RX.test(f)),
];
const findings = files.flatMap(checkFile);

if (findings.length === 0) {
  console.log(
  `lint:copy — ${files.length} files clean (British spelling, no prose dashes).`,
);
  process.exit(0);
}

console.error(
  `\nCopy issues (docs/Tone of Voice.md §Spelling, §Punctuation) — ${findings.length}:`,
);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  "${f.found}" -> "${f.suggestion}"`);
}
console.error(
  "\nIf a line is a verbatim visitor quote, add a " +
    "`uk-copy-lint-ignore-next-line` comment above it.",
);
process.exit(1);
