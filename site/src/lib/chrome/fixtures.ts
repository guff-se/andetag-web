import type { FooterVariantId, HeaderVariantId, Language, LegacyHeaderAliasId } from "./types";

type HreflangMap = Record<Language, string | null>;

export type NavigationFixture = {
  id: string;
  language: Language;
  destination: "stockholm" | "berlin";
  headerVariantId: HeaderVariantId | LegacyHeaderAliasId;
  viewport: "desktop-tablet" | "mobile";
  expectedVariantId: "sv-main" | "en-main" | "en-main-berlin" | "de-main";
};

export const NAVIGATION_FIXTURES: NavigationFixture[] = [
  {
    id: "sv-small-header-desktop",
    language: "sv",
    destination: "stockholm",
    headerVariantId: "chrome-hdr-sv-stockholm-small",
    viewport: "desktop-tablet",
    expectedVariantId: "sv-main",
  },
  {
    id: "en-stockholm-small-desktop",
    language: "en",
    destination: "stockholm",
    headerVariantId: "chrome-hdr-en-stockholm-small",
    viewport: "desktop-tablet",
    expectedVariantId: "en-main",
  },
  {
    id: "en-berlin-small-desktop",
    language: "en",
    destination: "berlin",
    headerVariantId: "chrome-hdr-en-berlin-small",
    viewport: "desktop-tablet",
    expectedVariantId: "en-main-berlin",
  },
  {
    id: "legacy-berlin-alias-header",
    language: "en",
    destination: "berlin",
    headerVariantId: "header-4136",
    viewport: "desktop-tablet",
    expectedVariantId: "en-main-berlin",
  },
];

export type SelectorFixture = {
  id: string;
  language: Language;
  destination: "stockholm" | "berlin";
  canonicalPath: string;
  expectedLanguages: Language[];
  expectedDestinations: Array<"stockholm" | "berlin">;
};

export const SELECTOR_FIXTURES: SelectorFixture[] = [
  {
    id: "english-stockholm-selectors",
    language: "en",
    destination: "stockholm",
    canonicalPath: "/en/stockholm/tickets/",
    expectedLanguages: ["sv", "en", "de"],
    expectedDestinations: ["stockholm", "berlin"],
  },
];

export type PageLayoutFixture = {
  id: string;
  language: Language;
  destination: "stockholm" | "berlin";
  headerVariantId: HeaderVariantId | LegacyHeaderAliasId;
  footerVariantId: FooterVariantId;
  canonicalPath: string;
  hreflang: HreflangMap;
  xDefaultPath: string | null;
  expectedHeaderId: HeaderVariantId;
  expectedNavDesktop: "sv-main" | "en-main" | "en-main-berlin" | "de-main";
  expectedCanonicalUrl: string;
  expectedHreflangCount: number;
  expectedBrandHomeHref: string;
  seoCanonicalPath?: string | null;
};

export const PAGE_LAYOUT_FIXTURES: PageLayoutFixture[] = [
  {
    id: "stockholm-en-tickets",
    language: "en",
    destination: "stockholm",
    headerVariantId: "chrome-hdr-en-stockholm-small",
    footerVariantId: "chrome-ftr-en-stockholm",
    canonicalPath: "/en/stockholm/tickets/",
    hreflang: {
      sv: "/sv/stockholm/biljetter/",
      en: "/en/stockholm/tickets/",
      de: null,
    },
    xDefaultPath: "/sv/stockholm/biljetter/",
    expectedHeaderId: "chrome-hdr-en-stockholm-small",
    expectedNavDesktop: "en-main",
    expectedCanonicalUrl: "https://www.andetag.museum/en/stockholm/tickets/",
    expectedHreflangCount: 3,
    expectedBrandHomeHref: "/en/",
  },
  {
    id: "legacy-berlin-alias-route",
    language: "en",
    destination: "berlin",
    headerVariantId: "header-4136",
    footerVariantId: "chrome-ftr-en-berlin",
    canonicalPath: "/en/berlin/",
    hreflang: {
      sv: null,
      en: "/en/berlin/",
      de: "/de/berlin/",
    },
    xDefaultPath: "/de/berlin/",
    expectedHeaderId: "chrome-hdr-en-berlin-hero",
    expectedNavDesktop: "en-main-berlin",
    expectedCanonicalUrl: "https://www.andetag.museum/en/berlin/",
    expectedHreflangCount: 3,
    expectedBrandHomeHref: "/en/berlin/",
  },
];

export const FOOTER_SV_EXPECTED_SECTION_TITLES = ["Besok ANDETAG", "Upplevelsen"] as const;
export const FOOTER_SV_EXPECTED_GROUPED_SECTION_TITLES = ["Grupper & foretag", "Om"] as const;
export const FOOTER_SV_EXPECTED_PRIVACY_LABEL = "Integritetspolicy";

export const FOOTER_EN_EXPECTED_SECTION_TITLES = ["Visit ANDETAG", "The Experience"] as const;
export const FOOTER_EN_EXPECTED_GROUPED_SECTION_TITLES = ["Groups & business", "About"] as const;
export const FOOTER_EN_EXPECTED_PRIVACY_LABEL = "Privacy policy";
