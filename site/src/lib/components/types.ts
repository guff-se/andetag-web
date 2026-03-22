export type HeadingLevel = "h1" | "h2" | "h3";

export type Link = {
  label: string;
  href: string;
};

/** v1: any surface. v2: light background only (emphasis). v3: photo or busy backgrounds. See `docs/Visual Identity.md`. */
export type CtaVariant = "primary" | "secondary" | "outline";

export type Cta = Link & {
  variant: CtaVariant;
};

export type LinkStyleVariant =
  | "content"
  | "nav"
  | "footer"
  | "cta-primary"
  | "cta-secondary"
  | "cta-outline";

export type StyledLink = Link & {
  styleVariant: LinkStyleVariant;
  external?: boolean;
};
