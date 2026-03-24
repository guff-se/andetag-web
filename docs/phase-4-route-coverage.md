# Phase 4 Route Coverage

Purpose: map every `docs/url-matrix.csv` row to its static implementation (Astro page, redirect rule, or exception).

Status: aligned with `site/` implementation. **2026-03-23:** Phase 4 shells closed. **Swedish `/sv/` prefix:** canonical Swedish paths and legacy **`301`** redirects applied in matrix, `_redirects`, registry, and metadata extractor.

## Summary

| Mechanism | Count | Notes |
|-----------|------:|-------|
| Static HTML shell (`index.astro` redirect + `[...slug].astro`) | 49 | Paths keyed in `site/src/data/page-shell-meta.json`; **`/`** → **`/sv/stockholm/`** (`301`) from `index.astro` plus **`_redirects`** |
| Repo `public/_redirects` (Cloudflare Pages / Workers assets) | 10 | **`/de/`**, legacy EN aliases, **`/privacy-policy/`**, Swedish legacy paths, **`/stockholm/*`**, **`/`** (see `site/public/_redirects`) |
| Internal routes (not in URL matrix) | 1 | Global **`404`** (`404.html`) |
| Matrix `redirect` rows covered by `_redirects` | 26 | All `redirect_type=301` rows in `url-matrix.csv` (Swedish legacy + existing de/en aliases) |
| Policy-only redirect | 1 | `/privacy-policy/` (not a separate matrix row) |

**Layout modules and `dist/`:** files under `site/src/lib/chrome/` (for example `hero-sv.ts`, `footer-sv.ts`, `header-small-sv.ts`) are bundled into pages; only `site/src/pages/` produces URL directories in the static build output.

## Matrix rows (canonical paths)

**English and German:** unchanged from previous coverage: **`/en/...`**, **`/de/...`** as in `docs/url-matrix.csv` **`keep`** rows.

**Swedish (canonical):** all **`keep`** Swedish content uses **`/sv/`**:

- Home: **`/sv/stockholm/`**
- Stockholm pages: **`/sv/stockholm/<slug>/`** (all former **`/stockholm/<slug>/`** paths)
- Shared Swedish: **`/sv/musik/`**, **`/sv/om-andetag/`**, **`/sv/om-konstnarerna-malin-gustaf-tadaa/`**, **`/sv/optisk-fibertextil/`**

**Swedish (legacy `redirect` rows):** **`source_url`** paths without **`/sv/`** (for example **`/`**, **`/stockholm/biljetter/`**, **`/musik/`**) **`301`** to the **`canonical_url`** in the matrix; implemented in **`site/public/_redirects`** (and must stay aligned with matrix).

**Privacy:** **`/privacy/`** **`keep`**, locale-neutral path (unchanged).

Host-level `http`/`https` and apex → `www` redirects are owned by Cloudflare (see `docs/phase-4-todo.md` decision block), not by `_redirects`.

Optional alias **`/privacy-policy/`** → **`/privacy/`** (`301`) is defined in `_redirects` per `docs/url-migration-policy.md` (not listed as its own row in `url-matrix.csv`).

## Artifacts

- Shell metadata extraction: `site/scripts/extract-page-shell-meta.mjs` → `site/src/data/page-shell-meta.json`
- Layout and hreflang resolution: `site/src/lib/routes/page-shell-registry.ts`
- Redirects: `site/public/_redirects`

## 404 behavior

See **`docs/phase-4-404.md`**. Summary:

- Global static `404.html` from `site/src/pages/404.astro`.
- Swedish-primary copy and `html lang="sv"` via `SiteLayout`; recovery links to **`/sv/stockholm/`**, **`/en/`**, **`/de/berlin/`**, **`/sv/stockholm/biljetter/`**.
- `robots`: `noindex,follow`.

## Exceptions

- **EX-0007** in `docs/migration-exceptions.md`: `/en/stockholm/` title and description reuse `en.html` because `en-stockholm.html` snapshot mis-targets canonicals relative to the Swedish home.
