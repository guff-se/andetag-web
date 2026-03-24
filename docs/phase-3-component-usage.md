# Phase 3 Component Usage Reference

Purpose: provide implementation-facing usage guidance for approved Phase 3 components before page migration in Phase 5.

## Global typography

- Default **body and paragraph** text: **Baskervville** (`BaskervvilleLocal`), per `docs/Visual Identity.md` and `site/src/styles/layout.css` (`body`).
- **Accordion question rows** (`AccordionSection` **`.accordion-item-toggle`** label text): **Baskervville** (`BaskervvilleLocal`) for the default label; **`.brand-wordmark`** inside the label (via **`titleHtml`**) uses **Jost** and uppercase spacing like other pages.
- **Headings**, eyebrow labels, card titles, **CTAs**, and preview **header chrome**: **Jost** (`JostLocal`) where scoped in `site/src/styles/components.css` and `site/src/styles/layout.css`.

## Usage Rules

- Use the approved prop contracts from `docs/phase-3-component-inventory.md`.
- Keep heading semantics aligned to the documented hierarchy (`h1`, `h2`, `h3`).
- Use shared link variants and CTA variants only, do not invent one-off link styles.
- Apply the reusable `ANDETAG` wordmark style (`.brand-wordmark`) where brand treatment is required.

## Page shell and main

- **`SiteLayout`** renders **`<main id="main-content" class="main-content">`**. Vertical space from the **bottom edge of the Swedish shared hero** (including the desktop nav strip) to the **first page block** is **`padding-top`** on **`.main-content`**, driven by **`--page-shell-main-top-gap`** in **`site/src/styles/layout.css`**. Prefer tuning that token over page-level **`margin-top`** on the first row.
- **`site/src/styles/components.css`** sets **`.main-content > :first-child > *:first-child { margin-top: 0 }`** so **`.content-section`**, **`.component-hero`**, and similar blocks do not add an extra top margin above that padding.
- **Small Swedish hero** (**`chrome-hdr-sv-stockholm-small`**): **`.shared-hero-header.is-small`** has no **`margin-bottom`**; spacing after the nav comes only from **`.main-content`** padding so subpages align with the full-hero home gap.

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
  - **`cta-*`:** **`components.css`** sets **`display: inline-flex`**, **`width: fit-content`**, **`max-width: 100%`** so CTAs stay label-sized unless a parent intentionally stretches them (avoid **`display: block`** on these anchors in page CSS).

### `ButtonGroup`

- Purpose: render grouped CTA actions.
- Key props:
  - `buttons: Array<{ label: string; href: string; variant: "primary" | "secondary" | "outline"; external?: boolean }>`
- Notes:
  - **Layout:** in **`components.css`**, **`.button-group`** uses **`justify-content: center`** so items stay centered in their container; **`page-migrated-cta`** also centers the group on migrated pages. Stockholm home and SEO landings use **`page-stockholm-home__cta-after-testimonials`** on the **Upplev Andetag!** row below testimonials for wider vertical margins (**`4rem 0 4rem`** vs default **`0.5rem 0 2rem`**).
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
  - **Cover parallax:** when **`backgroundImage`** is set, **`HeroSection`** emits a module script that loads **`site/src/client-scripts/hero-cover-parallax.ts`** (scroll-driven **`translateY`** + **`scale`** on **`.component-hero-media`**, **`prefers-reduced-motion`** clears transforms). The script binds listeners once per page (**`window.__andetagHeroCoverParallax`**). Pages without a cover **`HeroSection`** do not load it.
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
  - `items: Array<{ title: string; titleHtml?: string; body?: string; bodyHtml?: string }>` (use **`title`** for plain question text; optional **`titleHtml`** for trusted HTML when the question includes **`.brand-wordmark`** or other inline markup; use **`body`** for a single plain paragraph, **`bodyHtml`** for trusted HTML with links or multiple **`p`** blocks)
  - `initialOpenIndex?: number | null` (default **`0`**: first row open on load; pass **`null`** when every row should start closed, matching legacy nested accordion default on the Swedish home)
- Notes:
  - Titles should map to subsection semantics under the current section heading.
  - **`titleHtml`** (when set) renders inside **`.accordion-item-toggle-label`** on the **`button`**; **`bodyHtml`** renders inside **`.accordion-item-body`**. **`components.css`** styles links, **`strong`** (**Jost** **`700`**; Baskerville has no bold master), and **`.brand-wordmark`** in both toggle and body so the wordmark keeps **Jost** uppercase spacing beside Baskerville question copy.
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
  - `aggregate?: { eyebrow, score, scoreCaption, meta, linkHref, linkLabel, linkAriaLabel?, regionAriaLabel?, showTripAdvisorBrand? }`: optional Tripadvisor (or similar) summary **below** the quotes; the **same** **`backgroundImage`** fills **`testimonial-block__bg`**, with a single **`testimonial-block__overlay`** (light veil) over the **whole** band (carousel + aggregate). Omit on pages that should show quotes only. By default (**`showTripAdvisorBrand`** omitted or true) the aggregate shows self-hosted **`/assets/tripadvisor/tripadvisor-5dots.png`** (decorative, **`alt=""`**) and **`/assets/tripadvisor/tripadvisor-logo.svg`** (**`alt="Tripadvisor"`**); keep **`meta`** and **`linkLabel`** free of repeating the numeric score or the word Tripadvisor when those are already clear from **`score`** / **`scoreCaption`** and the wordmark. Use **`linkAriaLabel`** when the visible link text is shortened (for example **`Läs alla recensioner`**) but assistive tech should name the destination (**`… på Tripadvisor`**). Set **`showTripAdvisorBrand: false`** to use the previous Unicode star row instead (non-Tripadvisor aggregates).
- Notes:
  - Root element is **`testimonial-block`** (full-bleed band); carousel logic mounts on **`testimonial-block__carousel`** (class **`js-testimonial-carousel`**).
  - Include at least one item, support single-item fallback.
  - Client script (no jQuery): slide transitions (incoming from the side, outgoing opposite), previous/next controls, and autoplay; `transitionend` listens for **`transform`** (and **`-webkit-transform`**) with a timeout fallback; `prefers-reduced-motion` shortens the CSS transition.
  - Default background image `/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled.jpg`. Stockholm Swedish pages import aggregate copy from **`site/src/lib/content/stockholm-testimonial-aggregate.ts`** (figures aligned with **`BesokaromdomenSv`**).

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
  - `unframed?: boolean` (default **`false`**; no border, background, or padding; **use in the booking aside column** per standard layout below)
  - `showContact?: boolean` (default **`true`**: **`.booking-embed-contact`** below the widget mount with **`info@andetag.museum`**; copy from **`getBookingEmbedContactHtml`** in **`site/src/lib/ui-logic/booking-embed-contact.ts`**; **EX-0010**)
- Notes:
  - With **`heading`**, **`.embed-shell-heading`** (**`margin-bottom: 1.1rem`**) is always **centered** above the widget (**`.booking-embed`** in **`components.css`**), including in the narrow aside column; **`.booking-embed-contact`** stays centered under the widget.
  - **Standard page layout:** Put **`BookingEmbed`** in the **fixed-width right column** of **`page-layout-with-aside`** (**`site/src/styles/components.css`**: **`--page-aside-width`** default **`420px`**, stacks to one column under **`900px`** with the widget **below** the main column). The **left column** (**`page-layout-with-aside__main`**) is **variable width** and holds the rest of the page flow that should sit beside the calendar (for example **`InfoFrame`**, **`AccordionSection`**). Place any **full-width** blocks **above** this grid when the design calls for it (for example hero, testimonials band); **`DejtSv.astro`** does this. In the aside, prefer **`unframed`** so the widget is not double-boxed and **`.page-layout-with-aside__aside .embed-shell`** can keep **`margin-top: 0`** aligned with the main column top.
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
  - `unframed?: boolean` (default **`false`**; no border, background, or padding on the shell, for example beside copy in a two-column layout)

### `VideoEmbed`

- Purpose: video embed surface with consent/unavailable fallback behavior.
- Loaded state: root **`video-embed`** (no padding, margin, border, or background; iframe is **`width: 100%`** of the container). Unavailable state: framed **`embed-shell`** with **`embed-fallback`**.
- Key props:
  - `title: string`
  - `src: string`
  - `fallbackText: string`
  - `unavailable?: boolean`

## Verification Notes

- Historical review route: `/component-showcase/` (retired after Phase 3 sign-off; see `docs/phase-3-verification-record.md`)
- Review mode was one consolidated sign-off pass for all required states
- Quality checklist: `docs/phase-3-component-qa-checklist.md`
