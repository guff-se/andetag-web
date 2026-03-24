import type {
  FooterVariant,
  FooterVariantId,
  HeaderVariant,
  HeaderVariantId,
  LegacyHeaderAliasId,
} from "./types";

export const HEADER_VARIANTS: Record<HeaderVariantId, HeaderVariant> = {
  "chrome-hdr-sv-stockholm-hero": {
    id: "chrome-hdr-sv-stockholm-hero",
    language: "sv",
    kind: "hero",
    navVariantDesktop: "sv-main",
    navVariantMobile: "sv-main",
    ctaLabel: "Hitta biljetter",
    ctaHref: "#book",
  },
  "chrome-hdr-sv-stockholm-small": {
    id: "chrome-hdr-sv-stockholm-small",
    language: "sv",
    kind: "small",
    navVariantDesktop: "sv-main",
    navVariantMobile: "sv-main",
    ctaLabel: "Hitta biljetter",
    ctaHref: "/sv/stockholm/biljetter/",
  },
  "chrome-hdr-en-stockholm-hero": {
    id: "chrome-hdr-en-stockholm-hero",
    language: "en",
    kind: "hero",
    navVariantDesktop: "en-main",
    navVariantMobile: "en-main",
    ctaLabel: "Find Tickets",
    ctaHref: "#book",
  },
  "chrome-hdr-en-stockholm-small": {
    id: "chrome-hdr-en-stockholm-small",
    language: "en",
    kind: "small",
    navVariantDesktop: "en-main",
    navVariantMobile: "en-main",
    ctaLabel: "Tickets",
    ctaHref: "/en/stockholm/tickets/",
  },
  "chrome-hdr-en-stockholm-brand": {
    id: "chrome-hdr-en-stockholm-brand",
    language: "en",
    kind: "brand",
    navVariantDesktop: "en-brand",
    navVariantMobile: "en-main",
    ctaLabel: "Tickets",
    ctaHref: "/en/stockholm/tickets/",
  },
  "chrome-hdr-en-berlin-hero": {
    id: "chrome-hdr-en-berlin-hero",
    language: "en",
    kind: "hero",
    navVariantDesktop: "en-main",
    navVariantMobile: "en-main",
    ctaLabel: "Find Tickets",
    ctaHref: "#book",
  },
  "chrome-hdr-en-berlin-small": {
    id: "chrome-hdr-en-berlin-small",
    language: "en",
    kind: "small",
    navVariantDesktop: "en-main",
    navVariantMobile: "en-main",
    ctaLabel: "Tickets",
    ctaHref: "/en/stockholm/tickets/",
  },
  "chrome-hdr-de-berlin-hero": {
    id: "chrome-hdr-de-berlin-hero",
    language: "de",
    kind: "hero",
    navVariantDesktop: "de-main",
    navVariantMobile: "de-main",
    ctaLabel: "FUR FRUHBUCHER-TICKETS ANMELDEN",
    ctaHref: "#book",
  },
  "chrome-hdr-de-berlin-small": {
    id: "chrome-hdr-de-berlin-small",
    language: "de",
    kind: "small",
    navVariantDesktop: "de-main",
    navVariantMobile: "de-main",
    ctaLabel: "Anmelden",
    ctaHref: "/de/berlin/",
  },
};

export const FOOTER_VARIANTS: Record<FooterVariantId, FooterVariant> = {
  "chrome-ftr-sv-stockholm": {
    id: "chrome-ftr-sv-stockholm",
    language: "sv",
    legalLinks: [{ label: "Integritetspolicy", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetag.museum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
  "chrome-ftr-en-stockholm": {
    id: "chrome-ftr-en-stockholm",
    language: "en",
    legalLinks: [{ label: "Privacy Policy", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetag.museum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
  "chrome-ftr-en-berlin": {
    id: "chrome-ftr-en-berlin",
    language: "en",
    legalLinks: [{ label: "Privacy Policy", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetag.museum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
  "chrome-ftr-de-berlin": {
    id: "chrome-ftr-de-berlin",
    language: "de",
    legalLinks: [{ label: "Datenschutz", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetag.museum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
};

export function getResolvedHeaderVariantId(
  headerVariantId: HeaderVariantId | LegacyHeaderAliasId,
): HeaderVariantId {
  if (headerVariantId === "header-4136") {
    return "chrome-hdr-en-berlin-hero";
  }

  return headerVariantId;
}
