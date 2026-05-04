import { describe, expect, it } from "vitest";
import { createPageLayoutModel } from "../chrome/page-layout";
import { buildCanonicalUrl } from "../chrome/seo";
import { getPageShellRoute, PAGE_SHELL_PATHS } from "./page-shell-registry";
import { STOCKHOLM_TICKETS } from "../content/stockholm-offers";
import { STOCKHOLM_CORPORATE_PRICING } from "../content/stockholm-corporate";

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

  it("uses English Berlin x-default for Berlin pair (SEO-0020)", () => {
    const shell = getPageShellRoute("/en/berlin/");
    expect(shell.xDefaultPath).toBe("/en/berlin/");
    expect(shell.hreflang.de).toBe("/de/berlin/");
  });

  it("x-default points to the English sibling for every shell (SEO-0020)", () => {
    for (const path of PAGE_SHELL_PATHS) {
      const shell = getPageShellRoute(path);
      if (shell.xDefaultPath === null) continue;
      expect(shell.xDefaultPath.startsWith("/en/")).toBe(true);
    }
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
        expect(shell.xDefaultPath).toBe("/en/");
      }
      if (path.startsWith("/en/berlin") || path.startsWith("/de/berlin")) {
        expect(shell.hreflang.sv).toBeNull();
      }
    }
  });

  it("interpolates price tokens from offer sources (no raw {TOKEN} survives)", () => {
    for (const path of PAGE_SHELL_PATHS) {
      const shell = getPageShellRoute(path);
      // Tokens are `{UPPERCASE_NAME}`. A literal `{` followed by an uppercase
      // letter and no closing brace before the next whitespace would mean an
      // unresolved token leaked through.
      expect(shell.title).not.toMatch(/\{[A-Z][A-Z0-9_]*\}/);
      expect(shell.description).not.toMatch(/\{[A-Z][A-Z0-9_]*\}/);
    }
  });

  it("dejt description carries regular ticket prices from STOCKHOLM_TICKETS", () => {
    const regular = STOCKHOLM_TICKETS.find((t) => t.id === "regular")!;
    const sv = getPageShellRoute("/sv/stockholm/dejt/");
    expect(sv.description).toContain(`${regular.daytimePrice} kr dagtid`);
    expect(sv.description).toContain(`${regular.price} kr ordinarie`);
    const en = getPageShellRoute("/en/stockholm/date/");
    expect(en.description).toContain(`${regular.daytimePrice} SEK daytime`);
    expect(en.description).toContain(`${regular.price} SEK regular`);
  });

  it("corporate-events description carries pricing from STOCKHOLM_CORPORATE_PRICING with locale-formatted thousands", () => {
    const { groupPerPersonSek, exclusiveHourlySek, exclusiveCapacity } =
      STOCKHOLM_CORPORATE_PRICING;
    const sv = getPageShellRoute("/sv/stockholm/foretagsevent/");
    expect(sv.description).toContain(`${groupPerPersonSek} kr per person`);
    expect(sv.description).toContain(`${exclusiveCapacity} personer`);
    // SV thousands separator is a regular space.
    expect(sv.description).toContain(
      `${exclusiveHourlySek.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kr per timme`,
    );
    const en = getPageShellRoute("/en/stockholm/corporate-events/");
    expect(en.description).toContain(`${groupPerPersonSek} SEK per person`);
    expect(en.description).toContain(`${exclusiveCapacity} people`);
    // EN thousands separator is a comma.
    expect(en.description).toContain(
      `${exclusiveHourlySek.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SEK per hour`,
    );
  });
});
