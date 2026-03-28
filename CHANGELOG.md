# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`docs/routing-location-scoped-global-pages-plan.md`:** Step-by-step plan for location-prefixed story routes, redirects, SEO canonical split, chrome or nav changes, internal links, tests, and doc updates. **`AGENTS.md`** documentation table entry. **Why:** approved execution checklist before implementing dual English paths and retiring the English global menu.

- **`docs/routing-location-scoped-global-pages-plan.md` (update):** **Locked decisions** table (location in all paths except entry home, **`hreflang`** same-location only, **`x-default`** by city, **`en-brand`** removal, single-wave rollout). **Redirect scope:** **`301`** only for URLs that existed on the **original** site sitemap; no redirects for never-published paths (e.g. migration-only German slugs). **Why:** freeze spec and avoid fictitious redirect rows.

- **`docs/routing-location-scoped-global-pages-plan.md` (update):** Slug rule (old slugs + location only); exceptions **`/`** and **`/en/`**; **privacy** as **four** location pages with Berlin copy rewrite; **single-hop** **`301`** only (no chains); **`hreflang`** vs Berlin English **canonical** ship now and **revisit** after GSC. **Why:** close clarifications before implementation.

- **`spider.py` versioned crawls:** Default run archives each crawl under **`crawl-versions/<UTC-id>/`** (`html/`, `md/`), diffs against the previous snapshot, writes **`MIGRATION_CHANGELOG.md`** (summary tables plus truncated unified diffs for text files), updates **`crawl-versions/manifest.json`**, then copies the new snapshot to **`site-html/`** and **`site-md/`**. **`--legacy`** keeps the old wipe-and-crawl-only behavior. **`--base-url`**, **`--versions-dir`**, **`--html-dir`**, **`--md-dir`** are available. Unit tests in **`tests/test_spider_versioning.py`**. **Why:** track live-site changes and feed a concrete checklist for updating the Astro migration.

### Changed

- **Art Yoga (`/en/stockholm/art-yoga/`):** **`ArtYogaEn.astro`** matches **`ArtYogaSv.astro`**: mid-page **`HeroSection`** with the same photo and an **outline** booking CTA, practical block as a **`<ul>`** (no inline **`ButtonGroup`**). **Why:** en/sv design parity.

- **Om Andetag (Swedish `/sv/stockholm/om-andetag/`):** Section titles in the long copy use **`h2`** like English, not **`h3`**. **`OmAndetagSv.astro`**. **Why:** shared heading scale with **`OmAndetagEn.astro`**.

- **English artists page (`/en/stockholm/about-the-artists-malin-gustaf-tadaa/`, Berlin EN reuse):** **`OmKonstnarernaEn.astro`** now uses the same layout as **`OmKonstnarernaSv.astro`** (lead two-column grid with hero image and tadaa.se link, portrait duo grid, team block). Copy is aligned with **`site-html/en-about-the-artists-malin-gustaf-tadaa.html`** (including fixing the stray Swedish **"och"** in the music credit line). **Why:** match Swedish design and production English parity.

- **`GallerySection` mobile carousel (`<=1024px`):** horizontal **`padding`** and **`gap`** removed so slides are **full viewport width** (only **`safe-area-inset`** kept); **`scroll-snap-align: start`**. The **`max-width: 900px`** rule no longer reapplies **`10px`** padding to **`.mobile-carousel`**. **`components.css`**.

- **Stockholm home intro lead image** (`andrum-looking.jpg`): **`page-stockholm-home__intro-figure`** is centered with **`max-width: min(52rem, 88%)`** and extra **`margin-block`** so the photo sits smaller with more air on **`/sv/stockholm/`** and **`/en/stockholm/`**. **`components.css`**.

### Fixed

- **`GallerySection` mobile carousel:** autoplay and prev/next used **`scrollIntoView()`** on each slide, which also scrolled the **page vertically** to the gallery on every advance. **`gallery-section-carousel.ts`** now uses **`section.scrollTo({ left })`** on the horizontal strip only.

- **Partner logos 1 / 5 / 8 (Ateljé Lyktan, Stoddard, Uniqorna):** WordPress **`index.html`** serves these SVGs with explicit **`width`/`height`** on **`<img>`**; our **`<img>`** had no dimensions and three SVG roots had **viewBox only** (or paths with no fill in **`download.svg`**), so some browsers reported **zero intrinsic size** and the logos vanished. Added **`width`/`height`** on the root **`<svg>`** for **`SVGOMG-Image-1.svg`**, **`download.svg`** (plus root **`fill="#000000"`**), and **`uniqorna-black.svg`**. **`components.css`**: **`.partners-link`** is a flex container; partner **`<img>`** uses **`width/height: auto`** with **`max-height`**. **Why:** match working Toniton/Object Carpet SVG markup and stable **`<img>`** sizing.

- **Stockholm home / SEO lavender CTA band** (before **Where is ANDETAG** / **Var är ANDETAG**): **`max-width: 640px`** uses lighter horizontal **`padding`** on **`page-stockholm-home__cta-secondary-band`** and drops lateral **`margin`** on the nested **`page-migrated-cta`** (was **`3rem`** on all sides with band padding, squeezing **Book tickets now!** / **Boka biljetter nu!** into a line break). **`components.css`**.

- **`TestimonialCarousel` mobile height:** **`components.css`** no longer forces a shorter **`min-height`** on small viewports than desktop (was **`320px`** / **`280px`**, clipping longer quotes). **`max-width: 900px`** and **`640px`** now use **`clamp(..., vh, ...)`** so Swedish and English Stockholm home and SEO landings share the same usable band height.

- **`/en/stockholm/`:** Page **h1** is full width above the intro and booking columns (was inside the main column next to the embed). **`StockholmHomeEn.astro`**, **`components.css`**.

### Changed

- **`GallerySection`** **`mobileMode="carousel"`:** From **`1025px`** width the gallery stays a **four-column grid**; at **`1024px`** and below it becomes a **horizontal slider** (scroll-snap, swipe, prev/next, autoplay with pause on hover or touch, **`prefers-reduced-motion`** disables autoplay and smooth scrolling), matching **`site-html/index.html`** (desktop-only Elementor grid + **`elementor-hidden-desktop`** image carousel). New **`gallery-section-carousel.ts`**, **`components.css`**, **`carouselAriaLabel`** and **`galleryNavLocale`** on **`GallerySection`**. Swedish call sites pass **`Bildgalleri`** / **`sv`**; English call sites pass **`Image gallery`** / **`en`** explicitly (**`StockholmHomeEn`**, **`StockholmSeoLandingEn`**, **`VilkenTypAvUpplevelseEn`**, mirroring **`Sv`**). **`docs/phase-3-component-usage.md`** updated (lightbox is jQuery-based, not glightbox). **Why:** implement the existing **`mobile-carousel`** contract and keep **sv/en** wiring parallel.

- **Stockholm home (Swedish `/sv/stockholm/`, English `/en/stockholm/`):** Intro band uses **`andrum-looking.jpg`** before the FAQ accordion (replacing the former image below the accordion). Art Yoga block is a two-column row: copy left, **`andrum-meditation.jpg`** right, matching intro photo styling (`12px` radius, fluid width). Assets in **`site/public/wp-content/uploads/2026/03/`**. **`StockholmHomeSv.astro`**, **`StockholmHomeEn.astro`**, **`components.css`**. **Why:** front-page design refresh with supplied photography.

- **Docs · Phase 6 and route coverage:** **`docs/phase-6-todo.md`**, **`docs/phase-6-verification-record.md`**, **`docs/grand-plan.md`** (Phase 5 note + Phase 6 status), **`docs/definition-of-done.md`**, **`docs/content-model.md`** (chrome ids), **`docs/phase-4-route-coverage.md`**, **`docs/phase-4-redirect-tests.md`** (required cases + pending live re-run note), and **`docs/url-migration-policy.md`** (Swedish + privacy sections) aligned with the **2026-03-28** location-scoped routing delivery (**54** **`PAGE_CUSTOM_BODY_PATHS`**, **61** matrix shells, four privacy URLs). **Why:** resume Phase 6 from a single consistent doc baseline.

- **Location-scoped story URLs and privacy:** Swedish, English, and German story pages and four privacy shells use **`/sv/stockholm/...`**, **`/en/stockholm/...`**, **`/de/berlin/...`**, and **`/en/berlin/...`** (Berlin English story duplicates canonical to Stockholm English in HTML). **`en-brand`** / **`chrome-hdr-en-stockholm-brand`** removed; **`chrome-hdr-en-berlin-small`** for Berlin English except hub. **`site/public/_redirects`**: single-hop **`301`** from legacy global English, flat **`/de/...`**, legacy **`/sv/...`** story paths, unprefixed Swedish, **`/privacy/`**, and related aliases. **`docs/url-matrix.csv`** regenerated: **61** **`keep`** rows aligned with **`PAGE_SHELL_PATHS`**, plus **`redirect`** rows for published legacy URLs. **`docs/url-migration-policy.md`**, **`docs/phase-4-routing-reopen.md`**, **`docs/routing-location-scoped-global-pages-plan.md`** (status **implemented**). **Why:** execute locked routing plan, fix matrix or shell parity tests, and keep policy docs consistent with static routes.

- **Docs · Phase 6 process clarity:** **`docs/phase-6-todo.md`** adds **Current position and what is next** (status table and immediate actions). **`docs/phase-6-verification-record.md`**, **`docs/grand-plan.md`**, **`docs/definition-of-done.md`**, **`AGENTS.md`** (`phase-6-todo` row) point to it. **Why:** single entry point for where the migration is and what happens after **P6-01** sign-off.

- **English `/en/` entry:** Replaced the minimal hub body (**`EnglishHubEn.astro`**, removed) with **`chrome-hdr-en-header-selector`**: same full-viewport video hero as English Stockholm, **Stockholm** and **Berlin** CTAs in place of **Find Tickets**, desktop and mobile menu strips removed, no **`<main>`** and no footer (**`SiteLayout.astro`** **`headerSelectorOnly`**). Registry (**`page-shell-registry.ts`**), **`layout.css`**, **`content-model.md`**, **`docs/phase-6-verification-record.md`**. **`PAGE_CUSTOM_BODY_PATHS`** is **46** entries. **Why:** hub is location choice only, hero-parity shell.

- **Site structure refactor (complete, 2026-03-24):** **`site/src/`** folders renamed per **`docs/decisions/0003-site-src-structure.md`**: **`components/chrome`**, **`lib/chrome`**, **`components/page-bodies`**, **`lib/page-registry`**, **`lib/ui-logic`**, **`client-scripts/`** (under **`site/src/`**). Imports, Vitest, and **`npm run build`** updated; **`docs/`**, **`AGENTS.md`** Code Layout tree, **`docs/site-structure-refactor-plan.md`** (status **complete**), **`docs/phase-structure-todo.md`** (S0–S8 checked). **Why:** disambiguate layout, pages, and components; align docs with the Astro workspace.

- **Changelog historical paths:** Entries dated **before 2026-03-24** may still name pre-refactor **`site/src/`** paths verbatim; do not rewrite old bullets. Current paths are summarized in the bullet above and in **`AGENTS.md`**.

- **Phase 6 · P6-01 · English Wave 1 bodies wired:** All in-scope **`/en/stockholm/...`** and English global routes (except **`/en/berlin/`**, **P6-02**) render migrated **`*En.astro`** bodies via **`PAGE_CUSTOM_BODY_PATHS`** (**46** entries with **`/sv/...`**; **`/en/`** is header-only) and **`[...slug].astro`**. Includes **`StockholmHomeEn`** (**EX-0007** resolved in **`docs/migration-exceptions.md`**), **`OmAndetagEn`**, **`OmKonstnarernaEn`**, **`BesokaromdomenEn`** (static Tripadvisor excerpts; slider still omitted per **EX-0012**), and the remaining English page components from **`site-html/`** English sources. **`page-body-registry.test.ts`** updated. **`docs/phase-6-todo.md`**, **`docs/phase-6-verification-record.md`**, **`docs/grand-plan.md`**. **`npm test`** and **`npm run build`** verified. **Why:** Wave 1 ready for Gustaf package inspection before sign-off.

- **`navigation.ts`** **`en-main`:** Visit parent **`/en/stockholm/`**; matrix-backed paths (**`/en/stockholm/giftcard/`**, **`date/`**, **`group-bookings/`**, **`what-kind-of-experience/`**); Groups submenu lists group bookings and corporate events. Matches **`docs/url-matrix.csv`** and **`STOCKHOLM_SV_EN_PAIRS`**. **Why:** hero, footer, and desktop nav must not point at non-canonical English slugs.

- **`/en/`** minimal hub copy and shell metadata (**EX-0015**): destination-neutral **h1** and lead (**`EnglishHubEn.astro`**) from **`docs/Andetag SEO Manual.md`** §1 + §1.1 (**breathing museum**); hub positioning uses the definite article (**the breathing museum** / **The Breathing Museum** in **`<title>`** and h1); **`page-shell-meta.json`** **`/en/`** title and description aligned so the Stockholm | Berlin CTAs are not contradicted by Stockholm-only legacy Yoast text. **`docs/migration-exceptions.md`**, **`docs/phase-6-verification-record.md`**.

- **Phase 6 · P6-00 signed off (2026-03-24, Gustaf):** Swedish **`sv` / Stockholm** chrome package approved with existing Phase 5 **`/sv/...`** bodies. **`docs/phase-6-todo.md`** **P6-00** marked complete; **`docs/phase-6-verification-record.md`** opened with **P6-00** entry; **`docs/grand-plan.md`** Phase 6 status updated. **Next:** **P6-01** (English Stockholm + English global).

### Added

- **`docs/site-structure-refactor-plan.md`:** Side-phase plan for disambiguating **`layout`** / **`pages`** / **`components`** in `site/src/` (inventory, Astro-aligned target tree, phased renames, documentation checklist). **`AGENTS.md`** documentation table and root **Code Layout** tree updated. **Why:** reduce maintainer confusion before large Phase 6 or 7 churn.

- **English Stockholm NPF + SEO landings (sv/en pairs):** New canonical paths **`/en/stockholm/npf-visitors/`**, **`indoor-activity-stockholm/`**, **`things-to-do-stockholm/`**, **`museum-stockholm/`**, **`exhibition-stockholm/`** with translated titles and meta in **`page-shell-meta.json`**, **`docs/url-matrix.csv`**, **`STOCKHOLM_SV_EN_PAIRS`**, and full bodies (**`NpfStockholmEn.astro`**, **`StockholmSeoLandingEn.astro`** + thin page wrappers). English footer matches Swedish layout: **The Experience** includes **NPF visitors**; SEO row **Activity / Museum / Things to do / Exhibition** (peers of Aktivitet, Museum, Att göra, Utställning). **`hero-en-stockholm`** and **`navigation.ts`** **`en-main`** use the same **NPF visitors** label. **Why:** Swedish-only hreflang removed for these topics; language switcher resolves peers via the shared pair list.

- **Phase 6 · P6-01 · English Stockholm chrome:** Shared video hero and small header (**`chrome-hdr-en-stockholm-hero`**, **`chrome-hdr-en-stockholm-small`**) wired through **`hero-en-stockholm.ts`** and **`SiteHeader.astro`** (English labels, **`logoHomeHref`** **`/en/`** vs **`/en/stockholm/`**, CTA from **`variants.ts`**). Full **`chrome-ftr-en-stockholm`** footer via **`footer-en-stockholm.ts`** (no Swedish-only SEO link row; NPF omitted until an English matrix URL exists). Tests: **`hero-en-stockholm.test.ts`**, **`footer-en-stockholm.test.ts`**. **`hero-sv.ts`** adds **`logoHomeHref`** for a single logo `href` shape. **Why:** ship **`en` + Stockholm** shell parity before **`/en/stockholm/`** body depth.

- **Phase 6 · P6-01 · `/en/` minimal hub:** **`EnglishHubEn.astro`** (destination CTAs to **`/en/stockholm/`** and **`/en/berlin/`**). Visible **h1** + lead match **`site-html/en.html`** Yoast **title** / **meta description** and **`page-shell-meta.json`** **`/en/`**. **`page-body-registry`** (**24** migrated paths), **`[...slug].astro`**, **`components.css`** hub spacing, **`layout.css`** **`.visually-hidden`**. **Why:** policy-aligned English entry **200** with city choice, not full Stockholm marketing parity on the hub.

- **Phase 6 · P6-00 (chrome implementation):** Stable chrome **`headerVariantId`** / **`footerVariantId`** strings (**`chrome-hdr-*`**, **`chrome-ftr-*`**) in **`site/src/lib/layout/types.ts`** and **`variants.ts`**; **`page-shell-registry`** **`layoutVariantsForPath`** and exported **`STOCKHOLM_SV_EN_PAIRS`** for topic data. Shared **`resolveChromeNavigationHref`** (**`site/src/lib/routes/chrome-navigation-resolve.ts`**) implements **`docs/phase-4-routing-reopen.md`** site chrome coupling; **`navigation.ts`** language and destination selectors always offer **`sv`**, **`en`**, **`de`** and both cities with resolver-backed **`href`**s; Swedish hero (**`hero-sv.ts`**) uses the same resolver for flags and adds a **Stockholm | Berlin** row in **`SiteHeader.astro`**. Tests: **`chrome-navigation-resolve.test.ts`**, updated layout fixtures. Legacy **`header-4136`** still resolves via **`getResolvedHeaderVariantId`** to **`chrome-hdr-en-berlin-hero`** (**EX-0005**). **Why:** single URL-resolution path and Phase 6 chrome naming per **`docs/phase-6-todo.md`**.

- **Cloudflare edge / browser caching (`site/public/_headers`):** Strong **`Cache-Control`** for **`/_astro/*`** (immutable, 1y), **`/fonts/*`**, **`/assets/*`**, and **`/wp-content/uploads/*`** (SWR, no `immutable` on uploads). **`X-Robots-Tag: noindex`** on **`https://:version.:subdomain.workers.dev/*`** per Cloudflare docs. Copied to **`dist/`** with Astro build; applies to **Workers static assets** (`wrangler.jsonc`). **Why:** replaces Workers default **`max-age=0, must-revalidate`** on all assets so repeat visits and CDN behavior improve without stale HTML (HTML paths unmatched).

- **Stockholm full hero video (optimized delivery):** **`stockholm-hero-desktop.mp4`** (~1080p, H.264, ~3.5 Mbps cap, faststart) and **`stockholm-hero-mobile.mp4`** (~960×540, ~1.6 Mbps cap) under **`site/public/wp-content/uploads/2024/12/`**, re-encoded from the legacy **`Desktop.mp4`** master. **`HERO_SV_ASSETS.video`** / **`videoMobile`** in **`assets.ts`**; **`SiteHeader.astro`** uses **`<source media="(max-width: 900px)">`** then desktop fallback. **`site/scripts/encode-stockholm-hero-videos.sh`** reproduces encodes from any source file (requires **ffmpeg**). **Why:** ~86% less bytes on typical phones (~1.6 MB vs ~12 MB), ~55% smaller desktop file, same loop and poster.

- **Tripadvisor brand assets in testimonial aggregate:** **`site/public/assets/tripadvisor/tripadvisor-5dots.png`** and **`tripadvisor-logo.svg`** (from repo root sources), shown in **`TestimonialCarousel`** when **`aggregate`** is set and **`showTripAdvisorBrand`** is not false. **Why:** summary row matches Tripadvisor visual language while keeping figures in text.

- **Preview · mock testimonial carousel:** **`/preview/testimonial-mock-quotes/`** (`noindex`) uses three fictional quotes from **`testimonial-mockup-items.ts`**; slide rotation is the **`TestimonialCarousel.astro`** client script (**`js-testimonial-carousel`**). **Why:** layout QA without sourcing copy as real reviews.

- **`TestimonialCarousel` / Stockholm home + SEO landings:** Root **`testimonial-block`** with **`testimonial-block__bg`** and full-band **`testimonial-block__overlay`** over photo, quotes, and optional **`aggregate`**. **`stockholm-testimonial-aggregate.ts`** (Tripadvisor stats per besökaromdömen source). Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**.

- **`docs/testimonials-reimplementation-options.md`:** Research-backed options (carousel evolution, trust strip, hub-first) for reimplementing testimonials and 4.9-style social proof; aligns with tone, accessibility, and **EX-0002**/**EX-0012**. **`AGENTS.md`** documentation table updated. **Why:** stakeholder review before implementation.

- **Phase 5 (second batch, complete implementation queue):** Remaining alphabetical **`/sv/`** shells from **`docs/phase-5-todo.md`**: **`OmAndetagSv`**, **`OmKonstnarernaSv`**, **`StockholmAktivitetInomhusSv`**, **`StockholmAttGoraSv`**, **`StockholmMuseumSv`**, **`StockholmUtstallningSv`** (shared **`StockholmSeoLandingSv`** + **`stockholm-marketing-faq-sv.ts`**), **`BesokaromdomenSv`**, **`HittaHitSv`**, **`NpfStockholmSv`**, **`OppettiderSv`**, **`PresentkortSv`**, **`SasongskortSv`**, **`TillganglighetSv`**, **`VilkenTypAvUpplevelseSv`**. **`page-body-registry`** now **23** paths; **`[...slug].astro`** uses shared **`ShellPageBody`** typing; page-specific layout in **`components.css`**. **`docs/migration-exceptions.md`**: **EX-0012** (TripAdvisor slider on besökaromdömen + SEO landings, extends **EX-0002**). **`docs/phase-5-todo.md`** and **`docs/phase-5-verification-record.md`** updated. **`npm test`** and **`npm run build`** verified. **Why:** close the agreed second-batch migration queue before batch design sign-off.

- **Phase 5 (second batch):** **`/sv/musik/`** body from **`site-html/musik.html`** (`wp-page` 2162) via **`MusikSv.astro`**: **`h1`** + prose (**`.brand-wordmark`**), streaming links (Spotify, Apple Music, Soundcloud, Bandcamp), Povel Olsson credit; Spotify album **`iframe`** in **`embed-shell`** (legacy embed URL). **`page-body-registry`**, **`[...slug].astro`**, **`page-body-registry.test.ts`**, **`components.css`**. **`docs/phase-5-verification-record.md`**, **`docs/phase-5-todo.md`**. Pending batch design approval.

- **Phase 5:** **`/sv/stockholm/`** (Swedish Stockholm home) body from **`site-html/index.html`** (`wp-page` 2) via **`StockholmHomeSv.astro`**: intro, FAQ accordion (all closed on load), gallery, biljett/säsong/privat bands, booking hero, Art Yoga, English **`TestimonialCarousel`** (TripAdvisor shortcode omitted per **EX-0002**), Vimeo embed, partners, kontakt/press blocks, map (**`#hitta`**). **`AccordionSection`:** optional **`initialOpenIndex`** (use **`null`** for home). Asset: **`Andetag-18-058-copy2-1024x683.jpg`** in **`site/public/wp-content/uploads/2024/11/`**. **`page-body-registry`**, **`[...slug].astro`**, **`page-body-registry.test.ts`**, **`components.css`**, **`docs/phase-3-component-usage.md`**. Design-approved **`docs/phase-5-verification-record.md`** (2026-03-23, Gustaf); Swedish Stockholm first-wave items **1–8** closed. **`docs/phase-5-todo.md`** Immediate Next 3 Actions updated.

### Removed

- **`site/public/wp-content/uploads/2024/12/Desktop.mp4`:** replaced by **`stockholm-hero-desktop.mp4`** and **`stockholm-hero-mobile.mp4`**. Restore from git history or production if a higher-bitrate master is needed for re-encoding.

- **`site/src/pages/preview/testimonials-mockups-sv.astro`** and **`site/src/styles/testimonial-mockups-preview.css`:** testimonial mockup preview route and styles (superseded by production **`testimonial-block`**).

### Changed

- **Phase 6 todo · page cadence:** **`docs/phase-6-todo.md`** requires **one page at a time** per wave with **`npm test`** / **`npm run build`**, fixups, and tests before the next route. **Why:** stable increments.

- **Phase 6 todo · localization source split:** **`docs/phase-6-todo.md`** records **text** from **`site-html/`** (per locale) and **design** from the rebuilt **`/sv/...`** **site/** implementation (shared components and CSS), not legacy non-Swedish layout. **Why:** Swedish Phase 5 is ahead visually; other locales follow it.

- **Phase 6 todo · chrome inventory:** **`docs/phase-6-todo.md`** adds **8 headers** (hero + small × four contexts: **`sv`/Stockholm, `en`/Stockholm, `en`/Berlin, `de`/Berlin) and **4 footers**; **legacy WordPress header id** retirement (**`header-918`**, **`header-192`**, etc.) in favor of **stable** ids; **package-level** Gustaf design approval after each full localization slice (chrome + bodies), not chrome-only gates. **Why:** coherent shell contract and review rhythm.

- **Phase 6 / routing docs:** **`docs/phase-6-todo.md`** documents **always-visible** language (**`sv`**, **`en`**, **`de`**) and destination (**Stockholm**, **Berlin**) chrome, coupling rules (e.g. **`sv`** on Berlin → Stockholm; **`de`** on Stockholm → Berlin; Stockholm while **`de`** → **`en`** + Stockholm; Berlin while **`sv`** → **`en`** + Berlin), and a **single** URL resolver for implementation. **`docs/phase-4-routing-reopen.md`**: new **Decided: site chrome switcher** section (normative mirror). **Why:** align IA notes with stakeholder UX before **`P6-00`** build.

- **Phase 5 closure (2026-03-24):** Swedish **`/sv/`** migration milestone **complete** (**23** bodies). **`docs/grand-plan.md`** Phase 5 **complete**; **`docs/phase-5-todo.md`** **complete** with **`P5-05`–`P5-07`** carry-forward; **`docs/phase-5-verification-record.md`** **closed** (P5-01 evidence, stakeholder sign-off, **EX-0014**). New **`docs/phase-6-todo.md`**. **`docs/definition-of-done.md`** Phase 5 **EX-0014** note. **`docs/migration-exceptions.md`** **EX-0014**. **`AGENTS.md`** table. **`npm test`** / **`npm run build`** on **`site/`**.

- **Phase 5 / Phase 6 planning (2026-03-24):** English **page bodies** (**`/en/`**, **`/en/stockholm/`**, **`EX-0007`**) and **`P5-02`** English hub implementation are **deferred to Phase 6** together with **localized header and footer** content. Removed **`EnglishHomeEn.astro`**, **`stockholm-marketing-faq-en.ts`**, and **`stockholmTestimonialAggregateEn`**; **`/en/`** is shell placeholder again (**23** migrated paths). Updated **`docs/grand-plan.md`** entry schedule, **`docs/phase-5-todo.md`**, **`docs/phase-5-verification-record.md`**, **`docs/migration-exceptions.md`** (**EX-0007** follow-up). **Retained:** **`SiteLayout`** locale skip links and **`[...slug].astro`** LCP preloads for **`header-918`** / **`header-4344`**. **`npm test`** and **`npm run build`** verified.

- **Hero LCP / Swedish Stockholm home (`header-192`):** **`SiteLayout`** accepts optional **`lcpImagePreloadHref`** (hero poster JPEG) and **`lcpFontPreloadHref`** (Jost 500 Latin WOFF2). **`[...slug].astro`** sets both for **`header-192`** (`/sv/stockholm/`). **`SiteHeader`:** full hero **autoplay video** on **all** breakpoints with **`preload="none"`** and **`poster`** (no mobile-only still swap; video is required for brand look). **`docs/phase-5-verification-record.md`:** Lighthouse / LCP notes (simulated vs provided throttling). **Why:** earlier poster fetch and CTA font when fonts exist under **`site/public/fonts/`**, without dropping mobile video.

- **Swedish site copy (spelling, grammar, consistency):** Skip link **innehåll**; footer **Utställning**; FAQ **cykelställen**, **ANDETAG** in accordion `title`, period after **fri entré**; home/SEO **tills du**, **säljs i kassan**, **mejl**, **Innehållssamarbeten** / **innehållsskapare**, **Kontakt** heading, en dash in intro; **Hitta hit** hiss sentence and street paragraph period; **Säsongskort** **säljs i kassan**; **Dejt** **Lättillgängligt**. **Why:** reader-facing correctness.

- **`components.css`:** **`page-stockholm-home__cta-after-testimonials`** top margin **`1rem` → `4rem`** (Upplev Andetag! below testimonials). **`docs/phase-3-component-usage.md`** updated.

- **`stockholm-testimonial-aggregate.ts` / `TestimonialCarousel`:** Stockholm aggregate **`meta`** is **`165 recensioner`** only (no second **4,9 av 5** or **Tripadvisor** after the score row and brand assets). Link text **`Läs alla recensioner`** with **`linkAriaLabel`** **`Läs alla recensioner på Tripadvisor`**. **Why:** avoid repeating score and platform on screen.

- **`TestimonialCarousel`:** Replaced jQuery with a small vanilla **`setupTestimonialCarousel`** (native **`transitionend`** on **`transform`**, timeout fallback, **`dataset`** for init/transition guard). **Why:** reliable autoplay and arrow controls across browsers. **`docs/phase-3-component-usage.md`** updated.

- **`components.css` · testimonial band:** Tighter gap from quote carousel to aggregate (**`testimonial-block__aggregate-inner`** padding-top **`0.65rem`**), more space below Tripadvisor link (padding-bottom **`2.35rem`**); **`testimonial-block__carousel`** **`isolation: isolate`**; nav **`z-index: 5`**. **Why:** spacing feedback and clearer hit targets.

- **`TestimonialCarousel` / `components.css`:** Single **`testimonial-block__overlay`** (full-band light veil) replaces separate carousel overlay and aggregate gradient scrim.

- **`TestimonialCarousel`:** Removed pause (**Pausa**) control and **`pauseControl`** props; **`components.css`** drops **`.testimonial-pause`**. Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**.

- **`AccordionSection` / `components.css` / FAQ data:** Optional **`titleHtml`** for questions with **`.brand-wordmark`**; scoped **`.brand-wordmark`** rules under **`.accordion-item-toggle`** and **`.accordion-item-body`**; **`strong`** in accordion answers uses **Jost** **`700`**. **`stockholm-marketing-faq-sv.ts`**, **`FragorSvarSv.astro`**, **`DejtSv.astro`**; **`StockholmHomeSharedBody.astro`** imports **`stockholmMarketingFaqSv`** instead of duplicating the array. **`docs/phase-3-component-usage.md`**.

- **`HittaHitSv.astro` / `components.css`:** **Hitta till ANDETAG** uses a **grid** (**`title | map`** / **`body | map`**) so the **h1** aligns with the **top** of the map; **square** map (**`aspect-ratio: 1 / 1`**); **`page-hitta-hit-sv__map-frame`**; footer address **centered**; **`strong`** in directions uses **Jost** **`700`** (Baskerville has no bold master). Matches **`stockholm-hitta-hit.html`** structure.

- **`components.css`:** **Om konstnärerna** circular portraits (**`.page-om-konstnarerna-sv__figure--portrait`**) use **double** **`clamp`** size (**`15rem` / `52vw` / `22rem`**).

- **`components.css`:** **Om konstnärerna** artist bios (**`.page-om-konstnarerna-sv__duo-grid`**) stay a **single column** of rows at all breakpoints so each artist is portrait left and text right (removed desktop **`1fr 1fr`** that placed Malin and Gustaf side by side).

- **`docs/phase-5-todo.md`:** First wave marked **complete**; **second batch** lists all **15** remaining **`/sv/`** shells from **`page-shell-meta.json`** in **strict alphabetical** path order with **`site-html/`** sources; **batch approval** exception after the queue is built; **`P5-03`** and **Immediate Next 3 Actions** updated. **`AGENTS.md`** documentation table note for **`phase-5-todo`**.

- **`layout.css` / `components.css`:** Unified vertical gap from the **shared Swedish hero nav** to the **first main column block** using **`--page-shell-main-top-gap`** on **`.main-content`** (**`padding-top`**), **`margin-top: 0`** on the first nested block under **`<main>`**, and **`margin-bottom: 0`** on **`.shared-hero-header.is-small`** (was stacking with main and section margins). **`docs/phase-3-component-usage.md`**.

- **`MapEmbed`:** Optional **`unframed`** (same shell treatment as **`BookingEmbed`**). **`StockholmHomeSv`:** **Var är ANDETAG?** uses **`content-section`** **`h2`** typography; prose + **`unframed`** map in a two-column grid from **`768px`**; directions use **`Från tunnelbanan:`** / **`Från gatan:`** in **`strong`**. **`components.css`**, **`docs/phase-3-component-usage.md`**, **`docs/phase-3-component-inventory.md`**.

- **`BookingEmbed`:** Shell always includes **`booking-embed`**; heading above the Understory widget is **always centered** (removed **`headingAlign`**). **`components.css`**, **`docs/phase-3-component-usage.md`**, **`docs/phase-3-component-inventory.md`**. **`StockholmHomeSv`:** lead line full width above the intro/booking grid; intro copy left-aligned; **Hitta hit** on its own row (**`.page-stockholm-home__hitta-row`**).

- **`StockholmHomeSv`:** **Hitta hit** (**`StyledLink`**) uses **`cta-primary`** instead of **`cta-outline`** (hero and intro/booking band).

- **`components.css`:** Stockholm home booking **`HeroSection`**: **`.component-hero.is-cover h2.page-stockholm-home__book-hero-heading`** overrides generic cover **`h2`** **`font-size`** and **`text-wrap: balance`** (**`nowrap`** + readable **`clamp(1rem, 2.35vw, 1.42rem)`** under the default hero cap); slot **`max-width`** **`min(60rem, 100%)`**; **`.page-stockholm-home__book-hero-heading-full`** **`white-space: nowrap`**.

### Fixed

- **`components.css` / `OmKonstnarernaSv.astro`:** Reusable **`.two-col-align-top`** (**`align-items: start`** + **`margin-top: 0`** on direct **`.content-section`** children) so two-column rows align column tops; **Om konstnärerna** lead grid uses it so the **h1** lines up with the hero image (was offset by default **`.content-section`** vertical margin).

- **`components.css`:** **Boka biljetter nu!** band (**`.page-stockholm-home__cta-secondary-band`**) zeros nested **`.page-migrated-cta`** and **`.button-group`** margins so top and bottom spacing match the band **`padding`** (was heavier below due to **`page-migrated-cta`** **`margin-bottom: 2rem`**).

- **`StockholmHomeSv` / `components.css`:** **Från tunnelbanan:** / **Från gatan:** in the **Var är ANDETAG?** map copy use **Jost** **`font-weight: 700`** (`.page-stockholm-home__map-copy strong`) because **Baskervville** is only shipped at 400, so generic **`strong`** was effectively unbold.

- **`StyledLink` / `components.css`:** **`cta-primary`**, **`cta-secondary`**, **`cta-outline`** use **`width: fit-content`** and **`max-width: 100%`** so CTA anchors are not stretched full width by page layout or **`display: block`** overrides. **Hitta hit** row uses flex centering only (**`.page-stockholm-home__hitta-row`**). **`docs/phase-3-component-usage.md`**.

- **`VideoEmbed` / `components.css`:** Loaded state uses root **`video-embed`** (no **`embed-shell`** margin or padding; no **`embed-shell-no-frame`** viewport breakout). Iframe fills container width under **`.video-embed`**. **`.page-stockholm-home__video-band`** **`padding: 0`**. **`docs/phase-3-component-usage.md`**.

- **`AccordionSection` / `components.css`:** Closed panels no longer show a sliver of body text: **`padding-bottom`** on **`.accordion-item-expand-inner`** only when **`.accordion-item.is-open`** (padding was inflating **`0fr`** grid min height). **`min-height: 0`** on **`.accordion-item-expand`**. Doc note in **`phase-3-component-usage.md`**.
- **`AccordionSection` / `components.css` / `accordion-section-exclusive.ts`:** Replaced native **`<details>`** with **`button.accordion-item-toggle`** + **`.is-open`** on **`.accordion-item`** so **`.accordion-item-expand`** height transitions run on every open and close (native **`<details>`** caused a one-time expand then snap-close and snap-reopen in Chromium/WebKit). Exclusive one-open behavior unchanged (click handler). Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**, **`phase-3-verification-record.md`**.

### Changed

- **`layout.css`:** **`shared-footer-privacy`** (Integritetspolicy) shares the same typography as **`shared-footer-seo-links`** (Aktivitet / Museum row): **0.6em**, uppercase, **0.3em** letter-spacing, **Jost**.
- **`layout.css`:** Swedish footer menu columns (**`shared-footer-col`**) match **`site-html/wp-content/uploads/elementor/css/post-207.css`** footer text-editor widgets: **`font-weight: 400`**, **`line-height: 1.3em`**, lists inherit that rhythm, **`padding-inline-start: 2.5em`**, **`list-style-position: outside`**, plain inline links (no **`inline-block`** row height). **`p`** still **`font-size: inherit`** so global body **`p`** does not force 16px. **`footer-root p`** unchanged.
- **`SiteHeader` / Swedish hero:** Header logo matches **`site-html/index.html`**: inline SVG wordmark and drop shadow (class **`andetag-logo`**) instead of **`andetag-logo-white-shadow.png`**. New **`AndetagHeaderLogo.astro`**; **`HERO_SV_ASSETS.logo`** removed from **`assets.ts`** (poster and video unchanged).
- **`AccordionSection`:** **`accordion-section-exclusive.ts`** keeps **one** open row per **`accordion-section`** (clicks on **`.accordion-item-toggle`**; sibling **`.is-open`** removed); FAQ twin columns stay independent.
- **`AccordionSection` / `components.css`:** expand/collapse uses **`.accordion-item-expand`** (**`display: grid`**, **`grid-template-rows`** **`0fr`→`1fr`**); **`.accordion-item-expand-inner`** horizontal padding when closed, **`padding-bottom`** only when **`.accordion-item.is-open`**. **`prefers-reduced-motion`** skips the transition.
- **`AccordionSection` / `components.css`:** **`.accordion-item-toggle`** uses **`+`** / **−** (Unicode minus) on the **left** (**`::before`**). **`accordion-section`** background removed (**`transparent`**), **border** retained.
- **`layout.css`:** **`.shared-hero-lang-top`** (language links under hero socials) uses **Jost**; links inherit **`text-transform: uppercase`**.
- **Phase 5:** **`/sv/stockholm/fragor-svar/`** (FAQ): body from **`site-html/stockholm-fragor-svar.html`** via **`FragorSvarSv.astro`** (twin **`AccordionSection`**, **`bodyHtml`**, **`.page-faq-accordions`**); **`page-body-registry`**, **`[...slug].astro`**, **`page-body-registry.test.ts`**, **`components.css`**. Design-approved **`docs/phase-5-verification-record.md`** (2026-03-23, Gustaf). Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**.
- **Phase 5:** **`/sv/stockholm/dejt/`** marked design-approved in **`docs/phase-5-verification-record.md`** (2026-03-23, Gustaf).
- **`BookingEmbed`:** default **`.booking-embed-contact`** below the widget mount (not site footer); copy from **`booking-embed-contact.ts`** (**`showContact`** default **`true`**). Removed **`footerHtml`**. **`BiljetterSv`** and **`DejtSv`** use the default; **`info@andetag.museum`** (**EX-0010**). Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**, **`migration-exceptions.md`**, **`phase-5-verification-record.md`**.
- **`HeroSection`:** optional default **slot** (**`.component-hero-slot`**) for overlay body (for example Dejt testimonials); **`ctas`** optional. Cover heroes load **`hero-cover-parallax.ts`** via co-located **`<script>`**; init guarded by **`window.__andetagHeroCoverParallax`**. **`SiteLayout`:** removed global parallax import. Self-hosted **`TADAA-LONG-V1.00_07_29_05.Still009-2-2.jpg`** for Dejt testimonial band. **`components.css`:** cover slot blockquote styles; removed **`.dejt-testimonials`**. Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**, **`phase-5-verification-record.md`**.
- **`BookingEmbed` / docs:** standard layout documented in **`docs/phase-3-component-usage.md`** and **`phase-3-component-inventory.md`** (fixed-width **`page-layout-with-aside__aside`**, variable main); comment on **`BookingEmbed.astro`**. **`components.css`:** first child in **`page-layout-with-aside__main`** may be **`info-frame`** or **`accordion-section`** (**`margin-top: 0`** alignment with aside).
- **Dejt (`DejtSv.astro`):** below testimonials, **`page-layout-with-aside`**: main (Praktisk **`InfoFrame`**, accordion) + aside **`BookingEmbed`** (**`unframed`**, **`Tillgängliga tider`**, embed default contact).
- **Dejt (`DejtSv.astro`):** **Praktisk information** block uses **`InfoFrame`** (same pattern as Biljetter priser).
- **Dejt (`DejtSv.astro`):** intro uses **`page-layout-with-aside`** so the first photo sits in the **right** column on wide viewports; **`components.css`:** **`.page-dejt-intro__figure`** image sizing and radius.
- **Phase 5:** **`/sv/stockholm/biljetter/`** marked design-approved in **`docs/phase-5-verification-record.md`** (2026-03-23, Gustaf).
- **Phase 5:** **`/sv/stockholm/dejt/`** body migrated from **`site-html/stockholm-dejt.html`** via **`DejtSv.astro`** (`ContentSection`, visitor quotes in **`HeroSection`**, **`AccordionSection`**, **`BookingEmbed`**). **`page-body-registry`**, **`[...slug].astro`**, **`page-body-registry.test.ts`**. Images under **`site/public/wp-content/uploads/2026/01/`**. **`components.css`:** **`.page-migrated .content-section-body img`**.
- **`page-layout-with-aside`:** first **`.content-section`** in **`__main`** has **`margin-top: 0`** so **Biljetter** / **Tillgängliga tider** align at the column tops (aside embed already had **`margin-top: 0`**).
- **`.button-group`:** **`justify-content: center`** so CTAs stay centered (including säsongskort on biljetter); removed **`page-layout-with-aside`** override that left-aligned **`page-migrated-cta`**.
- **`BookingEmbed`:** **`unframed`** drops border, background, and padding (**`.embed-shell--unframed`**). **`BiljetterSv.astro`** uses it for the ticket widget.
- **`InfoFrame`:** inner **`padding`** **`1.5rem`** (was **`1rem`**).
- **`InfoFrame`:** vertical margin **`2.25rem`** top and bottom (was **`1.5rem`** with shared section stack).
- **`InfoFrame` / biljetter:** **`.info-frame-body`** uses **Jost**; **`strong`** uses self-hosted **Jost 700**; priser **`bodyHtml`** bolds each label before the colon (dagtid line uses **`Dagtidspris:`** for the same pattern).
- **`InfoFrame`** (replaces **`InfoCardGrid`**): single lavender callout with **`bodyHtml`** and optional **`heading`** / **`cta`**; not a multi-card grid. **`BiljetterSv.astro`** priser use one frame with full price copy. CSS: **`.info-frame`**, **`.info-frame-body`**; removed grid/card-only rules. Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**, **`phase-3-todo.md`**.
- **`BookingEmbed`:** **`.embed-shell-heading`** **`margin-bottom`** **`1.1rem`** (was **`0.75rem`**) for clearer gap above the widget.
- **`BookingEmbed`:** optional **`heading`**, **`headingLevel`**, **`headingAlign`**; title renders inside the embed shell. **`BiljetterSv.astro`:** two-column **`page-layout-with-aside`** (**`420px`** aside, stacks under **`900px`**). **`components.css`:** layout helpers, **`.embed-shell-heading`**. Docs: **`phase-3-component-usage.md`**, **`phase-3-component-inventory.md`**.
- **Phase 5:** **`/sv/stockholm/biljetter/`** body migrated from **`site-html/stockholm-biljetter.html`** via **`BiljetterSv.astro`** (`ContentSection`, **`ButtonGroup`** to **`/sv/stockholm/sasongskort/`**, **`BookingEmbed`** with legacy Understory company id). **`page-body-registry`**, **`[...slug].astro`**, **`phase-5-verification-record.md`** (Art Yoga marked approved), **`phase-3-component-usage.md`**.
- **`HeroSection` (`.component-hero`):** vertical spacing **`2.25rem`** top and bottom in **`site/src/styles/components.css`** (was **`1.5rem`** with other sections). **Why:** slightly more breathing room around cover and solid heroes without changing **`ContentSection`** rhythm.
- **Phase 5:** **`/sv/stockholm/art-yoga/`** uses mid-page **`HeroSection`** (same self-hosted Art Yoga JPEG as before) with **`outline`** "Boka Yoga" CTA above "Praktisk information"; removed bespoke **`.art-yoga-bottom-hero`**. **`HeroSection`:** optional **`heading`**, optional **`ariaLabel`** when title lives elsewhere. Docs: **`phase-3-component-usage.md`**, **`content-model.md`**. Prior: **EX-0009**, list spacing, **`optisk-fibertextil`** approval.
- **Phase 5:** **`/sv/optisk-fibertextil/`** body migrated from **`site-html/optisk-fibertextil.html`** via **`OptiskFibertextilSv.astro`**; weaving JPEGs self-hosted under **`site/public/wp-content/uploads/2026/02/`** with responsive two-pair grid in **`components.css`** (**EX-0008** resolved). **`AGENTS.md`** documents fetching missing first-party uploads from production into **`site/public/`**. **`foretagsevent`** marked design-approved in **`docs/phase-5-verification-record.md`**. Prior: **`foretagsevent`** migration and **`gruppbokning`** approval (2026-03-23).

- **Global paragraphs:** `p` uses **`font-size: 16px`**, **`line-height: 24px`**, **`font-weight: 400`** in **`site/src/styles/layout.css`**. More specific rules (footer, accordion body, testimonial slide, info cards) still override where needed.
- **Primary CTA (version 1):** `.link-cta-primary` background uses **`var(--component-accent)`** (`#d0a4cc`, `rgb(208, 164, 204)`) instead of page pink **`#f7dcea`**; **`docs/Visual Identity.md`** table updated. **Why:** stronger contrast with the page background while staying on-brand.

### Fixed

- **Cover hero parallax:** `.component-hero.is-cover .component-hero-media` uses extra vertical height and negative **`top`** (**`--hero-parallax-max-shift`**, aligned with **`MAX_SHIFT_PX`** in **`hero-cover-parallax.ts`**) so **`translateY`** no longer reveals the aubergine band background. **Why:** **`inset: 0`** plus **`scale(1.1)`** did not add enough bleed for ±96px shift.

### Added

- **Cover hero parallax:** **`site/src/scripts/hero-cover-parallax.ts`** uses native **`addEventListener`** for **`scroll`**/**`resize`** (and **`visualViewport`** when present) so updates fire reliably; **jQuery** still handles selection and **`.css("transform", …)`**. Stronger offset and **`scale(1.1)`**. **`prefers-reduced-motion: reduce`** still clears transforms. **`components.css`:** **`transform-origin`**, **`will-change`** on cover media.

- **Phase 5 (started):** migrated Swedish body for **`/sv/stockholm/gruppbokning/`** from **`site-html/stockholm-gruppbokning.html`** via **`site/src/components/pages/GruppbokningSv.astro`**, wired in **`site/src/pages/[...slug].astro`** with **`site/src/lib/pages/page-body-registry.ts`** and alignment test **`page-body-registry.test.ts`**. Centered CTA row in **`site/src/styles/components.css`**. **`docs/phase-5-verification-record.md`** created; **`docs/phase-5-todo.md`** status **in progress**; **`P5-00`** checked. **Why:** begin agreed first-wave order with source-backed copy and shared Phase 3 components (`ContentSection`, `ButtonGroup`).

### Removed

- Swedish small-header **preview route** (`site/src/pages/preview/header-small-sv.astro`, URLs **`/preview/header-small-sv/`** and legacy **`/header-small-sv/`** redirect): Phase 4 parity is complete; the **`header-2223`** shell remains on real pages (for example **`/privacy/`**) via **`lib/layout/header-small-sv.ts`** and **`SiteHeader.astro`**. **`AGENTS.md`** now requires **phase closure cleanup** of temporary preview or auditing-only routes. **Why:** avoid shipping QA-only URLs after a phase is closed.
- **`site/public/images/brand/og-default.png`** (and matching **`site/dist/...`** build artifact): unused asset; no **`og:image`** wiring in **`site/src`** yet. Reintroduce under **`site/public/`** when Phase 7 implements sharing metadata per **`docs/content-model.md`**.
- Phase 2 **`/layout-preview/`** grid page and `site/src/data/layout-examples.ts` (only consumer): Phase 4 matrix shells supersede the multi-variant snapshot page. Dropped preview-only layout CSS (`.variant-grid`, `.variant-card`). **`docs/phase-4-route-coverage.md`** and **`docs/phase-2-todo.md`** note the retirement.
- Phase 3 internal **`/component-showcase/`** route and its demo data (`site/src/pages/component-showcase.astro`, `site/src/data/component-showcase.ts`, tests): consolidated sign-off is complete, so the page is retired. Showcase-only CSS (`body.theme-pink`, `.component-showcase`, `.component-demo`, showcase tokens) removed from `site/src/styles/components.css`. Planning docs now describe the route as historical where relevant; **`docs/phase-3-verification-record.md`** remains the evidence record.

### Changed

- **EN or DE small header:** brand link uses **`model.brandHomeHref`** (**`/en/`**, **`/en/berlin/`**, **`/de/berlin/`**, or **`/sv/stockholm/`** for Swedish small header such as **`/privacy/`**) instead of **`/`**, avoiding an extra hop through the root redirect. **`getBrandHomeHref`** in **`site/src/lib/layout/navigation.ts`**, wired in **`createPageLayoutModel`**. **Why:** keep language or destination home in one click.
- **`docs/phase-4-redirect-tests.md`:** cases **6–10** documented with **`_redirects`** rule table, execution log row, and note that **`andetag-web.guff.workers.dev`** did not return **`301`** on **`HEAD`** for legacy Swedish paths (re-check on Cloudflare Pages after publish).
- **Swedish URLs:** canonical paths use explicit **`/sv/`** (**`/sv/stockholm/...`**, **`/sv/musik/`**, **`/sv/om-andetag/`**, and so on). Legacy unprefixed URLs (**`/`**, **`/stockholm/...`**, old shared paths) **`301`** to those canonicals via **`docs/url-matrix.csv`** (redirect + keep rows) and **`site/public/_redirects`**. **`site/`:** `page-shell-registry.ts`, Swedish nav or footer or hero data, **`index.astro`** → **`/sv/stockholm/`**, **`extract-page-shell-meta.mjs`**, regenerated **`page-shell-meta.json`**. **Docs:** `docs/url-migration-policy.md`, `docs/ia-language-destination-options.md`, `docs/phase-4-route-coverage.md`, `docs/phase-4-redirect-tests.md`, `docs/phase-4-404.md`, `docs/phase-4-routing-reopen.md`, `docs/phase-5-todo.md` (first-wave paths), `docs/url-matrix-schema.md`, `docs/content-model.md`, `docs/phase-4-verification-record.md`, `docs/migration-exceptions.md` (EX-0007 wording), **`docs/Andetag SEO Manual.md`** (section 3 URL architecture, hreflang example, inventory, menu, root behavior). **Why:** align all locales behind a language prefix and consolidate inbound links on **`/sv/...`** per agreed SEO or IA direction.
- `docs/phase-5-todo.md`: **Design approval gate** and **component-first change rule** (unchanged scope aside from **`/sv/`** path literals above).
- `site/src/styles/layout.css`: default `:root` page background is brand pink (`#f7dcea`) with dark body text; fallback `header-root` and `footer-root` contrast adjusted so non-showcase routes no longer ship a near-black body from `--color-bg`.
- `.github/workflows/ci.yml`: removed **markdownlint** job (MD013 line-length and other style rules); docs **link check** (lychee) and **Astro** build or test jobs unchanged.
- Phase 4 marked **complete** with stakeholder sign-off (2026-03-23): `docs/phase-4-todo.md`, `docs/phase-4-verification-record.md`, `docs/grand-plan.md`; **EX-0007** approved as accepted Phase 4 shell deviation until Phase 5 migrates `/en/stockholm/`.
- Phase 7 planning: expanded `docs/grand-plan.md` and `docs/definition-of-done.md` with favicon, Open Graph and sharing tag decisions, and schema.org JSON-LD aligned to the SEO manual.

### Added

- `docs/phase-5-todo.md`: Phase 5 execution checklist (Swedish Stockholm migration waves, `/en/` hub and `/sv/stockholm/` content, entry Worker staging or production enable, verification record); indexed from `AGENTS.md`; linked from `docs/grand-plan.md`.
- `docs/phase-7-todo.md`: Phase 7 execution checklist (favicon, sharing metadata, JSON-LD, scripts, consent, sitemap, sign-off); indexed from `AGENTS.md`.
- `docs/phase-4-routing-reopen.md`: working notes for revisiting Phase 4 routing (Stockholm sv/en, Berlin de/en, page parity, global pages and navigation); linked from `docs/phase-4-todo.md` and `docs/grand-plan.md`. Expanded with proposed `/en/` hub plus preference cookie (edge vs client options) and `sv`/`de` default destinations. **Updated:** normative **`andetag_entry`** cookie, **`/`** `Accept-Language` funnel, **`/en/`** hub rules, and bot handling live in `docs/url-migration-policy.md`; **`necessary`** consent in `docs/tracking-and-consent-requirements.md`.
- `docs/url-migration-policy.md`: clarify **`/`** is not a city chooser; **humans** with **missing or empty `Accept-Language`** default to **`/en/`**; **verified bots** on **`/`** (and **`/en/`** per tests) **`302`** to **`/en/stockholm/`** for a full location page instead of the hub.
- `docs/grand-plan.md`: **Entry routing and URL expansion schedule** (Phase 5 early through Phase 7) for Worker, **`/sv/stockholm/`**, hub, parity, CookieYes cookie listing, and sitemap or SEO manual updates.
- `docs/phase-4-routing-reopen.md`: **Phase 4 implementation delta** table (what stays vs what changes when entry routing ships).
- `docs/phase-4-todo.md`: status **complete and closed**; follow-up routing explicitly **not** a Phase 4 reopen (Phases 5–7 per `docs/grand-plan.md`).
- `AGENTS.md` and `docs/grand-plan.md`: **Routing and entry URLs** reminder to read `docs/phase-4-routing-reopen.md` before Phase 5+ routing or Worker changes.
- `docs/phase-4-404.md` and `docs/phase-4-verification-record.md` for Phase 4 documentation and sign-off tracking.
- `site/src/lib/routes/url-matrix-parity.test.ts`: CI regression that `docs/url-matrix.csv` `keep` paths match `PAGE_SHELL_PATHS`.
- Phase 4 static routing: `site/src/pages/index.astro`, `[...slug].astro`, and `404.astro` with layout shells for all `keep` URLs in `docs/url-matrix.csv`, metadata from `site/src/data/page-shell-meta.json` (generated by `site/scripts/extract-page-shell-meta.mjs` from `site-html/`), and hreflang plus `x-default` via `site/src/lib/routes/page-shell-registry.ts` and updated `site/src/lib/layout/seo.ts` (BCP47 attribute mapping).
- `site/public/_redirects` for `/de/` → `/de/berlin/`, `/en/berlin-en/` → `/en/berlin/`, `/en/stockholm/art-yoga-en/` → `/en/stockholm/art-yoga/`, and `/privacy-policy/` → `/privacy/`.
- `docs/phase-4-route-coverage.md`, `docs/phase-4-redirect-tests.md`, and **EX-0007** in `docs/migration-exceptions.md` for `/en/stockholm/` shell metadata sourcing.
- `site/src/lib/routes/page-shell-registry.test.ts` for registry coverage.
- `site/package.json` script `page-shell:meta` to regenerate `page-shell-meta.json` after `site-html/` updates.

### Changed

- `.github/workflows/ci.yml`: run `npm ci`, `npm test`, and `npm run build` in `site/` (replaces stack placeholder job).
- `docs/content-model.md`: document optional `xDefaultPath` for static layout and Phase 4 hreflang behavior.
- `docs/migration-exceptions.md` **EX-0007**: note live `/en/stockholm/` reproduces wrong Yoast metadata.
- `site/astro.config.mjs`: `trailingSlash: "always"` for canonical path parity with `docs/url-migration-policy.md`.
- `site/src/layouts/SiteLayout.astro`: optional `description` and `xDefaultPath`; `createPageLayoutModel` now passes `xDefaultPath` into hreflang generation.
- `site/src/data/layout-examples.ts` and layout fixtures/tests updated for `xDefaultPath` and BCP47 hreflang attributes.
- `docs/url-matrix.csv`: added explicit `keep` row for `https://www.andetag.museum/en/berlin/`.
- Phase 4 planning: recorded stakeholder decisions (layout plus metadata only, redirect ownership, trailing slash and matrix authority, hreflang and 404 defaults, sitemap deferred to Phase 7) in `docs/phase-4-todo.md`; aligned `docs/grand-plan.md` Phase 4 deliverables and Phase 7 sitemap or robots deliverables.
- Phase 2: recorded final stakeholder sign-off in `docs/phase-2-todo.md`, updated `docs/grand-plan.md` Phase 2 status, marked spillover checklist items as completed via Phase 3 deliverables, and refreshed Phase 2 immediate next actions.
- Documentation: Phase 3 marked closed in planning flow; `docs/grand-plan.md` practical next steps now point at Phase 4 onward; `docs/phase-4-todo.md` lists Phase 3 prerequisites for implementers.
- Partners logo grid: at `640px` viewport width and below, use two columns so pairs of logos wrap into rows (`site/src/styles/components.css`).
- `docs/phase-4-redirect-tests.md`: recorded passing `curl` verification for all matrix redirects on `https://andetag-web.guff.workers.dev/`; `docs/phase-4-todo.md` marks `P4-07` complete.
- `docs/phase-4-redirect-tests.md`: case 5 (`/privacy-policy/` → `/privacy/`) verified on Workers after deploy; `docs/phase-4-verification-record.md` updated.

### Fixed

- Cloudflare deploy: added `site/wrangler.jsonc` with `assets.directory` set to `./dist` so `npx wrangler deploy` from `site/` has a static asset root (fixes “Missing entry-point to Worker script or to assets directory” after a successful `astro build`).
- Component showcase: removed root horizontal padding so full-bleed blocks (hero, gallery, testimonials, frameless video) align to the viewport on narrow screens; gutters apply only to inset demo content (`site/src/styles/components.css`).

### Added

- Added `docs/phase-4-todo.md` with Phase 4 task board, exit criteria, and clarification queue for routing, redirects, canonical or hreflang behavior, and URL coverage reporting before Phase 5 migration.
- Initial changelog setup aligned with repository AI changelog standards.
- Added `docs/url-migration-policy.md` with canonical domain, trailing slash, alias redirects, SEO landing page handling, and sitemap rules.
- Added `docs/decisions/README.md` to standardize ADR naming and one-page decision capture, so major migration choices can be approved and traced.
- Added `docs/url-matrix-schema.md` to define Phase 1 must-keep URL matrix columns and validation rules, so redirect planning can be deterministic.
- Added `docs/content-model.md` contract v1.0.0 for page frontmatter, shared data, and component props, so parser outputs and rendering inputs stay versioned.
- Added `docs/definition-of-done.md` with measurable quality gates for Phases 0 through 6, so phase exits are verifiable.
- Added `docs/tracking-and-consent-requirements.md` defining GTM, Brevo, and category-based consent requirements, so tool selection in later phases is evaluable.
- Added `docs/migration-exceptions.md` log template and approval fields, so migration deviations can be documented consistently.
- Added `docs/design-extraction-method.md` with multi-source CSS extraction method, so token and component analysis is reproducible.
- Added `docs/phase-1-analysis-schema.md` table schema for variants, widgets, and integrations, so existing analysis can be populated without rework.
- Added `.github/workflows/ci.yml` with markdown lint, docs link checks, and stack-check placeholder job, so pull requests have baseline automated quality gates.
- Added `docs/phase-1-todo.md` with a source-backed Phase 1 task board and exit criteria, so analysis work can be tracked to a clear readiness gate before Phase 2.
- Added `docs/url-matrix.csv` populated from `site-html/sitemap.xml` and URL policy aliases, so must-keep route coverage is executable and reviewable.
- Added `docs/ia-language-destination-options.md` with IA option tradeoffs and recommendation, so Phase 1 can close route architecture ambiguity before Phase 2.
- Added `docs/phase-1-design-baseline.md` with reproducible CSS token and component evidence, so design system work starts from source-backed inputs.
- Added `docs/kpi-measurement-map.md` with funnel event taxonomy and GTM requirements, so conversion tracking scope is implementation-ready for later phases.
- Added `docs/decisions/0001-static-stack-selection.md` as the proposed Phase 1 stack and hosting ADR, so exit-gate decisions are captured in decision-log format.
- Added `docs/decisions/0002-consent-platform-selection.md` to document deferred consent platform selection with guardrails, so the open gap has an explicit decision path.
- Added `docs/phase-2-todo.md` with a Phase 2 task board, exit criteria, and clarification queue, so shared layout implementation can start with explicit variant, SEO, accessibility, and approval checkpoints.
- Added `docs/phase-3-todo.md` with a Phase 3 task board, exit criteria, and component showcase approval gates, so component-library work has a deterministic execution checklist before route and page migration.
- Added `docs/phase-3-component-qa-checklist.md` as a reusable Phase 3 verification template, so component and showcase QA runs follow one consistent sign-off workflow.
- Added `docs/phase-3-fixture-strategy.md` plus `site/src/lib/layout/fixtures.ts`, so nav/footer and layout-model regression checks now use deterministic fixture inputs.
- Added `docs/phase-3-component-inventory.md` as a source-backed draft inventory with proposed prop contracts, so component API confirmation can happen before implementation begins.
- Added `docs/phase-3-component-usage.md` as an implementation-facing reference for approved Phase 3 components and embeds, so page migration work can reuse component contracts without reverse engineering.
- Added Phase 3 reusable component implementation under `site/src/components/` and shared styling in `site/src/styles/components.css`, so approved component contracts are now represented by concrete Astro primitives.
- Added `site/src/pages/component-showcase.astro` with source-backed demo data in `site/src/data/component-showcase.ts`, so all required component states can be reviewed in one consolidated sign-off route.
- Added `site/src/lib/components/understory.ts` plus `understory.test.ts`, so Understory widget script/class/data-attribute wiring is validated by regression tests.
- Added `site/` Astro implementation workspace with Phase 2 shared layout foundation (header/footer components, layout model modules, and preview pages), so shared navigation and metadata behavior can be validated before page migration.
- Added Phase 2 layout test coverage in `site/src/lib/layout/*.test.ts`, so variant mapping, selector behavior, and canonical/hreflang hooks are regression-tested.

### Changed

- Added documentation governance and planning docs for migration roadmap and Phase 0 execution.
- Integrated preliminary analysis docs into planning by adding source-backed Phase 1 manifests and new Phase 0 tasks for design extraction and analysis schema.
- Clarified parser planning so design token extraction uses all relevant page and template CSS sources, not a single-file assumption.
- Updated `AGENTS.md` documentation overview to include the new URL migration policy doc.
- Added explicit Phase 0 and Phase 1 notes to reuse prior analysis from `docs/existing-site-structure.md` and `docs/parser-plan.md` before extending new documentation.
- Finalized URL normalization policy to 301-redirect uppercase paths to lowercase and normalize percent-encoded path variants to canonical form.
- Expanded `docs/url-migration-policy.md` with explicit query parameter and non-HTML endpoint policy, so canonical scope and redirect behavior are unambiguous.
- Aligned URL policy and URL matrix terminology by standardizing matrix fields to `status`, `redirect_type`, and `notes`, so policy and schema can be consumed without field-name drift.
- Updated `docs/phase-0-todo.md` by marking P0 deliverables complete and recording created outputs and reused analysis inputs.
- Updated `AGENTS.md` documentation overview and code layout references to include all new Phase 0 docs and CI workflow location.
- Updated `docs/definition-of-done.md` with explicit state-of-the-art thresholds (CWV and Lighthouse targets), so phase exits are measurable instead of subjective.
- Updated `.github/workflows/ci.yml` to run on pushes to `main` only in pre-1.0 workflow, so automation matches current delivery process.
- Updated `docs/tracking-and-consent-requirements.md` to keep legal and consent requirements unified across markets pre-launch, so consent implementation scope stays simple.
- Updated `docs/url-migration-policy.md` to enforce trailing slash normalization only for HTML content routes, so file endpoints are not incorrectly rewritten.
- Marked Phase 0 as complete in `docs/phase-0-todo.md` and `docs/grand-plan.md`, so project phase status is explicit before moving to a new agent context.
- Updated `docs/grand-plan.md` and `AGENTS.md` to reference `docs/phase-1-todo.md`, so the Phase 1 execution checklist is discoverable in both roadmap and agent guidance.
- Updated `docs/phase-1-todo.md` working rhythm to require immediate clarifying questions for ambiguity, so Phase 1 execution can avoid assumption drift.
- Updated `docs/phase-1-analysis-schema.md` from placeholder rows to source-backed variant, widget, integration, and gap tables, so Phase 1 analysis is populated rather than skeletal.
- Updated `docs/migration-exceptions.md` with active Phase 1 exception entries for integration and URL parity decisions, so deviations can be approved explicitly before implementation.
- Updated `docs/migration-exceptions.md` to mark TripAdvisor and WonderPush removals as approved decisions, so Phase 1 integration disposition is explicit.
- Updated `docs/phase-1-todo.md` task statuses and outputs to reflect completed Phase 1 analysis artifacts and open decision dependencies.
- Updated `AGENTS.md` documentation overview to include new Phase 1 IA, KPI, and design baseline documents, so reference guidance remains coherent.
- Updated `docs/decisions/0001-static-stack-selection.md` from `Proposed` to `Accepted` for Astro and Cloudflare Pages, so the Phase 1 platform exit gate is formally closed.
- Updated `docs/phase-1-todo.md` and `docs/grand-plan.md` to mark Phase 1 as complete and approved, so planning state now matches the accepted platform decision.
- Updated `docs/grand-plan.md` practical next steps and platform decision wording to reflect post-Phase 1 state, so upcoming work starts directly at Phase 2 dependencies.
- Updated `docs/phase-1-analysis-schema.md` gap statuses and target phases to carry unresolved items into Phases 2, 4, and 6, so phase ownership is explicit after Phase 1 closure.
- Updated `docs/migration-exceptions.md` and `docs/phase-1-analysis-schema.md` to mark EX-0004 approved and close the corresponding canonical alias gap, so URL exception status matches approved migration policy.
- Updated `docs/decisions/0002-consent-platform-selection.md` with a short weighted decision matrix and recommendation, so consent platform approval can be made in one review pass.
- Updated `docs/decisions/0002-consent-platform-selection.md` decision matrix to include relative cost of ownership scoring and revised weighted totals, so platform tradeoffs include budget impact alongside compliance and implementation factors.
- Updated `docs/decisions/0002-consent-platform-selection.md` to add Google Ads and Consent Mode v2 readiness weighting, so consent platform ranking now reflects ad-dependent operating requirements.
- Updated `docs/decisions/0002-consent-platform-selection.md` with an explicit cost snapshot table and source links, so matrix cost scoring is grounded in concrete plan pricing assumptions.
- Updated `docs/decisions/0002-consent-platform-selection.md` to re-score the custom option under AI-assisted implementation assumptions, so platform comparison reflects reduced engineering overhead while preserving legal and audit risk considerations.
- Updated `docs/decisions/0002-consent-platform-selection.md` with three lower-cost alternatives (CookieYes, Termly, CookieScript) and Ads-focused reliability notes, so options below iubenda baseline are explicitly documented for decision-making.
- Updated the main weighted decision matrix in `docs/decisions/0002-consent-platform-selection.md` to include CookieYes, Termly, and CookieScript directly, so all alternatives are compared in one unified scoring table.
- Updated `docs/decisions/0002-consent-platform-selection.md` from `Proposed` to `Accepted` with CookieYes as the selected consent platform, so consent architecture is now fixed ahead of Phase 6 implementation.
- Updated `docs/grand-plan.md`, `docs/phase-1-analysis-schema.md`, and `docs/phase-1-todo.md` to reflect CookieYes as the resolved replacement for Complianz and to shift next actions from selection to staging validation.
- Updated `AGENTS.md` with a mandatory phase-closure forward audit rule, so each completed phase now triggers a review and synchronization pass across all future phases before final closure.
- Updated `docs/phase-1-todo.md` with a formal Phase 1 forward-audit record and refreshed dependent docs (`docs/phase-1-design-baseline.md`, `docs/ia-language-destination-options.md`, `docs/kpi-measurement-map.md`, `docs/decisions/0002-consent-platform-selection.md`) to remove stale deferred-decision wording.
- Updated `docs/tracking-and-consent-requirements.md`, `docs/kpi-measurement-map.md`, and `docs/grand-plan.md` to classify Understory as `necessary`, so the booking widget remains unblocked by optional consent categories.
- Updated `docs/grand-plan.md` and `AGENTS.md` to reference `docs/phase-2-todo.md`, so the Phase 2 execution checklist is discoverable in both roadmap and agent guidance.
- Updated `docs/phase-2-todo.md` and `docs/grand-plan.md` with resolved Phase 2 kickoff decisions (Astro workspace path, responsive baseline, and separate destination/language selectors), so layout implementation can begin without clarification blockers.
- Updated `docs/phase-2-todo.md` and `docs/grand-plan.md` with an explicit mobile-first browser QA matrix (iOS Safari and Chrome on iOS, plus desktop Chrome, Safari, and Firefox), so Phase 2 layout sign-off criteria are concrete and testable.
- Updated `docs/phase-2-todo.md` and `docs/grand-plan.md` to remove desktop Firefox from the Phase 2 QA browser matrix, so sign-off scope matches the current testing policy.
- Updated `docs/phase-2-todo.md` to use repository root (`./`) as the Astro workspace path instead of `apps/site/`, so project structure stays aligned to a single-site repository.
- Updated `docs/phase-2-todo.md` to use `site/` as the Astro workspace path instead of repository root, so deployable app code stays isolated from docs and source-artifact folders.
- Updated `docs/grand-plan.md`, `docs/definition-of-done.md`, and `docs/phase-1-todo.md` to align Phase 2 references with current decisions (desktop/tablet + mobile parity language, mobile-first browser QA matrix, and `docs/phase-2-todo.md` path), so planning docs stay consistent before implementation starts.
- Updated `docs/phase-2-todo.md`, `docs/phase-1-analysis-schema.md`, `docs/migration-exceptions.md`, and `docs/grand-plan.md` to reflect in-progress Phase 2 implementation, including GAP-002 resolution via EX-0005 and current completion state.
- Updated `.gitignore` with `site/` build and dependency artifacts, so the new Astro workspace does not pollute repository tracking with generated files.
- Renamed the Swedish hero layout module from `swedish-hero` to `hero-sv` and documented locale suffix rules in `AGENTS.md` and `docs/phase-2-todo.md`, so language-specific source files follow one consistent `-sv`/`-en`/`-de` convention.
- Updated migration governance docs (`AGENTS.md`, `docs/grand-plan.md`, `docs/url-migration-policy.md`, `docs/phase-2-todo.md`, `docs/definition-of-done.md`) with a strict self-hosted asset policy, so the rebuilt site never depends on absolute old-site internal JS/CSS/media URLs.
- Localized Swedish hero media references to Astro-hosted root-relative paths and added `site/src/lib/layout/assets.ts` plus `assets.test.ts`, so current header implementation enforces local internal asset usage with regression coverage.
- Added a local font sync pipeline (`site/scripts/sync-fonts.mjs`, `site/src/lib/fonts/sources.json`, `site/src/styles/fonts.css`, `npm run fonts:sync`) and wired hero/menu typography to local `Jost` assets, so menu rendering matches source typography without remote font dependencies.
- Updated `site/README.md`, `docs/design-extraction-method.md`, and `AGENTS.md` with a repeatable font localization workflow, so additional required fonts can be downloaded and regenerated deterministically.
- Fixed the font sync pipeline to preserve both `latin-ext` and `latin` subsets with `unicode-range` declarations per weight/style, so local `Jost` rendering no longer falls back due to incomplete glyph coverage.
- Implemented a dedicated Swedish footer variant imitation (`footer-207`) using source-backed section structure, SEO link row, legal row, and social icon treatment in `SiteFooter.astro` plus `footer-sv.ts`, so the rebuilt footer mirrors the original `index.html` footer layout while keeping internal links local.
- Renamed shared header and footer CSS/DOM selectors from language-prefixed `sv-*` names to design-scoped `shared-*` names, so layout styling is reusable across all languages without implying language-specific design coupling.
- Added an explicit universal-design rule to `AGENTS.md`, `docs/grand-plan.md`, and `docs/phase-2-todo.md`, so language-specific behavior is limited to content and variant selection while core design styles remain shared by default.
- Updated `hero-sv` mobile behavior to imitate source sticky hamburger navigation with a dedicated mobile menu shell and expandable submenu groups, so phone layout now follows the original separate mobile menu pattern instead of desktop-style menu wrapping.
- Added `header-small-sv` implementation path for `header-2223` in `SiteHeader.astro`, using local static background assets and no hero CTA (source template: `stockholm-art-yoga`), plus a dedicated preview route at `/header-small-sv/` for direct visual QA.
- Added a Phase 2 implementation-insights retrospective to `docs/phase-2-todo.md`, `docs/grand-plan.md`, and `AGENTS.md`, so the header/footer parity workflow (shared design naming, mobile-first interaction parity, sticky threshold method, local asset-first tuning, and variant preview routes) is reusable in future phases.
- Updated `docs/grand-plan.md` and `docs/phase-2-todo.md` to defer localized header implementation until the Swedish site header baseline is working and approved, so header rollout order matches the Swedish-first execution strategy.
- Updated `docs/grand-plan.md` and `docs/phase-2-todo.md` to defer all localization work, including header and page-content localization, until Swedish content migration is completed and approved through Phase 5, so sequencing is explicit and consistent across implementation phases.
- Updated planning and quality docs (`docs/grand-plan.md`, `docs/definition-of-done.md`, and downstream phase-reference docs) plus `AGENTS.md` to insert a dedicated Phase 6 localization rollout and move scripts/consent/analytics launch hardening to Phase 7, so Phase 5 remains a clean Swedish-only implementation milestone.
- Updated shared layout accessibility in `site/src/layouts/SiteLayout.astro`, `site/src/components/layout/SiteHeader.astro`, and `site/src/styles/layout.css` with skip-to-main support, visible keyboard focus states, and mobile menu focus management, and marked `P2-05` complete in `docs/phase-2-todo.md`, so Phase 2 accessibility criteria are satisfied at layout level.
- Marked `P2-06` complete in `docs/phase-2-todo.md` after visual approval and non-visual checks, confirming Swedish header/footer link targets against `site-html/index.html` and confirming no absolute old-site media/CSS/JS asset URL dependencies in `site/src/` layout code.
- Completed `P2-07` carry-forward updates by marking Phase 2 complete pending sign-off in `docs/phase-2-todo.md`, updating `docs/grand-plan.md` with Phase 2 outcomes and post-Phase-2 next steps, and closing EX-0005 follow-up language in `docs/migration-exceptions.md`, so Phase 3 can begin without shared-layout documentation blockers.
- Updated `AGENTS.md` and `docs/grand-plan.md` to reference `docs/phase-3-todo.md`, so the Phase 3 execution checklist is discoverable in both roadmap and agent guidance.
- Updated `docs/phase-3-todo.md` status tracking for `P3-01` and `P3-02`, including delivered outputs and fixture wiring evidence.
- Updated `docs/phase-3-component-inventory.md` to approved status with explicit heading hierarchy standards, link appearance contract rules, and a reusable ANDETAG wordmark style baseline, so component implementation preserves semantic structure and brand consistency.
- Updated `docs/phase-3-component-inventory.md` and `docs/phase-3-todo.md` to include a source-backed `PartnersSection` component for the front-page `Våra partners` logo/link block, so partner branding and outbound links are implemented as reusable component behavior instead of page-local markup.
- Updated `docs/phase-3-todo.md` and `docs/phase-3-component-qa-checklist.md` to reflect `P3-03` approval and add heading/link/brand QA checks, so Phase 3 verification includes typography and wordmark consistency gates.
- Updated Phase 3 execution policy in `docs/phase-3-todo.md`, `docs/phase-3-component-qa-checklist.md`, and `docs/phase-3-component-inventory.md` to resolve `CQ-01` and `CQ-02`, set `/component-showcase/` as the review route, and enforce one consolidated showcase sign-off after all required component states are implemented, so approval and QA flow remain simple and deterministic.
- Updated `site/src/layouts/SiteLayout.astro` to support optional robots meta and applied `noindex,nofollow` on `/component-showcase/`, so internal review routes stay out of indexable production surfaces.
- Updated `docs/phase-3-todo.md` to mark `P3-04` through `P3-07` complete with file-level implementation evidence, so Phase 3 now advances to consolidated showcase sign-off.
- Updated `site/src/components/embeds/BookingEmbed.astro` to render the official Understory embed snippet (script + `.understory-booking-widget` container with `data-company-id` and `data-language`), so the booking integration matches source implementation expectations.
- Updated `site/src/components/embeds/WaitlistFormEmbed.astro` to use the provided Brevo embed structure (custom sib styles, hosted Brevo stylesheet, form markup, and hidden locale fields) while preserving fallback mode for showcase QA, so waitlist integration now mirrors the approved embed implementation.
- Updated showcase presentation styles in `site/src/styles/components.css` and enabled full-width showcase layout in `site/src/layouts/SiteLayout.astro` plus `site/src/pages/component-showcase.astro`, so `/component-showcase/` now follows the light pink background, dark text, full-width colored section, unified accordion container, and borderless full-width video behavior requested in review.
- Updated `site/src/data/component-showcase.ts` to use stable local SVG showcase media, and added gallery and partner assets under `site/public/wp-content/uploads/2026/03/`, so gallery and partner visuals render reliably without broken image placeholders in the sign-off page.
- Updated Phase 3 scope and showcase implementation to remove the standalone `SocialLinks` component (`site/src/components/content/SocialLinks.astro` deleted), so social links remain owned by already-implemented header and footer surfaces only.
- Updated `PartnersSection` showcase data and styling to match `site-html/index.html` partner block with the same eight partner links and source logo assets localized under `site/public/wp-content/uploads/2024/11` and `site/public/wp-content/uploads/2024/12`, so partner presentation now follows source parity expectations.
- Updated gallery implementation to source parity by localizing the exact eight `site-html/index.html` gallery photos, rendering them as a full-width 4x2 grid with hover overlay, and adding click lightbox interaction via `glightbox` (`site/src/components/content/GallerySection.astro`, `site/src/data/component-showcase.ts`, `site/src/styles/components.css`), so showcase gallery behavior now matches the requested layout and interaction model.
- Updated gallery edge-spacing and lightbox implementation in `site/src/components/content/GallerySection.astro` and `site/src/styles/components.css` to enforce equal 10px left/right and inter-image spacing, and switched click popup behavior to a jQuery-based lightbox overlay, so gallery interaction now matches requested spacing and implementation preference.
- Updated layout tests (`site/src/lib/layout/layout.test.ts`, `site/src/lib/layout/page-layout.test.ts`, `site/src/lib/layout/footer-sv.test.ts`) to consume shared fixture data, so regression assertions are centralized and easier to maintain.
- Updated `HeroSection` and the showcase hero variant (`site/src/components/content/HeroSection.astro`, `site/src/pages/component-showcase.astro`, `site/src/styles/components.css`) to support image-cover rendering for no-body hero sections using the source `Take a Breath - Book your ticket` background image, and synced the contract docs in `docs/phase-3-component-inventory.md` and `docs/phase-3-component-usage.md`, so this hero state now mirrors source structure for consolidated sign-off review.
- Updated `site/src/components/content/PartnersSection.astro` to remove lazy-loading on partner logo images and use async decoding, so source-localized SVG logos render reliably in the one-row partner strip during showcase review.
- Updated `site/src/components/content/TestimonialCarousel.astro` and `site/src/styles/components.css` to implement full carousel behavior (autoplay, previous/next controls, and jQuery fade transitions) over a source-modeled image background, and updated showcase testimonial fixtures plus component contracts in `site/src/data/component-showcase.ts`, `docs/phase-3-component-inventory.md`, and `docs/phase-3-component-usage.md`, so the testimonial component now matches the expected source carousel pattern instead of static quote cards.
- Added `site/src/lib/components/testimonial-carousel.ts` with `testimonial-carousel.test.ts`, so carousel index wrap behavior is covered by deterministic unit tests.
- Fixed gallery lightbox runtime script in `site/src/components/content/GallerySection.astro` by removing TypeScript-only casts from browser-executed code, so click handlers now intercept image links and open the jQuery lightbox overlay instead of navigating directly to image URLs.
- Updated `site/src/components/content/PartnersSection.astro` to append a version query string for SVG logo sources, so browsers refresh previously cached failed SVG responses and consistently load partner logos 1, 5, and 8.
- Fixed module loading for jQuery-powered gallery and testimonial scripts by removing explicit `type="module"` from Astro component script blocks in `site/src/components/content/GallerySection.astro` and `site/src/components/content/TestimonialCarousel.astro`, so Astro now bundles imports correctly and gallery clicks open the intended lightbox popup instead of navigating to raw image links.
- Updated testimonial carousel hero styling in `site/src/styles/components.css` to full-bleed viewport width with full-frame slides, light text treatment, and arrow positioning tied to content gutters, so each rotating testimonial occupies the full hero area while keeping jQuery-based autoplay and arrow-driven transitions.
- Reverted `site/src/components/content/PartnersSection.astro` to plain `<img>` partner logos (removed build-time inline SVG), so Toniton and other logos render again without Astro fragment or sanitization side effects on SVG markup.
- Extended `site/src/lib/fonts/sources.json` with Baskervville 400 italic, ran `npm run fonts:sync`, and pointed testimonial quote copy at `BaskervvilleLocal` at `font-weight: 400` with real italic files, so quote typography uses self-hosted faces and `font-weight: 300` is not claimed without a matching woff2.
- Updated `.gitignore` to ignore `.cursor/`, so Cursor IDE metadata stays out of the working tree noise.
- Set default `body` typography to `BaskervvilleLocal` in `site/src/styles/layout.css`, scoped preview `header-root` back to Jost, and declared Jost for component headings and accordion titles in `site/src/styles/components.css`, so body and paragraphs match `docs/Visual Identity.md` while nav and heading surfaces stay Jost; documented the split in `docs/phase-3-component-usage.md`.
- Updated `.accordion-item summary` in `site/src/styles/components.css` to **Baskervville** at `font-weight: 400`, so FAQ questions match body typography and are not bold.
- Replaced testimonial carousel jQuery fade with horizontal slide transitions in `site/src/components/content/TestimonialCarousel.astro` and `site/src/styles/components.css` (forward: exit left, enter from right; backward the reverse), with `transitionend` plus timeout cleanup, `prefers-reduced-motion` handling, and docs note in `docs/phase-3-component-usage.md`.
- Reworked `HeroSection` to two exclusive modes (`is-cover` when `backgroundImage` is set, `is-solid` when not), removed the image-strip-plus-aubergine `inline` layout, set light typography on both modes, adjusted secondary CTA on solid aubergine for contrast, fixed `.component-showcase` overrides that forced dark text onto hero content, and updated `component-showcase.astro`, `docs/phase-3-component-inventory.md`, `docs/phase-3-component-usage.md`, and `docs/content-model.md`.
- Documented three CTA usage levels in `docs/Visual Identity.md` (primary any surface, secondary light only, outline on photos), wired notes through `docs/phase-3-component-usage.md`, `docs/phase-3-component-inventory.md`, and comments in `site/src/styles/components.css`.
- Closed Phase 3 (`P3-08`, `P3-09`): added `docs/phase-3-verification-record.md`, marked `docs/phase-3-todo.md` complete, set Phase 3 status in `docs/grand-plan.md` with carry-forward notes, logged **EX-0006** for showcase-only Lighthouse Performance, clarified Phase 3 performance wording in `docs/definition-of-done.md`, and indexed the verification record in `AGENTS.md` and `docs/phase-3-component-qa-checklist.md`.
- Improved accessibility for showcase and layout: underlines on `link-footer` and `content-section-body` links, aubergine ghost styling for outline CTAs on the pink demo button row only, larger tap targets for Swedish hero social and language links and footer list and social icons in `site/src/styles/layout.css` (Lighthouse mobile accessibility 100 on `/component-showcase/` after build).

### Deprecated

- None.

### Removed

- None.

### Fixed

- Updated `site/src/pages/component-showcase.astro` hero demo background from `ANDETAG-I-signature-room.webp` (missing locally and 404 on production) to existing localized media `Andetag-27-037-copy-scaled.jpg`, so `npm run dev` no longer logs 404s for that asset.
- Updated `spider.py` crawl startup to remove existing `site-html/` and `site-md/` directories before creating fresh outputs, so reruns rebuild the mirror from scratch instead of creating duplicate `-1`, `-2` files.

### Security

- None.
