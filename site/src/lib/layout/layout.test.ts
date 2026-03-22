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
  it("returns sv-main for swedish stockholm pages", () => {
    const variant = getNavigationVariant({
      language: "sv",
      destination: "stockholm",
      headerVariantId: "header-2223",
    });

    expect(variant.id).toBe("sv-main");
  });

  it("returns en-brand for desktop when brand header is used", () => {
    const variant = getNavigationVariant({
      language: "en",
      destination: "stockholm",
      headerVariantId: "header-4287",
      viewport: "desktop-tablet",
    });

    expect(variant.id).toBe("en-brand");
  });

  it("falls back to en-main on mobile for brand header", () => {
    const variant = getNavigationVariant({
      language: "en",
      destination: "stockholm",
      headerVariantId: "header-4287",
      viewport: "mobile",
    });

    expect(variant.id).toBe("en-main");
  });

  it("keeps language and destination selector controls independent", () => {
    const languageOptions = getLanguageSelectorOptions({
      language: "en",
      destination: "stockholm",
    });
    const destinationOptions = getDestinationSelectorOptions({
      language: "en",
      destination: "stockholm",
    });

    expect(languageOptions.map((option) => option.value)).toEqual(
      expect.arrayContaining(["sv", "en"]),
    );
    expect(destinationOptions.map((option) => option.value)).toEqual(
      expect.arrayContaining(["stockholm", "berlin"]),
    );
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
