# Definition of Done by Phase

Purpose: provide measurable exit checks aligned to each phase in `docs/grand-plan.md`.

## Shared Quality Gates

All phases must keep these baseline checks in scope:

- Performance: Core Web Vitals on key templates meet modern production targets (LCP <= 2.5s, INP <= 200ms, CLS <= 0.1) under controlled test conditions.
- SEO: canonical/hreflang integrity preserved for affected URLs.
- Accessibility: no unresolved high-severity accessibility violations in changed surfaces (WCAG 2.2 AA intent).
- Visual parity: approved differences only.
- Functional conversion path: ticket and lead paths remain operable.

## Phase 0, Foundations and Guardrails

- Performance: CI workflow executes on every push to `main` and completes within 5 minutes for docs-only changes.
- SEO: URL policy and URL schema are documented and internally consistent.
- Accessibility: no direct UI output in this phase, not applicable.
- Visual parity: no direct UI output in this phase, not applicable.
- Functional conversion path: tracking and consent requirements documented for later implementation.

## Phase 1, Existing Site Analysis and Documentation

- Performance: analysis artifacts are reproducible from source files.
- SEO: 100 percent of known URLs are represented in analysis schema or marked unknown with rationale.
- Accessibility: existing accessibility risks are documented where detected during analysis.
- Visual parity: component and template inventory includes evidence sources from existing pages.
- Functional conversion path: integration disposition identifies how booking and conversion flows are retained.

## Phase 2, Shared Layout System

- Performance: shared layout code does not add unnecessary blocking resources.
- SEO: nav/footer links, canonical generation hooks, and hreflang hooks are implemented.
- Accessibility: keyboard nav, focus order, and semantic landmarks pass review.
- Visual parity: each header/footer variant approved on desktop/tablet and mobile reference views, with mobile-first QA on iOS Safari and Chrome (iOS), plus desktop Chrome and Safari.
- Functional conversion path: primary CTA links in nav/footer route correctly.
- Asset integrity: shared layout does not depend on absolute old-site asset URLs, and all first-party media/js/css references resolve from local Astro-hosted paths.

## Phase 3, Component Library and Verification Page

- Performance: the internal consolidated verification route scored at least 90 for Lighthouse Performance on mobile profile **unless** an approved exception applies (**EX-0006**, historical; see `docs/migration-exceptions.md` and `docs/phase-3-verification-record.md`). That route was removed after Phase 3 sign-off.
- SEO: reusable components support metadata injection where relevant.
- Accessibility: each core component has keyboard and screen-reader behavior validated; Lighthouse Accessibility on the verification route was at least 95 (recorded in `docs/phase-3-verification-record.md`).
- Visual parity: consolidated component sign-off completed before page migration starts (record in `docs/phase-3-verification-record.md`).
- Functional conversion path: CTA and embed components support required ticketing and lead journeys.

## Phase 4, Routing and URL Preservation

- Performance: redirects and route handling do not introduce redirect chains.
- SEO: route coverage report shows full mapping, canonical URLs match policy.
- Accessibility: error and fallback routes remain usable with keyboard and screen readers.
- Visual parity: route-level templates render approved layout variants.
- Functional conversion path: critical conversion routes and aliases resolve correctly.

## Phase 5, Page Migration and Iterative Approval

- Performance: migrated conversion-priority pages score at least 85 in Lighthouse Performance on mobile profile, and do not exceed one blocking redirect hop. **Closure 2026-03-24:** **EX-0014** documents approved variance when **simulated** mobile Lighthouse stays below 85 while **provided** throttling and production-oriented checks pass; revalidate after deploy and in Phase 7.
- SEO: each migrated page has title, description, canonical, hreflang, and indexability set.
- Accessibility: no unresolved high-severity issues on approved migrated pages.
- Visual parity: per-page approval is explicitly recorded before next migration batch.
- Functional conversion path: booking/lead interactions on each migrated page are validated.

## Phase 6, Localization Rollout (After Swedish Completion)

**Process status:** **`docs/phase-6-todo.md`** (**P6-00**–**P6-06** closed **2026-04-04**). **Evidence and sign-off:** **`docs/phase-6-verification-record.md`**. **Canonical URL model** for story topics and privacy: **`docs/routing-location-scoped-global-pages-plan.md`** (**implemented**) and **`docs/url-migration-policy.md`** (**Location-scoped story URLs and privacy**).

- Performance: localized pages keep the same component-level performance profile as approved Swedish equivalents.
- SEO: localized pages preserve canonical/hreflang integrity and locale-specific metadata correctness.
- Accessibility: localized content updates do not introduce unresolved high-severity accessibility issues.
- Visual parity: shared design system remains consistent across locales, with only approved content/variant differences.
- Functional conversion path: localized CTA and booking/lead flows resolve to the correct locale and destination routes.

## Phase 7, Scripts, Consent, Analytics, and Launch Hardening

- Performance: third-party scripts are consent-gated, and key conversion pages maintain Lighthouse Performance >= 85 mobile and >= 95 desktop.
- SEO: sitemap, robots, canonicals, and hreflang output pass pre-launch checks. Self-hosted favicon (and agreed touch or mask icons) are present. Open Graph and Twitter (or X) card tags follow the documented default and per-page override rules in `docs/grand-plan.md` Phase 7 and `docs/content-model.md`. JSON-LD schema.org output matches `docs/Andetag SEO Manual.md` for each live destination phase (Stockholm; Berlin Place versus Museum rules).
- Accessibility: consent experience and script-driven UI remain accessible, with no unresolved critical accessibility issues.
- Visual parity: final cross-device QA has no unresolved high-priority defects.
- Functional conversion path: analytics and attribution coverage is validated end-to-end for purchase funnel events.

## Phase 8, Deployment and production cutover

- **Pre-cutover:** Dev and staging (**`https://andetag-web.guff.workers.dev`**) pass full functional QA (routing, scripts, cookies, consent, embeds, forms). Must-keep URLs from the legacy live site behave per **`docs/url-matrix.csv`** and **`docs/url-migration-policy.md`**; exceptions are approved and logged.
- **Locale copy:** Gustaf has explicitly approved **final user-visible text** for **`sv`**, **`en`**, and **`de`** on **staging** (**`docs/phase-8-todo.md`**, **P8-06**); optional external **`de`** review completed before that sign-off if used.
- **Cutover:** **`https://www.andetag.museum`** serves this stack (entry Worker + static assets); runbook executed; rollback path understood.
- **Post-cutover:** **`docs/phase-4-redirect-tests.md`** table **B** (and agreed matrix checks) pass on **`www`**; live spot-checks for SEO, sharing, and conversion paths match Phase 7 expectations on the canonical host.
- **Sign-off:** Gustaf approval recorded in **`docs/phase-8-verification-record.md`**.
- **Post-cutover operations:** Routine changes ship via **PRs** with preview URLs; **merge to `main`** updates **`www`** (**`docs/phase-8-todo.md`**, **P8-25**).
