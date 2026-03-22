# Phase 4, 404 behavior

Purpose: document the global not-found page for the static Astro build (Phase 4 shells).

## Implementation

- **Source:** `site/src/pages/404.astro`
- **Output:** `404.html` at site root of the deploy bundle (Cloudflare serves it for unknown paths).
- **Layout:** `SiteLayout` with `language="sv"`, `destination="stockholm"`, small Swedish header (`header-2223`), Swedish footer (`footer-207`).
- **Copy:** Swedish primary heading and body; recovery links to `/`, `/en/`, `/de/berlin/`, `/stockholm/biljetter/`.
- **SEO:** `robots` `noindex,follow`; no `hreflang` alternates (`xDefaultPath` null).
- **Accessibility:** Skip link to `#main-content`, visible heading, list of text links (keyboard and screen-reader friendly).

## Policy alignment

- Matches Phase 4 decision for a single global 404 (not per-locale pages).
- See also `docs/phase-4-route-coverage.md` (404 subsection).
