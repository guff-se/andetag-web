# Phase 3 Component Usage Reference

Purpose: provide implementation-facing usage guidance for approved Phase 3 components before page migration in Phase 5.

## Usage Rules

- Use the approved prop contracts from `docs/phase-3-component-inventory.md`.
- Keep heading semantics aligned to the documented hierarchy (`h1`, `h2`, `h3`).
- Use shared link variants and CTA variants only, do not invent one-off link styles.
- Apply the reusable `ANDETAG` wordmark style (`.brand-wordmark`) where brand treatment is required.

## Components

### `BrandWordmark`

- Purpose: render the ANDETAG wordmark with consistent uppercase and letter spacing.
- Key props:
  - `text?: "ANDETAG"`
  - `as?: "span" | "p" | "h1" | "h2"`
  - `decorative?: boolean`
- Notes:
  - Use where explicit brand-wordmark treatment is intended.
  - Avoid local overrides to casing or spacing.

### `StyledLink`

- Purpose: centralize link appearance variants.
- Key props:
  - `label: string`
  - `href: string`
  - `styleVariant: "content" | "nav" | "footer" | "cta-primary" | "cta-secondary" | "cta-outline"`
  - `external?: boolean`
- Notes:
  - Prefer this for links in reusable components to keep visual contract stable.

### `ButtonGroup`

- Purpose: render grouped CTA actions.
- Key props:
  - `buttons: Array<{ label: string; href: string; variant: "primary" | "secondary" | "outline" }>`
- Notes:
  - Use for hero and card CTA clusters.
  - Keep labels concise and action-oriented.

### `HeroSection`

- Purpose: reusable hero content block independent of header layout.
- Key props:
  - `heading: string`
  - `body?: string`
  - `eyebrow?: string`
  - `backgroundImage?: string`
  - `backgroundStyle?: "inline" | "cover"`
  - `headingLevel?: "h1" | "h2"`
  - `ctas: Cta[]`
- Notes:
  - Use `h1` only when this is the page primary heading.
  - Use `h2` when the page already has a primary heading elsewhere.
  - Use `backgroundStyle: "cover"` with `backgroundImage` for image-overlay hero variants such as `Take a Breath - Book your ticket`.

### `ContentSection`

- Purpose: generic text/content section wrapper.
- Key props:
  - `heading?: string`
  - `headingLevel?: "h2" | "h3"`
  - `markdown: string`
  - `align?: "left" | "center"`
- Notes:
  - Prefer `h2` for top-level sections, `h3` for nested sub-sections.

### `AccordionSection`

- Purpose: FAQ-style expandable content.
- Key props:
  - `items: Array<{ title: string; body: string }>`
- Notes:
  - Titles should map to subsection semantics under the current section heading.

### `GallerySection`

- Purpose: image gallery with responsive behavior.
- Key props:
  - `images: Array<{ src: string; alt: string; caption?: string; fullSrc?: string }>`
  - `mobileMode: "carousel" | "grid"`
- Notes:
  - Use `mobileMode: "carousel"` by default, aligned with approved source behavior.
  - Showcase parity implementation uses source-backed 8-image dataset in a 4x2 full-width grid.
  - Hover overlay and click lightbox behavior is implemented with `glightbox`.

### `PartnersSection`

- Purpose: reusable partner logo/link block for `Våra partners` and equivalent contexts.
- Key props:
  - `heading?: string`
  - `headingLevel?: "h2" | "h3"`
  - `partners: Array<{ name: string; href: string; logoSrc: string; logoAlt: string }>`
- Notes:
  - Partner links are external and should preserve keyboard focus clarity.
  - Logo `alt` text is required for accessibility.

### `TestimonialCarousel`

- Purpose: quote/testimonial presentation for social proof.
- Key props:
  - `items: Array<{ quote: string; author?: string }>`
  - `backgroundImage?: string`
  - `autoplayMs?: number`
- Notes:
  - Include at least one item, support single-item fallback.
  - Uses jQuery transitions with previous/next arrow controls and autoplay, modeled after the source testimonial carousel pattern.
  - Source-parity showcase uses background image `/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled.jpg`.

### `InfoCardGrid`

- Purpose: structured information cards with optional CTA.
- Key props:
  - `cards: Array<{ title: string; body: string; cta?: { label: string; href: string } }>`
- Notes:
  - Use for pricing/info clusters where repeated card layout improves scannability.

### `BookingEmbed`

- Purpose: conversion-critical booking embed wrapper with fallback state.
- Key props:
  - `companyId: string`
  - `language: "sv" | "en" | "de"`
  - `anchorId?: string`
  - `fallbackText: string`
  - `unavailable?: boolean`
- Notes:
  - Loaded-state implementation uses the Understory official embed snippet:
    - script: `https://widgets.understory.io/widgets/understory-booking-widget.js`
    - widget container class: `understory-booking-widget`
    - required data attributes: `data-company-id`, `data-language`
  - Keep fallback text user-actionable when unavailable.

### `WaitlistFormEmbed`

- Purpose: lead capture embed wrapper with fallback state.
- Key props:
  - `formId: string`
  - `locale: "sv" | "en" | "de"`
  - `fallbackText: string`
  - `unavailable?: boolean`
  - `formAction?: string`
- Notes:
  - Loaded-state implementation follows the provided Brevo embed structure:
    - custom `#sib-container` style overrides
    - Brevo stylesheet include `https://sibforms.com/forms/end-form/build/sib-styles.css`
    - `<form method="POST">` with hidden locale/html fields
  - Internal privacy link is normalized to local path `/privacy/`.

### `MapEmbed`

- Purpose: map embed surface with consent/unavailable fallback behavior.
- Key props:
  - `title: string`
  - `src: string`
  - `fallbackText: string`
  - `unavailable?: boolean`

### `VideoEmbed`

- Purpose: video embed surface with consent/unavailable fallback behavior.
- Key props:
  - `title: string`
  - `src: string`
  - `fallbackText: string`
  - `unavailable?: boolean`

## Verification Notes

- Showcase route for review: `/component-showcase/`
- Review mode: one consolidated sign-off pass for all required states
- Quality checklist: `docs/phase-3-component-qa-checklist.md`
