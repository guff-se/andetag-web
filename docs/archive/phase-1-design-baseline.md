# Phase 1 Design Baseline

Purpose: capture reproducible token and component evidence from source CSS and HTML before unified component implementation.

## Reused Inputs

- `docs/design-extraction-method.md`
- `docs/existing-site-structure.md`
- `docs/parser-plan.md`
- `site-html/wp-content/uploads/elementor/css/post-*.css`
- `site-html/*.html`

## Extraction Scope Summary

- Elementor CSS files scanned: 65 (`post-*.css` files present in local scrape).
- Elementor CSS files referenced across HTML snapshots: 66.
- High-frequency shared CSS sources:
  - `post-173.css` (base/global)
  - `post-203.css` (single-page wrapper)
  - `post-207.css`, `post-3100.css`, `post-4229.css` (footer variants)
  - `post-192.css`, `post-918.css`, `post-4344.css`, `post-2223.css`, `post-3305.css`, `post-4287.css` (header variants)

## Token Candidate Baseline (frequency snapshot)

Observed high-frequency candidate values in Elementor CSS:

### Colors

- `#D0A4CC` (primary lavender accent)
- `#4A0D2F` (dark plum)
- `#F7DCEA` and alpha variants (`#F7DCEAE8`, `#F7DCEA00`) for background layers
- `#FAFAFA` (light text/surface)
- `rgba(0,0,0,0.5)` and `rgba(84,89,95,0.73)` overlays/shadows

### Typography

- Primary sans: `"Jost", Sans-serif`
- Serif body/accent: `"Baskervville", Sans-serif`
- Global typography variables are used extensively (`--e-global-typography-*` family/size/weight entries).

### Radius and shadows

- `border-radius: 25px 25px 25px 25px` (info cards/boxes and key CTA sections)
- `border-radius: 5px 5px 5px 5px` (buttons)
- `box-shadow: 18px 18px 10px 0px rgba(0,0,0,0.5)` (deep elevated cards)
- `box-shadow: 5px 5px 10px 0px rgba(0,0,0,0.5)` (button elevation)

## Component Pattern Evidence

Patterns with strong reuse and direct migration relevance:

1. Hero header with desktop/mobile video variants and overlaid CTA.
2. Small sticky navigation header variant for non-hero pages.
3. Accent CTA buttons with uppercase Jost text and drop-shadow.
4. Pricing/info card surfaces with rounded corners and soft shadow.
5. Accordion FAQ sections (`nested-accordion.default`).
6. Conversion embeds:
   - Understory booking widget blocks
   - Brevo waitlist form block
7. Map and video embeds requiring consent-aware loading behavior.

Patterns marked low-priority or removal candidates:

- TripAdvisor shortcode slider (`shortcode.default`) due plugin coupling.
- One-off decorative variants not reused across at least two contexts.

## Keep vs Exclude Decisions (Phase 1 recommendation)

Keep for unified system:

- Header variants (hero/small/brand) and footer variants by language.
- Primary color/typography/button/card systems.
- Accordion, booking, map, and media embed patterns.

Exclude or deprecate:

- Plugin-specific visual wrappers tied to WP shortcodes.
- One-off style fragments that do not serve conversion, readability, or consistency.

## Gaps Linked to Exceptions

- Consent platform selection is resolved to CookieYes, implementation-specific banner/preference UI styling is carried into Phase 7 integration QA.
- English Berlin alias page (`/en/berlin-en/`) uses a distinct header variant requiring routing/IA reconciliation.
- Non-sitemap legacy snapshot files exist and should not be treated as canonical design sources without explicit decision.

## Reproducibility Notes

- Baseline values were derived from deterministic local artifacts in `site-html/`.
- Any manual override to token naming or pattern merging should be logged in `docs/migration-exceptions.md`.
