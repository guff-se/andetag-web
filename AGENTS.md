# Agent Guide: ANDETAG Web Migration

This document guides AI agents working in this repository. Read it at the start of each session.

---

## You Built This

**You created every file in this project.** Own design decisions, keep the system coherent, and leave the repo in a better state than you found it.

**Your collaborator knows architecture but not implementation details.** Always report what changed, where it changed, and why.

---

## Your Role

You are the sole maintainer for this repository and should execute complete solutions end-to-end.

**Implications:**
- Make implementation choices without waiting for approval when requirements are clear.
- Do not hand off executable work to the user when you can do it yourself.
- Keep docs and implementation aligned at all times.
- Prefer small, verifiable changes with clear rationale.

---

## Critical: Source Integrity

This project works with real scraped website artifacts and SEO language constraints.

- Never fabricate pages, URLs, metadata, or content values that could be interpreted as source truth.
- If required source data is missing or ambiguous, stop and ask.
- Do not silently invent placeholders in parser outputs, manifests, or SEO copy.

---

## Project at a Glance

**What it is:** A migration workspace for converting the current `andetag.museum` WordPress/Elementor site into structured static-site source content.

**Business context:** Stockholm content is live and multilingual (sv/en/de context), while Berlin is a pre-launch track. The repository captures scraped source files, parser planning docs, and SEO content strategy that must stay consistent.

**Tech:** Python (`spider.py`), HTML/Markdown source artifacts, and documentation-driven parser specs in `docs/`.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `site-html/` is treated as canonical scraped input | Parser behavior should be deterministic from stable local source files. |
| Parser extraction boundary is `data-elementor-type="wp-page"` | Keeps per-page content separate from shared header/footer templates. |
| Output model is structured (`content`, `nav`, `design`, `schema`, `pages`) | Supports static site generation with clean source-of-truth artifacts. |
| Language architecture remains sv/en/de with preserved hreflang relationships | Required for SEO/GEO continuity and migration safety. |
| WordPress/plugin JS is not migrated as content | Reduces noise and avoids carrying over irrelevant runtime behavior. |

---

## Documentation Structure

Reference docs before implementation:

| Doc | Use when |
|-----|----------|
| `docs/existing-site-structure.md` | Understanding current WP/Elementor templates, widget types, nav, integrations. |
| `docs/parser-plan.md` | Implementing or changing parser outputs and extraction rules. |
| `docs/Andetag SEO Manual.md` | Making SEO/GEO decisions, page intent, language strategy, schema constraints. |
| `docs/Tone of Voice.md` | Writing or editing user-facing copy and metadata text. |
| `docs/Visual Identity.md` | Quick visual direction and brand consistency checks. |
| `docs/grand-plan.md` | Project roadmap, phase gates, business objectives, and decision log. |
| `docs/phase-0-todo.md` | Execution checklist for Phase 0 guardrails and deliverables. |
| `docs/phase-1-todo.md` | Execution checklist for Phase 1 analysis deliverables and exit gate inputs. |
| `docs/phase-2-todo.md` | Execution checklist for Phase 2 shared layout system deliverables and approvals. |
| `docs/phase-3-todo.md` | Execution checklist for Phase 3 component library, showcase approval, and verification gates. |
| `docs/phase-4-todo.md` | Execution checklist for Phase 4 routing, redirects, canonical or hreflang wiring, and URL coverage validation. |
| `docs/phase-5-todo.md` | Historical Phase 5 execution checklist; **status complete** (2026-03-24, Swedish `/sv/` migration). Carry-forward items **`P5-05`–`P5-07`** in **`docs/phase-6-todo.md`**. |
| `docs/phase-5-verification-record.md` | Phase 5 evidence, per-page design approvals, P5-01 static target note, Lighthouse summary, **EX-0014**, stakeholder sign-off (**closed** 2026-03-24). |
| `docs/phase-6-todo.md` | Localization (**`en`**, **`de`**) and Phase 5 carry-forward. Start with **Current position and what is next** for wave status (**P6-04**–**P6-06** next; **P6-00**–**P6-03** closed **2026-04-04**). |
| `docs/phase-6-verification-record.md` | Phase 6 evidence and Gustaf sign-off per slice (**P6-00** chrome package, later waves). |
| `docs/phase-7-todo.md` | Execution checklist for Phase 7 scripts, consent, analytics, favicon, sharing metadata, schema.org, sitemap, and launch hardening. |
| `docs/phase-4-route-coverage.md` | URL matrix to Astro shell and `_redirects` mapping for Phase 4 route coverage. |
| `docs/phase-4-routing-reopen.md` | Post-closure routing revisit: location and language matrix, Berlin or Stockholm parity, global pages and navigation. |
| `docs/routing-location-scoped-global-pages-plan.md` | Execution plan: move story or global pages under location-prefixed routes, redirects, canonical, chrome, and docs (when approved). |
| `docs/phase-4-redirect-tests.md` | Redirect test table and execution log for Cloudflare Pages `public/_redirects`. |
| `docs/phase-4-404.md` | Phase 4 global `404` behavior and accessibility notes. |
| `docs/phase-4-verification-record.md` | Phase 4 verification evidence and stakeholder sign-off (parallel to Phase 3 record). |
| `docs/phase-3-component-qa-checklist.md` | Reusable QA checklist template for Phase 3 component verification and showcase sign-off. |
| `docs/phase-3-verification-record.md` | Phase 3 `P3-08` Lighthouse results, manual QA summary, and stakeholder sign-off (historical internal showcase route, since removed). |
| `docs/phase-3-fixture-strategy.md` | Deterministic fixture strategy and coverage map for Phase 3 layout and component regression checks. |
| `docs/phase-3-component-inventory.md` | Source-backed Phase 3 component inventory and approved API contracts. |
| `docs/phase-3-component-usage.md` | Implementation-facing usage reference for approved Phase 3 components and embeds. |
| `docs/phase-1-design-baseline.md` | Source-backed design token and component evidence baseline for Phase 1. |
| `docs/ia-language-destination-options.md` | IA options and recommendation for language plus destination routing continuity. |
| `docs/kpi-measurement-map.md` | KPI funnel event taxonomy for GTM and Phase 7 analytics implementation. |
| `docs/url-migration-policy.md` | Canonical URL, redirect, alias, and sitemap policy for migration and launch. |
| `docs/url-matrix-schema.md` | URL matrix data contract for must-keep URLs and redirect status tracking. |
| `docs/content-model.md` | Versioned contract for page frontmatter, shared data, and component props. |
| `docs/definition-of-done.md` | Measurable exit checks for each delivery phase. |
| `docs/tracking-and-consent-requirements.md` | GTM, Brevo, and consent category requirements for compliant tracking. |
| `docs/migration-exceptions.md` | Exception log format and approval workflow for source parity deviations. |
| `docs/testimonials-reimplementation-options.md` | Research and strategic options for customer testimonials and social proof (discussion before implementation). |
| `docs/design-extraction-method.md` | Reproducible method for extracting design tokens and component patterns from all CSS sources. |
| `docs/phase-1-analysis-schema.md` | Structured tables for Phase 1 variant, widget, and integration analysis. |
| `docs/site-structure-refactor-plan.md` | Side phase: `site/src/` layout (ADR 0003). **Status:** complete (2026-03-24). Historical execution notes, §6 verification, deferred follow-ups. |
| `docs/phase-structure-todo.md` | Execution checklist for the site structure refactor (S0–S8); record baseline hash and check off phases. |
| `docs/decisions/0003-site-src-structure.md` | **Accepted** ADR: final folder names (`chrome`, `page-bodies`, `page-registry`, `ui-logic`, `client-scripts`). |
| `docs/decisions/README.md` | ADR template, naming convention, and decision lifecycle process. |

**Rule:** If behavior changes, update the relevant doc in the same task.

### Documentation Overview Maintenance

- Keep this documentation table current whenever new planning or migration docs are created.
- If a doc is superseded, mark it in the table or remove it in the same task that introduces the replacement.
- At the end of substantial planning work, verify that every new doc in `docs/` has a clear owner purpose and "use when" entry here.

---

## Coherence: Everything Is Connected

Changes often affect multiple layers. Audit all related layers before concluding:

| Layer | What to check |
|-------|---------------|
| **Scraped source** | `site-html/` and `site-md/` filename conventions and source coverage |
| **Parser logic** | `spider.py` behavior and any future parser modules/scripts |
| **Planned outputs** | `docs/parser-plan.md` output contracts and field names |
| **SEO content** | `seo-content/` pages and constraints from SEO manual |
| **Docs** | Architecture/tone/SEO docs that describe changed behavior |

**Checklist for cross-cutting changes:**
1. Search for old field names, slugs, URL paths, and widget assumptions.
2. Update parser behavior and matching documentation together.
3. Verify language-specific impacts (sv/en/de) and hreflang/canonical consistency.
4. Confirm no contradiction with tone and SEO constraints.

### Routing and entry URLs (Phase 5 onward)

Before changing Astro routes (`site/src/pages/`, `page-shell-registry`, `page-shell-meta`), `docs/url-matrix.csv`, `site/public/_redirects`, or edge Workers for entry routing:

1. Read **`docs/phase-4-routing-reopen.md`** (decided behavior, open questions, **Phase 4 implementation delta**).
2. Read **`docs/url-migration-policy.md`** (entry routing, **`andetag_entry`**, **`Accept-Language`**, crawlers).
3. Check **`docs/grand-plan.md`** (Entry routing and URL expansion schedule).

---

## Code Layout

```
web/
├── AGENTS.md                 # This guide
├── CHANGELOG.md              # Human-readable project change log
├── .github/workflows/        # CI workflows for docs and quality gates
├── spider.py                 # Current crawler (HTML + Markdown snapshots + assets)
├── docs/                     # Migration, SEO, tone, and site architecture specs
├── site-html/                # Scraped HTML pages and downloaded WP assets
├── site-md/                  # Markdown snapshots from crawler
├── site/                     # Astro workspace (`npm test`, `npm run build`); `docs/site-structure-refactor-plan.md`, ADR 0003
│   ├── public/               # Static assets, `_redirects`, `_headers`
│   ├── scripts/              # Node / shell tooling (meta, fonts, encoding); not browser bundles
│   └── src/
│       ├── client-scripts/    # Browser-oriented TS imported from Astro components
│       ├── components/
│       │   ├── chrome/       # Site chrome (header, footer, logo)
│       │   ├── content/      # Section-level blocks (Hero, ContentSection, …)
│       │   ├── embeds/
│       │   ├── page-bodies/  # Per-route main-column bodies (`[...slug].astro` map)
│       │   └── ui/
│       ├── data/             # `page-shell-meta.json` (generated)
│       ├── layouts/          # Astro document layout (`SiteLayout.astro`)
│       ├── lib/
│       │   ├── chrome/       # Chrome + SEO model (navigation, hero, footer, types, fixtures)
│       │   ├── content/
│       │   ├── fonts/
│       │   ├── page-registry/  # `page-body-registry`, FAQ TS next to bodies
│       │   ├── routes/       # `page-shell-registry`, URL / chrome navigation resolution
│       │   └── ui-logic/     # TS-only helpers (carousel, booking HTML, presentation)
│       ├── pages/            # File-based routes (`index`, `[...slug]`, `404`, previews)
│       └── styles/
└── seo-content/              # SEO content drafts (currently mostly Swedish)
```

---

## Testing Strategy

**Goal:** Keep parser and content transformations reliable and repeatable.

### Unit tests
- Add parser-focused unit tests under `tests/` when introducing parsing helpers.
- Use fixed HTML snippets from `site-html/` fixtures for deterministic assertions.
- Validate exact output fields and normalization behavior.

### Integration checks
- Run parser/crawler against local artifacts when possible.
- If network access is required (for crawling or media download), keep runs explicit and documented.

### Running checks
```bash
python3 -m py_compile spider.py
python3 spider.py
python3 -m unittest tests.test_spider_versioning
```

**`spider.py`:** By default each run writes **`crawl-versions/<id>/`**, diffs against the prior run, and writes **`MIGRATION_CHANGELOG.md`** in that folder before promoting to **`site-html/`** and **`site-md/`**. Use **`python3 spider.py --legacy`** for a simple refresh with no archive or changelog (large disk use on repeated full crawls: consider pruning old **`crawl-versions/*`** manually or via git ignore if you do not commit archives).

Astro workspace (`site/`): `npm test` and `npm run build` (also run on `push` to `main` via `.github/workflows/ci.yml`).

### Rule
- Use red/green TDD for non-trivial parser logic changes.
- No parser feature is complete without a regression check (test or documented deterministic validation).

---

## Workflow by Task Type

### Updating parser behavior
1. Read `docs/parser-plan.md` and `docs/existing-site-structure.md`.
2. Implement minimal parser change in `spider.py` or new parser module.
3. Add/update tests or deterministic validation steps.
4. Update parser docs if output shape or assumptions changed.

### Updating SEO or content guidance
1. Read `docs/Andetag SEO Manual.md` and `docs/Tone of Voice.md`.
2. Edit affected `seo-content/` files or metadata references.
3. Verify language-specific wording constraints (especially sv/en/de intent).
4. Keep docs and content examples synchronized.

### Investigating migration mismatches
1. Reproduce using source page in `site-html/`.
2. Identify whether mismatch is parser logic, source artifact, or spec drift.
3. Fix root cause and add a regression check.
4. Document changed assumption in relevant doc.

---

## Conventions

- **No effort estimates.** Do not add day/hour estimates to docs or plans.
- Preserve raw scraped files. Do not manually "clean" `site-html/` content in place.
- Keep filenames and slugs predictable and stable.
- Locale-specific source files must use language suffixes at the end of the filename, using only `sv`, `en`, and `de` (for example `hero-sv.ts`, `hero-en.ts`, `hero-de.ts`).
- Design system rule: visual design primitives are universal across languages. Language can change content, active variants, and shown elements, but core design tokens, layout patterns, and component styling must remain shared unless an approved migration exception is logged.
- The rebuilt site must self-host all first-party assets. Do not use absolute `https://www.andetag.museum/...` URLs for internal JS, CSS, images, video, fonts, or other media in `site/`; use local root-relative paths (for example `/wp-content/uploads/...`) backed by files in the Astro workspace.
- **Missing media in `site-html/`:** When a migrated page needs an image or other first-party file that is referenced in scraped HTML or on the live site but was not captured under `site-html/`, **download it from the current production URL** (or re-run the crawler if you prefer a batch refresh) and commit it under **`site/public/`** on the same path the site will serve (for example `site/public/wp-content/uploads/...`). Then wire that path in Astro. Do not leave permanent hotlinks to `andetag.museum` for internal assets, and do not invent placeholder imagery.
- For CSS, create fresh local styles in `site/src/styles/` or component-scoped files instead of copying legacy WordPress CSS bundles.
- For JS behavior, reimplement with local project code and package-managed dependencies instead of loading legacy WordPress script files by URL.
- For webfonts, maintain source definitions in `site/src/lib/fonts/sources.json` and regenerate local files via `npm run fonts:sync`; do not ship runtime links to remote font providers.
- For user-facing copy, follow `docs/Tone of Voice.md` and SEO constraints exactly.
- In prose docs, avoid the em dash character and use commas, colons, or parentheses.

### Header and Footer Parity Notes

- Keep CSS selector naming design-scoped and reusable (`shared-*`), language-specific files should provide content and routing differences only.
- When a source template has distinct mobile navigation behavior, implement that behavior directly instead of collapsing to desktop interaction patterns.
- For sticky UI elements that start near or outside viewport bounds, calculate stick points from the element's real document position and recalculate on resize.
- During active layout or component parity work, optional dedicated preview routes under `site/src/pages/` can shorten review cycles. **Remove those routes and any `_redirects` entries or doc references that exist only for them when the owning phase is marked complete**, unless follow-up is logged in `docs/migration-exceptions.md` or the relevant phase todo with an owner. After closure, rely on matrix shells, tests, and verification records for regression (see **Phase closure cleanup** below).

---

## Environment

- **Runtime:** Python 3 with `requests`, `beautifulsoup4`, and `html2text`.
- **Data source:** Local `site-html/` and `site-md/` artifacts, plus optional live crawl target `https://www.andetag.museum`.
- **Secrets:** None currently required in-repo.
- **Gotcha:** `spider.py` may fetch live assets; avoid unintended full recrawls during small parser-only changes.

### Cloudflare (Astro `site/`)

- **Pages (recommended):** Project root directory `site`, build command `npm run build`, build output directory `dist`, and **leave the deploy command empty** so Pages publishes `dist` after the build.
- **Workers static assets:** If the pipeline runs `npx wrangler deploy`, run it with working directory `site` so `wrangler.jsonc` applies. That file points `assets.directory` at `./dist` (Astro static output, includes `public/_redirects` and `public/_headers`). **`_headers`** sets `Cache-Control` (and optional `X-Robots-Tag` on `*.workers.dev`) per [Workers static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/); without it, the default is `max-age=0, must-revalidate` on every file.

---

## Delivery and Reporting

When finishing substantial work:

1. Report concrete file-level changes and behavior impact.
2. Call out any **Critical** constraints from docs that affected implementation.
3. Explicitly mention residual risks (for example language edge cases, widget variants not covered, or network-dependent checks not run).

### Phase Closure Forward Audit (Mandatory)

When a phase is marked complete, always perform a forward audit across all remaining future phases before finalizing:

1. Review planning docs for every later phase (`N+1` and onward), not only the next phase.
2. Identify assumptions or decisions that changed in the completed phase and could invalidate future phase plans.
3. Update affected planning docs in the same task, or explicitly log unresolved impacts as gaps/exceptions with owners and target phases.
4. Ask clarifying questions immediately when a future-phase dependency is ambiguous or requires stakeholder approval.
5. **Phase closure cleanup:** remove human-auditing scaffolding that was created **only** for the phase being closed (for example temporary preview pages under `site/src/pages/`, redirect rules in `site/public/_redirects` that only served those pages, duplicate scratch checklists in `docs/` when the phase verification record already holds evidence). **Keep** regression tests, fixtures, and signed verification records required by `docs/definition-of-done.md`. If something must stay temporarily, log it with owner and removal target in `docs/migration-exceptions.md` or the phase todo.

Rule: no phase closure is final until this forward audit has been completed and documented, and applicable cleanup has been executed or explicitly deferred with an owner.

---

## AI Changelog Standards

Maintain a human-readable changelog for meaningful repository changes.

### File and format

- Use `CHANGELOG.md` at repo root.
- Follow Keep a Changelog categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Keep an `Unreleased` section at the top.
- For releases, use reverse chronological order and ISO date format (`YYYY-MM-DD`).
- Link versions and relevant PRs/issues when available.

### Entry quality rules

- Write for humans, not commit logs, and summarize user-visible impact.
- Group related changes, avoid noisy internal-only notes unless they affect behavior or operations.
- Include migration notes when URL behavior, schema fields, or contracts change.
- Explicitly call out breaking changes and deprecations before removals.
- Include verification notes for major changes (tests run, deterministic checks, or manual validation scope).

### AI-specific logging rules

- For AI-authored changes, include a short "why" statement for each notable entry.
- Record scope precisely with file paths or subsystem names (for example parser, docs, SEO metadata, routing).
- If uncertainty remains (for example missing source data), document assumptions and follow-up actions.
- Keep changelog entries consistent with commit intent (`feat`, `fix`, and breaking changes) for future automation.

### Release workflow

1. During work: add notable items under `Unreleased`.
2. On release: move `Unreleased` items into a new version heading with date.
3. After release: reset `Unreleased` with empty category headings.

---

## When in Doubt

1. Check docs first.
2. Prefer simpler parser logic over clever extraction heuristics.
3. Add a deterministic test/check before and after changing behavior.
4. Update docs immediately when behavior changes.