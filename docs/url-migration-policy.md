# URL Migration Policy

Purpose: preserve SEO value and inbound links while rebuilding `andetag.museum` as a static site.

## Scope

- Applies to all public HTML page URLs in current and future ANDETAG site versions.
- Source of truth for discovered URLs:
  - `site-html/sitemap.xml`
  - page inventory docs in `docs/`

## Canonical URL Rules

- Canonical domain is `https://www.andetag.museum`.
- Canonical protocol is `https`.
- Canonical path style uses trailing slash for HTML content pages: `/path/`.
- Slugs must remain ASCII-only, lowercase, and hyphen-separated.
- Canonicals must not include tracking query parameters.

## Redirect Rules (Global)

- Redirect non-canonical host to canonical host (`andetag.museum` -> `www.andetag.museum`) using `301`.
- Redirect `http` to `https` using `301`.
- Redirect non-trailing-slash HTML page paths to trailing-slash paths using `301`.
- Redirect uppercase path requests to lowercase canonical paths using `301`.
- Preserve query parameters through all redirects (including `utm_*`, `gclid`, `fbclid`, and similar).
- Normalize common malformed paths (for example duplicate slashes) to canonical path using `301`.
- Normalize percent-encoded path variants to canonical URL form using `301`:
  - decode percent-encoded unreserved ASCII characters to plain characters
  - keep reserved characters percent-encoded where decoding could change path meaning
  - use uppercase hex for any remaining percent-encoded bytes

## Language and Destination Routing Rules

- German root:
  - Canonical: `/de/berlin/`
  - Redirect: `/de/` -> `/de/berlin/` (`301`)
- English Berlin path:
  - Canonical target path: `/en/berlin/`
  - Legacy alias: `/en/berlin-en/` -> `/en/berlin/` (`301`)
- English Art Yoga path:
  - Canonical target path: `/en/stockholm/art-yoga/`
  - Legacy alias: `/en/stockholm/art-yoga-en/` -> `/en/stockholm/art-yoga/` (`301`)

## SEO Landing Page Policy

The following Swedish Stockholm SEO landing pages remain indexable and live:

- `/stockholm/aktivitet-inomhus-stockholm/`
- `/stockholm/att-gora-stockholm/`
- `/stockholm/museum-stockholm/`
- `/stockholm/npf-stockholm/`
- `/stockholm/utstallning-stockholm/`

Policy notes:
- These may share base content blocks, but each page can keep distinct SEO intent fields (title, meta description, hero/header text, and opening copy).
- Do not collapse these pages into one canonical URL.

## Privacy URL Policy

- Canonical privacy URL remains `/privacy/` for migration continuity.
- Optional alias `/privacy-policy/` should redirect to `/privacy/` (`301`) if introduced.

## Query Parameter Policy

- Query parameters do not create canonical variants.
- Canonical URLs are always stored and emitted without query strings.
- Requests with query parameters must resolve to the same canonical page path, preserving parameters through redirects where redirects occur.
- Known tracking parameters (`utm_*`, `gclid`, `fbclid`, `msclkid`) are allowed for attribution and must not be used for indexable URL expansion.

## Non-HTML Endpoint Policy

- WordPress/system endpoints (`/wp-json/`, `/xmlrpc.php`, feed URLs, and admin endpoints) are non-HTML and are not migrated as indexable pages.
- Non-HTML assets (images, videos, PDFs) keep direct asset URLs where needed and are excluded from page canonical maps.
- Any legacy non-HTML endpoint retained for compatibility must be explicitly listed in the URL matrix with `page_type=non_html` and `status` set to `redirect` or `remove`.
- Trailing slash normalization applies only to HTML content routes, never to file-extension endpoints (for example `.pdf`, `.jpg`, `.xml`, `.json`).

## Berlin Transition Policy

- Berlin temporary prelaunch/waitlist content and live content should use the same stable destination URLs.
- Replace content in place when business stage changes, avoid URL changes unless unavoidable.

## Sitemap and Canonicalization Requirements

- XML sitemap must list canonical URLs only.
- Redirecting aliases must not be included in sitemap.
- Every indexable page must have:
  - self-referencing canonical tag
  - hreflang tags where language equivalents exist

## Implementation Requirements

- Redirect behavior must be implemented at hosting/CDN edge level where possible.
- Redirect tests must verify:
  - status code (`301`)
  - final URL correctness
  - query parameter preservation
- URL matrix artifacts should map:
  - `source_url`
  - `canonical_url`
  - `status`
  - `redirect_type`
  - `notes`

## Policy Status

This policy is currently closed for Phase 0 and can be used as implementation input.
