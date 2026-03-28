import {
  getBrandHomeHref,
  getDestinationSelectorOptions,
  getLanguageSelectorOptions,
  getNavigationVariant,
} from "./navigation";
import { buildCanonicalUrl, buildHreflangLinks } from "./seo";
import type {
  Destination,
  FooterVariantId,
  HeaderVariantId,
  Language,
  LegacyHeaderAliasId,
} from "./types";
import { FOOTER_VARIANTS, HEADER_VARIANTS, getResolvedHeaderVariantId } from "./variants";

type LayoutModelInput = {
  language: Language;
  destination: Destination;
  headerVariantId: HeaderVariantId | LegacyHeaderAliasId;
  footerVariantId: FooterVariantId;
  canonicalPath: string;
  /** When set, `<link rel="canonical">` targets this path instead of `canonicalPath`. */
  seoCanonicalPath?: string | null;
  hreflang: Record<Language, string | null>;
  xDefaultPath: string | null;
};

export function createPageLayoutModel(input: LayoutModelInput) {
  const resolvedHeaderId = getResolvedHeaderVariantId(input.headerVariantId);

  return {
    brandHomeHref: getBrandHomeHref(input.language, input.destination),
    header: HEADER_VARIANTS[resolvedHeaderId],
    footer: FOOTER_VARIANTS[input.footerVariantId],
    navigation: getNavigationVariant({
      language: input.language,
      destination: input.destination,
      headerVariantId: resolvedHeaderId,
      viewport: "desktop-tablet",
    }),
    navigationMobile: getNavigationVariant({
      language: input.language,
      destination: input.destination,
      headerVariantId: resolvedHeaderId,
      viewport: "mobile",
    }),
    languageSelector: getLanguageSelectorOptions({
      language: input.language,
      destination: input.destination,
      canonicalPath: input.canonicalPath,
    }),
    destinationSelector: getDestinationSelectorOptions({
      language: input.language,
      destination: input.destination,
      canonicalPath: input.canonicalPath,
    }),
    canonicalUrl: buildCanonicalUrl(input.seoCanonicalPath ?? input.canonicalPath),
    hreflangLinks: buildHreflangLinks(input.hreflang, input.xDefaultPath),
  };
}

export type PageLayoutModel = ReturnType<typeof createPageLayoutModel>;
