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

### Deprecated

- None.

### Removed

- None.

### Fixed

- None.

### Security

- None.
