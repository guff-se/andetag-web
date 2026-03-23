# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- Swedish small-header **preview route** (`site/src/pages/preview/header-small-sv.astro`, URLs **`/preview/header-small-sv/`** and legacy **`/header-small-sv/`** redirect): Phase 4 parity is complete; the **`header-2223`** shell remains on real pages (for example **`/privacy/`**) via **`lib/layout/header-small-sv.ts`** and **`SiteHeader.astro`**. **`AGENTS.md`** now requires **phase closure cleanup** of temporary preview or auditing-only routes. **Why:** avoid shipping QA-only URLs after a phase is closed.
- **`site/public/images/brand/og-default.png`** (and matching **`site/dist/...`** build artifact): unused asset; no **`og:image`** wiring in **`site/src`** yet. Reintroduce under **`site/public/`** when Phase 7 implements sharing metadata per **`docs/content-model.md`**.
- Phase 2 **`/layout-preview/`** grid page and `site/src/data/layout-examples.ts` (only consumer): Phase 4 matrix shells supersede the multi-variant snapshot page. Dropped preview-only layout CSS (`.variant-grid`, `.variant-card`). **`docs/phase-4-route-coverage.md`** and **`docs/phase-2-todo.md`** note the retirement.
- Phase 3 internal **`/component-showcase/`** route and its demo data (`site/src/pages/component-showcase.astro`, `site/src/data/component-showcase.ts`, tests): consolidated sign-off is complete, so the page is retired. Showcase-only CSS (`body.theme-pink`, `.component-showcase`, `.component-demo`, showcase tokens) removed from `site/src/styles/components.css`. Planning docs now describe the route as historical where relevant; **`docs/phase-3-verification-record.md`** remains the evidence record.

### Changed

- **EN or DE small header:** brand link uses **`model.brandHomeHref`** (**`/en/`**, **`/en/berlin/`**, **`/de/berlin/`**, or **`/sv/stockholm/`** for Swedish small header such as **`/privacy/`**) instead of **`/`**, avoiding an extra hop through the root redirect. **`getBrandHomeHref`** in **`site/src/lib/layout/navigation.ts`**, wired in **`createPageLayoutModel`**. **Why:** keep language or destination home in one click.
- **`docs/phase-4-redirect-tests.md`:** cases **6–10** documented with **`_redirects`** rule table, execution log row, and note that **`andetag-web.guff.workers.dev`** did not return **`301`** on **`HEAD`** for legacy Swedish paths (re-check on Cloudflare Pages after publish).
- **Swedish URLs:** canonical paths use explicit **`/sv/`** (**`/sv/stockholm/...`**, **`/sv/musik/`**, **`/sv/om-andetag/`**, and so on). Legacy unprefixed URLs (**`/`**, **`/stockholm/...`**, old shared paths) **`301`** to those canonicals via **`docs/url-matrix.csv`** (redirect + keep rows) and **`site/public/_redirects`**. **`site/`:** `page-shell-registry.ts`, Swedish nav or footer or hero data, **`index.astro`** → **`/sv/stockholm/`**, **`extract-page-shell-meta.mjs`**, regenerated **`page-shell-meta.json`**. **Docs:** `docs/url-migration-policy.md`, `docs/ia-language-destination-options.md`, `docs/phase-4-route-coverage.md`, `docs/phase-4-redirect-tests.md`, `docs/phase-4-404.md`, `docs/phase-4-routing-reopen.md`, `docs/phase-5-todo.md` (first-wave paths), `docs/url-matrix-schema.md`, `docs/content-model.md`, `docs/phase-4-verification-record.md`, `docs/migration-exceptions.md` (EX-0007 wording), **`docs/Andetag SEO Manual.md`** (section 3 URL architecture, hreflang example, inventory, menu, root behavior). **Why:** align all locales behind a language prefix and consolidate inbound links on **`/sv/...`** per agreed SEO or IA direction.
- `docs/phase-5-todo.md`: **Design approval gate** and **component-first change rule** (unchanged scope aside from **`/sv/`** path literals above).
- `site/src/styles/layout.css`: default `:root` page background is brand pink (`#f7dcea`) with dark body text; fallback `header-root` and `footer-root` contrast adjusted so non-showcase routes no longer ship a near-black body from `--color-bg`.
- `.github/workflows/ci.yml`: removed **markdownlint** job (MD013 line-length and other style rules); docs **link check** (lychee) and **Astro** build or test jobs unchanged.
- Phase 4 marked **complete** with stakeholder sign-off (2026-03-23): `docs/phase-4-todo.md`, `docs/phase-4-verification-record.md`, `docs/grand-plan.md`; **EX-0007** approved as accepted Phase 4 shell deviation until Phase 5 migrates `/en/stockholm/`.
- Phase 7 planning: expanded `docs/grand-plan.md` and `docs/definition-of-done.md` with favicon, Open Graph and sharing tag decisions, and schema.org JSON-LD aligned to the SEO manual.

### Added

- `docs/phase-5-todo.md`: Phase 5 execution checklist (Swedish Stockholm migration waves, `/en/` hub and `/sv/stockholm/` content, entry Worker staging or production enable, verification record); indexed from `AGENTS.md`; linked from `docs/grand-plan.md`.
- `docs/phase-7-todo.md`: Phase 7 execution checklist (favicon, sharing metadata, JSON-LD, scripts, consent, sitemap, sign-off); indexed from `AGENTS.md`.
- `docs/phase-4-routing-reopen.md`: working notes for revisiting Phase 4 routing (Stockholm sv/en, Berlin de/en, page parity, global pages and navigation); linked from `docs/phase-4-todo.md` and `docs/grand-plan.md`. Expanded with proposed `/en/` hub plus preference cookie (edge vs client options) and `sv`/`de` default destinations. **Updated:** normative **`andetag_entry`** cookie, **`/`** `Accept-Language` funnel, **`/en/`** hub rules, and bot handling live in `docs/url-migration-policy.md`; **`necessary`** consent in `docs/tracking-and-consent-requirements.md`.
- `docs/url-migration-policy.md`: clarify **`/`** is not a city chooser; **humans** with **missing or empty `Accept-Language`** default to **`/en/`**; **verified bots** on **`/`** (and **`/en/`** per tests) **`302`** to **`/en/stockholm/`** for a full location page instead of the hub.
- `docs/grand-plan.md`: **Entry routing and URL expansion schedule** (Phase 5 early through Phase 7) for Worker, **`/sv/stockholm/`**, hub, parity, CookieYes cookie listing, and sitemap or SEO manual updates.
- `docs/phase-4-routing-reopen.md`: **Phase 4 implementation delta** table (what stays vs what changes when entry routing ships).
- `docs/phase-4-todo.md`: status **complete and closed**; follow-up routing explicitly **not** a Phase 4 reopen (Phases 5–7 per `docs/grand-plan.md`).
- `AGENTS.md` and `docs/grand-plan.md`: **Routing and entry URLs** reminder to read `docs/phase-4-routing-reopen.md` before Phase 5+ routing or Worker changes.
- `docs/phase-4-404.md` and `docs/phase-4-verification-record.md` for Phase 4 documentation and sign-off tracking.
- `site/src/lib/routes/url-matrix-parity.test.ts`: CI regression that `docs/url-matrix.csv` `keep` paths match `PAGE_SHELL_PATHS`.
- Phase 4 static routing: `site/src/pages/index.astro`, `[...slug].astro`, and `404.astro` with layout shells for all `keep` URLs in `docs/url-matrix.csv`, metadata from `site/src/data/page-shell-meta.json` (generated by `site/scripts/extract-page-shell-meta.mjs` from `site-html/`), and hreflang plus `x-default` via `site/src/lib/routes/page-shell-registry.ts` and updated `site/src/lib/layout/seo.ts` (BCP47 attribute mapping).
- `site/public/_redirects` for `/de/` → `/de/berlin/`, `/en/berlin-en/` → `/en/berlin/`, `/en/stockholm/art-yoga-en/` → `/en/stockholm/art-yoga/`, and `/privacy-policy/` → `/privacy/`.
- `docs/phase-4-route-coverage.md`, `docs/phase-4-redirect-tests.md`, and **EX-0007** in `docs/migration-exceptions.md` for `/en/stockholm/` shell metadata sourcing.
- `site/src/lib/routes/page-shell-registry.test.ts` for registry coverage.
- `site/package.json` script `page-shell:meta` to regenerate `page-shell-meta.json` after `site-html/` updates.

### Changed

- `.github/workflows/ci.yml`: run `npm ci`, `npm test`, and `npm run build` in `site/` (replaces stack placeholder job).
- `docs/content-model.md`: document optional `xDefaultPath` for static layout and Phase 4 hreflang behavior.
- `docs/migration-exceptions.md` **EX-0007**: note live `/en/stockholm/` reproduces wrong Yoast metadata.
- `site/astro.config.mjs`: `trailingSlash: "always"` for canonical path parity with `docs/url-migration-policy.md`.
- `site/src/layouts/SiteLayout.astro`: optional `description` and `xDefaultPath`; `createPageLayoutModel` now passes `xDefaultPath` into hreflang generation.
- `site/src/data/layout-examples.ts` and layout fixtures/tests updated for `xDefaultPath` and BCP47 hreflang attributes.
- `docs/url-matrix.csv`: added explicit `keep` row for `https://www.andetag.museum/en/berlin/`.
- Phase 4 planning: recorded stakeholder decisions (layout plus metadata only, redirect ownership, trailing slash and matrix authority, hreflang and 404 defaults, sitemap deferred to Phase 7) in `docs/phase-4-todo.md`; aligned `docs/grand-plan.md` Phase 4 deliverables and Phase 7 sitemap or robots deliverables.
- Phase 2: recorded final stakeholder sign-off in `docs/phase-2-todo.md`, updated `docs/grand-plan.md` Phase 2 status, marked spillover checklist items as completed via Phase 3 deliverables, and refreshed Phase 2 immediate next actions.
- Documentation: Phase 3 marked closed in planning flow; `docs/grand-plan.md` practical next steps now point at Phase 4 onward; `docs/phase-4-todo.md` lists Phase 3 prerequisites for implementers.
- Partners logo grid: at `640px` viewport width and below, use two columns so pairs of logos wrap into rows (`site/src/styles/components.css`).
- `docs/phase-4-redirect-tests.md`: recorded passing `curl` verification for all matrix redirects on `https://andetag-web.guff.workers.dev/`; `docs/phase-4-todo.md` marks `P4-07` complete.
- `docs/phase-4-redirect-tests.md`: case 5 (`/privacy-policy/` → `/privacy/`) verified on Workers after deploy; `docs/phase-4-verification-record.md` updated.

### Fixed

- Cloudflare deploy: added `site/wrangler.jsonc` with `assets.directory` set to `./dist` so `npx wrangler deploy` from `site/` has a static asset root (fixes “Missing entry-point to Worker script or to assets directory” after a successful `astro build`).
- Component showcase: removed root horizontal padding so full-bleed blocks (hero, gallery, testimonials, frameless video) align to the viewport on narrow screens; gutters apply only to inset demo content (`site/src/styles/components.css`).

### Added

- Added `docs/phase-4-todo.md` with Phase 4 task board, exit criteria, and clarification queue for routing, redirects, canonical or hreflang behavior, and URL coverage reporting before Phase 5 migration.
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
- Added `docs/phase-3-todo.md` with a Phase 3 task board, exit criteria, and component showcase approval gates, so component-library work has a deterministic execution checklist before route and page migration.
- Added `docs/phase-3-component-qa-checklist.md` as a reusable Phase 3 verification template, so component and showcase QA runs follow one consistent sign-off workflow.
- Added `docs/phase-3-fixture-strategy.md` plus `site/src/lib/layout/fixtures.ts`, so nav/footer and layout-model regression checks now use deterministic fixture inputs.
- Added `docs/phase-3-component-inventory.md` as a source-backed draft inventory with proposed prop contracts, so component API confirmation can happen before implementation begins.
- Added `docs/phase-3-component-usage.md` as an implementation-facing reference for approved Phase 3 components and embeds, so page migration work can reuse component contracts without reverse engineering.
- Added Phase 3 reusable component implementation under `site/src/components/` and shared styling in `site/src/styles/components.css`, so approved component contracts are now represented by concrete Astro primitives.
- Added `site/src/pages/component-showcase.astro` with source-backed demo data in `site/src/data/component-showcase.ts`, so all required component states can be reviewed in one consolidated sign-off route.
- Added `site/src/lib/components/understory.ts` plus `understory.test.ts`, so Understory widget script/class/data-attribute wiring is validated by regression tests.
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
- Updated `AGENTS.md` and `docs/grand-plan.md` to reference `docs/phase-3-todo.md`, so the Phase 3 execution checklist is discoverable in both roadmap and agent guidance.
- Updated `docs/phase-3-todo.md` status tracking for `P3-01` and `P3-02`, including delivered outputs and fixture wiring evidence.
- Updated `docs/phase-3-component-inventory.md` to approved status with explicit heading hierarchy standards, link appearance contract rules, and a reusable ANDETAG wordmark style baseline, so component implementation preserves semantic structure and brand consistency.
- Updated `docs/phase-3-component-inventory.md` and `docs/phase-3-todo.md` to include a source-backed `PartnersSection` component for the front-page `Våra partners` logo/link block, so partner branding and outbound links are implemented as reusable component behavior instead of page-local markup.
- Updated `docs/phase-3-todo.md` and `docs/phase-3-component-qa-checklist.md` to reflect `P3-03` approval and add heading/link/brand QA checks, so Phase 3 verification includes typography and wordmark consistency gates.
- Updated Phase 3 execution policy in `docs/phase-3-todo.md`, `docs/phase-3-component-qa-checklist.md`, and `docs/phase-3-component-inventory.md` to resolve `CQ-01` and `CQ-02`, set `/component-showcase/` as the review route, and enforce one consolidated showcase sign-off after all required component states are implemented, so approval and QA flow remain simple and deterministic.
- Updated `site/src/layouts/SiteLayout.astro` to support optional robots meta and applied `noindex,nofollow` on `/component-showcase/`, so internal review routes stay out of indexable production surfaces.
- Updated `docs/phase-3-todo.md` to mark `P3-04` through `P3-07` complete with file-level implementation evidence, so Phase 3 now advances to consolidated showcase sign-off.
- Updated `site/src/components/embeds/BookingEmbed.astro` to render the official Understory embed snippet (script + `.understory-booking-widget` container with `data-company-id` and `data-language`), so the booking integration matches source implementation expectations.
- Updated `site/src/components/embeds/WaitlistFormEmbed.astro` to use the provided Brevo embed structure (custom sib styles, hosted Brevo stylesheet, form markup, and hidden locale fields) while preserving fallback mode for showcase QA, so waitlist integration now mirrors the approved embed implementation.
- Updated showcase presentation styles in `site/src/styles/components.css` and enabled full-width showcase layout in `site/src/layouts/SiteLayout.astro` plus `site/src/pages/component-showcase.astro`, so `/component-showcase/` now follows the light pink background, dark text, full-width colored section, unified accordion container, and borderless full-width video behavior requested in review.
- Updated `site/src/data/component-showcase.ts` to use stable local SVG showcase media, and added gallery and partner assets under `site/public/wp-content/uploads/2026/03/`, so gallery and partner visuals render reliably without broken image placeholders in the sign-off page.
- Updated Phase 3 scope and showcase implementation to remove the standalone `SocialLinks` component (`site/src/components/content/SocialLinks.astro` deleted), so social links remain owned by already-implemented header and footer surfaces only.
- Updated `PartnersSection` showcase data and styling to match `site-html/index.html` partner block with the same eight partner links and source logo assets localized under `site/public/wp-content/uploads/2024/11` and `site/public/wp-content/uploads/2024/12`, so partner presentation now follows source parity expectations.
- Updated gallery implementation to source parity by localizing the exact eight `site-html/index.html` gallery photos, rendering them as a full-width 4x2 grid with hover overlay, and adding click lightbox interaction via `glightbox` (`site/src/components/content/GallerySection.astro`, `site/src/data/component-showcase.ts`, `site/src/styles/components.css`), so showcase gallery behavior now matches the requested layout and interaction model.
- Updated gallery edge-spacing and lightbox implementation in `site/src/components/content/GallerySection.astro` and `site/src/styles/components.css` to enforce equal 10px left/right and inter-image spacing, and switched click popup behavior to a jQuery-based lightbox overlay, so gallery interaction now matches requested spacing and implementation preference.
- Updated layout tests (`site/src/lib/layout/layout.test.ts`, `site/src/lib/layout/page-layout.test.ts`, `site/src/lib/layout/footer-sv.test.ts`) to consume shared fixture data, so regression assertions are centralized and easier to maintain.
- Updated `HeroSection` and the showcase hero variant (`site/src/components/content/HeroSection.astro`, `site/src/pages/component-showcase.astro`, `site/src/styles/components.css`) to support image-cover rendering for no-body hero sections using the source `Take a Breath - Book your ticket` background image, and synced the contract docs in `docs/phase-3-component-inventory.md` and `docs/phase-3-component-usage.md`, so this hero state now mirrors source structure for consolidated sign-off review.
- Updated `site/src/components/content/PartnersSection.astro` to remove lazy-loading on partner logo images and use async decoding, so source-localized SVG logos render reliably in the one-row partner strip during showcase review.
- Updated `site/src/components/content/TestimonialCarousel.astro` and `site/src/styles/components.css` to implement full carousel behavior (autoplay, previous/next controls, and jQuery fade transitions) over a source-modeled image background, and updated showcase testimonial fixtures plus component contracts in `site/src/data/component-showcase.ts`, `docs/phase-3-component-inventory.md`, and `docs/phase-3-component-usage.md`, so the testimonial component now matches the expected source carousel pattern instead of static quote cards.
- Added `site/src/lib/components/testimonial-carousel.ts` with `testimonial-carousel.test.ts`, so carousel index wrap behavior is covered by deterministic unit tests.
- Fixed gallery lightbox runtime script in `site/src/components/content/GallerySection.astro` by removing TypeScript-only casts from browser-executed code, so click handlers now intercept image links and open the jQuery lightbox overlay instead of navigating directly to image URLs.
- Updated `site/src/components/content/PartnersSection.astro` to append a version query string for SVG logo sources, so browsers refresh previously cached failed SVG responses and consistently load partner logos 1, 5, and 8.
- Fixed module loading for jQuery-powered gallery and testimonial scripts by removing explicit `type="module"` from Astro component script blocks in `site/src/components/content/GallerySection.astro` and `site/src/components/content/TestimonialCarousel.astro`, so Astro now bundles imports correctly and gallery clicks open the intended lightbox popup instead of navigating to raw image links.
- Updated testimonial carousel hero styling in `site/src/styles/components.css` to full-bleed viewport width with full-frame slides, light text treatment, and arrow positioning tied to content gutters, so each rotating testimonial occupies the full hero area while keeping jQuery-based autoplay and arrow-driven transitions.
- Reverted `site/src/components/content/PartnersSection.astro` to plain `<img>` partner logos (removed build-time inline SVG), so Toniton and other logos render again without Astro fragment or sanitization side effects on SVG markup.
- Extended `site/src/lib/fonts/sources.json` with Baskervville 400 italic, ran `npm run fonts:sync`, and pointed testimonial quote copy at `BaskervvilleLocal` at `font-weight: 400` with real italic files, so quote typography uses self-hosted faces and `font-weight: 300` is not claimed without a matching woff2.
- Updated `.gitignore` to ignore `.cursor/`, so Cursor IDE metadata stays out of the working tree noise.
- Set default `body` typography to `BaskervvilleLocal` in `site/src/styles/layout.css`, scoped preview `header-root` back to Jost, and declared Jost for component headings and accordion titles in `site/src/styles/components.css`, so body and paragraphs match `docs/Visual Identity.md` while nav and heading surfaces stay Jost; documented the split in `docs/phase-3-component-usage.md`.
- Updated `.accordion-item summary` in `site/src/styles/components.css` to **Baskervville** at `font-weight: 400`, so FAQ questions match body typography and are not bold.
- Replaced testimonial carousel jQuery fade with horizontal slide transitions in `site/src/components/content/TestimonialCarousel.astro` and `site/src/styles/components.css` (forward: exit left, enter from right; backward the reverse), with `transitionend` plus timeout cleanup, `prefers-reduced-motion` handling, and docs note in `docs/phase-3-component-usage.md`.
- Reworked `HeroSection` to two exclusive modes (`is-cover` when `backgroundImage` is set, `is-solid` when not), removed the image-strip-plus-aubergine `inline` layout, set light typography on both modes, adjusted secondary CTA on solid aubergine for contrast, fixed `.component-showcase` overrides that forced dark text onto hero content, and updated `component-showcase.astro`, `docs/phase-3-component-inventory.md`, `docs/phase-3-component-usage.md`, and `docs/content-model.md`.
- Documented three CTA usage levels in `docs/Visual Identity.md` (primary any surface, secondary light only, outline on photos), wired notes through `docs/phase-3-component-usage.md`, `docs/phase-3-component-inventory.md`, and comments in `site/src/styles/components.css`.
- Closed Phase 3 (`P3-08`, `P3-09`): added `docs/phase-3-verification-record.md`, marked `docs/phase-3-todo.md` complete, set Phase 3 status in `docs/grand-plan.md` with carry-forward notes, logged **EX-0006** for showcase-only Lighthouse Performance, clarified Phase 3 performance wording in `docs/definition-of-done.md`, and indexed the verification record in `AGENTS.md` and `docs/phase-3-component-qa-checklist.md`.
- Improved accessibility for showcase and layout: underlines on `link-footer` and `content-section-body` links, aubergine ghost styling for outline CTAs on the pink demo button row only, larger tap targets for Swedish hero social and language links and footer list and social icons in `site/src/styles/layout.css` (Lighthouse mobile accessibility 100 on `/component-showcase/` after build).

### Deprecated

- None.

### Removed

- None.

### Fixed

- Updated `site/src/pages/component-showcase.astro` hero demo background from `ANDETAG-I-signature-room.webp` (missing locally and 404 on production) to existing localized media `Andetag-27-037-copy-scaled.jpg`, so `npm run dev` no longer logs 404s for that asset.
- Updated `spider.py` crawl startup to remove existing `site-html/` and `site-md/` directories before creating fresh outputs, so reruns rebuild the mirror from scratch instead of creating duplicate `-1`, `-2` files.

### Security

- None.
