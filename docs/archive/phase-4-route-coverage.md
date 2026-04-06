# Phase 4 Route Coverage

Purpose: map every `docs/url-matrix.csv` row to its static implementation (Astro page, redirect rule, or exception).

Status: aligned with `site/` implementation. **2026-03-23:** Phase 4 shells closed. **2026-03-28:** Location-scoped story URLs, four privacy shells, and matrix or **`_redirects`** refresh (**`docs/routing-location-scoped-global-pages-plan.md`**).

## Summary

| Mechanism | Count | Notes |
|-----------|------:|-------|
| Static HTML shell (`index.astro` redirect + `[...slug].astro`) | 61 | Paths keyed in `site/src/data/page-shell-meta.json`; **`/`** → **`/sv/stockholm/`** (`301`) from `index.astro` plus **`_redirects`** |
| Repo `public/_redirects` (Cloudflare Pages / Workers assets) | 23 | **`/de/`**, legacy EN or DE story paths, **`/privacy/`**, Swedish legacy paths, **`/stockholm/*`**, **`/`** (see `site/public/_redirects`; counts non-comment rules) |
| Internal routes (not in URL matrix) | 1 | Global **`404`** (`404.html`) |
| Matrix `redirect` rows | 24 | `redirect` rows in `docs/url-matrix.csv` (legacy **`301`** sources); keep aligned with **`_redirects`** |

**Layout modules and `dist/`:** files under `site/src/lib/chrome/` (for example `hero-sv.ts`, `footer-sv.ts`, `header-small-sv.ts`) are bundled into pages; only `site/src/pages/` produces URL directories in the static build output.

## Matrix rows (canonical paths)

**English and German:** canonical **`keep`** paths are **location-prefixed** where product rules require: **`/en/stockholm/...`**, **`/en/berlin/...`**, **`/de/berlin/...`**, plus **`/en/`** hub. See `docs/url-matrix.csv`.

**Swedish (canonical):** all **`keep`** Swedish content uses **`/sv/stockholm/...`** (home, utilities, story topics, privacy). Legacy **`/sv/musik/`**-style paths and unprefixed Swedish URLs are **`redirect`** rows to **`/sv/stockholm/...`**.

**Swedish (legacy `redirect` rows):** **`source_url`** paths (for example **`/`**, **`/stockholm/biljetter/`**, **`/musik/`**, **`/sv/musik/`**) **`301`** straight to the **`canonical_url`** in the matrix; implemented in **`site/public/_redirects`** (and must stay aligned with matrix).

**Privacy:** four **`keep`** shells (**`/sv/stockholm/privacy/`**, **`/en/stockholm/privacy/`**, **`/de/berlin/privacy/`**, **`/en/berlin/privacy/`**). Legacy **`/privacy/`** and **`/privacy-policy/`** **`301`** to **`/sv/stockholm/privacy/`**.

Host-level `http`/`https` and apex → `www` redirects are owned by Cloudflare (see `docs/phase-4-todo.md` decision block), not by `_redirects`.

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
