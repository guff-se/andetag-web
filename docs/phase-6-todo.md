# Phase 6 TODO, Localization and Carry-Forward from Phase 5

Purpose: ship a **new header and navigation model** (destination and language as separate choices), then roll out **localized page content** and matching **footer and navigation** content after Swedish Phase 5 closure. Track **Phase 5 carry-forward** (Worker, SEO manual examples, optional Berlin English depth) as needed for launch.

## Current position and what is next

| Stage | Status |
|-------|--------|
| **Phase 5** (Swedish `/sv/...` bodies) | **Closed** (2026-03-24). Evidence: **`docs/phase-5-verification-record.md`**. |
| **P6-00** (`sv` / Stockholm chrome: stable ids, destination + language chrome, resolver) | **Closed**, Gustaf package sign-off. Evidence: **`docs/phase-6-verification-record.md`** §P6-00. |
| **P6-01** (English Stockholm + location-scoped English story URLs) | **Closed** (2026-04-02), Gustaf package sign-off. Evidence: **`docs/phase-6-verification-record.md`** §P6-01. Same technical scope as before: **`PAGE_CUSTOM_BODY_PATHS`** **54** routes; story topics under **`/en/stockholm/{slug}/`**; **`/en/`** header-selector shell; routing per **`docs/routing-location-scoped-global-pages-plan.md`**. |
| **P6-02** (`en` + Berlin chrome and **`/en/berlin/...`** bodies) | **Closed** (2026-04-04), Gustaf package sign-off. Evidence: **`docs/phase-6-verification-record.md`** §P6-02. **`PAGE_CUSTOM_BODY_PATHS`** **55** routes (adds **`/en/berlin/`** and Berlin English utility paths; story bodies reuse Stockholm English where wired). |
| **P6-03** (`de` + Berlin chrome and **`/de/berlin/...`** bodies) | **Closed** (2026-04-04), Gustaf package sign-off. Evidence: **`docs/phase-6-verification-record.md`** §P6-03. **`PAGE_CUSTOM_BODY_PATHS`** **60**. Flat **`/de/...`** story **`301`** rules in **`site/public/_redirects`**. |
| **P6-04**–**P6-06** (metadata and SEO alignment, localization exceptions log, Phase 6 wrap-up) | **Closed** (2026-04-04), maintainer closure. Evidence: **`docs/phase-6-verification-record.md`** §P6-04–§P6-06. |

**Your next actions (Gustaf):** **`P5-06` staging** is reproducible in CI or locally: from **`site/`** run **`npm run verify:staging-entry`** (hits **`https://andetag-web.guff.workers.dev`** by default; see **`docs/phase-4-redirect-tests.md`** execution log **2026-04-04**). Re-run after routing changes; append the log row if you use **`curl`** instead. **`https://www.andetag.museum`** is still the **old** site; repeat table **B** on **`www`** only at **production cutover**. Optional: spot-check Open Graph on staging. German copy external review remains **pre-launch** per **Language review** above (**approved** to run in Phase 7).

**Carry-forward (repo, 2026-04-04):** Worker entry router and SEO manual entry sections are implemented. **`P5-06`** splits into **staging** verification (Workers preview host) now and **production** re-check when **`www`** serves this stack.

**Prerequisites:** Phase 5 **complete** (2026-03-24, Swedish `/sv/...` bodies). See **`docs/phase-5-verification-record.md`** and **`docs/grand-plan.md`** (Phase 5 status and **Entry routing and URL expansion schedule**).

**Inputs:** `docs/grand-plan.md` (Phase 6 block and entry schedule), `docs/url-migration-policy.md`, `docs/phase-4-routing-reopen.md`, `docs/content-model.md`, `docs/phase-3-component-usage.md`, `docs/definition-of-done.md` (Phase 6), `docs/Andetag SEO Manual.md`, `docs/Tone of Voice.md`, `docs/migration-exceptions.md`, `site-html/` English and German sources, **rebuilt `site/` Swedish pages** as the **design reference** (Phase 5 bodies and shared layout).

## Decided: IA, hub, reviewers, content waves

- **Navigation:** New **header structure**: **destination** (Stockholm | Berlin) and **language** (`sv` | `en` | `de`) as separate controls. **Always show all three languages and both locations** in the chrome (no contextual hiding).
- **Switcher coupling** (keep implementation **unified**: one place resolves target URL from current page + chosen language + chosen destination; see **`docs/phase-4-routing-reopen.md`**):
  - User selects **`sv`** while on **Berlin** → move to **Stockholm** (same topic when a path exists, otherwise Stockholm home or closest equivalent per matrix).
  - User selects **`de`** while on **Stockholm** → move to **Berlin** (same rule for topic resolution).
  - User selects **Stockholm** while language is **`de`** → set language to **`en`** and open the **English Stockholm** equivalent path.
  - User selects **Berlin** while language is **`sv`** → set language to **`en`** and open the **English Berlin** equivalent path.
- **`/en/` hub:** **Minimal** hub (city choice and essentials, policy-compliant **200** for humans), not full marketing parity.
- **Content build order (strict):**
  1. **English Stockholm** (`**/en/stockholm/...**`) **together with** the **four English story topics** at **`/en/stockholm/{slug}/`** (same slugs as the old global English URLs; legacy **`/en/music/`** etc. **`301`** here). No separate English “global” path segment in the matrix.
  2. **English Berlin** (`**/en/berlin/...**`), including **new** content where there is no Berlin counterpart yet; story duplicates **canonical** to Stockholm English in HTML where product rules require (see **`page-shell-registry`**).
  3. **German Berlin** (`**/de/berlin/...**`) **together with** German story pages under **`/de/berlin/{slug}/`** (legacy flat **`/de/...`** story URLs **`301`** when they were live), by **translating** Berlin-facing English copy (and using Swedish or sources where that is the authority).
- **Language review:** **Gustaf** reviews **English** throughout. **German:** external reviewer only at a **late** stage **before launch** (not blocking early **`de`** implementation in repo).
- **Text vs design when localizing:** Take **copy** (prose, headings, lists, and other **text** where the migration source is the live legacy site) from the **original locale** in **`site-html/`** (and aligned **`site-md/`** if used), not from inventing English or German. Take **design** from the **new Swedish site** in **`site/`**: same **components**, **layout patterns**, **`components.css`** conventions, and Phase 5 **`/sv/...`** page structure as the default. Do **not** port legacy Elementor or WordPress **visual** structure from non-Swedish HTML when it disagrees with the rebuilt Swedish pages. New Berlin-only or global pages still use **shared** Swedish-approved primitives. Log deliberate visual divergences in **`docs/migration-exceptions.md`**.
- **One page at a time:** Within each wave (**P6-01**–**P6-03**) and for any **`/sv/...`** body or registry work in **P6-00** that goes beyond chrome-only refactors, implement **one page (one canonical route) at a time**. After each page: run **`site/`** checks (**`npm test`**, **`npm run build`**), do **fixups**, add or extend **tests** when the page adds non-trivial logic, wiring, or regressions risk; confirm **green** before starting the **next** page. Optional: keep a short ordered queue per wave in the Phase 6 verification record.
- **Swedish chrome:** Update **`/sv/stockholm/...`** header/footer/nav to the **same** destination + language model where applicable so the shell is coherent (body copy remains Phase 5 approved unless a small exception is logged). Story and privacy paths use the **location prefix** (**`/sv/stockholm/`**).

### Header and footer variant matrix (site/language × destination)

Four **chrome contexts** (no Swedish Berlin or German Stockholm tree): **`sv` + Stockholm**, **`en` + Stockholm**, **`en` + Berlin**, **`de` + Berlin**.

| Context | Hero header | Small header | Footer |
|---------|-------------|--------------|--------|
| **`sv` / Stockholm** | 1 | 1 | 1 |
| **`en` / Stockholm** | 1 | 1 | 1 |
| **`en` / Berlin** | 1 | 1 | 1 |
| **`de` / Berlin** | 1 | 1 | 1 |
| **Totals** | **4** | **4** | **4** |

**8 headers** (hero + small per context) and **4 footers** (one per context). Shared **design system** and components; **content, nav labels, and CTAs** differ per context.

**Legacy naming:** WordPress Elementor ids must **not** remain the long-term contract. Headers in code today include **`header-192`**, **`header-918`**, **`header-4344`**, **`header-2223`**, **`header-3305`**, **`header-4287`**, and legacy alias **`header-4136`** (resolved to **`header-918`**). Footers include **`footer-207`**, **`footer-3100`**, **`footer-4229`**. Phase 6 **redefines stable ids** (and file or module names) keyed to **variant + context** (hero vs small + locale + destination for headers; one footer id per context), updates **`docs/content-model.md`**, **`variants.ts`**, **`page-shell-registry`** / **`layoutVariantsForPath`**, **`SiteHeader`** / **`SiteFooter`** / **`SiteLayout`**, **`page-shell-meta`** pipeline, **`[...slug].astro`** LCP preloads, CSS selectors if tied to legacy ids, and tests. Keep a short **old → new** mapping in **`docs/content-model.md`** or **`CHANGELOG.md`** until the codebase is clean.

**Design approval (package, not chrome-first):** For **each** localization slice, **finish implementation** of that slice’s **chrome** (hero + small + footer for the relevant context, destination/language controls, primary nav) **and** **page bodies** in scope for that slice, **then** seek **Gustaf** design approval **once for the whole package** (chrome + content together). No separate sign-off step that blocks bodies until chrome alone is approved.

**Rollout order:** **`sv` / Stockholm** **first** (legacy rename, new chrome, existing Swedish bodies under **`/sv/stockholm/...`** wired through the new shell), **package-approved** by Gustaf; then **Wave 1** full build (**`en` / Stockholm** chrome + **`/en/`** hub + **`/en/stockholm/...`** including former “global” story URLs as **location-scoped** paths), **package-approved**; **Wave 2** full build (**`en` / Berlin** chrome + **`/en/berlin/...`**), **package-approved**; **Wave 3** full build (**`de` / Berlin** chrome + **`/de/berlin/...`** + German story paths under Berlin), **package-approved** (German copy still gets external review pre-launch per **Language review** above).

## Gate: entry routing and URL artifacts

**Before any edits** that affect **entry routing**, the **URL matrix**, **`site/public/_redirects`**, the **Cloudflare Worker** (or equivalent edge), **`page-shell-registry`**, **`page-shell-meta`**, or other behavior tied to **`/`**, exact **`/en/`**, or policy in **`docs/url-migration-policy.md`:**

1. Read **`docs/phase-4-routing-reopen.md`** (decided behavior, **Phase 4 implementation delta**, open questions).
2. Read **`docs/url-migration-policy.md`** (especially **Entry routing**, **`Accept-Language`**, **`andetag_entry`**, Swedish **`/sv/`**, German **`/de/berlin/`** rules).

Align changes with **`AGENTS.md`** (Routing and entry URLs). **Dependency rule** (grand plan): do not point production **`/`** or **`/en/`** through the Worker until **minimum static targets** for that configuration return **200**; confirm the live matrix against policy before Worker production enable.

## Carry-forward from Phase 5 (infrastructure and launch)

Not required to **start** Phase 6, but required before production entry routing and final SEO examples (see grand-plan **Entry routing and URL expansion schedule**):

| Item | Source | Owner | Status |
|------|--------|-------|--------|
| **Worker implementation** | **`P5-05`** | AI agent | **Done (2026-04-04):** **`site/workers/entry-router.ts`**, **`site/workers/entry-routing-logic.ts`**, Vitest, **`site/wrangler.jsonc`** (**`main`** + **`ASSETS`** + **`run_worker_first`**). **Verify:** table **B** in **`docs/phase-4-redirect-tests.md`** on staging or **`npx wrangler dev`** after **`npm run build`**. |
| **Worker entry smoke test** | **`P5-06`** | Gustaf + AI agent | **Staging:** **`npm run verify:staging-entry`** in **`site/`** (logged **2026-04-04** in **`docs/phase-4-redirect-tests.md`**). **Production (cutover):** repeat on **`https://www.andetag.museum`** when the canonical host serves this Worker. |
| **SEO manual live entry** | **`P5-07`** | Gustaf + AI agent | **Done (2026-04-04):** **`docs/Andetag SEO Manual.md`** §12.1, §12.2 fixes, §13 menu paths, §14 and §14.1 (behavior table + Worker pointer). |
| **Berlin English bodies** | **`P5-04`** | (superseded) | **Closed:** Phase 6 **P6-02**; **`/en/berlin/`** shells **200** in **`site/`**. |

## Phase 6 core (execution checklist)

Aligned with **`docs/grand-plan.md`** Phase 6 and the **Decided** section above.

- [x] **P6-00** **Chrome architecture, legacy rename, and `sv` / Stockholm package:** **Complete (2026-03-24).** Stable **`chrome-hdr-*`** / **`chrome-ftr-*`** ids (**`docs/content-model.md`** §2.5), **`layoutVariantsForPath`**, **`resolveChromeNavigationHref`**, full language + destination selectors, Swedish hero (flags + Stockholm | Berlin), tests, **`STOCKHOLM_SV_EN_PAIRS`** export. **Gustaf package sign-off:** chrome + existing Phase 5 **`/sv/...`** bodies (**`docs/phase-6-verification-record.md`**). **Next:** **P6-01**.
- [x] **P6-01** **Wave 1: English Stockholm + location-scoped story URLs:** **Complete (2026-04-02).** Gustaf package sign-off: **`docs/phase-6-verification-record.md`** §P6-01. In-scope English Stockholm bodies and **four** story topics under **`/en/stockholm/{slug}/`** use **`site/src/lib/page-registry/page-body-registry.ts`** (**`PAGE_CUSTOM_BODY_PATHS`**, **54** paths) and **`site/src/pages/[...slug].astro`**. **`/en/`** hub uses **`chrome-hdr-en-header-selector`** (no entry in **`PAGE_CUSTOM_BODY_PATHS`**). Swedish counterparts are under **`/sv/stockholm/...`**. **`/en/stockholm/`** **`StockholmHomeEn.astro`** and shell metadata close **EX-0007**. **`npm test`** and **`npm run build`** in **`site/`** green. **Next:** **P6-02**.
- [x] **P6-02** **Wave 2: English Berlin:** **Complete (2026-04-04).** Gustaf package sign-off: **`docs/phase-6-verification-record.md`** §P6-02. **`en` + Berlin** hero, small header, footers (**`footer-en-berlin.ts`**, **`footer-de-berlin.ts`**) **and** **`/en/berlin/...`** bodies including **`BerlinHomeEn.astro`**, **`/en/berlin/privacy/`**, and story routes reusing Stockholm English bodies where wired (**`PAGE_CUSTOM_BODY_PATHS`**, **55** paths). **`npm test`** and **`npm run build`** in **`site/`** green. **Next:** **P6-03**.
- [x] **P6-03** **Wave 3: German Berlin:** **Complete (2026-04-04).** Gustaf package sign-off: **`docs/phase-6-verification-record.md`** §P6-03. **`de` + Berlin** hero, small header, footer (**`footer-de-berlin.ts`**) **and** **`/de/berlin/...`** bodies (home, privacy, four German story components). Flat legacy **`/de/...`** story URLs **`301`** to **`/de/berlin/...`**. **`PAGE_CUSTOM_BODY_PATHS`**, **60** paths. **`npm test`** and **`npm run build`** in **`site/`** green. **German:** external language reviewer **once**, late **pre-launch** (per **Language review** above). **Next:** **P6-04**.
- [x] **P6-04** Locale **metadata** (title, description, canonical, Open Graph baseline in **`SiteLayout.astro`**), **hreflang** integrity (registry tests for self-reference and no cross-location siblings), and **`docs/Andetag SEO Manual.md`** §5 alignment. **Closed 2026-04-04.**
- [x] **P6-05** **Localization exceptions:** **`EX-0016`** documents Berlin English story **canonical** consolidation to Stockholm English (**`docs/migration-exceptions.md`**). **Closed 2026-04-04.**
- [x] **P6-06** Phase 6 **verification record**, **`docs/grand-plan.md`** Phase 6 status, **`CHANGELOG.md`**, **`docs/content-model.md`**, **`AGENTS.md`** doc table. **Closed 2026-04-04.**

## Exit criteria (summary)

- Swedish Phase 5 remains closed; no ambiguous regressions on **`/sv/...`** routes; Swedish chrome uses the **8 + 4** header/footer model, **stable** chrome ids (no reliance on legacy **`header-*`** / **`footer-*`** WordPress names as the contract), and the shared destination/language model.
- Localized routes meet **`docs/definition-of-done.md`** Phase 6: performance profile vs Swedish equivalents, canonical/hreflang and locale metadata, accessibility, shared design system (only approved content/variant differences), CTAs and booking/lead flows to correct locale and destination.
- Grand-plan Phase 6 acceptance: each shipped localization slice has **package-level design sign-off** (chrome + in-scope bodies); **language-content review** (English: Gustaf; German: external pre-launch); **link integrity**; **no unapproved design forks**; localized pages were landed **one at a time** with **tests and build passing** between pages.
- Carry-forward: **`P5-04`**, **`P5-05`** implementation, **`P5-07`** closed in repo **2026-04-04**; **`P5-06`** staging evidence **2026-04-04** (**`verify:staging-entry`** + **`docs/phase-4-redirect-tests.md`** log); production **`www`** pass logged at cutover.
