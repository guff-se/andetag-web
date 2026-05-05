import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PAGE_SHELL_PATHS } from "./page-shell-registry";
import { allArtworkCanonicalPaths } from "./artwork-shell-routes";

/** Per-artwork pages live in their own dynamic route, not in `page-shell-meta.json`. */
const ALL_KEEP_CANONICAL_PATHS = (): string[] =>
  [...PAGE_SHELL_PATHS, ...allArtworkCanonicalPaths()];

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
  it("every matrix keep canonical path has a route (shell or per-artwork)", () => {
    const matrixPaths = parseKeepCanonicalPathsFromMatrix().sort();
    const routeSet = new Set(ALL_KEEP_CANONICAL_PATHS());
    const missing = matrixPaths.filter((p) => !routeSet.has(p));
    expect(missing, `Missing routes for: ${missing.join(", ")}`).toEqual([]);
  });

  it("every served canonical path is a matrix keep canonical (no orphans)", () => {
    const matrixSet = new Set(parseKeepCanonicalPathsFromMatrix());
    const orphans = ALL_KEEP_CANONICAL_PATHS().filter((p) => !matrixSet.has(p));
    expect(orphans, `Orphan routes: ${orphans.join(", ")}`).toEqual([]);
  });

  it("keep row count matches total route count (shells + per-artwork)", () => {
    expect(parseKeepCanonicalPathsFromMatrix().length).toBe(
      ALL_KEEP_CANONICAL_PATHS().length,
    );
  });
});
