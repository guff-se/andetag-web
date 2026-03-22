# Phase 3 Component Inventory and API Contracts

Purpose: define the migration-critical component set and stable API contracts for Phase 3, aligned with source evidence and `docs/content-model.md`.

Status: approved for implementation.

## Source Inputs

- `docs/phase-1-analysis-schema.md`
- `docs/content-model.md`
- `docs/phase-1-design-baseline.md`
- `docs/existing-site-structure.md`

## Inventory Summary

| component id | source widget/pattern evidence | migration priority | notes |
|--------------|--------------------------------|--------------------|-------|
| `ButtonGroup` | `button.default`, nav/footer CTA patterns | high | Covers primary and secondary CTA paths |
| `HeroSection` | Hero header and hero content patterns | high | Reuses shared hero primitives and CTA group |
| `ContentSection` | `heading.default` + `text-editor.default` blocks | high | Base wrapper for structured content areas |
| `AccordionSection` | `nested-accordion.default` on FAQ pages | high | Required for FAQ parity |
| `BookingEmbed` | `html.default` Understory widget | high | Primary conversion path component |
| `WaitlistFormEmbed` | `html.default` Brevo form (DE flow) | high | Lead capture and Berlin pre-launch flow |
| `MapEmbed` | `google_maps.default` | medium | Consent-aware embed surface |
| `VideoEmbed` | `video.default` Vimeo embeds | medium | Consent-aware media surface |
| `TestimonialCarousel` | `testimonial-carousel.default` | medium | Reusable proof/quote pattern |
| `GallerySection` | `gallery.default` and `image-carousel.default` | medium | Shared gallery surface with responsive variants |
| `PartnersSection` | Front-page `Våra partners` heading + linked `image.default` logo grid (`site-html/index.html`) | medium | Reusable partner logo/link section with consistent heading and link behavior |
| `InfoCardGrid` | Reused rounded-card information layouts | medium | Supports pricing/info card patterns |

## Proposed API Contracts

All contracts are TypeScript-first, prop names stay stable once confirmed.

```ts
type Link = { label: string; href: string };

type Cta = Link & {
  variant: "primary" | "secondary" | "outline";
};

type ButtonGroupProps = {
  buttons: Cta[];
};

type HeroSectionProps = {
  heading: string;
  body?: string;
  eyebrow?: string;
  backgroundImage?: string;
  backgroundStyle?: "inline" | "cover";
  headingLevel?: "h1" | "h2";
  ctas: Cta[];
};

type ContentSectionProps = {
  heading?: string;
  headingLevel?: "h2" | "h3";
  markdown: string;
  align?: "left" | "center";
};

type AccordionSectionProps = {
  items: Array<{ title: string; body: string }>;
};

type BookingEmbedProps = {
  companyId: string;
  language: "sv" | "en" | "de";
  anchorId?: string;
  fallbackText: string;
};

type WaitlistFormEmbedProps = {
  formId: string;
  locale: "sv" | "en" | "de";
  fallbackText: string;
};

type MapEmbedProps = {
  title: string;
  src: string;
  fallbackText: string;
};

type VideoEmbedProps = {
  title: string;
  src: string;
  fallbackText: string;
};

type TestimonialCarouselProps = {
  items: Array<{ quote: string; author?: string }>;
  backgroundImage?: string;
  autoplayMs?: number;
};

type GallerySectionProps = {
  images: Array<{ src: string; alt: string; caption?: string }>;
  mobileMode: "carousel" | "grid";
};

type PartnersSectionProps = {
  heading?: string;
  headingLevel?: "h2" | "h3";
  partners: Array<{
    name: string;
    href: string;
    logoSrc: string;
    logoAlt: string;
  }>;
};

type InfoCardGridProps = {
  cards: Array<{ title: string; body: string; cta?: Link }>;
};
```

## Typography Standards (Headings)

Heading usage is semantic-first and must stay consistent across components:

- Exactly one `h1` per indexable page.
- `HeroSection` uses `h1` when it is the primary page-intent heading, otherwise `h2`.
- `ContentSection` defaults to `h2`, with `h3` for subsections nested under the active section.
- `AccordionSection` item titles should map to `h3`-level semantics (or equivalent accessible heading structure) when rendered inside an `h2` section.

Implementation contract for heading consistency:

```ts
type HeadingLevel = "h1" | "h2" | "h3";

type HeadingPolicy = {
  pagePrimary: "h1";
  sectionDefault: "h2";
  subsectionDefault: "h3";
};
```

## Link Appearance Standards

All link rendering should consume reusable link styles, not per-component ad hoc styles:

- Body/content links: underlined by default, clear hover and focus-visible state.
- Navigation links: uppercase treatment where source-backed, no underline by default, clear active and focus-visible states.
- CTA links/buttons: use `primary`, `secondary`, or `outline` variants only.
- Footer legal/SEO links: compact style variant, still meeting contrast and focus requirements.

Implementation style contract:

```ts
type LinkStyleVariant = "content" | "nav" | "footer" | "cta-primary" | "cta-secondary" | "cta-outline";

type StyledLinkProps = {
  label: string;
  href: string;
  styleVariant: LinkStyleVariant;
  external?: boolean;
};
```

## ANDETAG Brand Wordmark Standard

The brand name should be treated as a reusable style contract, not manually re-styled per component:

- Text: `ANDETAG` (uppercase exact spelling).
- Typography baseline: Jost uppercase treatment.
- Letter spacing baseline: `0.3em` for the wordmark treatment.
- Reuse one shared class or token in all contexts where the brand wordmark appears.

Implementation contract:

```ts
type BrandWordmarkProps = {
  text?: "ANDETAG"; // default
  as?: "span" | "p" | "h1" | "h2";
  decorative?: boolean;
};
```

Recommended shared style hook:

- `.brand-wordmark` for casing and spacing consistency
- Optional size modifiers only, for example `.brand-wordmark--sm` and `.brand-wordmark--lg`

## Required State Coverage per Component

Minimum state requirements for sign-off:

- `ButtonGroup`: default, hover/focus, mobile wrapping behavior.
- `HeroSection`: default with CTA, no-body variant, mobile layout.
- `ContentSection`: heading + body, body-only variant.
- `AccordionSection`: collapsed, expanded, keyboard interaction.
- `BookingEmbed`: loaded state, unavailable-script fallback state.
- `WaitlistFormEmbed`: loaded state, unavailable-script fallback state.
- `MapEmbed`: loaded state, consent-blocked fallback state.
- `VideoEmbed`: loaded state, consent-blocked fallback state.
- `TestimonialCarousel`: single-item fallback, multi-item carousel behavior.
- `GallerySection`: desktop grid, mobile carousel or grid fallback.
- `PartnersSection`: heading + logo grid, keyboard focus on partner links, logo fallback text/alt behavior.
- `InfoCardGrid`: multi-card grid, single-card fallback.

## Confirmation Resolutions

1. `TestimonialCarousel` remains in Phase 3 core scope.
2. Social links are not a standalone Phase 3 component, they remain header/footer-owned behavior only.
3. `GallerySection` defaults to `carousel` on mobile to match source-backed behavior.

## Done-When Mapping for `P3-03`

- [x] Migration-critical component list is source-backed.
- [x] Proposed stable prop contracts are aligned with `docs/content-model.md`.
- [x] Required state coverage list is explicit.
- [x] Gustaf confirmation completed (required before `P3-04` starts).

## Showcase and Sign-Off Strategy (Phase 3)

- Implementation flow: build all approved components and required states in one batch (`P3-04` to `P3-07`).
- Showcase route: `/component-showcase/` (local and preview/staging), excluded from sitemap and production navigation.
- Approval flow: one consolidated Gustaf sign-off in `P3-08`, after the showcase route renders all required components and states.
