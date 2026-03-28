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
  it("contains Phase 6 stable chrome header variants", () => {
    expect(Object.keys(HEADER_VARIANTS)).toEqual(
      expect.arrayContaining([
        "chrome-hdr-sv-stockholm-hero",
        "chrome-hdr-sv-stockholm-small",
        "chrome-hdr-en-stockholm-hero",
        "chrome-hdr-en-header-selector",
        "chrome-hdr-en-stockholm-small",
        "chrome-hdr-en-stockholm-brand",
        "chrome-hdr-en-berlin-hero",
        "chrome-hdr-en-berlin-small",
        "chrome-hdr-de-berlin-hero",
        "chrome-hdr-de-berlin-small",
      ]),
    );
  });

  it("contains Phase 6 stable chrome footer variants", () => {
    expect(Object.keys(FOOTER_VARIANTS)).toEqual(
      expect.arrayContaining([
        "chrome-ftr-sv-stockholm",
        "chrome-ftr-en-stockholm",
        "chrome-ftr-en-berlin",
        "chrome-ftr-de-berlin",
      ]),
    );
  });

  it("resolves legacy header-4136 to English Berlin hero chrome id (EX-0005)", () => {
    expect(getResolvedHeaderVariantId("header-4136")).toBe("chrome-hdr-en-berlin-hero");
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
        canonicalPath: fixture.canonicalPath,
      });
      const destinationOptions = getDestinationSelectorOptions({
        language: fixture.language,
        destination: fixture.destination,
        canonicalPath: fixture.canonicalPath,
      });

      expect(languageOptions.map((option) => option.value)).toEqual(
        expect.arrayContaining(fixture.expectedLanguages),
      );
      expect(languageOptions).toHaveLength(fixture.expectedLanguages.length);
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

  it("returns only available hreflang links with BCP47 codes", () => {
    const links = buildHreflangLinks(
      {
        sv: "/sv/stockholm/biljetter/",
        en: "/en/stockholm/tickets/",
        de: null,
      },
      null,
    );

    expect(links).toEqual([
      { hreflang: "sv-SE", href: "https://www.andetag.museum/sv/stockholm/biljetter/" },
      { hreflang: "en", href: "https://www.andetag.museum/en/stockholm/tickets/" },
    ]);
  });

  it("appends x-default when provided", () => {
    const links = buildHreflangLinks(
      {
        sv: "/sv/stockholm/biljetter/",
        en: "/en/stockholm/tickets/",
        de: null,
      },
      "/sv/stockholm/biljetter/",
    );

    expect(links).toEqual([
      { hreflang: "sv-SE", href: "https://www.andetag.museum/sv/stockholm/biljetter/" },
      { hreflang: "en", href: "https://www.andetag.museum/en/stockholm/tickets/" },
      { hreflang: "x-default", href: "https://www.andetag.museum/sv/stockholm/biljetter/" },
    ]);
  });
});
