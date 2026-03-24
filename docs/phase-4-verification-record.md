# Phase 4 Verification Record

Purpose: capture routing, redirect, and shell verification evidence plus stakeholder sign-off for Phase 4 closure.

## Sign-off

| Field | Value |
|-------|--------|
| Phase | 4 |
| Stakeholder approval | Gustaf (2026-03-23), Phase 4 routing and shells approved |
| Record date | 2026-03-23 |

## Redirects (repo `site/public/_redirects`)

Validated with `curl -sI` on deployed Workers static assets:

| Environment | Date | Result |
|-------------|------|--------|
| `https://andetag-web.guff.workers.dev/` | 2026-03-23 | Pass — matrix redirects (cases 1–4) and policy `/privacy-policy/` → `/privacy/` (case 5); see `docs/phase-4-redirect-tests.md`. |

## Static route shells

- **Build:** `npm run build` in `site/` produces `index.html` plus one `index.html` per matrix `keep` path under `[...slug].astro`, plus non-matrix **`404.html`**.
- **Parity:** `site/src/lib/routes/url-matrix-parity.test.ts` asserts `docs/url-matrix.csv` `keep` canonical paths match `PAGE_SHELL_PATHS` exactly.

## Hreflang and canonical

- BCP47 attribute mapping (`sv-SE`, `en`, `de-DE`) and optional `x-default` via `site/src/lib/chrome/seo.ts` and `page-shell-registry.ts`.
- Spot-check: view source on **`/sv/stockholm/`**, **`/en/stockholm/tickets/`**, **`/de/berlin/`** for `link rel="canonical"` and `alternate` tags (and that **`/`** responds with **`301`** to **`/sv/stockholm/`** where redirects apply).

## Known exception

- **EX-0007** (`docs/migration-exceptions.md`): `/en/stockholm/` shell metadata. Approved with Phase 4 closure; shell reuses `en.html` metadata until Phase 5 supplies correct English hub head tags and body.

## Carry-forward

- Phase 5: replace empty main shells with migrated content per `docs/phase-3-component-usage.md`.
- Phase 7: XML sitemap and `robots.txt` per `docs/grand-plan.md`.
