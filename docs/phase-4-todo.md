# Phase 4 TODO, Routing and URL Preservation

Purpose: implement complete static routing, migration-safe redirects, and consistent canonical or hreflang behavior before Phase 5 page-by-page content migration.

**Prerequisites:** Phase 3 is complete (2026-03-22). Use `docs/phase-3-component-usage.md`, `docs/content-model.md`, and fixtures from `docs/phase-3-fixture-strategy.md` when implementing route shells and later page bodies.

Status: implementation complete on 2026-03-23; redirect verification recorded in `docs/phase-4-redirect-tests.md` (2026-03-23). Pending stakeholder sign-off for phase closure.

## Decisions (stakeholder approval, 2026-03-23)

1. **Route bodies:** Phase 4 ships `SiteLayout` plus real head metadata only. Main content blocks and design parity are Phase 5 onward.
2. **Host and protocol redirects:** Cloudflare (DNS and Pages custom domains / SSL) owns apex to `www` and `http` to `https`. The repo owns path-level rules (for example `site/public/_redirects`) for URL matrix `redirect` rows and policy aliases so behavior is versioned, reviewable, and testable; the route coverage report states where each rule lives.
3. **Trailing slash:** Confirmed. Astro build output must match `docs/url-migration-policy.md` trailing-slash canonicals for HTML routes.
4. **Coverage authority:** Confirmed. `docs/url-matrix.csv` plus any explicitly documented manual rows are the source of truth for route coverage (no standing requirement to diff against a live crawl on every change).
5. **Hreflang in HTML:** Implementation default, BCP47-oriented: map internal `sv` to `sv-SE`, `en` to `en`, `de` to `de-DE` in emitted `hreflang` attributes; keep `content-model.md` language keys and path maps as today. Include self-referencing alternates, `x-default`, and respect the SEO manual rule against cross-location hreflang. If the manual’s examples are updated later, keep them aligned with this mapping.
6. **404:** Implementation default: one global static 404 page, Swedish-primary `html lang`, accessible recovery navigation (skip link, heading, links to main entry routes). Document behavior in `docs/phase-4-404.md` or the route coverage addendum.
7. **Sitemap XML:** Out of scope for Phase 4. Implement canonical URL sitemap(s) in Phase 7 per `docs/grand-plan.md`.

## Exit Criteria

Phase 4 is complete only when all items marked `P4` are done and approved:

- Every URL in `docs/url-matrix.csv` with `status=keep` resolves to a built static route (or an explicit, documented exception in `docs/migration-exceptions.md`).
- Every URL with `status=redirect` is implemented with a single-hop `301` (or approved alternative) and matches `docs/url-migration-policy.md`.
- Canonical and hreflang output is wired for all indexable routes per `docs/content-model.md`, `docs/Andetag SEO Manual.md`, and policy (including `x-default` and no cross-location hreflang where the manual forbids it).
- A route coverage report shows 100% mapping of known URLs from the matrix (and any appended manual rows), with no undocumented gaps.
- Redirect test list exists and has been validated (status, final path, query preservation where required).
- 404 and language-aware fallback behavior is defined, implemented, and meets `docs/definition-of-done.md` Phase 4 accessibility expectations.
- XML sitemap generation is not a Phase 4 gate (Phase 7).

## Task Board

## P4, Must Complete in Phase 4

- [x] **P4-00 Confirm Phase 4 scope, routing strategy, and edge versus build responsibilities**
  - Owner: Gustaf + AI agent
  - Inputs:
    - `docs/grand-plan.md`
    - `docs/definition-of-done.md`
    - `docs/url-migration-policy.md`
    - `docs/decisions/0001-static-stack-selection.md`
  - Stakeholder decisions: see **Decisions (stakeholder approval, 2026-03-23)** above.
  - Include:
    - Verify Astro `site/` remains the routing source of truth for static HTML paths.
    - Encode edge versus repo redirect ownership in the route coverage report (Cloudflare for host or protocol, repo for path rules).
    - Verify `docs/grand-plan.md` Phase 4 wording matches layout-plus-metadata-only scope.
  - Done when: implementation and published docs match the decision block with no open blockers.

- [x] **P4-01 Close URL matrix gaps and publish the route coverage report**
  - Owner: AI agent
  - Inputs:
    - `docs/url-matrix.csv`
    - `docs/url-matrix-schema.md`
    - `site-html/sitemap.xml`
    - `docs/existing-site-structure.md`
  - Include:
    - Reconcile sitemap and crawl inventory against the matrix, resolve or explicitly log `unknown` rows with owners.
    - Produce a human-readable route coverage report (suggested path: `docs/phase-4-route-coverage.md`) listing each matrix row, expected behavior (`keep`, `redirect`, `remove`), and implementation location (Astro page path, redirect rule id, or exception id).
  - Done when: the report shows 100% coverage of known URLs with traceable implementation targets.

- [x] **P4-02 Configure Astro build routing for canonical path shape**
  - Owner: AI agent
  - Inputs:
    - `docs/url-migration-policy.md`
    - `site/astro.config.mjs`
  - Include:
    - Trailing-slash behavior consistent with canonical URLs for HTML routes.
    - `site` URL base already set to `https://www.andetag.museum`; keep canonical or absolute URL helpers compatible with a Phase 7 sitemap (sitemap not built in Phase 4).
  - Done when: local `astro build` output paths match the canonical path style for representative routes without manual guesswork.

- [x] **P4-03 Implement static routes for all `keep` URLs**
  - Owner: AI agent
  - Inputs:
    - Route coverage report from `P4-01`
    - `docs/content-model.md`
    - `docs/phase-3-component-usage.md`
    - `site/src/layouts/SiteLayout.astro`
  - Include:
    - File-based routes (or an approved data-driven route generator pattern) for every `keep` row.
    - Per-route `SiteLayout` props: `canonicalPath`, `hreflang`, header or footer variant ids, and `robots` where non-default.
    - Main slot: empty or a minimal non-marketing placeholder is acceptable in Phase 4; titles and meta descriptions must still come from approved sources (`seo-content/`, parser output contracts, or `site-html/` extraction), not invented marketing copy.
  - Done when: each `keep` URL returns a successful HTML response in preview or production build output with correct layout shell and policy-compliant head tags.

- [x] **P4-04 Implement redirect rules for all `redirect` and policy-required aliases**
  - Owner: AI agent
  - Inputs:
    - `docs/url-migration-policy.md`
    - Matrix rows with `status=redirect`
  - Include:
    - Cloudflare Pages compatible redirect definitions (for example `public/_redirects` in `site/` or platform-documented equivalent).
    - Legacy aliases such as `/en/berlin-en/` to `/en/berlin/`, `/en/stockholm/art-yoga-en/` to `/en/stockholm/art-yoga/`, `/de/` to `/de/berlin/`, and optional `/privacy-policy/` to `/privacy/` if that alias appears in policy.
    - Avoid redirect chains for combinations covered by multiple rules, document ordering if the platform requires it.
  - Done when: redirect test list from `P4-07` passes for every matrix redirect row and documented policy aliases.

- [x] **P4-05 Align canonical and hreflang emission with SEO manual and content model**
  - Owner: AI agent
  - Inputs:
    - `docs/Andetag SEO Manual.md` (hreflang section)
    - `docs/content-model.md`
    - `site/src/lib/layout/seo.ts`
  - Include:
    - Self-referencing hreflang where required.
    - `x-default` behavior per manual (typically Swedish default home or agreed default URL).
    - Apply the BCP47 mapping from **Decisions (stakeholder approval, 2026-03-23)** in `site/src/lib/layout/seo.ts` (or successor); `href` values remain absolute.
  - Done when: sample pages for each language and destination pattern validate against the manual checklist and content model.

- [x] **P4-06 Implement 404 strategy and language-aware fallback**
  - Owner: AI agent
  - Inputs:
    - `docs/url-migration-policy.md`
    - `docs/Tone of Voice.md`
    - `docs/definition-of-done.md` Phase 4
  - Include:
    - Custom `404` page per **Decisions (stakeholder approval, 2026-03-23)** (single global page, Swedish-primary shell, recovery links).
    - Keyboard and screen-reader sanity check: focus management, heading, skip link compatibility.
  - Done when: 404 behavior is documented in the route coverage report or a short `docs/phase-4-404.md` addendum and passes basic accessibility review.
  - Resolution: `docs/phase-4-404.md` added; summary cross-link in `docs/phase-4-route-coverage.md`.

- [x] **P4-07 Build and run the redirect validation list**
  - Owner: AI agent
  - Inputs:
    - Redirect rules from `P4-04`
    - `docs/url-migration-policy.md` (query preservation requirements)
  - Include:
    - A documented test table: source URL, expected status, expected `Location` or final path, and query-string preservation cases.
    - Record execution environment (local preview, Cloudflare preview, or production) and results.
  - Done when: all required redirects are verified with no undocumented failures.
  - Resolution: executed 2026-03-23 against `https://andetag-web.guff.workers.dev/`; see `docs/phase-4-redirect-tests.md` for `curl` evidence.

- [x] **P4-08 Add regression checks for routing and head metadata**
  - Owner: AI agent
  - Inputs:
    - `P4-03` and `P4-05` outputs
    - Existing test patterns under `site/src/lib/layout/*.test.ts`
  - Include:
    - Unit or integration tests for canonical URL builder, hreflang builder, and any new redirect map parsing.
    - Optional CI check that `docs/url-matrix.csv` rows have a corresponding route file or redirect entry when tooling is introduced (only if low-noise and deterministic).
  - Done when: changes to SEO helpers or redirect tables are caught by tests before merge.

- [x] **P4-09 Prepare carry-forward outputs for Phase 5**
  - Owner: AI agent
  - Inputs:
    - Completed Phase 4 artifacts
  - Output updates:
    - `docs/grand-plan.md` (Phase 4 status and any carry-forward notes)
    - `CHANGELOG.md` (`Unreleased` notes with why)
    - `AGENTS.md` if new Phase 4 artifacts need documentation table entries
  - Done when: Phase 5 can start page migration without routing or URL policy blockers.

## Clarification Queue (Resolved)

- [x] **CQ-01 `keep` route minimum content for Phase 4 versus Phase 5**
  - Resolution: Phase 4 is layout plus metadata only; body content and design in Phase 5 onward (see decision block).

- [x] **CQ-02 Ownership of host-level and protocol redirects**
  - Resolution: Cloudflare for apex and HTTPS; repo path redirects for matrix and policy aliases (see decision block).

## Working Rhythm

- Review cadence: one checkpoint per completed `P4` item cluster (build config, routes, redirects, SEO head, 404, validation).
- Clarification rule: ask immediately when matrix rows, policy, or SEO manual requirements conflict.
- Change control: any URL behavior deviation is logged in `docs/migration-exceptions.md`.
- Decision logging: platform-specific routing or redirect engine choices that affect portability belong in `docs/decisions/` when not already covered by ADR 0001.

## Immediate Next 3 Actions

1. After next deploy, run redirect case 5 in `docs/phase-4-redirect-tests.md` (`/privacy-policy/`) and mark the execution log row **Pass**.
2. Approve **EX-0007** in `docs/migration-exceptions.md` or replace `/en/stockholm/` metadata when WordPress or Phase 5 supplies correct English hub head tags.
3. Record Phase 4 stakeholder sign-off in `docs/phase-4-verification-record.md`, this file, and `docs/grand-plan.md`, then start Phase 5 page migration using `docs/phase-3-component-usage.md` and the shell registry.
