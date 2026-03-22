import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PAGE_SHELL_PATHS } from "./page-shell-registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Canonical paths for matrix rows with status `keep` (second URL on each line). */
function parseKeepCanonicalPathsFromMatrix(): string[] {
  const csvPath = path.resolve(__dirname, "../../../../docs/url-matrix.csv");
  const text = fs.readFileSync(csvPath, "utf8");
  const lines = text.trim().split("\n").slice(1);
  const paths: string[] = [];
  for (const line of lines) {
    if (!/,keep,/.test(line)) continue;
    const urls = line.match(/https:\/\/www\.andetag\.museum[^,\s]*/g);
    if (!urls || urls.length < 2) {
      throw new Error(`url-matrix.csv: could not parse two URLs: ${line}`);
    }
    const canonicalUrl = urls[1];
    const u = new URL(canonicalUrl);
    let p = u.pathname;
    if (p !== "/" && !p.endsWith("/")) {
      p = `${p}/`;
    }
    paths.push(p);
  }
  return paths;
}

describe("url matrix parity", () => {
  it("every matrix keep canonical path has a page shell route", () => {
    const matrixPaths = parseKeepCanonicalPathsFromMatrix().sort();
    const shellSet = new Set(PAGE_SHELL_PATHS);
    const missing = matrixPaths.filter((p) => !shellSet.has(p));
    expect(missing, `Missing shells for: ${missing.join(", ")}`).toEqual([]);
  });

  it("every page shell path is a matrix keep canonical (no orphan shells)", () => {
    const matrixSet = new Set(parseKeepCanonicalPathsFromMatrix());
    const orphans = PAGE_SHELL_PATHS.filter((p) => !matrixSet.has(p));
    expect(orphans, `Orphan shells: ${orphans.join(", ")}`).toEqual([]);
  });

  it("keep row count matches shell count", () => {
    expect(parseKeepCanonicalPathsFromMatrix().length).toBe(PAGE_SHELL_PATHS.length);
  });
});
