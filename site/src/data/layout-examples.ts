import type { Destination, FooterVariantId, Language } from "../lib/layout/types";

export type LayoutExample = {
  id: string;
  title: string;
  language: Language;
  destination: Destination;
  headerVariantId:
    | "header-192"
    | "header-918"
    | "header-4344"
    | "header-2223"
    | "header-3305"
    | "header-4287"
    | "header-4136";
  footerVariantId: FooterVariantId;
  canonicalPath: string;
  hreflang: Record<Language, string | null>;
  description: string;
};

export const LAYOUT_EXAMPLES: LayoutExample[] = [
  {
    id: "sv-home-hero",
    title: "ANDETAG Stockholm",
    language: "sv",
    destination: "stockholm",
    headerVariantId: "header-192",
    footerVariantId: "footer-207",
    canonicalPath: "/",
    hreflang: {
      sv: "/",
      en: "/en/",
      de: "/de/berlin/",
    },
    description: "Swedish homepage hero layout with stockholm main navigation.",
  },
  {
    id: "en-home-hero",
    title: "ANDETAG Stockholm | English",
    language: "en",
    destination: "stockholm",
    headerVariantId: "header-918",
    footerVariantId: "footer-3100",
    canonicalPath: "/en/",
    hreflang: {
      sv: "/",
      en: "/en/",
      de: "/de/berlin/",
    },
    description: "English homepage hero layout with full english navigation.",
  },
  {
    id: "de-berlin-hero",
    title: "ANDETAG Berlin",
    language: "de",
    destination: "berlin",
    headerVariantId: "header-4344",
    footerVariantId: "footer-4229",
    canonicalPath: "/de/berlin/",
    hreflang: {
      sv: null,
      en: "/en/berlin/",
      de: "/de/berlin/",
    },
    description: "German berlin hero layout with berlin-first navigation.",
  },
  {
    id: "en-brand",
    title: "About ANDETAG",
    language: "en",
    destination: "stockholm",
    headerVariantId: "header-4287",
    footerVariantId: "footer-3100",
    canonicalPath: "/en/about-andetag/",
    hreflang: {
      sv: "/om-andetag/",
      en: "/en/about-andetag/",
      de: null,
    },
    description:
      "English brand header variant with desktop brand navigation and mobile fallback.",
  },
  {
    id: "en-berlin-legacy",
    title: "ANDETAG Berlin Legacy Alias",
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
    description: "Legacy alias header mapped to the unified english hero variant.",
  },
];
