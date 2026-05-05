# Project overview

Current-state description of `andetag.museum`. Read this for the mental model of what the project **is** today; read the doc table in `AGENTS.md` for what to consult when making a change.

This doc replaces `docs/archive/grand-plan.md` (the historical migration roadmap, kept for reference only).

---

## What the site is

`https://www.andetag.museum` is the website of ANDETAG, an immersive museum that breathes. Stockholm is live and operational; Berlin is pre-launch (opening planned for fall 2026). The site is a static Astro export served by a Cloudflare Workers entry router plus the static asset binding. There is no CMS and no WordPress runtime; content is versioned in this repo.

The migration from WordPress (Phases 0 through 8 of the original grand plan) closed on **2026-04-14**. The maintenance program (formerly Phase 9) closed on **2026-04-25**. From this point forward, the project is operated as a maintenance repository, not a build project.

## Audiences and goals

- **Primary KPI:** completed ticket purchase in the external Understory checkout. The site is funnel optimization into that flow.
- **Audience priorities (ranked):** Stockholm locals → tourists → couples and corporate visitors → mindfulness/yoga audiences. Berlin will mirror once open.
- **Brand positioning:** "the breathing museum." Calm, invitational tone. Banned words and locale register are normative in `docs/Tone of Voice.md`.
- **Material fact (copy baseline):** describe the artworks as custom-woven and hand-stitched optical fibre textiles; do not describe them as hand-woven.

## Languages and locations

Three locales, two locations:

- **Stockholm:** Swedish (`sv`) and English (`en`). Hreflang pairs Swedish with English; no German alternate.
- **Berlin:** German (`de`) and English (`en`). Hreflang pairs German with English; no Swedish alternate. Pre-opening pages emit `Place` JSON-LD only.

The four Berlin English story shells canonicalize to their Stockholm English siblings (`SEO-0016`); their hreflang stays Berlin-internal.

The `/` and `/en/` entry routes are handled by the Worker (`site/workers/entry-router.ts`) using `Accept-Language`, Cloudflare `cf.country`, and the `andetag_entry` cookie. Verified bots land on `/en/stockholm/` from both `/` and `/en/`; `/en/` remains a human selector utility, emitted as `noindex,follow` and excluded from the sitemap (`SEO-0021`).

## Stack

- **Astro static** export to `dist/` (`output: "static"`, `trailingSlash: "always"`, canonical site `https://www.andetag.museum`).
- **Cloudflare Workers + static assets** with `run_worker_first: true`. Entry router runs first on `/` and exact `/en/`; everything else falls through to the asset handler.
- **Deploys:** `npm run worker:deploy` from `site/`. Main/staging alias `https://andetag-web.guff.workers.dev` points at `main` (same runtime as production hostname). Branch previews follow `https://<branch-name>-andetag-web.guff.workers.dev` (for example `https://feature-artworks-andetag-web.guff.workers.dev`).
- **CI:** GitHub Actions runs `npm test` and `npm run build` on push and PR to `main`.

## What lives where

| Area | Path |
|------|------|
| Page bodies | `site/src/components/page-bodies/*.astro` |
| Page registry | `site/src/lib/routes/page-shell-registry.ts` (locale pairs, canonical map, custom-body paths) |
| Page shell metadata | `site/src/data/page-shell-meta.json` (titles, descriptions, OG) |
| Navigation | `site/src/lib/chrome/navigation.ts` |
| SEO and schema | `site/src/lib/chrome/seo.ts`, `site/src/lib/chrome/schema-org.ts` |
| Entry router | `site/workers/entry-router.ts`, `entry-routing-logic.ts` |
| Redirects | `site/public/_redirects` |
| Operational facts | `site/src/lib/content/stockholm-offers.ts` (prices, daytime window, Art Yoga), `schema-org.ts` (address, geo, hours) |
| Reviews | `site/src/lib/content/stockholm-reviews.ts` |
| FAQs | `site/src/lib/content/stockholm-faq.ts` (+ shared "What is ANDETAG?" copy) |
| Image catalog | `assets/images/photos.yaml` (per-file trilingual alt + tags) |
| Skills | `skills/<name>/SKILL.md` |

## Operating model

- Sole maintainer: Gustaf. Collaborators: museum directors via Cloud Claude Code or OpenClaw. All have full create + approve rights on PRs.
- No direct pushes to `main`. Routine work ships via PR. Cloudflare commit-preview URL is the practical merge gate.
- Berlin-specific routing, copy, and schema changes happen post-launch; pre-opening Berlin pages stay scoped to existing shells.
- Read-only GSC / GA4 / sales queries use the sibling `andetag-stats` CLI (`../stats/cli`); credentials live in that project, not this repo.

## Doctrine docs

Live, ongoing reference material:

- **SEO contract:** `docs/seo/url-architecture.md`, `docs/seo/decisions.md`, `docs/Andetag SEO Manual.md`.
- **Tone:** `docs/Tone of Voice.md`.
- **Visual identity:** `docs/Visual Identity.md`.
- **Content model:** `docs/content-model.md`, `docs/component-usage.md`, `docs/responsive-image-workflow.md`.
- **Performance:** `docs/performance-improvement-plan.md`.
- **Tracking and consent:** `docs/tracking-and-consent-requirements.md`, `docs/kpi-measurement-map.md`.
- **Maintenance backlog:** `docs/maintenance-backlog.md`.

Migration-era artifacts (phase plans, verification records, the grand plan, URL migration policy, migration exceptions, ADRs) live in `docs/archive/`. They are reference-only; do not extend them.

## Where to start

- New collaborator? Read `docs/collaborator-guide.md`.
- New maintainer/agent? Read `AGENTS.md` and the relevant `skills/<name>/SKILL.md` for the change type.
- Adding a routine change? Find the matching skill in `skills/README.md`. If none fits, write or extend one.
