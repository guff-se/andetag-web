#!/usr/bin/env node
/**
 * Copy linter for English source under site/src.
 *
 * Enforces docs/Tone of Voice.md §Spelling: English copy uses British
 * spelling and vocabulary. The §Punctuation dash rule is a separate,
 * pre-existing grep documented in that file and in AGENTS.md; it is not
 * checked here.
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
  // -ise / -isation
  synchronize: "synchronise", synchronized: "synchronised",
  synchronizes: "synchronises", synchronizing: "synchronising",
  synchronization: "synchronisation",
  recognize: "recognise", recognized: "recognised",
  recognizes: "recognises", recognizing: "recognising",
  organizations: "organisations", organize: "organise",
  organized: "organised", organizing: "organising",
  visualize: "visualise", visualized: "visualised",
  visualization: "visualisation",
  optimize: "optimise", optimized: "optimised", optimizing: "optimising",
  optimization: "optimisation",
  emphasize: "emphasise", emphasized: "emphasised",
  minimize: "minimise", minimized: "minimised",
  maximize: "maximise", maximized: "maximised",
  prioritize: "prioritise", prioritized: "prioritised",
  specialize: "specialise", specialized: "specialised",
  summarize: "summarise", summarized: "summarised",
  finalize: "finalise", finalized: "finalised", finalizing: "finalising",
  anonymize: "anonymise", anonymized: "anonymised",
  utilize: "utilise", utilized: "utilised", utilization: "utilisation",
  apologize: "apologise", apologized: "apologised",
  // -yse
  analyze: "analyse", analyzed: "analysed", analyzing: "analysing",
  paralyze: "paralyse",
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

/** Checked only in English-only files (also valid Swedish otherwise). */
const ENGLISH_ONLY = {
  fiber: "fibre", fibers: "fibres",
  meter: "metre", meters: "metres",
};

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

    for (const m of line.matchAll(GENERAL_RX)) {
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
  });

  return findings;
}

const files = await walk(SRC);
const findings = files.flatMap(checkFile);

if (findings.length === 0) {
  console.log(`lint:copy — ${files.length} files clean (British spelling).`);
  process.exit(0);
}

console.error(
  `\nUS spellings found (docs/Tone of Voice.md §Spelling) — ${findings.length} issue(s):`,
);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  "${f.found}" -> "${f.suggestion}"`);
}
console.error(
  "\nIf a line is a verbatim visitor quote, add a " +
    "`uk-copy-lint-ignore-next-line` comment above it.",
);
process.exit(1);
