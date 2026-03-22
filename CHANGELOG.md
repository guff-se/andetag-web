# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial changelog setup aligned with repository AI changelog standards.
- Added `docs/url-migration-policy.md` with canonical domain, trailing slash, alias redirects, SEO landing page handling, and sitemap rules.
- Added `docs/decisions/README.md` to standardize ADR naming and one-page decision capture, so major migration choices can be approved and traced.
- Added `docs/url-matrix-schema.md` to define Phase 1 must-keep URL matrix columns and validation rules, so redirect planning can be deterministic.
- Added `docs/content-model.md` contract v1.0.0 for page frontmatter, shared data, and component props, so parser outputs and rendering inputs stay versioned.
- Added `docs/definition-of-done.md` with measurable quality gates for Phases 0 through 6, so phase exits are verifiable.
- Added `docs/tracking-and-consent-requirements.md` defining GTM, Brevo, and category-based consent requirements, so tool selection in later phases is evaluable.
- Added `docs/migration-exceptions.md` log template and approval fields, so migration deviations can be documented consistently.
- Added `docs/design-extraction-method.md` with multi-source CSS extraction method, so token and component analysis is reproducible.
- Added `docs/phase-1-analysis-schema.md` table schema for variants, widgets, and integrations, so existing analysis can be populated without rework.
- Added `.github/workflows/ci.yml` with markdown lint, docs link checks, and stack-check placeholder job, so pull requests have baseline automated quality gates.
- Added `docs/phase-1-todo.md` with a source-backed Phase 1 task board and exit criteria, so analysis work can be tracked to a clear readiness gate before Phase 2.
- Added `docs/url-matrix.csv` populated from `site-html/sitemap.xml` and URL policy aliases, so must-keep route coverage is executable and reviewable.
- Added `docs/ia-language-destination-options.md` with IA option tradeoffs and recommendation, so Phase 1 can close route architecture ambiguity before Phase 2.
- Added `docs/phase-1-design-baseline.md` with reproducible CSS token and component evidence, so design system work starts from source-backed inputs.
- Added `docs/kpi-measurement-map.md` with funnel event taxonomy and GTM requirements, so conversion tracking scope is implementation-ready for later phases.
- Added `docs/decisions/0001-static-stack-selection.md` as the proposed Phase 1 stack and hosting ADR, so exit-gate decisions are captured in decision-log format.
- Added `docs/decisions/0002-consent-platform-selection.md` to document deferred consent platform selection with guardrails, so the open gap has an explicit decision path.

### Changed

- Added documentation governance and planning docs for migration roadmap and Phase 0 execution.
- Integrated preliminary analysis docs into planning by adding source-backed Phase 1 manifests and new Phase 0 tasks for design extraction and analysis schema.
- Clarified parser planning so design token extraction uses all relevant page and template CSS sources, not a single-file assumption.
- Updated `AGENTS.md` documentation overview to include the new URL migration policy doc.
- Added explicit Phase 0 and Phase 1 notes to reuse prior analysis from `docs/existing-site-structure.md` and `docs/parser-plan.md` before extending new documentation.
- Finalized URL normalization policy to 301-redirect uppercase paths to lowercase and normalize percent-encoded path variants to canonical form.
- Expanded `docs/url-migration-policy.md` with explicit query parameter and non-HTML endpoint policy, so canonical scope and redirect behavior are unambiguous.
- Aligned URL policy and URL matrix terminology by standardizing matrix fields to `status`, `redirect_type`, and `notes`, so policy and schema can be consumed without field-name drift.
- Updated `docs/phase-0-todo.md` by marking P0 deliverables complete and recording created outputs and reused analysis inputs.
- Updated `AGENTS.md` documentation overview and code layout references to include all new Phase 0 docs and CI workflow location.
- Updated `docs/definition-of-done.md` with explicit state-of-the-art thresholds (CWV and Lighthouse targets), so phase exits are measurable instead of subjective.
- Updated `.github/workflows/ci.yml` to run on pushes to `main` only in pre-1.0 workflow, so automation matches current delivery process.
- Updated `docs/tracking-and-consent-requirements.md` to keep legal and consent requirements unified across markets pre-launch, so consent implementation scope stays simple.
- Updated `docs/url-migration-policy.md` to enforce trailing slash normalization only for HTML content routes, so file endpoints are not incorrectly rewritten.
- Marked Phase 0 as complete in `docs/phase-0-todo.md` and `docs/grand-plan.md`, so project phase status is explicit before moving to a new agent context.
- Updated `docs/grand-plan.md` and `AGENTS.md` to reference `docs/phase-1-todo.md`, so the Phase 1 execution checklist is discoverable in both roadmap and agent guidance.
- Updated `docs/phase-1-todo.md` working rhythm to require immediate clarifying questions for ambiguity, so Phase 1 execution can avoid assumption drift.
- Updated `docs/phase-1-analysis-schema.md` from placeholder rows to source-backed variant, widget, integration, and gap tables, so Phase 1 analysis is populated rather than skeletal.
- Updated `docs/migration-exceptions.md` with active Phase 1 exception entries for integration and URL parity decisions, so deviations can be approved explicitly before implementation.
- Updated `docs/migration-exceptions.md` to mark TripAdvisor and WonderPush removals as approved decisions, so Phase 1 integration disposition is explicit.
- Updated `docs/phase-1-todo.md` task statuses and outputs to reflect completed Phase 1 analysis artifacts and open decision dependencies.
- Updated `AGENTS.md` documentation overview to include new Phase 1 IA, KPI, and design baseline documents, so reference guidance remains coherent.
- Updated `docs/decisions/0001-static-stack-selection.md` from `Proposed` to `Accepted` for Astro and Cloudflare Pages, so the Phase 1 platform exit gate is formally closed.
- Updated `docs/phase-1-todo.md` and `docs/grand-plan.md` to mark Phase 1 as complete and approved, so planning state now matches the accepted platform decision.
- Updated `docs/grand-plan.md` practical next steps and platform decision wording to reflect post-Phase 1 state, so upcoming work starts directly at Phase 2 dependencies.
- Updated `docs/phase-1-analysis-schema.md` gap statuses and target phases to carry unresolved items into Phases 2, 4, and 6, so phase ownership is explicit after Phase 1 closure.
- Updated `docs/migration-exceptions.md` and `docs/phase-1-analysis-schema.md` to mark EX-0004 approved and close the corresponding canonical alias gap, so URL exception status matches approved migration policy.
- Updated `docs/decisions/0002-consent-platform-selection.md` with a short weighted decision matrix and recommendation, so consent platform approval can be made in one review pass.
- Updated `docs/decisions/0002-consent-platform-selection.md` decision matrix to include relative cost of ownership scoring and revised weighted totals, so platform tradeoffs include budget impact alongside compliance and implementation factors.
- Updated `docs/decisions/0002-consent-platform-selection.md` to add Google Ads and Consent Mode v2 readiness weighting, so consent platform ranking now reflects ad-dependent operating requirements.
- Updated `docs/decisions/0002-consent-platform-selection.md` with an explicit cost snapshot table and source links, so matrix cost scoring is grounded in concrete plan pricing assumptions.
- Updated `docs/decisions/0002-consent-platform-selection.md` to re-score the custom option under AI-assisted implementation assumptions, so platform comparison reflects reduced engineering overhead while preserving legal and audit risk considerations.
- Updated `docs/decisions/0002-consent-platform-selection.md` with three lower-cost alternatives (CookieYes, Termly, CookieScript) and Ads-focused reliability notes, so options below iubenda baseline are explicitly documented for decision-making.
- Updated the main weighted decision matrix in `docs/decisions/0002-consent-platform-selection.md` to include CookieYes, Termly, and CookieScript directly, so all alternatives are compared in one unified scoring table.
- Updated `docs/decisions/0002-consent-platform-selection.md` from `Proposed` to `Accepted` with CookieYes as the selected consent platform, so consent architecture is now fixed ahead of Phase 6 implementation.
- Updated `docs/grand-plan.md`, `docs/phase-1-analysis-schema.md`, and `docs/phase-1-todo.md` to reflect CookieYes as the resolved replacement for Complianz and to shift next actions from selection to staging validation.
- Updated `AGENTS.md` with a mandatory phase-closure forward audit rule, so each completed phase now triggers a review and synchronization pass across all future phases before final closure.
- Updated `docs/phase-1-todo.md` with a formal Phase 1 forward-audit record and refreshed dependent docs (`docs/phase-1-design-baseline.md`, `docs/ia-language-destination-options.md`, `docs/kpi-measurement-map.md`, `docs/decisions/0002-consent-platform-selection.md`) to remove stale deferred-decision wording.
- Updated `docs/tracking-and-consent-requirements.md`, `docs/kpi-measurement-map.md`, and `docs/grand-plan.md` to classify Understory as `necessary`, so the booking widget remains unblocked by optional consent categories.

### Deprecated

- None.

### Removed

- None.

### Fixed

- None.

### Security

- None.
