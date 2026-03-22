export type Language = "sv" | "en" | "de";
export type Destination = "stockholm" | "berlin";
export type HeaderVariantId =
  | "header-192"
  | "header-918"
  | "header-4344"
  | "header-2223"
  | "header-3305"
  | "header-4287";
export type FooterVariantId = "footer-207" | "footer-3100" | "footer-4229";
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
  id: "sv-main" | "en-main" | "en-brand" | "de-main";
  language: Language;
  destination: Destination | "shared";
  items: NavigationItem[];
};

export type HeaderVariant = {
  id: HeaderVariantId;
  language: Language;
  kind: "hero" | "small" | "brand";
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
