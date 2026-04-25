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

**Status:** Phases **0–8** closed (**`docs/phase-8-verification-record.md`** §Closure). **Phase 9** is **partially active**: **`docs/phase-9-todo.md`** **P9-25** (release discipline) and **P9-26** (post-cutover organic monitoring). **P9-00** governance is **complete**: **`docs/phase-9-plan.md`** (§A, **North-star**). Remaining Phase 9 exit work and id rows: that checklist and the plan.

**Languages:** Swedish (`sv`), English (`en`), German (`de`) with preserved hreflang relationships.

**Locations:** Stockholm (live, multilingual) and Berlin (pre-launch).

---

## Code Layout

```
web/
├── AGENTS.md              # This guide
├── CHANGELOG.md           # Human-readable change log (see docs/changelog-standards.md)
├── .github/workflows/     # CI: Node tests + build
├── archive/
│   └── legacy-wordpress-site/  # spider.py, site-html/, site-md/ (frozen WP mirror; read-only)
├── docs/                  # Active migration and architecture specs
│   └── archive/           # Closed-phase checklists, superseded plans, historical reference
├── skills/                # Agent skills (see skills/README.md); pointers in .claude/skills/ and .cursor/rules/
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
```

---

## Documentation

Consult before implementation. All active docs are in `docs/`.

| Doc | Use when |
|-----|----------|
| `docs/grand-plan.md` | Roadmap, phase gates, business objectives, decision log |
| `docs/phase-8-todo.md` | **Closed** Phase 8: deployment checklist, URL parity, `www` cutover |
| `docs/phase-8-verification-record.md` | Phase 8 evidence and Gustaf sign-off (§Closure) |
| `docs/phase-9-todo.md` | **Current ops:** **P9-25**, **P9-26**; **P9-00** done (**`docs/phase-9-plan.md`**). Other Phase 9 ids: see checklist (skills, **P9-20**+ PR-gate convention, exit criteria) |
| `docs/Andetag SEO Manual.md` | SEO/GEO decisions, page intent, language strategy, schema |
| `docs/seo/url-architecture.md` | **Ongoing** URL contract: canonical, redirects, hreflang, entry routing, sitemap, location-scoped stories, privacy, query/non-HTML/asset rules, Berlin transition. Successor to `docs/url-migration-policy.md` |
| `docs/seo/decisions.md` | **Ongoing** SEO decision log (`SEO-NNNN`): durable deviations from default rules. Successor to the SEO-relevant rows of `docs/migration-exceptions.md` |
| `docs/Tone of Voice.md` | User-facing copy and metadata text |
| `docs/Visual Identity.md` | Typography, color palette, CTA mapping |
| `docs/url-migration-policy.md` | **Migration-era reference** — canonical URLs, redirects, entry routing, sitemap. Ongoing successor: `docs/seo/url-architecture.md`. Archived at Phase 9 closure |
| `docs/phase-4-routing-reopen.md` | Routing decisions, open questions, location/language matrix |
| `docs/phase-4-redirect-tests.md` | Redirect test tables and execution log |
| `docs/content-model.md` | Page frontmatter, shared data contracts, component props |
| `docs/phase-3-component-usage.md` | Component API reference and usage patterns |
| `docs/definition-of-done.md` | Measurable exit checks per phase |
| `docs/migration-exceptions.md` | **Migration-era reference** — `EX-NNNN` deviations from Phase 1–8. Ongoing SEO decisions live in `docs/seo/decisions.md`; ongoing operational decisions live as §Decisions blocks in the relevant skill. Archived at Phase 9 closure |
| `docs/performance-improvement-plan.md` | Lighthouse, responsive images, script loading |
| `docs/responsive-image-workflow.md` | **Mandatory** when adding photos: derivative generation, suffix rules, wiring |
| `docs/tracking-and-consent-requirements.md` | GTM, Brevo, consent categories |
| `docs/kpi-measurement-map.md` | Analytics measurement, GTM audit, consent migration checklist |
| `docs/gtm-consent-migration-runbook.md` | Step-by-step GTM work for Phase 8 P8-07 |
| `docs/phase-8-cutover-runbook.md` | DNS, Workers custom domain, TLS, rollback, post-cutover PR discipline (P8-10, P8-11; checklist **P9-25** in `docs/phase-9-todo.md`) |
| `docs/decisions/0002-consent-platform-selection.md` | CMP selection ADR (CookieConsent implemented) |
| `docs/changelog-standards.md` | How to write CHANGELOG.md entries |
| `skills/README.md` | **Agent skills** index and authoring pattern. Canonical skill files live at `skills/<name>/SKILL.md`; pointers in `.claude/skills/` (Claude Code symlinks) and `.cursor/rules/<name>.mdc` (Cursor thin wrappers). Landed: `page` (P9-12), `faq` (P9-16), `events` (P9-17), `operational-facts` (P9-18), `images` (P9-19), `testimonials` (P9-14), `rollback` (P9-30), `site-integrity` (P9-31), `performance-check` (P9-10 + P9-40), `seo` (P9-13), `quicklinks`. |
| `docs/archive/` | Closed-phase checklists, verification records, superseded plans |

**Rule:** If behavior changes, update the relevant doc in the same task.

---

## Coherence Checklist

Changes often affect multiple layers. Audit before concluding:

| Layer | What to check |
|-------|---------------|
| **Astro site** | `site/src/` components, pages, lib, styles, client scripts |
| **Workers / routing** | `site/workers/`, `site/public/_redirects`, `_headers`, URL policy doc |
| **Legacy WP mirror (archived)** | `archive/legacy-wordpress-site/site-html/` and `.../site-md/` — not maintained |
| **SEO / shell meta** | `docs/meta-texts-catalog.md`, `docs/Andetag SEO Manual.md`, `site/src/data/page-shell-meta.json` |
| **Docs** | Architecture, tone, and SEO docs that describe changed behavior |

For cross-cutting changes:
1. Search for old field names, slugs, URL paths.
2. Verify language-specific impacts (sv/en/de) and hreflang/canonical consistency.
3. Confirm no contradiction with tone and SEO constraints.

**Multilingual page parity:** When the same logical page exists in more than one language (paired page bodies such as `*En.astro` / `*Sv.astro`, mirrored FAQ modules, or Berlin `de`/`en` pairs), update **every** language variant in the **same task** unless the collaborator explicitly requests a single-locale change only. Editing one locale and not the others causes structural and copy drift (links, CTAs, headings, accordion depth), breaks hreflang intent, and is easy to miss in review.

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
```

CI (`.github/workflows/ci.yml`) runs Node tests and build on push and PR to `main`. Optional: `cd archive/legacy-wordpress-site && PYTHONPATH=. python3 -m unittest discover -s tests` for the archived crawler unit tests.

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
- **Multilingual edits:** Same rule as the Coherence Checklist: never change only one language of a multi-language page unless explicitly asked (see **Multilingual page parity** there).
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
