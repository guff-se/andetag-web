# Phase 1 TODO, Existing Site Analysis and Documentation

Purpose: complete source-backed analysis artifacts needed before implementation work in Phase 2.

Status: Complete and approved (2026-03-22).

## Exit Criteria

Phase 1 is complete only when all items marked `P1` are done and approved:

- URL coverage is fully mapped in analysis outputs or explicitly marked unknown with rationale.
- Variant, widget, and integration schemas are populated with source evidence.
- Gaps and unknowns are logged and triaged with phase targets.
- Static stack and hosting decision is documented and approved.

## Task Board

## P1, Must Complete in Phase 1

- [x] **P1-00 Validate baseline docs before extending analysis outputs**
  - Owner: AI agent
  - Inputs:
    - `docs/existing-site-structure.md`
    - `docs/parser-plan.md`
    - `docs/phase-1-analysis-schema.md`
  - Done when: all reused assumptions are confirmed or added to known gaps with evidence.

- [x] **P1-01 Build sitemap-derived must-keep URL matrix data**
  - Owner: AI agent
  - Inputs:
    - `site-html/sitemap.xml`
    - `docs/url-matrix-schema.md`
    - `docs/url-migration-policy.md`
  - Output: `docs/url-matrix.csv`.
  - Done when: every known HTML URL is represented and normalized according to policy.

- [x] **P1-02 Populate Phase 1 analysis schema tables**
  - Owner: AI agent
  - Input: `docs/phase-1-analysis-schema.md`
  - Include:
    - Header and footer variant registry.
    - Navigation variant coverage by language and destination context.
    - Widget coverage matrix by page.
    - Integration disposition matrix.
    - Known gaps and unknowns register.
  - Done when: all rows include source evidence fields and validation status values.

- [x] **P1-03 Document destination and language IA options**
  - Owner: AI agent
  - Output: `docs/ia-language-destination-options.md`
  - Include:
    - Stockholm and Berlin compatibility.
    - Language and destination selector behavior options.
    - URL contract impact per option.
  - Done when: one recommended IA direction is proposed with tradeoffs and no URL contract conflicts.

- [x] **P1-04 Produce design token and component evidence baseline**
  - Owner: AI agent
  - Inputs:
    - `docs/design-extraction-method.md`
    - Relevant CSS assets referenced by source pages/templates in `site-html/`
  - Output: `docs/phase-1-design-baseline.md`.
  - Done when: extracted evidence is reproducible from listed source files and includes coverage notes.

- [x] **P1-05 Define integration retention decisions with rationale**
  - Owner: AI agent
  - Inputs:
    - `docs/tracking-and-consent-requirements.md`
    - `docs/Andetag SEO Manual.md`
    - Phase 1 integration matrix rows
  - Done when: each integration is marked `keep`, `replace`, or `remove`, with business and compliance rationale.

- [x] **P1-06 Document static stack and hosting decision**
  - Owner: Gustaf + AI agent
  - Output: ADR under `docs/decisions/` plus decision references in planning docs.
  - Current status: accepted in `docs/decisions/0001-static-stack-selection.md`.
  - Done when: framework, hosting, and build-deploy constraints are approved and satisfy Phase 1 exit gate in `docs/grand-plan.md`.

- [x] **P1-07 Draft KPI measurement map for conversion tracking**
  - Owner: AI agent
  - Output: `docs/kpi-measurement-map.md`
  - Include:
    - Primary KPI (completed purchase) and supporting proxy events.
    - GTM event mapping by funnel stage.
    - Minimum validation approach for later implementation phases.
  - Done when: event taxonomy can be consumed directly during Phase 7 script and analytics implementation.

- [x] **P1-08 Open and resolve migration exceptions discovered in analysis**
  - Owner: AI agent
  - Input: `docs/migration-exceptions.md`
  - Done when: every unresolved high-impact gap has an exception entry or a linked ADR path.

## P2, Important but Can Spill into Early Phase 2

- [ ] **P2-01 Define first-wave Stockholm Swedish migration order**
  - Owner: Gustaf + AI agent
  - Output: prioritized page sequence in the Phase 2 execution checklist (`docs/phase-2-todo.md`).
  - Done when: page order is approved before Phase 5 migration starts.

- [ ] **P2-02 Capture accessibility risk notes from source analysis**
  - Owner: AI agent
  - Output: accessibility risk notes attached to gaps register or exception log.
  - Done when: known high-risk patterns are visible before component implementation begins.

## Working Rhythm

- Review cadence: weekly Phase 1 checkpoint.
- Approval rule: Gustaf approves each `P1` completion before the item is checked.
- Clarification rule: ask clarifying questions immediately when scope, source evidence, acceptance criteria, or ownership is ambiguous.
- Change control: any source parity deviation is logged in `docs/migration-exceptions.md`.
- Decision logging: architecture and platform decisions are captured as ADRs in `docs/decisions/`.

## Immediate Next 3 Actions

1. Start Phase 2 layout architecture using Astro project conventions and Cloudflare deployment constraints.
2. Implement CookieYes consent category mapping and GTM Consent Mode v2 behavior in staging.
3. Define first-wave Stockholm Swedish migration order in the Phase 2 execution checklist.

## Phase Closure Forward Audit Record

Date: 2026-03-22

Future-phase impact review completed for Phases 2 through 7:

- Platform dependency sync: Astro + Cloudflare references confirmed in planning docs.
- Consent dependency sync: CookieYes acceptance propagated to roadmap and analysis schema.
- URL policy dependency sync: alias approval (`/en/berlin-en/` to `/en/berlin/`) reflected and moved to implementation test action.
- Remaining carried-forward work is explicitly tracked in later phases (`GAP-002`, `GAP-004`, and Phase 7 consent validation tasks).
