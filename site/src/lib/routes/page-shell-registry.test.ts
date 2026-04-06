import { describe, expect, it } from "vitest";
import { createPageLayoutModel } from "../chrome/page-layout";
import { buildCanonicalUrl } from "../chrome/seo";
import { getPageShellRoute, PAGE_SHELL_PATHS } from "./page-shell-registry";

describe("page shell registry", () => {
  it("covers every path in page-shell-meta.json", () => {
    for (const path of PAGE_SHELL_PATHS) {
      expect(() => getPageShellRoute(path)).not.toThrow();
      const shell = getPageShellRoute(path);
      expect(shell.title.length).toBeGreaterThan(0);
      expect(shell.description.trim().length).toBeGreaterThan(0);
      expect(shell.canonicalPath).toBe(path);
    }
  });

  it("uses SEO canonical URL in layout model when Berlin English story shells point at Stockholm English", () => {
    for (const path of [
      "/en/berlin/about-andetag/",
      "/en/berlin/about-the-artists-malin-gustaf-tadaa/",
      "/en/berlin/music/",
      "/en/berlin/optical-fibre-textile/",
    ] as const) {
      const shell = getPageShellRoute(path);
      expect(shell.seoCanonicalPath).not.toBeNull();
      const model = createPageLayoutModel({
        language: shell.language,
        destination: shell.destination,
        headerVariantId: shell.headerVariantId,
        footerVariantId: shell.footerVariantId,
        canonicalPath: shell.canonicalPath,
        seoCanonicalPath: shell.seoCanonicalPath,
        hreflang: shell.hreflang,
        xDefaultPath: shell.xDefaultPath,
      });
      expect(model.canonicalUrl).toBe(buildCanonicalUrl(shell.seoCanonicalPath!));
    }
  });

  it("uses Berlin x-default for English Berlin shell", () => {
    const shell = getPageShellRoute("/en/berlin/");
    expect(shell.xDefaultPath).toBe("/de/berlin/");
    expect(shell.hreflang.de).toBe("/de/berlin/");
  });

  it("Berlin English story shells canonicalize to Stockholm English", () => {
    const shell = getPageShellRoute("/en/berlin/music/");
    expect(shell.seoCanonicalPath).toBe("/en/stockholm/music/");
  });

  it("Berlin English privacy is self-canonical", () => {
    const shell = getPageShellRoute("/en/berlin/privacy/");
    expect(shell.seoCanonicalPath).toBeNull();
  });

  it("uses small German Berlin header on German Berlin subpages", () => {
    const shell = getPageShellRoute("/de/berlin/privacy/");
    expect(shell.headerVariantId).toBe("chrome-hdr-de-berlin-small");
    expect(shell.footerVariantId).toBe("chrome-ftr-de-berlin");
  });

  it("keeps self-referencing hreflang for each shell language", () => {
    for (const path of PAGE_SHELL_PATHS) {
      const shell = getPageShellRoute(path);
      expect(shell.hreflang[shell.language]).toBe(shell.canonicalPath);
    }
  });

  it("avoids cross-location hreflang (Stockholm vs Berlin)", () => {
    for (const path of PAGE_SHELL_PATHS) {
      const shell = getPageShellRoute(path);
      if (path.startsWith("/sv/") || path.startsWith("/en/stockholm")) {
        expect(shell.hreflang.de).toBeNull();
        if (shell.hreflang.en) {
          expect(shell.hreflang.en.startsWith("/en/stockholm")).toBe(true);
        }
      }
      if (path === "/en/") {
        expect(shell.hreflang.de).toBeNull();
        expect(shell.hreflang.sv).toBe("/sv/stockholm/");
        expect(shell.hreflang.en).toBe("/en/");
      }
      if (path.startsWith("/en/berlin") || path.startsWith("/de/berlin")) {
        expect(shell.hreflang.sv).toBeNull();
      }
    }
  });
});
