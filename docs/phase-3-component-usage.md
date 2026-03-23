# Phase 3 Component Usage Reference

Purpose: provide implementation-facing usage guidance for approved Phase 3 components before page migration in Phase 5.

## Global typography

- Default **body and paragraph** text: **Baskervville** (`BaskervvilleLocal`), per `docs/Visual Identity.md` and `site/src/styles/layout.css` (`body`).
- **Accordion question rows** (`AccordionSection` **`.accordion-item-toggle`** label text): **Baskervville** (`BaskervvilleLocal`) in `site/src/styles/components.css`, same as FAQ body copy.
- **Headings**, eyebrow labels, card titles, **CTAs**, and preview **header chrome**: **Jost** (`JostLocal`) where scoped in `site/src/styles/components.css` and `site/src/styles/layout.css`.

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
  - `buttons: Array<{ label: string; href: string; variant: "primary" | "secondary" | "outline"; external?: boolean }>`
- Notes:
  - **Layout:** in **`components.css`**, **`.button-group`** uses **`justify-content: center`** so items stay centered in their container; **`page-migrated-cta`** also centers the group on migrated pages.
  - Use for hero and card CTA clusters.
  - Set **`external: true`** for third-party booking or partner URLs so links open in a new tab with safe `rel` (wired through `StyledLink`).
  - Keep labels concise and action-oriented.
  - **Variant usage** (see `docs/Visual Identity.md`, CTA buttons):
    - **`primary` (version 1):** light or dark backgrounds.
    - **`secondary` (version 2):** **light surfaces only** (for example pink page background), strongest emphasis.
    - **`outline` (version 3):** **photo or busy backgrounds** (for example `HeroSection` with `backgroundImage`).

### `HeroSection`

- Purpose: reusable hero content block independent of header layout.
- Key props:
  - `heading?: string`
  - `body?: string`
  - `eyebrow?: string`
  - `backgroundImage?: string`
  - `headingLevel?: "h1" | "h2"`
  - `ctas?: Cta[]` (optional; supports **`external`** on each item via `ButtonGroup` / `StyledLink`; omit or **`[]`** when the band uses only the default **slot**)
  - `ariaLabel?: string` (set when `heading` is omitted so the band has an accessible name)
- Default **slot:** optional rich content inside **`.component-hero-content`** (after eyebrow / heading / body, before CTAs). Use for structured HTML that is not a single lead paragraph (for example **`DejtSv.astro`** visitor **`blockquote`**s on the photo band). Slot markup should use light-on-overlay typography; cover-specific rules live under **`.component-hero.is-cover .component-hero-slot`** in **`components.css`**.
- Notes:
  - Use `h1` only when this is the page primary heading.
  - Use `h2` when the page already has a primary heading elsewhere.
  - When the real page title lives in a `ContentSection` above the band (for example Art Yoga), omit `heading` and pass **`ariaLabel`** plus **`backgroundImage`** and **`outline`** CTAs on the photo.
  - **Cover parallax:** when **`backgroundImage`** is set, **`HeroSection`** emits a module script that loads **`site/src/scripts/hero-cover-parallax.ts`** (scroll-driven **`translateY`** + **`scale`** on **`.component-hero-media`**, **`prefers-reduced-motion`** clears transforms). The script binds listeners once per page (**`window.__andetagHeroCoverParallax`**). Pages without a cover **`HeroSection`** do not load it.
  - **Two mutually exclusive modes:** with `backgroundImage`, the hero is **full-bleed image + dark overlay + light text** (source-shaped band such as `site-html/index.html` container `b899d4f`). **Without** `backgroundImage`, the hero is **solid aubergine (`#4a0d2f`) with light text only** (no image strip above the same band).
  - Do not use dark body text on the aubergine or image-overlay hero; headings, eyebrow, and lead use light tones in `site/src/styles/components.css`.

### `ContentSection`

- Purpose: generic text/content section wrapper.
- Key props:
  - `heading?: string`
  - `headingLevel?: "h2" | "h3"`
  - `markdown: string`
  - `align?: "left" | "center"`
- Notes:
  - Prefer `h2` for top-level sections, `h3` for nested sub-sections.
  - Light-surface heading typography (Jost, uppercase, letter-spacing per `docs/Visual Identity.md`) for the section heading and for `h2`–`h4` inside `content-section-body` is defined in `site/src/styles/components.css`; do not rely on browser defaults.

### `AccordionSection`

- Purpose: FAQ-style expandable content.
- Key props:
  - `items: Array<{ title: string; body?: string; bodyHtml?: string }>` (use **`body`** for a single plain paragraph, **`bodyHtml`** for trusted HTML with links or multiple **`p`** blocks)
- Notes:
  - Titles should map to subsection semantics under the current section heading.
  - **`bodyHtml`** renders inside **`.accordion-item-body`** (link and **`strong`** styles in **`components.css`**).
  - Visual: **`+`** / **minus** (U+2212) on the **`summary`** left via **`::before`** (legacy Elementor plus/minus icons); default disclosure marker hidden. **`accordion-section`** is **border-only** (no fill), **`transparent`** background.
  - Motion: content sits in **`.accordion-item-expand`** > **`.accordion-item-expand-inner`**; **`components.css`** animates height with **`grid-template-rows`** **`0fr`→`1fr`** (smooth open). Bottom padding on **`.accordion-item-expand-inner`** applies only when **`.accordion-item.is-open`** so the closed row does not keep a **`0fr`** min height from padding. **`prefers-reduced-motion: reduce`** disables the transition.
  - Behavior: **`button.accordion-item-toggle`** + **`.is-open`** on **`accordion-item`** (not native **`<details>`**) so **`.accordion-item-expand`** **`grid-template-rows`** animates on every open and close in Chromium/WebKit. Within each **`accordion-section`**, only one panel stays open (**`accordion-section-exclusive.ts`** click handler closes siblings). Multiple **`AccordionSection`** instances on a page (for example FAQ columns) are independent. The user can still close the open row so none are expanded.
  - **`FragorSvarSv.astro`:** two **`AccordionSection`** instances in **`.page-faq-accordions`** (two-column grid, stacks under **`900px`**) to match legacy Elementor **`e-grid`** + twin nested accordions on **`/sv/stockholm/fragor-svar/`**.

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
  - Layout: one row of eight columns by default; at `640px` and below the grid is two columns so logos break every two.

### `TestimonialCarousel`

- Purpose: quote/testimonial presentation for social proof.
- Key props:
  - `items: Array<{ quote: string; author?: string }>`
  - `backgroundImage?: string`
  - `autoplayMs?: number`
- Notes:
  - Include at least one item, support single-item fallback.
  - Uses jQuery-driven slide transitions (incoming from the side, outgoing opposite) with previous/next arrow controls and autoplay, modeled after the source testimonial carousel pattern; `prefers-reduced-motion` shortens the CSS transition.
  - Source-parity showcase uses background image `/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled.jpg`.

### `InfoFrame`

- Purpose: a **single** lavender rounded frame around one highlighted block of information (pricing, policy excerpt, and similar). It is **not** a grid and **not** for series of multiple cards; use one component instance per callout. Vertical rhythm in **`components.css`**: **`margin: 2.25rem 0`**, **`padding: 1.5rem`** inside the frame.
- Key props:
  - `bodyHtml: string` (trusted HTML, same contract as `ContentSection` body)
  - `heading?: string`
  - `headingLevel?: "h1" | "h2" | "h3"` (default **`h3`**)
  - `cta?: { label: string; href: string; external?: boolean }` (optional content-style link under the body)
- Notes:
  - **`BiljetterSv.astro`:** **`heading="Priser"`** and **`bodyHtml`** with all price lines through the dagtid sentence (label before each colon in **`strong`**). **`.info-frame-body`** uses **Jost** for boxed copy (not Baskervville body default).

### `BookingEmbed`

- Purpose: conversion-critical booking embed wrapper with fallback state.
- Key props:
  - `companyId: string`
  - `language: "sv" | "en" | "de"`
  - `anchorId?: string`
  - `fallbackText: string`
  - `unavailable?: boolean`
  - `heading?: string` (optional title above the widget inside the shell)
  - `headingLevel?: "h1" | "h2" | "h3"` (default **`h2`**)
  - `headingAlign?: "left" | "center"` (default **`center`**)
  - `unframed?: boolean` (default **`false`**; no border, background, or padding; **use in the booking aside column** per standard layout below)
  - `showContact?: boolean` (default **`true`**: **`.booking-embed-contact`** below the widget mount with **`info@andetag.museum`**; copy from **`getBookingEmbedContactHtml`** in **`site/src/lib/components/booking-embed-contact.ts`**; **EX-0010**)
- Notes:
  - **Standard page layout:** Put **`BookingEmbed`** in the **fixed-width right column** of **`page-layout-with-aside`** (**`site/src/styles/components.css`**: **`--page-aside-width`** default **`420px`**, stacks to one column under **`900px`** with the widget **below** the main column). The **left column** (**`page-layout-with-aside__main`**) is **variable width** and holds the rest of the page flow that should sit beside the calendar (for example **`InfoFrame`**, **`AccordionSection`**). Place any **full-width** blocks **above** this grid when the design calls for it (for example hero, testimonials band); **`DejtSv.astro`** does this. In the aside, prefer **`unframed`** so the widget is not double-boxed and **`.page-layout-with-aside__aside .embed-shell`** can keep **`margin-top: 0`** aligned with the main column top.
  - With **`heading`**, the title uses **`.embed-shell-heading`** (**`margin-bottom: 1.1rem`**) before the widget or fallback.
  - Loaded-state implementation uses the Understory official embed snippet:
    - script: `https://widgets.understory.io/widgets/understory-booking-widget.js`
    - widget container class: `understory-booking-widget`
    - required data attributes: `data-company-id`, `data-language`
  - Keep fallback text user-actionable when unavailable.
  - **`BiljetterSv.astro`** (`/sv/stockholm/biljetter/`): whole page is **`page-layout-with-aside`** from the top (main: copy + priser + säsongskort; aside: **`BookingEmbed`** with **`heading="Tillgängliga tider"`**, **`unframed`**, default contact below widget). Company id **`3b3aa7a7c2cd455b8f3a56cd81033110`**, language **`sv`**, **`anchorId`** **`book`** (header CTA `#book`).
  - **`DejtSv.astro`** (`/sv/stockholm/dejt/`): same aside pattern, but the grid starts **after** the testimonial band; intro uses a separate **`page-dejt-intro`** **`page-layout-with-aside`** for text + photo. Contact line is the embed default (**`info@andetag.museum`**; legacy **`info@tadaa.se`**; **EX-0010**).

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

- Historical review route: `/component-showcase/` (retired after Phase 3 sign-off; see `docs/phase-3-verification-record.md`)
- Review mode was one consolidated sign-off pass for all required states
- Quality checklist: `docs/phase-3-component-qa-checklist.md`
