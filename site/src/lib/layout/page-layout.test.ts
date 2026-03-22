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
        hreflang: fixture.hreflang,
        xDefaultPath: fixture.xDefaultPath,
      });

      expect(model.header.id).toBe(fixture.expectedHeaderId);
      expect(model.navigation.id).toBe(fixture.expectedNavDesktop);
      expect(model.canonicalUrl).toBe(fixture.expectedCanonicalUrl);
      expect(model.hreflangLinks).toHaveLength(fixture.expectedHreflangCount);
    });
  });
});
