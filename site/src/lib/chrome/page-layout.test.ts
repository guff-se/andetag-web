import { describe, expect, it } from "vitest";
import { createPageLayoutModel } from "./page-layout";
import { PAGE_LAYOUT_FIXTURES } from "./fixtures";

describe("page layout model", () => {
  PAGE_LAYOUT_FIXTURES.forEach((fixture) => {
    it(`builds expected model for ${fixture.id}`, () => {
      const model = createPageLayoutModel({
        language: fixture.language,
        destination: fixture.destination,
        headerVariantId: fixture.headerVariantId,
        footerVariantId: fixture.footerVariantId,
        canonicalPath: fixture.canonicalPath,
        seoCanonicalPath: fixture.seoCanonicalPath ?? null,
        hreflang: fixture.hreflang,
        xDefaultPath: fixture.xDefaultPath,
      });

      expect(model.header.id).toBe(fixture.expectedHeaderId);
      expect(model.navigation.id).toBe(fixture.expectedNavDesktop);
      expect(model.canonicalUrl).toBe(fixture.expectedCanonicalUrl);
      expect(model.hreflangLinks).toHaveLength(fixture.expectedHreflangCount);
      expect(model.brandHomeHref).toBe(fixture.expectedBrandHomeHref);
    });
  });

  it("uses seoCanonicalPath for canonical URL when set (Berlin English story)", () => {
    const model = createPageLayoutModel({
      language: "en",
      destination: "berlin",
      headerVariantId: "chrome-hdr-en-berlin-small",
      footerVariantId: "chrome-ftr-en-berlin",
      canonicalPath: "/en/berlin/music/",
      seoCanonicalPath: "/en/stockholm/music/",
      hreflang: {
        sv: null,
        en: "/en/berlin/music/",
        de: "/de/berlin/musik-von-andetag/",
      },
      xDefaultPath: "/de/berlin/musik-von-andetag/",
    });
    expect(model.canonicalUrl).toBe("https://www.andetag.museum/en/stockholm/music/");
  });
});
