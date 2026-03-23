# Phase 2 TODO, Shared Layout System (Headers, Footers, Navigation)

Purpose: implement and validate the shared layout system required before component library and page migration work.

Status: **Complete (final sign-off 2026-03-22, Gustaf).**

## Final sign-off

| Field | Value |
|-------|--------|
| Phase | 2 |
| Stakeholder approval | Gustaf (2026-03-22), shared layout and variant parity |
| Scope | Headers, footers, navigation model, layout SEO hooks, accessibility baseline, link and asset parity per `P2-00` through `P2-07` |
| Record | This checklist and `docs/grand-plan.md` Phase 2 section |

## Exit Criteria

Phase 2 is complete only when all items marked `P2` are done and approved:

- Shared header and footer variants are implemented and mapped to source-backed variant IDs.
- Navigation and language switcher behavior matches approved URL and IA policies.
- Layout-level SEO and accessibility hooks are in place and verified.
- Link parity and CTA route checks pass for nav and footer destinations.

## Task Board

## P2, Must Complete in Phase 2

- [x] **P2-00 Confirm Phase 2 implementation scope and target workspace**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/grand-plan.md`
    - `docs/definition-of-done.md`
    - `docs/decisions/0001-static-stack-selection.md`
  - Decisions:
    - Active Astro implementation workspace path: `site/` at repository root.
    - Layout QA sign-off environments: local and Cloudflare preview deployment.
  - Done when: implementation path and approval environments are explicit and documented in this checklist.

- [x] **P2-01 Finalize shared layout contract from Phase 1 variant evidence**
  - Owner: AI agent
  - Inputs:
    - `docs/phase-1-analysis-schema.md`
    - `docs/existing-site-structure.md`
    - `docs/content-model.md`
  - Include:
    - Header variant mapping for `header-192`, `header-918`, `header-4344`, `header-2223`, `header-3305`, `header-4287`.
    - Footer variant mapping for `footer-207`, `footer-3100`, `footer-4229`.
    - Explicit resolution path for `GAP-002` (`header-4136` on `en-berlin-en.html`).
  - Done when: every active header/footer variant has a deterministic static mapping and unresolved variants are tracked with owner and target phase.
  - Implementation evidence:
    - `site/src/lib/layout/variants.ts`
    - `site/src/lib/layout/page-layout.ts`
    - `site/src/lib/layout/layout.test.ts`

- [x] **P2-02 Implement header/footer layout variants with shared render primitives**
  - Owner: AI agent
  - Inputs:
    - `docs/phase-1-design-baseline.md`
    - `docs/Visual Identity.md`
    - `docs/Tone of Voice.md`
  - Include:
    - Hero and small-header behavior parity (desktop and mobile variants).
    - Brand-header behavior parity (desktop simplified nav, mobile fallback behavior).
    - Footer legal/social/schema slots with language-aware variant support.
  - Done when: all required layout variants render from structured data, not page-local hardcoding.
  - Implementation evidence:
    - `site/src/components/layout/SiteHeader.astro`
    - `site/src/components/layout/SiteFooter.astro`
    - `site/src/layouts/SiteLayout.astro`
    - Historical Phase 2 grid preview `site/src/pages/layout-preview.astro` (removed after parity sign-off; Phase 4 matrix shells cover ongoing checks)

- [x] **P2-03 Implement navigation data model and rendering logic**
  - Owner: AI agent
  - Inputs:
    - `docs/content-model.md`
    - `docs/phase-1-analysis-schema.md`
    - `docs/url-migration-policy.md`
  - Include:
    - Variant-aware menu trees for `sv-main`, `en-main`, `en-brand`, `de-main`.
    - CTA item handling for ticket routes where present.
    - Language switcher behavior aligned with canonical language routes and hreflang relationships.
    - Separate language selector and destination selector controls (intentional divergence from old combined behavior to support future IA).
  - Done when: all approved nav variants render from shared data contracts and produce expected destination links.
  - Implementation evidence:
    - `site/src/lib/layout/navigation.ts`
    - `site/src/lib/layout/page-layout.ts`
    - `site/src/lib/layout/layout.test.ts`

- [x] **P2-04 Wire layout-level SEO hooks**
  - Owner: AI agent
  - Inputs:
    - `docs/url-migration-policy.md`
    - `docs/definition-of-done.md`
    - `docs/Andetag SEO Manual.md`
  - Include:
    - Canonical hook integration in base layout.
    - Hreflang hook integration for sv/en/de relationships.
    - Footer and nav link normalization to canonical path policy.
  - Done when: layout foundation supports Phase 4 route-level canonical/hreflang generation without contract changes.
  - Implementation evidence:
    - `site/src/lib/layout/seo.ts`
    - `site/src/layouts/SiteLayout.astro`
    - `site/src/lib/layout/page-layout.test.ts`

- [x] **P2-05 Validate accessibility and keyboard navigation for shared layout**
  - Owner: AI agent
  - Inputs:
    - `docs/definition-of-done.md`
    - Phase 2 implementation artifacts
  - Validate:
    - Landmark semantics for header, nav, main, and footer.
    - Keyboard traversal and focus visibility for nav and language switcher interactions.
    - Mobile menu open/close focus management.
  - Done when: no unresolved high-severity accessibility issues remain in shared layout surfaces.
  - Implementation note: shared layout now includes a keyboard skip link to `main`, visible `:focus-visible` treatment for interactive controls, and mobile menu focus management (focus move on open, Escape close, and focus return to toggle).

- [x] **P2-06 Run visual parity and link parity verification on all layout variants**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/phase-1-analysis-schema.md`
    - `site-html/*.html` source references for each variant
  - Verify:
    - Desktop/tablet and mobile reference screenshots for each header/footer variant (same two-container layout model as source site).
    - Link parity for nav/footer destinations and primary CTA routes.
    - Internal media paths resolve to Astro-hosted local files, no absolute old-site asset URL dependencies remain in layout code.
  - Done when: each required variant is approved or logged as a migration exception with rationale.
  - Implementation note: visual parity approved by Gustaf, Swedish header/footer route targets were normalized and verified against `site-html/index.html`, and layout source scan confirms no absolute old-site media/CSS/JS asset URLs in `site/src/`.

- [x] **P2-07 Prepare carry-forward outputs for Phase 3 and Phase 4**
  - Owner: AI agent
  - Inputs:
    - Completed Phase 2 checklist artifacts
  - Output updates:
    - `docs/grand-plan.md` (Phase 2 status and key outcomes)
    - `docs/migration-exceptions.md` (any approved layout deviations)
    - `CHANGELOG.md` (`Unreleased` notes with why)
  - Done when: Phase 3 component work can start without unresolved shared-layout blockers.
  - Implementation note: `docs/grand-plan.md` now reflects post-Phase-2 status and next-step ordering, `docs/migration-exceptions.md` records EX-0005 follow-up closure after parity checks, and `CHANGELOG.md` logs Phase 2 carry-forward completion.

## P3, Important but Can Spill into Early Phase 3

- [x] **P3-01 Create reusable layout QA checklist template**
  - Owner: AI agent
  - Output: a repeatable checklist document or section for desktop/mobile variant verification and link parity checks.
  - Done when: future layout adjustments can be revalidated without redefining QA steps.
  - Resolution: delivered in Phase 3 as `docs/phase-3-component-qa-checklist.md` (see `docs/phase-3-todo.md` **P3-01**).

- [x] **P3-02 Formalize nav/footer structured data fixture set for regression checks**
  - Owner: AI agent
  - Output: source-backed fixtures that can be used for deterministic nav/footer rendering tests.
  - Done when: nav/footer regressions can be detected in CI after Phase 3 test expansion.
  - Resolution: delivered in Phase 3 as `docs/phase-3-fixture-strategy.md` and `site/src/lib/layout/fixtures.ts` (see `docs/phase-3-todo.md` **P3-02**).

## Clarification Queue (Ask Early)

- [x] **CQ-01 Confirm active Astro app path for implementation work**
  - Resolution: use `site/` as the active Astro workspace path for implementation work.
  - Why now: Phase 2 requires concrete file targets before implementation starts.

- [x] **CQ-02 Confirm approval baseline for responsive breakpoints and browser support**
  - Resolution: follow existing-site model with two layout buckets, desktop/tablet and mobile.
  - Browser support matrix: mobile-first QA in iOS Safari and Chrome (iOS), plus desktop Chrome and Safari.
  - Why now: variant sign-off criteria depend on approved viewport matrix.

- [x] **CQ-03 Confirm selector UX policy for destination plus language switching**
  - Resolution: destination and language are separate selectors, accepted as intentional divergence from old UX to support future routing strategy.
  - Why now: language switcher behavior and nav IA must match approved route strategy before coding.

## Working Rhythm

- Review cadence: one checkpoint per major `P2` item completion.
- Approval rule: Gustaf approves each `P2` item before it is marked done.
- Clarification rule: ask clarifying questions immediately when URL behavior, variant mapping, or accessibility acceptance criteria are ambiguous.
- Change control: log source-parity deviations in `docs/migration-exceptions.md`.
- Decision logging: architecture-impacting changes are captured as ADRs in `docs/decisions/`.
- Naming convention: locale-specific source files in `site/` must end with `-sv`, `-en`, or `-de` before the extension (for example `hero-sv.ts`).
- Asset convention: first-party JS, CSS, images, and media must be self-hosted in `site/` and referenced by root-relative local paths, not absolute legacy-site URLs.
- Design convention: component and layout styling is universal across languages; language can change content, route targets, and conditional element presence, but should not fork core design styles without an approved exception.
- Localization rollout convention: finish and approve Swedish content through Phase 5 before implementing any localization work, including localized headers and localized page content.

## Implementation Insights (Header and Footer Work)

- Keep one shared design layer (`shared-*` selectors), then inject language or variant-specific content from model files.
- Build mobile behavior as a first-class variant, not a reduced desktop fallback, especially for sticky and hamburger navigation.
- For sticky controls that start outside the viewport, compute stick thresholds from the element's actual in-flow position, not from container height assumptions.
- Use local asset and local font pipelines early, visual parity and typography tuning are faster after external dependencies are removed.
- During active parity work, optional dedicated preview routes under `site/src/pages/` can shorten review cycles; **remove them when the owning phase closes** (see `AGENTS.md`, phase closure cleanup). Prefer matrix shell pages or documented fixtures for regression after sign-off.

## Immediate Next 3 Actions

1. Start Phase 3 component library work and produce `P3-01` layout QA checklist template.
2. Build `P3-02` nav/footer structured fixture set for regression testing.
3. Keep localization paused until Swedish content completion in Phase 5, then begin Phase 6 localization rollout.

## Phase Closure Forward Audit Record

Date: 2026-03-22 (updated at Phase 2 final sign-off)

Future-phase impact review completed for Phases 3 through 7:

- Phase 3: no shared-layout blockers remain, Phase 3 component library work and the reusable QA checklist could start immediately.
- Phase 4: canonical/hreflang base hooks are in place from Phase 2, routing work can focus on coverage and redirect validation.
- Phase 5: Swedish-first sequencing remains mandatory, localization work stays deferred until Swedish content migration is approved.
- Phase 6: localization phase scope remains content plus header localization using shared design primitives from Phase 2.
- Phase 7: consent, analytics, and launch hardening phase numbering remains updated and consistent with carry-forward dependencies.
