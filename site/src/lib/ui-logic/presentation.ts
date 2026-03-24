import type { HeadingLevel, LinkStyleVariant } from "./types";

const LINK_CLASS_BY_VARIANT: Record<LinkStyleVariant, string> = {
  content: "link-content",
  nav: "link-nav",
  footer: "link-footer",
  "cta-primary": "link-cta-primary",
  "cta-secondary": "link-cta-secondary",
  "cta-outline": "link-cta-outline",
};

export const WORDMARK_CLASS = "brand-wordmark";
export const WORDMARK_LETTER_SPACING_EM = 0.3;

export function getLinkClassName(variant: LinkStyleVariant): string {
  return LINK_CLASS_BY_VARIANT[variant];
}

export function getHeadingTag(
  level: HeadingLevel | undefined | string,
  fallback: HeadingLevel,
): HeadingLevel {
  if (level === "h1" || level === "h2" || level === "h3") {
    return level;
  }

  return fallback;
}
