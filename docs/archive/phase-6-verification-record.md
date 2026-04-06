# Phase 6 Verification Record

Purpose: evidence and stakeholder sign-off for Phase 6 slices per **`docs/phase-6-todo.md`** and **`docs/definition-of-done.md`** Phase 6.

**Where we are:** **P6-00**–**P6-06** closed (**2026-04-04**). **P6-03** (**Wave 3**, German Berlin): **`/de/berlin/`** home (**`BerlinHomeDe.astro`**), **`hero-de-berlin.ts`**, subpages on **`chrome-hdr-de-berlin-small`**, **`WaitlistFormEmbed`** **`de`**, **`stockholmTestimonialAggregateDe`**, **`/de/berlin/privacy/`**, and **four** German story bodies (**`UeberAndetagDe`**, **`MusikVonAndetagDe`**, **`OptischeFasertextilDe`**, **`DieKuenstlerDe`**). **`PAGE_CUSTOM_BODY_PATHS` = 60**. Legacy flat **`/de/...`** story URLs **`301`** in **`public/_redirects`**. **P6-04**–**P6-06:** see §P6-04–§P6-06 below.

**P6-02** recap: **`/en/berlin/`** (**`BerlinHomeEn.astro`**), **`hero-en-berlin.ts`**, **`footer-en-berlin.ts`** / **`footer-de-berlin.ts`**, **`FooterSocialLinks`**, Brevo waitlist, LCP preload on Berlin hero, After Hours JPEG **`site/public/wp-content/uploads/2025/04/`**. **Resume context:** **2026-03-28** routing slice: matrix **61** shells, legacy **`301`**, **`en-brand`** removed.

Status: **closed** (Phase 6 localization waves and wrap-up tasks complete). **Final locale copy sign-off** (**`sv`**, **`en`**, **`de`**) on staging before **`www`** is **Phase 8** (**`docs/phase-8-todo.md`**, **P8-06**); optional external input for **`de`** feeds **P8-06**.

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

## P6-03 · German Berlin (Wave 3)

**Scope:** **`de` + Berlin** chrome (**`hero-de-berlin.ts`**, **`chrome-hdr-de-berlin-hero`** / **`chrome-hdr-de-berlin-small`**, **`navigation.ts`** **`de-main`**, **`footer-de-berlin.ts`**, **`SiteHeader`** / **`SiteFooter`**). **Bodies:** **`/de/berlin/`** (**`BerlinHomeDe.astro`**); **`/de/berlin/privacy/`** (**`PrivacyPage.astro`**); story routes **`/de/berlin/ueber-andetag/`**, **`.../musik-von-andetag/`**, **`.../optische-fasertextil/`**, **`.../die-kuenstler-malin-gustaf-tadaa/`** (**`UeberAndetagDe`**, **`MusikVonAndetagDe`**, **`OptischeFasertextilDe`**, **`DieKuenstlerDe`**; sources **`site-html/de-*.html`** **`wp-page`** regions). **`PAGE_CUSTOM_BODY_PATHS` = 60**. Legacy **`/de/{story}/`** → **`/de/berlin/...`** in **`public/_redirects`**.

**Technical verification:** **`npm test`** and **`npm run build`** in **`site/`** green at closure.

**Package sign-off (chrome + bodies):** **Yes** (2026-04-04, Gustaf).

**German external review:** **Approved** to run **once**, late **pre-launch** (Phase 8, **P8-06**), per stakeholder (Gustaf, 2026-04-04). Not blocking shipped **`de`** routes in repo.

## P6-04 · Locale metadata, hreflang, Open Graph baseline

**Scope:** **`SiteLayout.astro`** emits **`og:title`**, **`og:description`** (when shell has description), **`og:url`** (matches **`link rel="canonical"`** via **`createPageLayoutModel`**), **`og:type`**, **`og:site_name`**, **`og:locale`**, **`og:locale:alternate`**, **`og:image`** (absolute URL for Stockholm hero still **`HERO_SV_ASSETS.poster`**), **`twitter:card`** **`summary_large_image`** plus title, description, image. Helpers in **`site/src/lib/chrome/seo.ts`** (**`languageToOgLocale`**, **`ogLocaleAlternates`**, **`defaultOgImageAbsoluteUrl`**). **`docs/Andetag SEO Manual.md`** section 5 documents the baseline. **`docs/content-model.md`** `seo` contract notes emitted tags.

**Hreflang regression:** **`page-shell-registry.test.ts`** asserts self-referencing hreflang per shell language and **no cross-location** hreflang (Stockholm versus Berlin).

**Technical verification:** **`npm test`** and **`npm run build`** in **`site/`** green at closure.

## P6-05 · Localization exceptions

**Scope:** **`EX-0016`** in **`docs/migration-exceptions.md`** records Berlin English story URLs (**`<link rel="canonical">`** and **`og:url`** → Stockholm English per topic) with hreflang and user-visible URL behavior.

## P6-06 · Phase 6 wrap-up

**Scope:** This record (**§P6-04**–**§P6-06**), **`docs/phase-6-todo.md`** checklist, **`docs/grand-plan.md`** Phase 6 status, **`CHANGELOG.md`**, **`AGENTS.md`** documentation table.

**Next (project):** **`docs/phase-7-todo.md`** (scripts, consent, analytics, sitemap, schema.org, launch hardening), then **`docs/phase-8-todo.md`** (**`www`** cutover and **`P5-06`** production). **Carry-forward:** Worker source and SEO manual entry alignment shipped **2026-04-04**; **`P5-06`** staging: **`npm run verify:staging-entry`** (**`docs/phase-4-redirect-tests.md`** log **2026-04-04**, **pass**). Table **B** on **`https://www.andetag.museum`**: **`docs/phase-8-todo.md`**.
