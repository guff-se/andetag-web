# Agent Guide: ANDETAG Web

Read this at session start. Then read [`docs/project-overview.md`](docs/project-overview.md) for the current-state mental model.

---

## Why this project exists

`https://www.andetag.museum` is the public website of ANDETAG, an immersive museum that breathes. Stockholm is live and operational; Berlin is pre-launch (opening fall 2026). The site has one job: send qualified visitors into the external Understory checkout to complete a ticket purchase. Everything else — copy, photography, FAQ, schema, performance, locale routing — is funnel optimization in service of that primary KPI.

Audience priority is ranked: Stockholm locals → tourists → couples and corporate visitors → mindfulness/yoga audiences. Berlin will mirror once open. The brand register is calm and invitational ("the breathing museum"). Tone, visual identity, and SEO doctrine are normative, not decorative.

The migration from WordPress closed on **2026-04-14**. The Phase 9 maintenance program closed on **2026-04-25**. From that point the project is operated as a **maintenance repository**, not a build project. There is no roadmap of phases, no cutover work, no migration vocabulary. There is the live site, the doctrine that governs it, and the work it needs.

---

## Operating principles

These are the invariants. Treat them as a contract; let them drive judgment on every change.

1. **Source integrity.** This site ships real content for a public museum. Never fabricate URLs, prices, hours, ratings, review quotes, photo credits, or schema fields. Anchor every change to a runtime source (`stockholm-*.ts`, `schema-org.ts`, `page-shell-meta.json`, `photos.yaml`) or to a live doctrine doc under `docs/` (outside `docs/archive/`). If required data is missing or ambiguous, stop and ask. **Do not** open, search, or use **`archive/`** (including `archive/legacy-wordpress-site/`) for content, copy, SEO, or “what did the old site say.” It exists for repository history, not for maintenance work. The same rule applies to **`docs/archive/`**: do not extend it or treat it as an active manual.

2. **Doc/code coherence.** Every behavior change updates the doc that describes it, in the same task. Doctrine docs (`docs/seo/`, `docs/Tone of Voice.md`, `docs/Andetag SEO Manual.md`, `docs/Visual Identity.md`, `docs/content-model.md`) are normative. When code drifts from doctrine, fix the code or revise the doctrine — never both silently, never neither.

3. **Locale parity.** Stockholm runs `sv` + `en`; Berlin runs `de` + `en`. Hreflang is paired per location (no Stockholm/Berlin cross-pairing). When the same logical page exists in more than one language, update **every** locale in the same task unless the collaborator explicitly scopes to one. A Berlin English shell that canonicalizes to Stockholm English (`SEO-0016`) is still a parity-bound page for hreflang purposes.

4. **Skills are the contract.** Routine maintenance work runs through `skills/<name>/SKILL.md`. The skill names which files move together, which parity rules apply, and which verification commands gate merge. Read the matching skill before editing. If no skill covers the work, **add or extend one** — do not bury tribal knowledge in PR descriptions or in this guide.

5. **PR, preview, merge.** No direct pushes to `main`. Every change ships via PR. Cloudflare posts a per-commit preview URL; that preview is the practical merge gate. Open it, walk the change, then merge.

6. **Scope discipline.** Match the scope of the action to what was asked. A copy edit is not a refactor. A bug fix does not need surrounding cleanup. No half-finished implementations, no speculative abstractions, no "while I'm here" diffs bundled into unrelated PRs.

7. **Maintenance vocabulary, not migration.** Phase numbers, cutover steps, and grand-plan terminology belong to `docs/archive/` only. Live docs, code, and PRs refer to live concepts.

8. **Execute end-to-end.** Treat direct user statements as action requests by default. Do the work, then report. Ask only when you would otherwise have to invent project facts.

---

## Mental model

Full current-state description: [`docs/project-overview.md`](docs/project-overview.md). Read it once, then keep these reminders:

- **Stack.** Astro static export (`output: "static"`, `trailingSlash: "always"`, canonical `https://www.andetag.museum`) on Cloudflare Workers (`run_worker_first: true`). Static `dist/` served via the `ASSETS` binding. No `@astrojs/cloudflare` adapter.
- **Entry router.** `site/workers/entry-router.ts` handles `/` and exact `/en/`. Verified bots receive a `301` to `/en/stockholm/`; humans are routed by `Accept-Language` + Cloudflare `cf.country` + the `andetag_entry` cookie. Everything else falls through to the asset handler.
- **Hosts.** Production `https://www.andetag.museum`. Staging `https://andetag-web.guff.workers.dev`.
- **People.** Sole maintainer is Gustaf. Museum directors collaborate through Cloud Claude Code or OpenClaw with full PR rights. Onboarding: [`docs/collaborator-guide.md`](docs/collaborator-guide.md).
- **External tools.** Read-only GSC / GA4 / sales queries use the sibling `andetag-stats` CLI (`../stats/cli`); credentials live in that project, not this repo.

---

## Code layout

```
web/
├── AGENTS.md              # This guide
├── CHANGELOG.md           # See docs/changelog-standards.md
├── archive/               # Do not use for agent work (see Source integrity)
├── docs/                  # Live operational references
│   └── archive/           # Closed records — do not use for agent work
├── skills/                # Canonical SKILL.md per task
├── .claude/skills/        # Claude Code pointers (symlinks to /skills/<name>)
├── .cursor/rules/         # Cursor pointers (.mdc wrappers)
└── site/                  # Astro workspace
    ├── public/            # Static assets, _redirects, _headers
    ├── scripts/           # Build/verify tooling (meta, fonts, lighthouse, verify-staging)
    ├── workers/           # Entry router (entry-router.ts, entry-routing-logic.ts)
    ├── wrangler.jsonc     # run_worker_first + ASSETS binding
    └── src/
        ├── client-scripts/
        ├── components/    # chrome/, content/, embeds/, page-bodies/, ui/
        ├── data/          # page-shell-meta.json (generated)
        ├── layouts/       # SiteLayout.astro
        ├── lib/
        │   ├── chrome/    # Navigation, hero, footer, SEO, schema-org
        │   ├── content/   # stockholm-offers, stockholm-reviews, stockholm-faq, gallery, image paths
        │   ├── fonts/     # sources.json (npm run fonts:sync)
        │   ├── page-registry/
        │   ├── routes/    # page-shell-registry, navigation resolution
        │   └── ui-logic/
        ├── pages/         # File-based routes (index, [...slug], 404)
        └── styles/
```

---

## Skills — the operating contract

Skills are the unit of repeatable maintenance work. Each one teaches an agent how to perform a specific task end-to-end, names the files that move together, and lists the verification commands that gate merge. Canonical files live at `skills/<name>/SKILL.md`; `.claude/skills/` and `.cursor/rules/` carry pointers. The agent runtime matches user requests to skills via the `description` frontmatter — you do not need to be told which skill to use.

| Skill | What it does |
|-------|--------------|
| [`page`](skills/page/SKILL.md) | Add, edit, rename, or remove a content page (page-shell-meta, registries, navigation, locale parity). |
| [`faq`](skills/faq/SKILL.md) | Stockholm FAQ entries (sv + en parity, FAQPage JSON-LD, marketing FAQ subset). |
| [`events`](skills/events/SKILL.md) | Add, update, or remove events — recurring (Art Yoga) or one-off; own page or home block. |
| [`operational-facts`](skills/operational-facts/SKILL.md) | Stockholm hours, prices, daytime window, contact email, address, geo (with propagation set). |
| [`images`](skills/images/SKILL.md) | Pick photos and wire them through the responsive-image pipeline (alt parity, derivatives). |
| [`testimonials`](skills/testimonials/SKILL.md) | TripAdvisor rating, review count, featured reviews, vendor URL. |
| [`rollback`](skills/rollback/SKILL.md) | Revert recent content changes via `git revert` → PR → preview → merge. |
| [`site-integrity`](skills/site-integrity/SKILL.md) | Read-only audit: links, hreflang, sitemap, redirects, registry coherence. |
| [`performance-check`](skills/performance-check/SKILL.md) | Build + Lighthouse + drilldowns; GSC / GA4 / sales bridge to `andetag-stats`. |
| [`seo`](skills/seo/SKILL.md) | On-page SEO and entity graph: titles, meta, canonical, hreflang, OG, JSON-LD, internal linking, tone. |
| [`quicklinks`](skills/quicklinks/SKILL.md) | Manage the `302` Quicklinks block in `site/public/_redirects`. |

Index of record and authoring template: [`skills/README.md`](skills/README.md).

---

## Documentation map

Read each doc when the work intersects its topic. Mental model lives in `docs/project-overview.md`; doctrine lives in the docs below.

| Doc | Read when |
|-----|-----------|
| [`docs/project-overview.md`](docs/project-overview.md) | First session, or when re-establishing the mental model. |
| [`docs/collaborator-guide.md`](docs/collaborator-guide.md) | Onboarding a non-technical collaborator (museum directors). |
| [`docs/Andetag SEO Manual.md`](docs/Andetag%20SEO%20Manual.md) | Page intent, language strategy, schema strategy, Berlin rollout, internal linking. |
| [`docs/Tone of Voice.md`](docs/Tone%20of%20Voice.md) | Any user-facing copy or metadata text; banned words; locale register. |
| [`docs/Visual Identity.md`](docs/Visual%20Identity.md) | Typography, color palette, CTA mapping. |
| [`docs/seo/url-architecture.md`](docs/seo/url-architecture.md) | Canonical URL contract, redirects, hreflang, entry routing, sitemap. |
| [`docs/seo/decisions.md`](docs/seo/decisions.md) | Durable SEO decisions log (`SEO-NNNN`): deviations from default rules. |
| [`docs/seo/README.md`](docs/seo/README.md) | SEO doctrine entry-point map. |
| [`docs/content-model.md`](docs/content-model.md) | Page frontmatter, shared data contracts, component props. |
| [`docs/component-usage.md`](docs/component-usage.md) | Component API reference and usage patterns. |
| [`docs/responsive-image-workflow.md`](docs/responsive-image-workflow.md) | **Mandatory** when adding photos: derivative generation, suffix rules, wiring. |
| [`docs/meta-texts-catalog.md`](docs/meta-texts-catalog.md) | Shell title and meta description per canonical path. |
| [`docs/performance-improvement-plan.md`](docs/performance-improvement-plan.md) | Lighthouse budgets, image and script playbook. |
| [`docs/tracking-and-consent-requirements.md`](docs/tracking-and-consent-requirements.md) | GTM, Brevo, consent categories. |
| [`docs/kpi-measurement-map.md`](docs/kpi-measurement-map.md) | Analytics measurement and GTM audit. |
| [`docs/changelog-standards.md`](docs/changelog-standards.md) | How to write `CHANGELOG.md` entries. |
| [`docs/url-matrix.csv`](docs/url-matrix.csv) | Canonical / redirect / status matrix; referenced by `site-integrity` and `page`. |
| [`docs/maintenance-backlog.md`](docs/maintenance-backlog.md) | One-time tasks tracked across maintenance work (`M-NNNN`). |
| `docs/archive/` | **Agents must not** read or cite for ongoing work. Maintainers may consult humans-only; the live stack is in non-archive docs and `site/src/`. |

**Rule:** if behavior changes, update the relevant doc in the same task.

---

## Coherence checklist

Most changes touch multiple layers. Audit before concluding:

| Layer | What to check |
|-------|---------------|
| Astro site | `site/src/` components, pages, lib, styles, client scripts |
| Workers / routing | `site/workers/`, `site/public/_redirects`, `_headers`, `docs/seo/url-architecture.md` |
| SEO / shell meta | `docs/meta-texts-catalog.md`, `docs/Andetag SEO Manual.md`, `site/src/data/page-shell-meta.json`, `docs/seo/decisions.md` |
| Doctrine docs | Tone, SEO, content model, URL architecture — update any doc that describes changed behavior |

For cross-cutting changes:

1. Search for old field names, slugs, URL paths.
2. Verify language-specific impacts (`sv` / `en` / `de`) and hreflang/canonical consistency.
3. Confirm no contradiction with tone or SEO doctrine.

**Multilingual page parity:** When the same logical page exists in more than one language (paired bodies such as `*En.astro` / `*Sv.astro`, mirrored FAQ modules, or Berlin `de`/`en` pairs), update **every** language variant in the **same task** unless the collaborator explicitly requests a single-locale change. Editing one locale and not the others causes structural and copy drift, breaks hreflang intent, and is easy to miss in review.

**Before changing routes:** Read `docs/seo/url-architecture.md`. Run `npm run verify:staging-entry` from `site/` after entry-router or redirect changes.

---

## Verification

```bash
cd site && npm test          # Vitest (primary)
cd site && npm run build     # Static build (also CI on push/PR to main)

# When the change demands it:
cd site && npm run lighthouse:all          # Mobile perf sweep (needs built dist/)
cd site && npm run verify:staging-entry    # Entry routing vs staging
```

Run the matching skill's **Verification** section before requesting merge. If a check is skipped, say so in the PR body.

CI (`.github/workflows/ci.yml`) runs Node tests and build on push and PR to `main`.

Standing exceptions for SEO live in `docs/seo/decisions.md` (`SEO-NNNN`). Operational decisions (e.g. public contact email) live as **§Decisions** blocks inside the relevant skill.

---

## Delivery

When finishing substantial work:

1. Report concrete file-level changes and behavior impact.
2. Call out doctrine constraints that shaped the implementation.
3. Mention residual risks — language edge cases, untested variants, network-dependent checks.
4. Confirm the Cloudflare preview URL (or note that the change is doc-only).

The preview is the merge gate. Open it, walk the change, then merge.

---

## Conventions

- **Locale suffixes** at end of filename: `hero-sv.ts`, `hero-en.ts`, `hero-de.ts`.
- **Self-host all first-party assets.** No absolute `https://www.andetag.museum/...` URLs in `site/`. Use root-relative paths backed by files in `site/public/`.
- **Missing media:** Download from production and commit under `site/public/` on the serving path. No hotlinks, no placeholders.
- **Responsive images:** Follow `docs/responsive-image-workflow.md` for any new photograph or large raster.
- **CSS:** Fresh local styles in `site/src/styles/` or component-scoped. Do not import styles from the pre-Astro platform.
- **JS:** Reimplement with local code and package-managed deps. No legacy third-party scripts from retired stacks.
- **Fonts:** Maintain `site/src/lib/fonts/sources.json`; regenerate via `npm run fonts:sync`.
- **Copy:** Follow `docs/Tone of Voice.md` and SEO doctrine exactly.
- **Prose docs:** Avoid em dash; use commas, colons, or parentheses.
- **Design tokens** are universal across languages. Language changes content and variants, not core styling, unless an approved exception is logged in `docs/seo/decisions.md` (SEO) or the relevant skill's §Decisions block (operational).

---

## Cloudflare

- **Astro:** `output: "static"`, `trailingSlash: "always"`, `site: https://www.andetag.museum`. Static export to `dist/`. No `@astrojs/cloudflare` adapter.
- **Workers + static assets:** `wrangler.jsonc` sets `run_worker_first: true`. The entry router handles `/` and exact `/en/` language routing, then falls through to `ASSETS.fetch` for static pages.
- **Deploy:** `npm run worker:deploy` from `site/`. Staging: `https://andetag-web.guff.workers.dev`.
- **`_headers`:** Cache-Control per asset type. ~30 day max-age on `/wp-content/uploads/*`. Prefer new filenames when replacing media at the same URL.

---

The site exists for one outcome: a completed ticket purchase in Understory. Calm, fast, accurate, in the visitor's language. Every change should serve that — and when in doubt, choose the option that makes the next visitor more likely to complete the funnel.
