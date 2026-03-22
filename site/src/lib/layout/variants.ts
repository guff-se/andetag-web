import type {
  FooterVariant,
  FooterVariantId,
  HeaderVariant,
  HeaderVariantId,
} from "./types";

export const HEADER_VARIANTS: Record<HeaderVariantId, HeaderVariant> = {
  "header-192": {
    id: "header-192",
    language: "sv",
    kind: "hero",
    navVariantDesktop: "sv-main",
    navVariantMobile: "sv-main",
    ctaLabel: "Hitta biljetter",
    ctaHref: "#book",
  },
  "header-918": {
    id: "header-918",
    language: "en",
    kind: "hero",
    navVariantDesktop: "en-main",
    navVariantMobile: "en-main",
    ctaLabel: "Find Tickets",
    ctaHref: "#book",
  },
  "header-4344": {
    id: "header-4344",
    language: "de",
    kind: "hero",
    navVariantDesktop: "de-main",
    navVariantMobile: "de-main",
    ctaLabel: "FUR FRUHBUCHER-TICKETS ANMELDEN",
    ctaHref: "#book",
  },
  "header-2223": {
    id: "header-2223",
    language: "sv",
    kind: "small",
    navVariantDesktop: "sv-main",
    navVariantMobile: "sv-main",
    ctaLabel: "Hitta biljetter",
    ctaHref: "/stockholm/biljetter/",
  },
  "header-3305": {
    id: "header-3305",
    language: "en",
    kind: "small",
    navVariantDesktop: "en-main",
    navVariantMobile: "en-main",
    ctaLabel: "Tickets",
    ctaHref: "/en/stockholm/tickets/",
  },
  "header-4287": {
    id: "header-4287",
    language: "en",
    kind: "brand",
    navVariantDesktop: "en-brand",
    navVariantMobile: "en-main",
    ctaLabel: "Tickets",
    ctaHref: "/en/stockholm/tickets/",
  },
};

export const FOOTER_VARIANTS: Record<FooterVariantId, FooterVariant> = {
  "footer-207": {
    id: "footer-207",
    language: "sv",
    legalLinks: [{ label: "Integritetspolicy", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetagmuseum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
  "footer-3100": {
    id: "footer-3100",
    language: "en",
    legalLinks: [{ label: "Privacy Policy", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetagmuseum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
  "footer-4229": {
    id: "footer-4229",
    language: "de",
    legalLinks: [{ label: "Datenschutz", href: "/privacy/" }],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/andetag.museum/" },
      { label: "Facebook", href: "https://www.facebook.com/andetagmuseum/" },
      { label: "Pinterest", href: "https://www.pinterest.com/andetagmuseum/" },
      { label: "Spotify", href: "https://open.spotify.com/" },
    ],
  },
};

export function getResolvedHeaderVariantId(
  headerVariantId: HeaderVariantId | "header-4136",
): HeaderVariantId {
  if (headerVariantId === "header-4136") {
    // GAP-002 resolution: treat legacy en-berlin alias header as the main
    // English hero header in the unified static layout.
    return "header-918";
  }

  return headerVariantId;
}
