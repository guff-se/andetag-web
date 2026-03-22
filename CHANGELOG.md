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
- Added `docs/phase-2-todo.md` with a Phase 2 task board, exit criteria, and clarification queue, so shared layout implementation can start with explicit variant, SEO, accessibility, and approval checkpoints.
- Added `site/` Astro implementation workspace with Phase 2 shared layout foundation (header/footer components, layout model modules, and preview pages), so shared navigation and metadata behavior can be validated before page migration.
- Added Phase 2 layout test coverage in `site/src/lib/layout/*.test.ts`, so variant mapping, selector behavior, and canonical/hreflang hooks are regression-tested.

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
- Updated `docs/grand-plan.md` and `AGENTS.md` to reference `docs/phase-2-todo.md`, so the Phase 2 execution checklist is discoverable in both roadmap and agent guidance.
- Updated `docs/phase-2-todo.md` and `docs/grand-plan.md` with resolved Phase 2 kickoff decisions (Astro workspace path, responsive baseline, and separate destination/language selectors), so layout implementation can begin without clarification blockers.
- Updated `docs/phase-2-todo.md` and `docs/grand-plan.md` with an explicit mobile-first browser QA matrix (iOS Safari and Chrome on iOS, plus desktop Chrome, Safari, and Firefox), so Phase 2 layout sign-off criteria are concrete and testable.
- Updated `docs/phase-2-todo.md` and `docs/grand-plan.md` to remove desktop Firefox from the Phase 2 QA browser matrix, so sign-off scope matches the current testing policy.
- Updated `docs/phase-2-todo.md` to use repository root (`./`) as the Astro workspace path instead of `apps/site/`, so project structure stays aligned to a single-site repository.
- Updated `docs/phase-2-todo.md` to use `site/` as the Astro workspace path instead of repository root, so deployable app code stays isolated from docs and source-artifact folders.
- Updated `docs/grand-plan.md`, `docs/definition-of-done.md`, and `docs/phase-1-todo.md` to align Phase 2 references with current decisions (desktop/tablet + mobile parity language, mobile-first browser QA matrix, and `docs/phase-2-todo.md` path), so planning docs stay consistent before implementation starts.
- Updated `docs/phase-2-todo.md`, `docs/phase-1-analysis-schema.md`, `docs/migration-exceptions.md`, and `docs/grand-plan.md` to reflect in-progress Phase 2 implementation, including GAP-002 resolution via EX-0005 and current completion state.
- Updated `.gitignore` with `site/` build and dependency artifacts, so the new Astro workspace does not pollute repository tracking with generated files.
- Renamed the Swedish hero layout module from `swedish-hero` to `hero-sv` and documented locale suffix rules in `AGENTS.md` and `docs/phase-2-todo.md`, so language-specific source files follow one consistent `-sv`/`-en`/`-de` convention.
- Updated migration governance docs (`AGENTS.md`, `docs/grand-plan.md`, `docs/url-migration-policy.md`, `docs/phase-2-todo.md`, `docs/definition-of-done.md`) with a strict self-hosted asset policy, so the rebuilt site never depends on absolute old-site internal JS/CSS/media URLs.
- Localized Swedish hero media references to Astro-hosted root-relative paths and added `site/src/lib/layout/assets.ts` plus `assets.test.ts`, so current header implementation enforces local internal asset usage with regression coverage.
- Added a local font sync pipeline (`site/scripts/sync-fonts.mjs`, `site/src/lib/fonts/sources.json`, `site/src/styles/fonts.css`, `npm run fonts:sync`) and wired hero/menu typography to local `Jost` assets, so menu rendering matches source typography without remote font dependencies.
- Updated `site/README.md`, `docs/design-extraction-method.md`, and `AGENTS.md` with a repeatable font localization workflow, so additional required fonts can be downloaded and regenerated deterministically.
- Fixed the font sync pipeline to preserve both `latin-ext` and `latin` subsets with `unicode-range` declarations per weight/style, so local `Jost` rendering no longer falls back due to incomplete glyph coverage.
- Implemented a dedicated Swedish footer variant imitation (`footer-207`) using source-backed section structure, SEO link row, legal row, and social icon treatment in `SiteFooter.astro` plus `footer-sv.ts`, so the rebuilt footer mirrors the original `index.html` footer layout while keeping internal links local.
- Renamed shared header and footer CSS/DOM selectors from language-prefixed `sv-*` names to design-scoped `shared-*` names, so layout styling is reusable across all languages without implying language-specific design coupling.
- Added an explicit universal-design rule to `AGENTS.md`, `docs/grand-plan.md`, and `docs/phase-2-todo.md`, so language-specific behavior is limited to content and variant selection while core design styles remain shared by default.
- Updated `hero-sv` mobile behavior to imitate source sticky hamburger navigation with a dedicated mobile menu shell and expandable submenu groups, so phone layout now follows the original separate mobile menu pattern instead of desktop-style menu wrapping.
- Added `header-small-sv` implementation path for `header-2223` in `SiteHeader.astro`, using local static background assets and no hero CTA (source template: `stockholm-art-yoga`), plus a dedicated preview route at `/header-small-sv/` for direct visual QA.
- Added a Phase 2 implementation-insights retrospective to `docs/phase-2-todo.md`, `docs/grand-plan.md`, and `AGENTS.md`, so the header/footer parity workflow (shared design naming, mobile-first interaction parity, sticky threshold method, local asset-first tuning, and variant preview routes) is reusable in future phases.
- Updated `docs/grand-plan.md` and `docs/phase-2-todo.md` to defer localized header implementation until the Swedish site header baseline is working and approved, so header rollout order matches the Swedish-first execution strategy.
- Updated `docs/grand-plan.md` and `docs/phase-2-todo.md` to defer all localization work, including header and page-content localization, until Swedish content migration is completed and approved through Phase 5, so sequencing is explicit and consistent across implementation phases.
- Updated planning and quality docs (`docs/grand-plan.md`, `docs/definition-of-done.md`, and downstream phase-reference docs) plus `AGENTS.md` to insert a dedicated Phase 6 localization rollout and move scripts/consent/analytics launch hardening to Phase 7, so Phase 5 remains a clean Swedish-only implementation milestone.
- Updated shared layout accessibility in `site/src/layouts/SiteLayout.astro`, `site/src/components/layout/SiteHeader.astro`, and `site/src/styles/layout.css` with skip-to-main support, visible keyboard focus states, and mobile menu focus management, and marked `P2-05` complete in `docs/phase-2-todo.md`, so Phase 2 accessibility criteria are satisfied at layout level.
- Marked `P2-06` complete in `docs/phase-2-todo.md` after visual approval and non-visual checks, confirming Swedish header/footer link targets against `site-html/index.html` and confirming no absolute old-site media/CSS/JS asset URL dependencies in `site/src/` layout code.
- Completed `P2-07` carry-forward updates by marking Phase 2 complete pending sign-off in `docs/phase-2-todo.md`, updating `docs/grand-plan.md` with Phase 2 outcomes and post-Phase-2 next steps, and closing EX-0005 follow-up language in `docs/migration-exceptions.md`, so Phase 3 can begin without shared-layout documentation blockers.

### Deprecated

- None.

### Removed

- None.

### Fixed

- Updated `spider.py` crawl startup to remove existing `site-html/` and `site-md/` directories before creating fresh outputs, so reruns rebuild the mirror from scratch instead of creating duplicate `-1`, `-2` files.

### Security

- None.
