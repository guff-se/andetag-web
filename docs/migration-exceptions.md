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
| EX-0005 | 2026-03-22 | 2 | component | `site-html/en-berlin-en.html` header variant `4136` | Map legacy alias id **`header-4136`** to stable Phase 6 chrome id **`chrome-hdr-en-berlin-hero`** in layout code (same non-Swedish hero shell as English Stockholm hero) | Legacy alias page should not force a dedicated long-term header component variant | low | low, legacy alias page uses unified header style instead of dedicated one-off header variant | approved (Gustaf) | **`getResolvedHeaderVariantId`** keeps **`header-4136`** input for tests and any residual references; primary contract is **`chrome-hdr-en-berlin-hero`** |
| EX-0006 | 2026-03-22 | 3 | component | `/component-showcase/` (retired 2026-03-23) | Accept Lighthouse Performance below 90 on mobile for the internal showcase while Accessibility meets or exceeds 95 | Showcase intentionally stacks all embeds, scripts, and media on one `noindex` route for single-pass sign-off, which dominates performance metrics versus production pages | none | none for end users, internal QA route only | approved (Gustaf) | **P7-15 (2026-04-06):** Migrated shells load embeds per page (no consolidated showcase). Marketing iframe classification in **`docs/tracking-and-consent-requirements.md`** §4a; optional lazy iframe deferral remains **`docs/phase-7-todo.md`** **P7-12** follow-up if CMP/legal requires. Production targets stay **`docs/definition-of-done.md`** Phase 5–7. |
| EX-0007 | 2026-03-23 | 4 | content | `site-html/en-stockholm.html` (legacy Yoast drift); `site-html/en.html` wp-page **907**; `page-shell-meta.json` **`/en/stockholm/`** | **`/en/stockholm/`** uses English **`<title>`** and meta description from **`en.html`** in **`page-shell-meta.json`**; main body **`StockholmHomeEn.astro`** migrated from **`site-html/en.html`** wp-page | Legacy scraped **`en-stockholm.html`** mis-targeted locale metadata; canonical English Stockholm marketing home is **`en.html`** | none once resolved | English Stockholm home is locale-consistent in shell and body | resolved (implementation **P6-01**; Gustaf package sign-off **2026-04-02**, **`docs/phase-6-verification-record.md`** §P6-01) | none |
| EX-0008 | 2026-03-23 | 5 | content | `site-html/optisk-fibertextil.html` (`malin-vaver*.jpg` under `wp-content/uploads/2026/02/` on live site) | ~~Migrated page omitted photos~~ **Resolved 2026-03-23:** JPEGs downloaded from production into `site/public/wp-content/uploads/2026/02/`; `OptiskFibertextilSv.astro` uses source-order two-column grid (image, prose / prose, image) with responsive stack | Scraped `site-html/` initially lacked binaries; agents fetch missing first-party uploads per `AGENTS.md` | none | none once resolved | resolved (implementation 2026-03-23) | none |
| EX-0009 | 2026-03-23 | 5 | content | `site-html/stockholm-art-yoga.html` (wp-page 2519), Elementor text-editor `259ad72` ("Praktisk information" body) | Migrated `/sv/stockholm/art-yoga/` renders list and closing paragraphs with normal `<ul>`/`<li>`/`<p>` only; removes pasted ChatGPT/Tailwind wrapper markup present in scraped HTML | Inner list item text and closing copy are preserved verbatim from source; outer wrapper is not site-authored content | none | none if copy matches intended WordPress content | approved (Gustaf) | Clean Elementor widget HTML on WordPress when convenient |
| EX-0010 | 2026-03-23 | 5 | content | `site-html/stockholm-dejt.html` text-editor after Understory (`mailto:info@tadaa.se`) | **`BookingEmbed`** default **`.booking-embed-contact`** below widget: **`Kontakta`** … **`info@andetag.museum`** (sv; en/de in **`booking-embed-contact.ts`**) (legacy **Vänligen maila** … **`info@tadaa.se`**) | Align booking-adjacent contact with current ANDETAG domain; shorter CTA wording | none | mailto target and opening phrase change for users who use that link | approved (Gustaf) | none |
| EX-0012 | 2026-03-23 | 5 | integration | `site-html/stockholm-besokaromdomen.html`, SEO landing HTML in `stockholm-*-stockholm.html` (`shortcode.default` TripAdvisor slider after testimonials or main copy) | Omit WP TripAdvisor review slider shortcode; static copy, **`TestimonialCarousel`** on SEO landings, and TripAdvisor outbound link on besökaromdömen page only | Same stack decision as **EX-0002**; no plugin runtime | low | No live TripAdvisor card carousel; users follow external link | approved (Gustaf, extends EX-0002) | Optional native review module in Phase 7 if needed |
| EX-0014 | 2026-03-24 | 5 | performance | `docs/definition-of-done.md` Phase 5 (Lighthouse Performance mobile **>= 85**); e.g. **`/sv/stockholm/`** | Phase 5 closure: **simulated** mobile Lighthouse may stay **below 85** while **provided** throttling scores **~100** and LCP sub-second; **render-delay** under simulated stress documented in **`docs/phase-5-verification-record.md`** | Lab variance; hero preloads and re-encoded video already shipped | low | none if production CWV acceptable | approved (Gustaf, Phase 5 closure 2026-03-24) | Re-run PSI after deploy; Phase 7 consent and embed gating |
| EX-0015 | 2026-03-24 | 6 | content | `site-html/en.html` Yoast title and description (Stockholm-only marketing home) | **`/en/`** uses destination-neutral **`<title>`** and **meta description** aligned with **`docs/Andetag SEO Manual.md`** §1 and §1.1 (**breathing museum**, definite article where applicable); on-page copy is the **header-selector** hero only (no **`<main>`** body); **`page-shell-meta.json`** **`/en/`** row remains the SEO source of truth | Legacy **`en.html`** is full Stockholm home, not a two-city chooser; Phase 6 hub UX requires coherent copy | low | English **`/en/`** SERP snippet and social preview change vs legacy Yoast | approved (Gustaf) | Re-run **`npm run page-shell:meta`** only if extractor overwrites **`/en/`** without an override; keep hub row stable |
| EX-0016 | 2026-04-04 | 6 | SEO | **`/en/berlin/{story-slug}/`** (four topics); **`docs/routing-location-scoped-global-pages-plan.md`**; **`site/src/lib/routes/page-shell-registry.ts`** **`BERLIN_EN_STORY_SEO_CANONICAL`** | **`<link rel="canonical">`**, **`og:url`**, and crawlers use the **Stockholm English** URL for the same topic (for example **`/en/berlin/music/`** → **`/en/stockholm/music/`**); the **Berlin English** URL remains the address users see; **hreflang** on that shell still pairs **English** (self, Berlin path) with **German** (Berlin path) only; **no** Swedish alternate | One consolidated English index target per story topic; avoids duplicate English story URLs; aligns with location-scoped matrix | medium | None when redirects and internal links follow policy | approved (documents **`docs/url-migration-policy.md`** and registry behavior) | Phase 7 sitemap and sharing QA should treat Stockholm English as the indexed English story URL |
| EX-0017 | 2026-04-06 | 7 | SEO | Legacy Yoast JSON-LD vs rebuilt JSON-LD in **`site/src/lib/chrome/schema-org.ts`** | Entity-first graph: Stockholm shells emit **`Museum`**, **`TouristAttraction`** with **`aggregateRating`** and featured **`Review`** nodes (TripAdvisor figures: **`stockholm-reviews.ts`** only), **6 `Offer`** nodes (source: **`stockholm-offers.ts`**), and **`Event`** for Art Yoga with **`Schedule`** (weekly Tuesday 17:00, `repeatFrequency: P1W`). Berlin pre-opening: **`Place`** only. Legacy **`ArtGallery`**, **`LocalBusiness`** types dropped. | Align with **`docs/Andetag SEO Manual.md`** §6 and §11; `aggregateRating` per §6; `offers` from centralized price data (stable for 1+ year); `Event` uses `eventSchedule` for recurring Art Yoga | low | Star ratings, price range, and event rich results eligible in SERP for Stockholm pages; legacy `ArtGallery`/`LocalBusiness` types no longer emitted | approved (Gustaf, 2026-04-12) | **Post-cutover (P8-26):** monitor Rich Results in GSC for 2-4 weeks. **Phase 9 (P9-14):** skill for maintaining review data in **`stockholm-reviews.ts`** and prices in **`stockholm-offers.ts`**. |
| EX-0018 | 2026-04-06 | 7 | tracking | Shared **`GTM-KXJGBL5W`**: legacy **`www`** WordPress + Complianz vs static staging + **CookieConsent** | Finish **GTM** trigger migration off **`cmplz_*`** mainly at **`www`** cutover (**Phase 8**); **brief analytics or marketing gaps** on migration day are acceptable if GTM publish timing straddles CMP or host switch | Same container on both stacks until cutover; dual triggers optional for continuity (**`docs/kpi-measurement-map.md`** § Staged rollout, § GTM migration checklist) | low | Possible short discontinuity in measured traffic or conversions around cutover | approved (Gustaf) | **`docs/phase-8-todo.md`** **P8-13**, **P8-22**; verify **Understory `dataLayer`** after static **`www`** |
| EX-0019 | 2026-04-10 | 8 | content | **`site-html/stockholm-utstallning-stockholm.html`** (Yoast **`<title>`** and Elementor H1): **konstutställing**; live WP footer had already moved **Utställing** → **Utställning** | **`/sv/stockholm/utstallning-stockholm/`**: **`<title>`** in **`page-shell-meta.json`** and on-page H1 use correct Swedish **konstutställning** (double **n**) | Typo in legacy scrape; align visible Swedish spelling with corrected live footer and dictionary form | low | SERP title and H1 show corrected spelling vs legacy HTML mirror | approved (Gustaf) | **`node site/scripts/extract-page-shell-meta.mjs`** would reintroduce the typo until **`site-html`** is replaced by a crawl where WP fixes the title; keep **`page-shell-meta.json`** row or re-apply after extract |

## Status Rules

- New entries start as `pending` in `approval`.
- Only approved entries may be treated as accepted implementation behavior.
- Rejected entries must remain in log with rejection note, do not delete history.

## Cross-Reference Rules

- Reference related policy docs when relevant (`docs/url-migration-policy.md`, `docs/content-model.md`).
- Include `exception_id` in URL matrix notes or implementation PR descriptions when applicable.
