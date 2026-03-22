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
- Canonical path style uses trailing slash for content pages: `/path/`.
- Slugs must remain ASCII-only, lowercase, and hyphen-separated.
- Canonicals must not include tracking query parameters.

## Redirect Rules (Global)

- Redirect non-canonical host to canonical host (`andetag.museum` -> `www.andetag.museum`) using `301`.
- Redirect `http` to `https` using `301`.
- Redirect non-trailing-slash page paths to trailing-slash paths using `301`.
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
  - `redirect_status`
  - `notes/exception_reason`

## Policy Status

This policy is currently closed for Phase 0 and can be used as implementation input.
