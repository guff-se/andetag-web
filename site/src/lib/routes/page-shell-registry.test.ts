import { describe, expect, it } from "vitest";
import { getPageShellRoute, PAGE_SHELL_PATHS } from "./page-shell-registry";

describe("page shell registry", () => {
  it("covers every path in page-shell-meta.json", () => {
    expect(PAGE_SHELL_PATHS.length).toBe(49);
    for (const path of PAGE_SHELL_PATHS) {
      expect(() => getPageShellRoute(path)).not.toThrow();
      const shell = getPageShellRoute(path);
      expect(shell.title.length).toBeGreaterThan(0);
      expect(shell.canonicalPath).toBe(path);
    }
  });

  it("uses Berlin x-default for English Berlin shell", () => {
    const shell = getPageShellRoute("/en/berlin/");
    expect(shell.xDefaultPath).toBe("/de/berlin/");
    expect(shell.hreflang.de).toBe("/de/berlin/");
  });
});
