# Phase 3 TODO, Design Component Library and Verification Page

Purpose: build a reusable, source-backed component library and verification workflow before Phase 5 page migration.

Status: In progress.

## Exit Criteria

Phase 3 is complete only when all items marked `P3` are done and approved:

- Reusable component APIs are implemented for the approved migration component set.
- A dedicated internal component showcase page exists and covers approved variants and states.
- Component usage guidance is documented with purpose, props, and content constraints.
- Showcase validation passes visual, accessibility, and responsive checks required by `docs/definition-of-done.md`.

## Task Board

## P3, Must Complete in Phase 3

- [x] **P3-00 Confirm Phase 3 scope, sequencing, and approval gate**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/grand-plan.md`
    - `docs/definition-of-done.md`
    - `docs/phase-2-todo.md`
  - Include:
    - Confirm the exact component set required before page migration starts.
    - Confirm the sign-off route for component showcase approval.
    - Confirm responsive QA viewport matrix for component checks.
  - Done when: scope and approval path are explicit in this checklist and no clarification blockers remain.
  - Resolution:
    - Component implementation strategy is batched: build all approved components and required states before sign-off.
    - Single consolidated sign-off: Gustaf reviews all components and states in one showcase pass, not per-component approvals.
    - Showcase route policy: use `/component-showcase/`, available in local and preview/staging, excluded from sitemap and production navigation.

- [x] **P3-01 Create reusable layout and component QA checklist template**
  - Owner: AI agent
  - Carry-forward source: `P3-01` from `docs/phase-2-todo.md`
  - Output: a repeatable QA checklist document or checklist section for desktop/tablet and mobile verification, accessibility checks, and link/CTA parity checks.
  - Done when: all component QA cycles can reuse one documented template without redefining test steps.
  - Output delivered: `docs/phase-3-component-qa-checklist.md`

- [x] **P3-02 Formalize nav/footer and component fixture coverage for regression checks**
  - Owner: AI agent
  - Carry-forward source: `P3-02` from `docs/phase-2-todo.md`
  - Inputs:
    - `docs/phase-1-analysis-schema.md`
    - Phase 2 layout data artifacts in `site/src/lib/layout/`
  - Include:
    - Source-backed fixture samples for nav and footer regressions.
    - Fixture strategy for component variant/state regression tests.
  - Done when: deterministic fixtures exist for CI-facing regression checks used by layout and component tests.
  - Outputs delivered:
    - `docs/phase-3-fixture-strategy.md`
    - `site/src/lib/layout/fixtures.ts`
    - Fixture wiring in layout tests under `site/src/lib/layout/`

- [x] **P3-03 Finalize Phase 3 component inventory and API contracts**
  - Owner: AI agent
  - Inputs:
    - `docs/phase-1-analysis-schema.md`
    - `docs/content-model.md`
    - `docs/phase-1-design-baseline.md`
  - Include:
    - Component list for migration-critical surfaces (for example button, hero section, content section wrappers, testimonial, FAQ/accordion, gallery, embeds, booking module, info boxes, and map block).
    - Stable prop contract definitions aligned with the content model.
    - Explicit handling for required states (default, hover/focus, mobile variants, empty/fallback behavior where needed).
  - Done when: each in-scope component has a documented API contract and no unresolved contract ambiguity remains.
  - Output delivered and approved: `docs/phase-3-component-inventory.md`
  - Added standards:
    - semantic heading hierarchy rules (`h1`, `h2`, `h3`) for component usage
    - reusable link appearance contract by variant
    - reusable ANDETAG wordmark style rule (uppercase and letter spacing baseline)
  - Scope update: added source-backed `PartnersSection` for front-page `Våra partners` logo/link block.

- [x] **P3-04 Implement core content components using shared design primitives**
  - Owner: AI agent
  - Inputs:
    - `docs/Visual Identity.md`
    - `docs/Tone of Voice.md`
    - Phase 3 component contracts from `P3-03`
  - Include:
    - Shared primitives and wrappers to avoid duplicated per-component styling logic.
    - Component implementation in the Astro workspace under `site/`.
    - Local-asset and shared-design compliance (no locale-specific design forks without approved exception).
    - Batch delivery with all required component states defined in `docs/phase-3-component-inventory.md`.
  - Done when: core components render from contract data and pass baseline checks in local preview.
  - Implementation evidence:
    - `site/src/components/ui/BrandWordmark.astro`
    - `site/src/components/ui/StyledLink.astro`
    - `site/src/components/content/ButtonGroup.astro`
    - `site/src/components/content/HeroSection.astro`
    - `site/src/components/content/ContentSection.astro`
    - `site/src/components/content/AccordionSection.astro`
    - `site/src/components/content/GallerySection.astro`
    - `site/src/components/content/PartnersSection.astro`
    - `site/src/components/content/TestimonialCarousel.astro`
    - `site/src/components/content/InfoCardGrid.astro`
    - `site/src/styles/components.css`
  - Scope refinement: removed standalone `SocialLinks` from Phase 3 component scope, social links remain header/footer-owned surfaces.

- [x] **P3-05 Implement interactive and embed components for conversion-critical flows**
  - Owner: AI agent
  - Inputs:
    - `docs/tracking-and-consent-requirements.md`
    - `docs/kpi-measurement-map.md`
    - `docs/migration-exceptions.md`
  - Include:
    - CTA-capable components that preserve ticket and lead-path operability.
    - Embed and widget wrappers needed for required booking and map/video surfaces.
    - Explicit fallback handling where third-party content is unavailable.
    - Include required fallback/error states for showcase sign-off coverage.
  - Done when: conversion-critical component paths are functional and ready for Phase 5 page usage.
  - Implementation evidence:
    - `site/src/components/embeds/BookingEmbed.astro`
    - `site/src/components/embeds/WaitlistFormEmbed.astro`
    - `site/src/components/embeds/MapEmbed.astro`
    - `site/src/components/embeds/VideoEmbed.astro`
    - `site/src/data/component-showcase.ts` (fallback-state scenarios)

- [x] **P3-06 Build dedicated internal component showcase route**
  - Owner: AI agent
  - Inputs:
    - Implemented Phase 3 components
    - `docs/definition-of-done.md` Phase 3 gates
  - Include:
    - One internal route that renders all approved components and all required states.
    - Test controls or structured data permutations for responsive and state verification.
    - Approval-ready visual presentation for one-pass Gustaf sign-off.
  - Done when: showcase can be used as the single approval surface before page migration starts.
  - Implementation evidence:
    - `site/src/pages/component-showcase.astro`
    - `site/src/layouts/SiteLayout.astro` (`robots` support for `noindex,nofollow`)
  - Route: `/component-showcase/`

- [x] **P3-07 Add component usage documentation for migration implementation**
  - Owner: AI agent
  - Inputs:
    - Component APIs from `P3-03`
    - Implementations from `P3-04` and `P3-05`
  - Include:
    - Purpose and intended usage per component.
    - Required/optional props and content constraints.
    - Usage examples and known limitations.
  - Done when: Phase 5 migration work can consume component docs without reverse-engineering implementation details.
  - Output delivered: `docs/phase-3-component-usage.md`

- [ ] **P3-08 Run Phase 3 verification and record approval outcomes**
  - Owner: Gustaf + AI agent
  - Inputs:
    - Component showcase route
    - Phase 3 QA checklist template from `P3-01`
  - Verify:
    - Lighthouse Performance score on showcase route is at least 90 on mobile profile.
    - Lighthouse Accessibility score on showcase route is at least 95.
    - Keyboard and screen-reader behavior is validated for each core component.
    - Responsive checks pass for desktop/tablet and mobile views.
  - Done when: Gustaf signs off the showcase and no high-severity unresolved Phase 3 defects remain.

- [ ] **P3-09 Prepare carry-forward outputs for Phase 4 and Phase 5**
  - Owner: AI agent
  - Inputs:
    - Completed Phase 3 artifacts
  - Output updates:
    - `docs/grand-plan.md` (Phase 3 status and carry-forward notes)
    - `docs/migration-exceptions.md` (approved component-level deviations)
    - `CHANGELOG.md` (`Unreleased` notes with why)
  - Done when: route and page-migration phases can start without component-library blockers.

## Clarification Queue (Resolved)

- [x] **CQ-01 Confirm internal URL path and access policy for the component showcase page**
  - Resolution:
    - Route: `/component-showcase/`
    - Availability: local and preview/staging
    - Visibility: excluded from production navigation and sitemap
  - Why now: Phase 3 approval workflow depends on one stable showcase route.

- [x] **CQ-02 Confirm which component states are mandatory for sign-off versus optional**
  - Resolution:
    - Implement all required documented states across all approved components in one batch.
    - Perform one consolidated sign-off in the showcase route, no individual component sign-off gates.
  - Why now: prevents overbuilding showcase permutations that do not affect Phase 5 migration readiness.

## Working Rhythm

- Review cadence: one checkpoint per completed `P3` item.
- Approval rule: implementation proceeds through `P3-04` to `P3-07` without per-component sign-off, and Gustaf provides one consolidated approval in `P3-08` via the showcase page.
- Clarification rule: ask clarifying questions immediately when component scope, data contracts, acceptance criteria, or ownership is ambiguous.
- Change control: any source parity deviation is logged in `docs/migration-exceptions.md`.
- Decision logging: architecture-impacting decisions are captured as ADRs in `docs/decisions/`.
- Design consistency rule: component styling remains shared across `sv`, `en`, and `de`, language can change content, route targets, and shown elements only unless an approved exception exists.
- Asset integrity rule: first-party assets remain local to `site/`, no absolute old-site internal asset URLs are allowed.

## Immediate Next 3 Actions

1. Run consolidated showcase review in `P3-08` on `/component-showcase/`.
2. Record open issues or approved exceptions, then close `P3-08`.
3. Complete `P3-09` carry-forward updates for Phase 4 and Phase 5 readiness.
