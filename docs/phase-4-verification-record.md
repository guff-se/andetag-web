# Phase 4 Verification Record

Purpose: capture routing, redirect, and shell verification evidence plus stakeholder sign-off for Phase 4 closure.

## Sign-off

| Field | Value |
|-------|--------|
| Phase | 4 |
| Stakeholder approval | pending (record date when approved) |
| Record date | 2026-03-23 (partial); update on sign-off |

## Redirects (repo `site/public/_redirects`)

Validated with `curl -sI` on deployed Workers static assets:

| Environment | Date | Result |
|-------------|------|--------|
| `https://andetag-web.guff.workers.dev/` | 2026-03-23 | Pass — matrix redirects (cases 1–4) and policy `/privacy-policy/` → `/privacy/` (case 5); see `docs/phase-4-redirect-tests.md`. |

## Static route shells

- **Build:** `npm run build` in `site/` produces `index.html` plus one `index.html` per matrix `keep` path under `[...slug].astro` (49 content shells plus internal preview routes).
- **Parity:** `site/src/lib/routes/url-matrix-parity.test.ts` asserts `docs/url-matrix.csv` `keep` canonical paths match `PAGE_SHELL_PATHS` exactly.

## Hreflang and canonical

- BCP47 attribute mapping (`sv-SE`, `en`, `de-DE`) and optional `x-default` via `site/src/lib/layout/seo.ts` and `page-shell-registry.ts`.
- Spot-check: view source on `/`, `/en/stockholm/tickets/`, `/de/berlin/` for `link rel="canonical"` and `alternate` tags.

## Known exception

- **EX-0007** (`docs/migration-exceptions.md`): `/en/stockholm/` shell metadata. Local snapshot `en-stockholm.html` and live `https://www.andetag.museum/en/stockholm/` both expose Swedish home `<title>` / `og:description` and canonical `/`. Shell reuses `en.html` metadata as the least-wrong snapshot until Phase 5 migration supplies correct English hub copy.

## Carry-forward

- Phase 5: replace empty main shells with migrated content per `docs/phase-3-component-usage.md`.
- Phase 7: XML sitemap and `robots.txt` per `docs/grand-plan.md`.
