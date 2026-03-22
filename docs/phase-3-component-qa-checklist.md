# Phase 3 Component QA Checklist Template

Purpose: provide one repeatable QA template for Phase 3 component and showcase validation across desktop/tablet and mobile before Phase 5 page migration.

Use this checklist for every component QA cycle and for final showcase sign-off in `P3-08`. Completed run outcomes for the consolidated sign-off are summarized in `docs/phase-3-verification-record.md`.

Sign-off mode for this phase:

- Build all approved components and required states before stakeholder review.
- Perform one consolidated sign-off pass in `/component-showcase/` instead of individual component sign-off gates.

## Scope and Inputs

- `docs/definition-of-done.md` (Phase 3 quality gates)
- `docs/phase-3-todo.md` (`P3-01`, `P3-08`)
- Source evidence:
  - `docs/existing-site-structure.md`
  - `docs/phase-1-analysis-schema.md`
  - `docs/phase-1-design-baseline.md`

## Pre-QA Setup

- [ ] Confirm component contract and intended states are documented.
- [ ] Confirm the component variant is rendered in the internal showcase route.
- [ ] Confirm test data uses deterministic fixture inputs where available.
- [ ] Confirm local assets are root-relative and self-hosted.
- [ ] Confirm no unapproved migration exception is required for this component.

## Responsive QA Matrix

### Desktop and Tablet

- [ ] Layout, spacing, and typography match approved baseline intent.
- [ ] Hover and focus states are visible and consistent with shared design primitives.
- [ ] CTA labels and links route to expected canonical destinations.
- [ ] Any media/embed surface maintains stable aspect ratio and no layout break.

### Mobile

- [ ] Component remains readable and operable at mobile viewport width.
- [ ] Tap targets are large enough and do not overlap.
- [ ] Focus order remains logical when navigating with keyboard/accessibility controls.
- [ ] No content clipping, overflow, or inaccessible controls.

## Accessibility Checks (WCAG 2.2 AA intent)

- [ ] Semantic structure is correct for component role (headings, lists, buttons, landmarks where relevant).
- [ ] Keyboard-only interaction works for all interactive controls.
- [ ] Focus indicator is visible for all focusable elements.
- [ ] Screen-reader labels are present for non-text controls.
- [ ] Embed fallback and error states are announced and understandable.

## Heading and Link Standards Checks

- [ ] Page-level heading hierarchy is valid (`h1` once, then `h2` and `h3` progression as applicable).
- [ ] Hero/content heading level usage follows approved component contracts.
- [ ] Link visual treatment matches approved variant (`content`, `nav`, `footer`, `cta-*`).
- [ ] Link hover and `focus-visible` states are present and visually clear.
- [ ] CTA variants are only `primary`, `secondary`, or `outline`.

## Brand Wordmark Consistency Check

- [ ] Brand name is rendered as `ANDETAG` where the wordmark style is required.
- [ ] Shared reusable wordmark style hook is used (no one-off local overrides).
- [ ] Wordmark letter spacing baseline is preserved (`0.3em` unless approved exception is logged).

## SEO and Link Integrity Checks

- [ ] Internal links are canonical and policy-compliant paths.
- [ ] No accidental `noindex` or metadata regressions introduced by component usage.
- [ ] No absolute `https://www.andetag.museum/...` URLs for first-party assets.

## Conversion Path Checks

- [ ] Primary ticket CTA path is operational.
- [ ] Lead/contact CTA path is operational where applicable.
- [ ] Booking and embed components render required fallback behavior when blocked/unavailable.

## Component State Coverage Template

Use this block per component:

- Component: `<name>`
- Route/section in showcase: `<path or anchor>`
- Required states:
  - [ ] default
  - [ ] hover and focus (if interactive)
  - [ ] mobile layout
  - [ ] empty/fallback (if data can be missing)
  - [ ] error/unavailable embed (if applicable)
- Result: `pass` or `fail`
- Notes:
  - `<issue, deviation, or confirmation>`

State coverage policy:

- All required states listed for each component in `docs/phase-3-component-inventory.md` are mandatory for Phase 3 sign-off.
- Optional states are not part of Phase 3 acceptance unless they are promoted to required in the inventory document.

## Sign-Off Record Template

- QA run date:
- Reviewed by:
- Components reviewed:
- Open issues:
- Migration exceptions raised:
- Ready for Phase 5 page usage: `yes` or `no`
