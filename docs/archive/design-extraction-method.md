# Design Extraction Method

Purpose: define a reproducible method for extracting design tokens and reusable component candidates from all relevant source styles, not from a single CSS file.

## Reused Inputs

This method extends known findings in:

- `docs/existing-site-structure.md` (template/page patterns and widget usage)
- `docs/parser-plan.md` (planned design output: `tokens.json` and section pattern notes)

## Source Scope Rules

Design extraction must include all relevant CSS sources:

- `site-html/wp-content/uploads/elementor/css/post-*.css` page-level and template-level files
- Theme and plugin CSS linked by scraped HTML pages where they affect visible styling
- Inline style blocks in scraped HTML where present

Never assume one CSS file is globally authoritative.

## Extraction Workflow

1. Build CSS source manifest:
   - List each CSS source file
   - Record source type (`page`, `template`, `theme`, `plugin`)
   - Record pages/templates where it appears
2. Parse token candidates:
   - CSS variables (`--*`)
   - color values
   - typography definitions (family, size, weight, transform, spacing)
   - spacing and radius values
   - shadows and overlays
3. Parse component pattern candidates:
   - button variants
   - hero and header treatments
   - card/info-box styles
   - accordion/testimonial/gallery/map wrappers
4. Aggregate frequency:
   - count usage by source and page coverage
   - mark outliers with low reuse
5. Propose unified system set:
   - keep high-reuse patterns
   - merge near-duplicates with explicit rationale
   - flag one-off styles as exceptions for migration log

## Keep/Discard Rule for Unified Component System

Keep a discovered style pattern when all are true:

- Appears in at least two distinct source contexts (page/template), or is business-critical for conversion.
- Can be represented through existing or planned component props.
- Does not conflict with agreed visual identity direction.

Discard or deprecate when:

- It is a one-off decorative artifact with no reusable role.
- It introduces technical debt without improving conversion or clarity.
- It duplicates another pattern with minimal visual difference.

## Output Artifacts

Phase 1 extraction must produce:

- `parsed/design/tokens.json` with normalized token set
- `parsed/design/section-patterns.md` with pattern inventory and source evidence
- A short extraction report that includes:
  - source files scanned
  - token counts by category
  - kept vs excluded pattern rationale

## Reproducibility Requirements

- All extraction runs must be deterministic from local `site-html/` artifacts.
- Scripts must document exact input glob patterns and normalization rules.
- Any manual overrides must be logged in `docs/migration-exceptions.md`.

## Font Localization Process

When extracted typography requires webfonts, localize them into the Astro site instead of linking remote font providers at runtime.

1. Identify required font family, weight, style, and language coverage from source CSS.
2. Add source definitions in `site/src/lib/fonts/sources.json`.
3. Run `npm run fonts:sync` from `site/`.
4. Verify generated outputs:
   - `site/public/fonts/<family-id>/*.woff2`
   - `site/src/styles/fonts.css`
5. Reference only generated local families (for example `JostLocal`) in site styles.

Rules:

- Prefer `woff2` output for production delivery.
- Include subset priority for language coverage (`latin-ext` before `latin` when Swedish/German glyphs are required).
- Keep font downloads deterministic by storing source config in version control and regenerating from script.
