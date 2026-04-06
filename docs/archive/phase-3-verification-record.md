# Phase 3 Verification and Approval Record

Purpose: capture `P3-08` verification evidence and stakeholder sign-off for the component library and the historical internal verification route **`/component-showcase/`** (removed from the Astro workspace after sign-off on 2026-03-23; this document remains the audit trail).

## Sign-off

| Field | Value |
|-------|--------|
| Phase | 3 |
| Route | `/component-showcase/` (retired) |
| Stakeholder approval | Gustaf (2026-03-22), consolidated showcase pass |
| Record date | 2026-03-22 |

## Lighthouse (mobile form factor, CLI)

Run against local static preview after `npm run build` in `site/`, URL `http://127.0.0.1:<port>/component-showcase/`, categories performance and accessibility only.

| Run | Performance | Accessibility | Notes |
|-----|-------------|---------------|--------|
| Initial (pre a11y fixes) | 56 | 90 | Baseline before contrast, link, and target-size fixes |
| After layout and component CSS fixes (2026-03-22) | 74 | 100 | See `CHANGELOG.md` Unreleased |

**Accessibility:** Meets `docs/definition-of-done.md` Phase 3 gate (Accessibility at least 95).

**Performance:** Below the Phase 3 DoD target of 90 for this route. Rationale and approved deviation: `EX-0006` in `docs/migration-exceptions.md`. Follow-up: lazy or consent-gated embed loading on migrated pages in later phases.

## Manual and structural checks (`docs/phase-3-component-qa-checklist.md`)

Consolidated pass (2026-03-22):

- **Responsive:** Showcase layout reviewed at mobile, tablet, and desktop widths; full-width components (gallery, testimonial, heroes) checked for overflow and tap targets.
- **Keyboard:** Skip link, header nav and mobile menu, accordion **`AccordionSection`** **`button.accordion-item-toggle`**, testimonial prev/next `button`s, gallery lightbox triggers, embed fallbacks, and footer links are focusable; focus ring uses shared `--component-focus` / layout outline rules.
- **Screen readers:** Landmark `main`, heading hierarchy in demos, `aria-live` on testimonial viewport, `aria-hidden` on carousel slides, `aria-label` on icon-only controls where implemented; embeds use titles or fallback copy when unavailable.
- **CTAs and links:** Demo destinations use root-relative Stockholm paths consistent with fixture intent; external links use `rel` where applicable via components.

Residual risk: third-party iframe content (maps, video hosts, Understory, Brevo) is not fully controllable for a11y inside the iframe; fallbacks are documented in `docs/phase-3-component-usage.md`.

## Carry-forward

See `P3-09` completion in `docs/phase-3-todo.md` and `docs/grand-plan.md` Phase 3 status.
