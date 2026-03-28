# Phase 6 Verification Record

Purpose: evidence and stakeholder sign-off for Phase 6 slices per **`docs/phase-6-todo.md`** and **`docs/definition-of-done.md`** Phase 6.

**Where we are:** **P6-00** signed off. **P6-01** is **implemented** and **awaiting Gustaf package sign-off** (chrome + **`/en/`** hub + English bodies). **Next after P6-01 sign-off:** **P6-02** (**`en` + Berlin**, **`/en/berlin/...`** bodies).

Status: **open** (**P6-00** closed; **P6-01** implementation complete, package sign-off pending; **P6-02**–**P6-03** and **P6-04**–**P6-06** pending).

## P6-00 · Swedish chrome package (`sv` / Stockholm)

**Scope:** Stable **`chrome-hdr-*`** / **`chrome-ftr-*`** variant ids; **`site/src/lib/routes/chrome-navigation-resolve.ts`** (**`resolveChromeNavigationHref`**, coupling per **`docs/phase-4-routing-reopen.md`**); **`layoutVariantsForPath`** in **`page-shell-registry`**; language and destination selectors on non-Swedish header; Swedish shared hero (language flags + Stockholm | Berlin row); **`STOCKHOLM_SV_EN_PAIRS`** export; tests (**`chrome-navigation-resolve.test.ts`**, layout fixtures). Phase 5 **`/sv/...`** page bodies unchanged.

**Technical verification:** **`npm test`** and **`npm run build`** in **`site/`** green at closure.

**Package sign-off (chrome + Swedish bodies):** **Yes** (2026-03-24, Gustaf).

**Follow-up:** Optional **`page-shell-meta`** extractor documentation if the pipeline should mention chrome ids explicitly (not blocking **P6-01**).

## P6-01 · English Stockholm + English global (implementation complete, sign-off open)

**Scope:** Wave 1 matrix shells with **`en` + Stockholm** chrome: **`/en/`** header-selector shell (Stockholm \| Berlin CTAs only; not in **`PAGE_CUSTOM_BODY_PATHS`**), all **`/en/stockholm/...`** bodies, and English global **`/en/about-andetag/`**, **`/en/about-the-artists-malin-gustaf-tadaa/`**, **`/en/music/`**, **`/en/optical-fibre-textile/`**. Excluded: **`/en/berlin/...`** (**P6-02**).

**Wiring:** **`site/src/lib/page-registry/page-body-registry.ts`** (**`PAGE_CUSTOM_BODY_PATHS`**, **46** paths = **23** English + **23** Swedish; **`/en/`** has no body component) and **`site/src/pages/[...slug].astro`** **`pageBodies`** map (keys must match exactly). **`page-body-registry.test.ts`** asserts set size and string presence in the slug page.

**Representative sources (see component file comments for wp-page / HTML file):**

| Area | Notes |
|------|--------|
| **`/en/`** hub | **`chrome-hdr-en-header-selector`** (**`SiteHeader.astro`**, full-viewport hero, Stockholm \| Berlin only; no main, no footer); **EX-0015** title and description in **`page-shell-meta.json`** |
| **`/en/stockholm/`** | **`StockholmHomeEn.astro`** from **`site-html/en.html`**; **EX-0007** **resolved** in **`docs/migration-exceptions.md`** |
| English global | **`OmAndetagEn`**, **`OmKonstnarernaEn`**, **`MusikEn`**, **`OpticalFibreTextileEn`** |
| English Stockholm utility pages | **`BiljetterEn`**, **`FragorSvarEn`**, **`HittaHitEn`**, **`OppettiderEn`**, **`PresentkortEn`**, **`SasongskortEn`**, **`TillganglighetEn`**, **`ArtYogaEn`**, **`ForetagseventEn`**, **`GruppbokningEn`**, **`DejtEn`**, **`VilkenTypAvUpplevelseEn`**, **`BesokaromdomenEn`** (TripAdvisor slider omitted per **EX-0012**) |
| SEO landings | **`StockholmExhibitionEn`**, **`StockholmIndoorActivityEn`**, **`StockholmMuseumEn`**, **`StockholmThingsToDoEn`**, **`NpfStockholmEn`** (shared **`StockholmSeoLandingEn`**) |

**English Stockholm chrome:** **`hero-en-stockholm.ts`**, **`footer-en-stockholm.ts`**, **`navigation.ts`** **`en-main`**, **`STOCKHOLM_SV_EN_PAIRS`**. **`chrome-hdr-en-header-selector`** reuses the English hero chrome model for **`/en/`** with menu strips omitted. **`chrome-hdr-en-stockholm-brand`** remains **`header-root`** for English global story pages.

**Technical verification:** **`npm test`**, **`npm run build`** in **`site/`** green (2026-03-24).

**Package sign-off (chrome + hub + bodies):** **Pending** (Gustaf).

## Next

1. **Gustaf:** Inspect Wave 1 English; update §P6-01 **Package sign-off** to **Yes** with date when approving.
2. **Maintainer:** Mark **P6-01** complete in **`docs/phase-6-todo.md`**; begin **P6-02** (**`/en/berlin/...`** and **`en` + Berlin** chrome), one route at a time.
3. **Later waves:** **P6-03** (German), then **P6-04**–**P6-06** (metadata, exceptions, grand-plan/CHANGELOG closure for Phase 6).
