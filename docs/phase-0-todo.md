# Phase 0 TODO, Foundations and Guardrails

Purpose: complete the minimum setup needed before implementation work starts in Phase 2.

Status: Complete and approved (2026-03-22).

## Exit Criteria

Phase 0 is complete only when all items marked `P0` are done and approved:

- URL migration policy is documented and testable.
- Content model contract is defined and versioned.
- Definition of done exists for each phase with measurable checks.
- CI can run at least basic quality gates on every PR.

## Task Board

## P0, Must Complete in Phase 0

- [x] **P0-00 Review prior analysis before new planning outputs**
  - Owner: AI agent
  - Inputs:
    - `docs/existing-site-structure.md`
    - `docs/parser-plan.md`
  - Done when: Phase 0 deliverables explicitly reference reused findings and identify only true gaps for Phase 1 validation.

- [x] **P0-01 Create architecture decision record (ADR) template**
  - Owner: AI agent
  - Output: `docs/decisions/README.md` with ADR format and naming convention.
  - Done when: every major decision can be captured in a one-page ADR.

- [x] **P0-02 Define URL migration policy and redirect rules**
  - Owner: AI agent
  - Output: `docs/url-migration-policy.md`
  - Include:
    - Canonical format (trailing slash policy).
    - Redirect behavior for non-canonical variants.
    - Policy for query parameters and non-HTML endpoints.
  - Done when: policy supports generating deterministic redirect files later.

- [x] **P0-03 Create initial must-keep URL matrix schema**
  - Owner: AI agent
  - Output: `docs/url-matrix-schema.md`
  - Columns:
    - `source_url`, `canonical_url`, `lang`, `destination`, `page_type`, `status`, `redirect_type`, `notes`.
  - Done when: schema is ready for sitemap-derived data in Phase 1.

- [x] **P0-04 Define content model contract**
  - Owner: AI agent
  - Output: `docs/content-model.md`
  - Include:
    - Page frontmatter contract.
    - Shared data contracts (`nav`, `footer`, `seo`, `tracking`).
    - Component prop contracts for content-driven rendering.
    - Mapping from known Elementor widget families to target component contracts.
  - Done when: one sample page spec validates all required fields.

- [x] **P0-05 Define phase-level definition of done (DoD)**
  - Owner: AI agent
  - Output: `docs/definition-of-done.md`
  - Include measurable checks for:
    - Performance
    - SEO
    - Accessibility
    - Visual parity
    - Functional conversion path
  - Done when: each phase in `docs/grand-plan.md` has a matching DoD section.

- [x] **P0-06 Set up minimum CI checks for PR workflow**
  - Owner: AI agent
  - Output: CI workflow file (path depends on chosen stack later, start generic now).
  - Initial checks:
    - Markdown lint (docs quality).
    - Link check for internal docs links.
    - Basic build/lint placeholders to activate after stack choice in Phase 1.
  - Done when: PRs run automated checks and report pass/fail status.

- [x] **P0-07 Define consent and tracking guardrail requirements**
  - Owner: Gustaf + AI agent
  - Output: `docs/tracking-and-consent-requirements.md`
  - Include:
    - GTM implementation requirements.
    - Brevo implementation requirements.
    - Consent categories and which tags are allowed per category.
  - Done when: requirements are explicit enough to evaluate cookie platform options in Phase 1/6.

- [x] **P0-08 Establish migration exception log format**
  - Owner: AI agent
  - Output: `docs/migration-exceptions.md`
  - Include:
    - What counts as an exception.
    - Required fields (decision, rationale, SEO impact, approval).
  - Done when: any deviation from source parity can be recorded consistently.

- [x] **P0-09 Define design extraction methodology from all page/template CSS**
  - Owner: AI agent
  - Output: `docs/design-extraction-method.md`
  - Include:
    - CSS source scope across all relevant page and template stylesheets.
    - Rule to avoid single-file assumptions for design tokens.
    - Process for selecting which discovered patterns are kept in the new unified component system.
  - Done when: method can be used in Phase 1 to produce reproducible design token and component candidate outputs.

- [x] **P0-10 Build Phase 1 analysis schema from preliminary docs**
  - Owner: AI agent
  - Output: `docs/phase-1-analysis-schema.md`
  - Include structured tables for:
    - Header and footer variant registry.
    - Navigation variant coverage by language/context.
    - Widget coverage matrix by page.
    - Integration disposition (`keep`, `replace`, `remove`) and rationale.
  - Done when: schema is ready to be populated directly from `docs/existing-site-structure.md`, `docs/parser-plan.md`, and sitemap data.

## P1, Important but Can Spill into Early Phase 1

- [ ] **P1-01 Define first-wave Stockholm Swedish page order**
  - Owner: Gustaf + AI agent
  - Output: prioritized list in `docs/phase-1-analysis-checklist.md` (or equivalent).
  - Done when: sequence is approved before page migration starts.

- [ ] **P1-02 Draft destination and language IA options**
  - Owner: AI agent
  - Output: `docs/ia-language-destination-options.md`
  - Done when: future IA supports Stockholm/Berlin and language variants without URL rewrites.

- [ ] **P1-03 Draft KPI measurement map**
  - Owner: AI agent
  - Output: `docs/kpi-measurement-map.md`
  - Include:
    - Primary KPI: completed purchase.
    - Proxy events measurable on-site (CTA clicks, widget open/click-through).
  - Done when: GTM events are mapped to funnel stages.

## Working Rhythm

- Review cadence: weekly Phase 0 checkpoint.
- Approval rule: Gustaf approves each P0 document before task is marked done.
- Change control: any scope change is added to `docs/migration-exceptions.md`.
- Execution mode: one agent context per phase. Gustaf manually initializes each next phase after explicit completion approval.

## Immediate Next 3 Actions

1. Populate `docs/phase-1-analysis-schema.md` directly from `docs/existing-site-structure.md` and `docs/parser-plan.md`.
2. Build initial URL matrix data using `docs/url-matrix-schema.md` and `site-html/sitemap.xml`.
3. Record any unresolved migration decisions in `docs/migration-exceptions.md` and open ADRs in `docs/decisions/`.

## Phase 0 Completion Record

- Completed outputs:
  - `docs/decisions/README.md`
  - `docs/url-migration-policy.md`
  - `docs/url-matrix-schema.md`
  - `docs/content-model.md`
  - `docs/definition-of-done.md`
  - `docs/tracking-and-consent-requirements.md`
  - `docs/migration-exceptions.md`
  - `docs/design-extraction-method.md`
  - `docs/phase-1-analysis-schema.md`
  - `.github/workflows/ci.yml`
- Reused analysis baseline confirmed from:
  - `docs/existing-site-structure.md`
  - `docs/parser-plan.md`
