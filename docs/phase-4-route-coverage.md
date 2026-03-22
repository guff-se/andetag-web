# Phase 4 Route Coverage

Purpose: map every `docs/url-matrix.csv` row to its static implementation (Astro page, redirect rule, or exception).

Status: aligned with Phase 4 implementation in `site/` (2026-03-23).

## Summary

| Mechanism | Count | Notes |
|-----------|------:|-------|
| Static HTML shell (`index.astro` + `[...slug].astro`) | 49 | Paths keyed in `site/src/data/page-shell-meta.json` |
| Repo `public/_redirects` (Cloudflare Pages / Workers assets) | 4 | `/de/`, legacy EN aliases, optional `/privacy-policy/` → `/privacy/` per URL policy |
| Internal or preview-only routes (not in URL matrix) | 4 | `layout-preview`, `header-small-sv`, `component-showcase`, `404` |
| Matrix `redirect` rows covered by `_redirects` | 3 | Matches `redirect_type=301` rows in `url-matrix.csv` |
| Policy-only redirect | 1 | `/privacy-policy/` (not a separate matrix row) |

## Matrix rows

| canonical_url (path) | status | Implementation |
|----------------------|--------|------------------|
| `/` | keep | `site/src/pages/index.astro` |
| `/de/` | redirect | `site/public/_redirects` → `/de/berlin/` |
| `/de/berlin/` | keep | `[...slug].astro` |
| `/de/die-kuenstler-malin-gustaf-tadaa/` | keep | `[...slug].astro` |
| `/de/musik-von-andetag/` | keep | `[...slug].astro` |
| `/de/optische-fasertextil/` | keep | `[...slug].astro` |
| `/de/ueber-andetag/` | keep | `[...slug].astro` |
| `/en/` | keep | `[...slug].astro` |
| `/en/about-andetag/` | keep | `[...slug].astro` |
| `/en/about-the-artists-malin-gustaf-tadaa/` | keep | `[...slug].astro` |
| `/en/berlin-en/` | redirect | `site/public/_redirects` → `/en/berlin/` |
| `/en/berlin/` | keep | `[...slug].astro` |
| `/en/music/` | keep | `[...slug].astro` |
| `/en/optical-fibre-textile/` | keep | `[...slug].astro` |
| `/en/stockholm/` | keep | `[...slug].astro` |
| `/en/stockholm/accessibility/` … `what-kind-of-experience/` | keep | `[...slug].astro` (one file per path) |
| `/en/stockholm/art-yoga-en/` | redirect | `site/public/_redirects` → `/en/stockholm/art-yoga/` |
| `/en/stockholm/art-yoga/` | keep | `[...slug].astro` |
| `/musik/` | keep | `[...slug].astro` |
| `/om-andetag/` | keep | `[...slug].astro` |
| `/om-konstnarerna-malin-gustaf-tadaa/` | keep | `[...slug].astro` |
| `/optisk-fibertextil/` | keep | `[...slug].astro` |
| `/privacy/` | keep | `[...slug].astro` |
| `/stockholm/*` (all matrix paths) | keep | `[...slug].astro` |

Host-level `http`/`https` and apex → `www` redirects are owned by Cloudflare (see `docs/phase-4-todo.md` decision block), not by `_redirects`.

Optional alias **`/privacy-policy/`** → **`/privacy/`** (`301`) is defined in `_redirects` per `docs/url-migration-policy.md` (not listed as its own row in `url-matrix.csv`).

## Artifacts

- Shell metadata extraction: `site/scripts/extract-page-shell-meta.mjs` → `site/src/data/page-shell-meta.json`
- Layout and hreflang resolution: `site/src/lib/routes/page-shell-registry.ts`
- Redirects: `site/public/_redirects`

## 404 behavior

See **`docs/phase-4-404.md`**. Summary:

- Global static `404.html` from `site/src/pages/404.astro`.
- Swedish-primary copy and `html lang="sv"` via `SiteLayout`; recovery links to `/`, `/en/`, `/de/berlin/`, `/stockholm/biljetter/`.
- `robots`: `noindex,follow`.

## Exceptions

- **EX-0007** in `docs/migration-exceptions.md`: `/en/stockholm/` title and description reuse `en.html` because `en-stockholm.html` snapshot canonical points at `/`.
