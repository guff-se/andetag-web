import type { FooterVariantId, HeaderVariantId, Language } from "./types";

type HreflangMap = Record<Language, string | null>;

export type NavigationFixture = {
  id: string;
  language: Language;
  destination: "stockholm" | "berlin";
  headerVariantId: HeaderVariantId | "header-4136";
  viewport: "desktop-tablet" | "mobile";
  expectedVariantId: "sv-main" | "en-main" | "en-brand" | "de-main";
};

export const NAVIGATION_FIXTURES: NavigationFixture[] = [
  {
    id: "sv-small-header-desktop",
    language: "sv",
    destination: "stockholm",
    headerVariantId: "header-2223",
    viewport: "desktop-tablet",
    expectedVariantId: "sv-main",
  },
  {
    id: "en-brand-desktop",
    language: "en",
    destination: "stockholm",
    headerVariantId: "header-4287",
    viewport: "desktop-tablet",
    expectedVariantId: "en-brand",
  },
  {
    id: "en-brand-mobile-fallback",
    language: "en",
    destination: "stockholm",
    headerVariantId: "header-4287",
    viewport: "mobile",
    expectedVariantId: "en-main",
  },
  {
    id: "legacy-berlin-alias-header",
    language: "en",
    destination: "berlin",
    headerVariantId: "header-4136",
    viewport: "desktop-tablet",
    expectedVariantId: "en-main",
  },
];

export type SelectorFixture = {
  id: string;
  language: Language;
  destination: "stockholm" | "berlin";
  expectedLanguages: Language[];
  expectedDestinations: Array<"stockholm" | "berlin">;
};

export const SELECTOR_FIXTURES: SelectorFixture[] = [
  {
    id: "english-stockholm-selectors",
    language: "en",
    destination: "stockholm",
    expectedLanguages: ["sv", "en"],
    expectedDestinations: ["stockholm", "berlin"],
  },
];

export type PageLayoutFixture = {
  id: string;
  language: Language;
  destination: "stockholm" | "berlin";
  headerVariantId: HeaderVariantId | "header-4136";
  footerVariantId: FooterVariantId;
  canonicalPath: string;
  hreflang: HreflangMap;
  expectedHeaderId: HeaderVariantId;
  expectedNavDesktop: "sv-main" | "en-main" | "en-brand" | "de-main";
  expectedCanonicalUrl: string;
  expectedHreflangCount: number;
};

export const PAGE_LAYOUT_FIXTURES: PageLayoutFixture[] = [
  {
    id: "stockholm-en-tickets",
    language: "en",
    destination: "stockholm",
    headerVariantId: "header-3305",
    footerVariantId: "footer-3100",
    canonicalPath: "/en/stockholm/tickets/",
    hreflang: {
      sv: "/stockholm/biljetter/",
      en: "/en/stockholm/tickets/",
      de: null,
    },
    expectedHeaderId: "header-3305",
    expectedNavDesktop: "en-main",
    expectedCanonicalUrl: "https://www.andetag.museum/en/stockholm/tickets/",
    expectedHreflangCount: 2,
  },
  {
    id: "legacy-berlin-alias-route",
    language: "en",
    destination: "berlin",
    headerVariantId: "header-4136",
    footerVariantId: "footer-3100",
    canonicalPath: "/en/berlin/",
    hreflang: {
      sv: null,
      en: "/en/berlin/",
      de: "/de/berlin/",
    },
    expectedHeaderId: "header-918",
    expectedNavDesktop: "en-main",
    expectedCanonicalUrl: "https://www.andetag.museum/en/berlin/",
    expectedHreflangCount: 2,
  },
];

export const FOOTER_SV_EXPECTED_SECTION_TITLES = ["Besok ANDETAG", "Upplevelsen"] as const;
export const FOOTER_SV_EXPECTED_GROUPED_SECTION_TITLES = ["Grupper & foretag", "Om"] as const;
export const FOOTER_SV_EXPECTED_PRIVACY_LABEL = "Integritetspolicy";
