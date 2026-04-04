# Phase 6 Verification Record

Purpose: evidence and stakeholder sign-off for Phase 6 slices per **`docs/phase-6-todo.md`** and **`docs/definition-of-done.md`** Phase 6.

**Where we are:** **P6-00**, **P6-01**, and **P6-02** signed off. **P6-02** (**`en` + Berlin**): **`/en/berlin/`** migrated home (**`BerlinHomeEn.astro`**, source **`site-html/en-berlin-en.html`**), **`hero-en-berlin.ts`** (**`chrome-hdr-en-berlin-*`**), **`footer-en-berlin.ts`** / **`footer-de-berlin.ts`**, **`FooterSocialLinks`**, Brevo waitlist via **`WaitlistFormEmbed`**, LCP preload on Berlin hero, self-hosted After Hours JPEG under **`site/public/wp-content/uploads/2025/04/`**. **`PAGE_CUSTOM_BODY_PATHS` = 55** (includes **`/en/berlin/`**, story topics, **`/en/berlin/privacy/`**; Berlin English story shells reuse Stockholm English bodies where wired). **Resume context:** **2026-03-28** routing slice (**`docs/routing-location-scoped-global-pages-plan.md`**): matrix **61** shells, legacy **`301`**, **`en-brand`** removed.

Status: **open** (**P6-00**–**P6-02** closed; **P6-03**–**P6-06** pending).

## P6-00 · Swedish chrome package (`sv` / Stockholm)

**Scope:** Stable **`chrome-hdr-*`** / **`chrome-ftr-*`** variant ids; **`site/src/lib/routes/chrome-navigation-resolve.ts`** (**`resolveChromeNavigationHref`**, coupling per **`docs/phase-4-routing-reopen.md`**); **`layoutVariantsForPath`** in **`page-shell-registry`**; language and destination selectors on non-Swedish header; Swedish shared hero (language flags + Stockholm | Berlin row); **`STOCKHOLM_SV_EN_PAIRS`** export; tests (**`chrome-navigation-resolve.test.ts`**, layout fixtures). Phase 5 **`/sv/...`** page bodies unchanged.

**Technical verification:** **`npm test`** and **`npm run build`** in **`site/`** green at closure.

**Package sign-off (chrome + Swedish bodies):** **Yes** (2026-03-24, Gustaf).

**Follow-up:** Optional **`page-shell-meta`** extractor documentation if the pipeline should mention chrome ids explicitly (not blocking **P6-01**).

## P6-01 · English Stockholm + location-scoped story URLs

**Scope:** Wave 1 matrix shells with **`en` + Stockholm** chrome: **`/en/`** header-selector shell (Stockholm \| Berlin CTAs only; not in **`PAGE_CUSTOM_BODY_PATHS`**), all **`/en/stockholm/...`** marketing and utility bodies, and the **four** former “global” story topics at **`/en/stockholm/about-andetag/`**, **`.../about-the-artists-malin-gustaf-tadaa/`**, **`.../music/`**, **`.../optical-fibre-textile/`** (legacy **`/en/music/`**-style URLs **`301`** to these paths). **Privacy:** **`/en/stockholm/privacy/`** (and three other locale or location shells per matrix). Swedish story and privacy paths are **`/sv/stockholm/...`**. **`/en/berlin/...`** story and privacy shells exist for **hreflang** and Berlin chrome; **Wave 2** (**P6-02**) **closed** **2026-04-04** (see §P6-02; some Berlin bodies reuse Stockholm English components after the **2026-03-28** routing delivery).

**Wiring:** **`site/src/lib/page-registry/page-body-registry.ts`** (**`PAGE_CUSTOM_BODY_PATHS`**, **54** paths: **29** English + **24** Swedish + **1** German privacy; **`/en/`** has no body component) and **`site/src/pages/[...slug].astro`** **`pageBodies`** map (keys must match exactly). **`page-body-registry.test.ts`** asserts set size and string presence in the slug page.

**Representative sources (see component file comments for wp-page / HTML file):**

| Area | Notes |
|------|--------|
| **`/en/`** hub | **`chrome-hdr-en-header-selector`** (**`SiteHeader.astro`**, full-viewport hero, Stockholm \| Berlin only; no main, no footer); **EX-0015** title and description in **`page-shell-meta.json`** |
| **`/en/stockholm/`** | **`StockholmHomeEn.astro`** from **`site-html/en.html`**; **EX-0007** **resolved** in **`docs/migration-exceptions.md`** |
| Privacy (four shells) | **`PrivacyPage.astro`** + **`privacy-policy-inner-html.ts`** (scraped inner HTML); per-location **`hreflang`** in registry |
| English story (location-scoped) | **`OmAndetagEn`**, **`OmKonstnarernaEn`**, **`MusikEn`**, **`OpticalFibreTextileEn`** at **`/en/stockholm/...`** (Berlin English URLs reuse the same components where wired) |
| English Stockholm utility pages | **`BiljetterEn`**, **`FragorSvarEn`**, **`HittaHitEn`**, **`OppettiderEn`**, **`PresentkortEn`**, **`SasongskortEn`**, **`TillganglighetEn`**, **`ArtYogaEn`**, **`ForetagseventEn`**, **`GruppbokningEn`**, **`DejtEn`**, **`VilkenTypAvUpplevelseEn`**, **`BesokaromdomenEn`** (TripAdvisor slider omitted per **EX-0012**) |
| SEO landings | **`StockholmExhibitionEn`**, **`StockholmIndoorActivityEn`**, **`StockholmMuseumEn`**, **`StockholmThingsToDoEn`**, **`NpfStockholmEn`** (shared **`StockholmSeoLandingEn`**) |

**English Stockholm chrome:** **`hero-en-stockholm.ts`**, **`footer-en-stockholm.ts`**, **`navigation.ts`** **`en-main`**, **`STOCKHOLM_SV_EN_PAIRS`**. **`chrome-hdr-en-header-selector`** reuses the English hero chrome model for **`/en/`** with menu strips omitted. **`chrome-hdr-en-stockholm-small`** (and hero) cover English Stockholm **including** story pages; **`en-brand`** and **`chrome-hdr-en-stockholm-brand`** were **removed** (**2026-03-28**). English Berlin non-hub pages use **`chrome-hdr-en-berlin-small`** and **`navigation.ts`** **`en-main-berlin`**.

**Technical verification:** **`npm test`**, **`npm run build`** in **`site/`** green (re-verified after **2026-03-28** routing slice).

**Package sign-off (chrome + hub + bodies):** **Yes** (2026-04-02, Gustaf).

## P6-02 · English Berlin (`en` + Berlin)

**Scope:** **`en` + Berlin** chrome (**`hero-en-berlin.ts`**, **`chrome-hdr-en-berlin-hero`** / **`chrome-hdr-en-berlin-small`**, **`navigation.ts`** **`en-main-berlin`**, **`footer-en-berlin.ts`** with **`FooterSocialLinks`**, **`SiteHeader`** / **`SiteFooter`**); German Berlin footer model (**`footer-de-berlin.ts`**) for **`chrome-ftr-de-berlin`**. **Bodies:** **`/en/berlin/`** (**`BerlinHomeEn.astro`**, waitlist, testimonials, video band, Stockholm teaser); **`/en/berlin/{story-slug}/`** and **`/en/berlin/privacy/`** per **`PAGE_CUSTOM_BODY_PATHS`** (story and privacy reuse Stockholm English components where matrix wiring matches **2026-03-28** routing). **`PAGE_CUSTOM_BODY_PATHS` = 55**.

**Technical verification:** **`npm test`** and **`npm run build`** in **`site/`** green at closure.

**Package sign-off (chrome + bodies):** **Yes** (2026-04-04, Gustaf).

## Next

1. **Maintainer:** Execute **P6-03** (**`de` + Berlin** chrome and **`/de/berlin/...`** bodies), one route at a time (**`npm test`** / **`npm run build`** green between pages); seek Gustaf **Wave 3** package sign-off when complete.
2. **Later:** **P6-04**–**P6-06** (metadata, exceptions, grand-plan/CHANGELOG closure for Phase 6).
