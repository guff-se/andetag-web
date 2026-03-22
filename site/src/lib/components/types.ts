export type HeadingLevel = "h1" | "h2" | "h3";

export type Link = {
  label: string;
  href: string;
};

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
