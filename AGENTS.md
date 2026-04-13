# Agent Guide: ANDETAG Web

Read this at the start of each session.

---

## Role

You are the sole maintainer. You created every file in this project. Own design decisions and keep the system coherent.

- Execute complete solutions end-to-end; do not hand off executable work.
- Your collaborator knows architecture but not implementation details: always report what changed, where, and why.
- Keep docs and implementation aligned at all times.
- Prefer small, verifiable changes with clear rationale.
- Treat direct user statements as action requests by default. Do the work unless the user explicitly asks for discussion, planning, or explanation only.

---

## Source Integrity

This project works with real scraped website artifacts and SEO language constraints.

- Never fabricate pages, URLs, metadata, or content values that could be interpreted as source truth.
- If required source data is missing or ambiguous, stop and ask.
- Do not silently invent placeholders in manifests or SEO copy.

---

## Project Overview

**What:** Migrating `andetag.museum` from WordPress/Elementor to an Astro static site on Cloudflare Workers.

**Status:** Phases 0-7 closed. **Phase 8** (production deployment) is active. Phase 9 (maintenance) is a placeholder.

**Languages:** Swedish (`sv`), English (`en`), German (`de`) with preserved hreflang relationships.

**Locations:** Stockholm (live, multilingual) and Berlin (pre-launch).

---

## Code Layout

```
web/
├── AGENTS.md              # This guide
├── CHANGELOG.md           # Human-readable change log (see docs/changelog-standards.md)
├── .github/workflows/     # CI: Node tests + build, Python tests, docs link check
├── spider.py              # Crawler (HTML + Markdown snapshots + assets)
├── docs/                  # Active migration and architecture specs
│   └── archive/           # Closed-phase checklists, superseded plans, historical reference
├── site-html/             # Scraped HTML pages (canonical input, do not manually edit)
├── site-md/               # Markdown snapshots from crawler
├── site/                  # Astro workspace
│   ├── public/            # Static assets, _redirects, _headers
│   ├── scripts/           # Node/shell tooling (meta, fonts, verify-staging, lighthouse)
│   ├── workers/           # Cloudflare entry router (entry-router.ts, entry-routing-logic.ts)
│   ├── wrangler.jsonc     # Workers + static dist/ (run_worker_first, ASSETS binding)
│   └── src/
│       ├── client-scripts/  # Browser TS imported from Astro components
│       ├── components/
│       │   ├── chrome/      # Header, footer, logo, tracking
│       │   ├── content/     # Section-level blocks (Hero, Gallery, Accordion, ...)
│       │   ├── embeds/      # Third-party embeds (booking, waitlist, map, video)
│       │   ├── page-bodies/ # Per-route main-column bodies
│       │   └── ui/          # Small reusable UI (links, pictures, wordmark)
│       ├── data/            # page-shell-meta.json (generated)
│       ├── layouts/         # SiteLayout.astro
│       ├── lib/
│       │   ├── chrome/      # Navigation, hero, footer, SEO, schema, types, fixtures
│       │   ├── content/     # Gallery, testimonials, responsive image path modules
│       │   ├── fonts/       # sources.json (npm run fonts:sync)
│       │   ├── page-registry/  # page-body-registry, FAQ data
│       │   ├── routes/      # page-shell-registry, chrome navigation, URL resolution
│       │   └── ui-logic/    # TS helpers (carousel, booking, presentation)
│       ├── pages/           # File-based routes (index, [...slug], 404)
│       └── styles/          # Global CSS (layout, components, fonts, print, vendor)
└── seo-content/             # SEO content drafts
```

---

## Documentation

Consult before implementation. All active docs are in `docs/`.

| Doc | Use when |
|-----|----------|
| `docs/grand-plan.md` | Roadmap, phase gates, business objectives, decision log |
| `docs/phase-8-todo.md` | **Current phase:** deployment checklist, URL parity, `www` cutover |
| `docs/phase-8-verification-record.md` | Phase 8 evidence and sign-off |
| `docs/phase-9-todo.md` | Placeholder: post-migration maintenance program (performance skill **P9-10**; pages, SEO, testimonials skills **P9-12**–**P9-15**; production PR gate **P9-20**+) |
| `docs/Andetag SEO Manual.md` | SEO/GEO decisions, page intent, language strategy, schema |
| `docs/Tone of Voice.md` | User-facing copy and metadata text |
| `docs/Visual Identity.md` | Typography, color palette, CTA mapping |
| `docs/url-migration-policy.md` | Canonical URLs, redirects, entry routing (`andetag_entry`), sitemap |
| `docs/phase-4-routing-reopen.md` | Routing decisions, open questions, location/language matrix |
| `docs/phase-4-redirect-tests.md` | Redirect test tables and execution log |
| `docs/content-model.md` | Page frontmatter, shared data contracts, component props |
| `docs/phase-3-component-usage.md` | Component API reference and usage patterns |
| `docs/definition-of-done.md` | Measurable exit checks per phase |
| `docs/migration-exceptions.md` | Exception log for source parity deviations |
| `docs/performance-improvement-plan.md` | Lighthouse, responsive images, script loading |
| `docs/responsive-image-workflow.md` | **Mandatory** when adding photos: derivative generation, suffix rules, wiring |
| `docs/tracking-and-consent-requirements.md` | GTM, Brevo, consent categories |
| `docs/kpi-measurement-map.md` | Analytics measurement, GTM audit, consent migration checklist |
| `docs/gtm-consent-migration-runbook.md` | Step-by-step GTM work for Phase 8 P8-07 |
| `docs/phase-8-cutover-runbook.md` | DNS, Workers custom domain, TLS, rollback, post-cutover PR discipline (P8-10, P8-11, P8-25) |
| `docs/decisions/0002-consent-platform-selection.md` | CMP selection ADR (CookieConsent implemented) |
| `docs/changelog-standards.md` | How to write CHANGELOG.md entries |
| `docs/archive/` | Closed-phase checklists, verification records, superseded plans |

**Rule:** If behavior changes, update the relevant doc in the same task.

---

## Coherence Checklist

Changes often affect multiple layers. Audit before concluding:

| Layer | What to check |
|-------|---------------|
| **Astro site** | `site/src/` components, pages, lib, styles, client scripts |
| **Workers / routing** | `site/workers/`, `site/public/_redirects`, `_headers`, URL policy doc |
| **Scraped source** | `site-html/` and `site-md/` coverage |
| **SEO content** | `seo-content/` pages and SEO manual constraints |
| **Docs** | Architecture, tone, and SEO docs that describe changed behavior |

For cross-cutting changes:
1. Search for old field names, slugs, URL paths.
2. Verify language-specific impacts (sv/en/de) and hreflang/canonical consistency.
3. Confirm no contradiction with tone and SEO constraints.

**Before changing routes:** Read `docs/phase-4-routing-reopen.md`, `docs/url-migration-policy.md`, and the entry routing schedule in `docs/grand-plan.md`.

---

## Testing

```bash
# Astro (primary)
cd site && npm test          # Vitest: 27 files, 107 tests
cd site && npm run build     # Static build (also CI on push/PR to main)

# Optional
cd site && npm run lighthouse:all   # Mobile perf sweep (needs built dist/)
cd site && npm run verify:staging-entry  # Entry routing vs staging

# Python crawler
python3 -m py_compile spider.py
python3 -m unittest tests.test_spider_versioning
```

CI (`.github/workflows/ci.yml`) runs Node tests, build, Python tests, and docs link check on push and PR to `main`.

---

## Conventions

- **No effort estimates** in docs or plans.
- **Locale suffixes** at end of filename: `hero-sv.ts`, `hero-en.ts`, `hero-de.ts`.
- **Self-host all first-party assets.** No absolute `https://www.andetag.museum/...` URLs in `site/`. Use root-relative paths backed by files in `site/public/`.
- **Missing media:** Download from production and commit under `site/public/` on the serving path. Do not leave hotlinks or invent placeholders.
- **Responsive images:** Follow `docs/responsive-image-workflow.md` for any new photograph or large raster.
- **CSS:** Fresh local styles in `site/src/styles/` or component-scoped. Do not copy legacy WordPress CSS.
- **JS:** Reimplement with local code and package-managed deps. Do not load legacy WP scripts.
- **Fonts:** Maintain `site/src/lib/fonts/sources.json`, regenerate via `npm run fonts:sync`.
- **Copy:** Follow `docs/Tone of Voice.md` and SEO constraints exactly.
- **Prose docs:** Avoid em dash; use commas, colons, or parentheses.
- **Design tokens** are universal across languages. Language changes content and variants, not core styling, unless an approved exception is logged.

---

## Cloudflare

- **Astro:** `output: "static"`, `trailingSlash: "always"`, `site: https://www.andetag.museum`. Normal static export to `dist/`. No `@astrojs/cloudflare` adapter.
- **Workers + static assets:** `wrangler.jsonc` sets `run_worker_first: true`. The entry router handles `/` and `/en/` language routing, then falls through to `ASSETS.fetch` for static pages.
- **Deploy:** `npm run worker:deploy` from `site/`. **Staging:** `https://andetag-web.guff.workers.dev`.
- **`_headers`:** Cache-Control per asset type. `~30 day` max-age on `/wp-content/uploads/*`. Prefer new filenames when replacing media at the same URL.

---

## Delivery

When finishing substantial work:

1. Report concrete file-level changes and behavior impact.
2. Call out constraints from docs that affected implementation.
3. Mention residual risks (language edge cases, untested variants, network-dependent checks).

### Phase closure

When a phase is marked complete:

1. Forward-audit all remaining future phase docs for invalidated assumptions.
2. Update affected docs in the same task, or log unresolved impacts as exceptions.
3. Remove scaffolding created only for the closing phase (preview routes, scratch checklists). Keep tests, fixtures, and verification records.
4. No phase closure is final until this audit is completed.
