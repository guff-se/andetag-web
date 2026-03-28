export type Language = "sv" | "en" | "de";
export type Destination = "stockholm" | "berlin";

/** Phase 6 stable chrome ids (hero or small header × locale + destination). */
export type HeaderVariantId =
  | "chrome-hdr-sv-stockholm-hero"
  | "chrome-hdr-sv-stockholm-small"
  | "chrome-hdr-en-stockholm-hero"
  /** English hub `/en/`: full-viewport hero, Stockholm and Berlin CTAs, no nav strip. */
  | "chrome-hdr-en-header-selector"
  | "chrome-hdr-en-stockholm-small"
  | "chrome-hdr-en-berlin-hero"
  | "chrome-hdr-en-berlin-small"
  | "chrome-hdr-de-berlin-hero"
  | "chrome-hdr-de-berlin-small";

/** One footer per chrome context (Phase 6 matrix). */
export type FooterVariantId =
  | "chrome-ftr-sv-stockholm"
  | "chrome-ftr-en-stockholm"
  | "chrome-ftr-en-berlin"
  | "chrome-ftr-de-berlin";

/** EX-0005 legacy Elementor alias; resolves like English Berlin hero in layout code. */
export type LegacyHeaderAliasId = "header-4136";
export type ViewportBucket = "desktop-tablet" | "mobile";

export type SelectorOption<T extends string> = {
  value: T;
  label: string;
  href: string;
  active: boolean;
};

export type NavigationItem = {
  label: string;
  href: string;
  cta?: boolean;
  children?: NavigationItem[];
};

export type NavigationVariant = {
  id: "sv-main" | "en-main" | "en-main-berlin" | "de-main";
  language: Language;
  destination: Destination | "shared";
  items: NavigationItem[];
};

export type HeaderVariant = {
  id: HeaderVariantId;
  language: Language;
  kind: "hero" | "small";
  navVariantDesktop: NavigationVariant["id"];
  navVariantMobile: NavigationVariant["id"];
  ctaLabel: string;
  ctaHref: string;
};

export type FooterVariant = {
  id: FooterVariantId;
  language: Language;
  legalLinks: Array<{ label: string; href: string }>;
  socialLinks: Array<{ label: string; href: string }>;
};
