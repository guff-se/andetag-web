# Migration Exceptions Log

Purpose: record approved deviations from source parity in a consistent and reviewable format.

## What Counts as an Exception

Log an exception when any of the following applies:

- URL path changes from source without strict one-to-one parity.
- Content is intentionally removed, merged, or materially rewritten.
- Component behavior differs from source in a way users can notice.
- Integration behavior changes (`keep`, `replace`, `remove`) with conversion or SEO impact.
- Tracking/consent behavior differs from approved requirements.

## Required Fields

Each exception entry must include:

- `exception_id`: stable ID (`EX-0001`, `EX-0002`, ...)
- `date`: ISO format `YYYY-MM-DD`
- `phase`: project phase where exception is introduced
- `scope`: affected area (URL, content, component, integration, tracking)
- `source_reference`: source URL/file(s) in current site artifacts
- `decision`: concise description of what is changed
- `rationale`: why this is necessary
- `seo_impact`: expected SEO effect (`none`, `low`, `medium`, `high`)
- `user_impact`: expected user-facing effect
- `approval`: approver name and status
- `follow_up`: actions required before launch or post-launch

## Log Table Template

| exception_id | date | phase | scope | source_reference | decision | rationale | seo_impact | user_impact | approval | follow_up |
|--------------|------|-------|-------|------------------|----------|-----------|------------|-------------|----------|-----------|
| EX-0001 | YYYY-MM-DD | 2 | URL | `/en/berlin-en/` | redirect alias to `/en/berlin/` | canonical normalization | low | none | pending | add redirect test |

## Active Exceptions Logged in Phase 1

| exception_id | date | phase | scope | source_reference | decision | rationale | seo_impact | user_impact | approval | follow_up |
|--------------|------|-------|-------|------------------|----------|-----------|------------|-------------|----------|-----------|
| EX-0002 | 2026-03-22 | 1 | integration | `site-html/index.html` and `shortcode.default` usage on homepages | Remove TripAdvisor shortcode/plugin runtime in rebuilt stack | Parser plan excludes shortcode parsing and migration targets component-native implementation | low | low, reviews presentation may change | approved (Gustaf) | Deliver static reviews copy via migrated pages or testimonial pattern (Phase 5) |
| EX-0003 | 2026-03-22 | 1 | integration | `site-html/*.html` WonderPush script references | Remove WonderPush from retained integration set | Not included in conversion-priority retained integrations and adds runtime/script overhead | low | none expected for core conversion path | approved (Gustaf) | Keep removal in Phase 7 launch checklist validation |
| EX-0004 | 2026-03-22 | 1 | URL | `/en/berlin-en/` and `site-html/en-berlin-en.html` | Treat `/en/berlin-en/` as alias-only and canonicalize to `/en/berlin/` | Align with URL migration policy and reduce duplicate destination URL intent | medium | none expected if redirects are correct | approved (Gustaf) | Add redirect test cases and align page registry naming in parser outputs |
| EX-0005 | 2026-03-22 | 2 | component | `site-html/en-berlin-en.html` header variant `4136` | Map legacy `header-4136` to unified English hero header `header-918` in static layout system | Legacy alias page should not force a dedicated long-term header component variant | low | low, legacy alias page uses unified header style instead of dedicated one-off header variant | approved (Gustaf) | Phase 2 parity follow-up completed, keep mapping in place through Phase 4 routing validation |
| EX-0006 | 2026-03-22 | 3 | component | `/component-showcase/` (retired 2026-03-23) | Accept Lighthouse Performance below 90 on mobile for the internal showcase while Accessibility meets or exceeds 95 | Showcase intentionally stacks all embeds, scripts, and media on one `noindex` route for single-pass sign-off, which dominates performance metrics versus production pages | none | none for end users, internal QA route only | approved (Gustaf) | Route removed after sign-off; revisit lazy or consent-gated embed patterns in Phase 7 for migrated pages; Phase 5 perf targets in `docs/definition-of-done.md` |
| EX-0007 | 2026-03-23 | 4 | content | `site-html/en-stockholm.html` and live `https://www.andetag.museum/en/stockholm/` (verified 2026-03-23: Yoast still emits Swedish home title, description, and canonical pointing at Swedish home) | Phase 4 shell for `/en/stockholm/` uses `<title>` and `og:description` from `site-html/en.html` via `page-shell-meta.json` | Live and scraped HTML both mis-target SEO for this path; no faithful English hub metadata available without editorial or parser fix | low | none until Phase 5 replaces shell with migrated body and source-backed metadata | approved (Gustaf, Phase 4 closure 2026-03-23) | Replace when WordPress or Phase 5 content supplies correct `/en/stockholm/` head metadata |
| EX-0008 | 2026-03-23 | 5 | content | `site-html/optisk-fibertextil.html` (`malin-vaver*.jpg` under `wp-content/uploads/2026/02/` on live site) | ~~Migrated page omitted photos~~ **Resolved 2026-03-23:** JPEGs downloaded from production into `site/public/wp-content/uploads/2026/02/`; `OptiskFibertextilSv.astro` uses source-order two-column grid (image, prose / prose, image) with responsive stack | Scraped `site-html/` initially lacked binaries; agents fetch missing first-party uploads per `AGENTS.md` | none | none once resolved | resolved (implementation 2026-03-23) | none |
| EX-0009 | 2026-03-23 | 5 | content | `site-html/stockholm-art-yoga.html` (wp-page 2519), Elementor text-editor `259ad72` ("Praktisk information" body) | Migrated `/sv/stockholm/art-yoga/` renders list and closing paragraphs with normal `<ul>`/`<li>`/`<p>` only; removes pasted ChatGPT/Tailwind wrapper markup present in scraped HTML | Inner list item text and closing copy are preserved verbatim from source; outer wrapper is not site-authored content | none | none if copy matches intended WordPress content | approved (Gustaf) | Clean Elementor widget HTML on WordPress when convenient |
| EX-0010 | 2026-03-23 | 5 | content | `site-html/stockholm-dejt.html` text-editor after Understory (`mailto:info@tadaa.se`) | **`BookingEmbed`** default **`.booking-embed-contact`** below widget: **`Kontakta`** … **`info@andetag.museum`** (sv; en/de in **`booking-embed-contact.ts`**) (legacy **Vänligen maila** … **`info@tadaa.se`**) | Align booking-adjacent contact with current ANDETAG domain; shorter CTA wording | none | mailto target and opening phrase change for users who use that link | approved (Gustaf) | none |
| EX-0012 | 2026-03-23 | 5 | integration | `site-html/stockholm-besokaromdomen.html`, SEO landing HTML in `stockholm-*-stockholm.html` (`shortcode.default` TripAdvisor slider after testimonials or main copy) | Omit WP TripAdvisor review slider shortcode; static copy, **`TestimonialCarousel`** on SEO landings, and TripAdvisor outbound link on besökaromdömen page only | Same stack decision as **EX-0002**; no plugin runtime | low | No live TripAdvisor card carousel; users follow external link | approved (Gustaf, extends EX-0002) | Optional native review module in Phase 7 if needed |

## Status Rules

- New entries start as `pending` in `approval`.
- Only approved entries may be treated as accepted implementation behavior.
- Rejected entries must remain in log with rejection note, do not delete history.

## Cross-Reference Rules

- Reference related policy docs when relevant (`docs/url-migration-policy.md`, `docs/content-model.md`).
- Include `exception_id` in URL matrix notes or implementation PR descriptions when applicable.
