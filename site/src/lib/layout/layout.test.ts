import { describe, expect, it } from "vitest";
import {
  FOOTER_VARIANTS,
  HEADER_VARIANTS,
  getResolvedHeaderVariantId,
} from "./variants";
import {
  getDestinationSelectorOptions,
  getLanguageSelectorOptions,
  getNavigationVariant,
} from "./navigation";
import { buildCanonicalUrl, buildHreflangLinks } from "./seo";
import { NAVIGATION_FIXTURES, SELECTOR_FIXTURES } from "./fixtures";

describe("layout variant contracts", () => {
  it("contains all validated header variants from phase 1", () => {
    expect(Object.keys(HEADER_VARIANTS)).toEqual(
      expect.arrayContaining([
        "header-192",
        "header-918",
        "header-4344",
        "header-2223",
        "header-3305",
        "header-4287",
      ]),
    );
  });

  it("contains all validated footer variants from phase 1", () => {
    expect(Object.keys(FOOTER_VARIANTS)).toEqual(
      expect.arrayContaining(["footer-207", "footer-3100", "footer-4229"]),
    );
  });

  it("resolves legacy header-4136 to the main english hero variant", () => {
    expect(getResolvedHeaderVariantId("header-4136")).toBe("header-918");
  });
});

describe("navigation behavior", () => {
  NAVIGATION_FIXTURES.forEach((fixture) => {
    it(`returns ${fixture.expectedVariantId} for ${fixture.id}`, () => {
      const variant = getNavigationVariant({
        language: fixture.language,
        destination: fixture.destination,
        headerVariantId: fixture.headerVariantId,
        viewport: fixture.viewport,
      });

      expect(variant.id).toBe(fixture.expectedVariantId);
    });
  });

  SELECTOR_FIXTURES.forEach((fixture) => {
    it(`keeps selectors independent for ${fixture.id}`, () => {
      const languageOptions = getLanguageSelectorOptions({
        language: fixture.language,
        destination: fixture.destination,
      });
      const destinationOptions = getDestinationSelectorOptions({
        language: fixture.language,
        destination: fixture.destination,
      });

      expect(languageOptions.map((option) => option.value)).toEqual(
        expect.arrayContaining(fixture.expectedLanguages),
      );
      expect(destinationOptions.map((option) => option.value)).toEqual(
        expect.arrayContaining(fixture.expectedDestinations),
      );
    });
  });
});

describe("layout seo hooks", () => {
  it("builds canonical URLs from canonical paths", () => {
    expect(buildCanonicalUrl("/en/stockholm/tickets/")).toBe(
      "https://www.andetag.museum/en/stockholm/tickets/",
    );
  });

  it("returns only available hreflang links", () => {
    const links = buildHreflangLinks({
      sv: "/stockholm/biljetter/",
      en: "/en/stockholm/tickets/",
      de: null,
    });

    expect(links).toEqual([
      { hreflang: "sv", href: "https://www.andetag.museum/stockholm/biljetter/" },
      { hreflang: "en", href: "https://www.andetag.museum/en/stockholm/tickets/" },
    ]);
  });
});
