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

### Location-scoped story URLs and privacy (static site, 2026-03-28)

Normative path list: **`docs/url-matrix.csv`** and **`site/public/_redirects`** (single-hop **`301`** to final canonicals).

- **Swedish story pages:** canonical **`/sv/stockholm/{slug}/`**; legacy **`/sv/{slug}/`** and unprefixed Swedish URLs redirect there where they were live URLs.
- **English story pages:** SEO canonical **`/en/stockholm/{slug}/`**; **`/en/berlin/{slug}/`** duplicates use HTML **`rel="canonical"`** to the Stockholm English URL for the four scoped topics (see **`site/src/lib/routes/page-shell-registry.ts`**); legacy English **global** paths such as **`/en/music/`** redirect **`301`** to **`/en/stockholm/music/`**.
- **German story pages:** canonical **`/de/berlin/{slug}/`**; legacy flat **`/de/...`** story URLs redirect where published.
- **Privacy:** four shells (**`/sv/stockholm/privacy/`**, **`/en/stockholm/privacy/`**, **`/de/berlin/privacy/`**, **`/en/berlin/privacy/`**); legacy **`/privacy/`** and **`/privacy-policy/`** go to Swedish Stockholm privacy.

Internal **`hreflang`** for these pages is **same location only** (Stockholm **sv**↔**en**, Berlin **de**↔**en**). Full rationale: **`docs/routing-location-scoped-global-pages-plan.md`**.

## Entry routing, `Accept-Language`, and the `andetag_entry` cookie

Purpose: one **necessary** (strictly functional) first-party cookie plus edge logic so `/` and `/en/` can remember visitor choice and otherwise funnel by browser language. Implementation is expected on the **CDN or Worker** in front of static HTML (see `docs/phase-4-routing-reopen.md`). This section is the policy contract; redirect status codes here are for **entry routes** only.

### Cookie: `andetag_entry`

| Attribute | Value |
|-----------|--------|
| Name | `andetag_entry` |
| Purpose | Remember the visitor’s chosen **entry lane** (language or destination entry) for routing only. No analytics or marketing use. |
| Consent | **`necessary`** only: must not be gated behind optional CookieYes categories; document in CookieYes as essential / functional (aligned with `docs/tracking-and-consent-requirements.md`). |
| Format | `v1:<token>` (version prefix allows future migrations). |
| Tokens | `sv` (Swedish Stockholm), `de` (German Berlin), `en-s` (English Stockholm), `en-b` (English Berlin). |
| `Path` | `/` |
| `Secure` | `true` in production |
| `HttpOnly` | `true` (set only by the edge; not readable by page JS) |
| `SameSite` | `Lax` |
| Max-Age | **180 days** (`15552000` seconds); refresh on each qualifying navigation (below). |

**When to set or refresh**

- **`sv`:** user lands on any page under **`/sv/`** (Swedish language prefix) or is sent there from entry routing.
- **`de`:** user lands on any page under `/de/berlin/`.
- **`en-s`:** user chooses Stockholm on the English hub, or lands on any page under `/en/stockholm/`.
- **`en-b`:** user chooses Berlin on the English hub, or lands on any page under `/en/berlin/`.

Do not set `andetag_entry` merely for passing through `/en/` on the way to a choice if no lane is committed yet.

### Root path `/` (and `/` with trailing slash per global rules)

**Note:** **`/`** is not a Stockholm-versus-Berlin chooser. It routes by **language lane** (Swedish site, German site, or English). The **city chooser** exists only on **`/en/`** when the visitor is in the English lane without an `en-s` / `en-b` preference. **Default human language** when there is no signal is **English** (**`/en/`** hub). **Crawlers** are handled separately so they always reach a **full English Stockholm** page, not the hub.

Handled at the **edge** for `GET` (and `HEAD` as appropriate).

**Verified bots** (maintained allowlist or platform bot signal), **no cookie** (ignore any `andetag_entry` for routing): **`302`** to **`/en/stockholm/`**, **omit `Set-Cookie`**, **ignore `Accept-Language`**. Single hop is enough (conceptually “English lane, default location Stockholm”); no need to chain **`/`** → **`/en/`** → **`/en/stockholm/`**.

**Everyone else, no** cookie:

1. **No usable `Accept-Language`:** if the header is **missing**, **empty**, or parses to **no ranges**, **`302`** to **`/en/`** (English hub) and **omit `Set-Cookie`** until the visitor picks a city or lands on `/en/stockholm/` or `/en/berlin/`.
2. Otherwise parse **`Accept-Language`**, **sort ranges by descending `q`**, walk in order, and examine the **primary language subtag** only:
   - If **`sv`:** **`302`** to **`/sv/stockholm/`** and **`Set-Cookie`** `andetag_entry=v1:sv` on that response.
   - If **`de`:** **`302`** to **`/de/berlin/`**, set `v1:de`.
   - If the list is exhausted with **no** `sv` or `de` match: **`302`** to **`/en/`** (English hub). **Do not** set `andetag_entry` until the user picks a city on the hub or lands on `/en/stockholm/` or `/en/berlin/`.

**With cookie:** if `andetag_entry` is present and valid, **`302`** to the mapped path:

| Token | Target |
|-------|--------|
| `v1:sv` | `/sv/stockholm/` |
| `v1:de` | `/de/berlin/` |
| `v1:en-s` | `/en/stockholm/` |
| `v1:en-b` | `/en/berlin/` |

### English hub `/en/`

Handled at the **edge** for exact entry URL only (respect trailing-slash normalization).

- **Verified bots** (no routing cookie): **`302`** to **`/en/stockholm/`**, **omit `Set-Cookie`** (same default English location as bot handling on **`/`**).
- Valid cookie **`v1:en-s`** or **`v1:en-b`:** **`302`** to `/en/stockholm/` or `/en/berlin/`.
- Cookie **`v1:sv`:** **`302`** to `/en/stockholm/` (English counterpart of Swedish preference).
- Cookie **`v1:de`:** **`302`** to `/en/berlin/`.
- **Humans** otherwise: serve the **static English hub** (`200`).

Do not apply this router to other `/en/*` paths.

### Crawlers and SEO

**Verified bots** on **`/`** or **`/en/`** always reach **`/en/stockholm/`** in one hop (see sections above), not the English hub, so crawlers index a **full English Stockholm** page. **Humans** with **no** `Accept-Language` on **`/`** go to **`/en/`** hub (**English** as default language). Document bot detection and sample `User-Agent` or platform signals in redirect tests.

Update `docs/Andetag SEO Manual.md` and hreflang examples when **`/sv/stockholm/`** and **`/en/`** entry behavior change so **`x-default`** and alternates match this policy.

### Swedish language prefix (`/sv/`)

**Decision:** All **canonical** Swedish HTML pages use an explicit **`/sv/`** language prefix, symmetric with **`/en/...`** and **`/de/...`**.

- **Stockholm Swedish** content lives under **`/sv/stockholm/...`** (home **`/sv/stockholm/`**, trailing slash).
- **Shared Swedish** brand pages (for example music, about, artists, optical-fibre textile) use **`/sv/<slug>/`** at the site root segment (for example **`/sv/musik/`**, **`/sv/om-andetag/`**).
- **Legacy** unprefixed URLs from the live WordPress site (**`/`**, **`/stockholm/...`**, **`/musik/`**, **`/om-andetag/`**, and similar) are **not** canonical: the URL matrix lists them as **`redirect`** rows with **`301`** to the matching **`/sv/...`** path. Repo rules live in **`site/public/_redirects`**; keep matrix and redirects aligned.
- **Privacy** remains **`/privacy/`** for all locales (unchanged).

Canonical Swedish Stockholm **home:** **`/sv/stockholm/`**.

### Redirect test expectations (when implemented)

- Entry routes use **`302`** (except legacy **`301`** rules elsewhere in this document).
- Query strings on `/` and `/en/` must be preserved on redirect per global query policy.

## SEO Landing Page Policy

The following Swedish Stockholm SEO landing pages remain indexable and live at their **canonical** paths:

- `/sv/stockholm/aktivitet-inomhus-stockholm/`
- `/sv/stockholm/att-gora-stockholm/`
- `/sv/stockholm/museum-stockholm/`
- `/sv/stockholm/npf-stockholm/`
- `/sv/stockholm/utstallning-stockholm/`

Legacy **`/stockholm/...`** requests **`301`** to the **`/sv/stockholm/...`** equivalents.

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
- Non-HTML assets (images, videos, PDFs) are served from local project-hosted paths in the rebuilt site and are excluded from page canonical maps.
- Any legacy non-HTML endpoint retained for compatibility must be explicitly listed in the URL matrix with `page_type=non_html` and `status` set to `redirect` or `remove`.
- Trailing slash normalization applies only to HTML content routes, never to file-extension endpoints (for example `.pdf`, `.jpg`, `.xml`, `.json`).

## Internal Asset Locality Policy

- Internal assets must not use absolute `https://www.andetag.museum/...` references in Astro templates, styles, or scripts.
- Allowed internal asset reference format is root-relative pathing (for example `/wp-content/uploads/2024/11/andetag-logo-white-shadow.png`) backed by files in the Astro workspace.
- Legacy WordPress CSS bundles are reference material only, styles must be recreated in fresh local CSS files.
- Legacy WordPress JS bundles are reference material only, behavior must be recreated in local code and package-managed dependencies.

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

Phase 0 baseline rules above remain in force. **Entry routing** (this document) extends the policy for Worker-backed behavior; implement redirects and matrix rows when `/sv/stockholm/` and edge routing ship.
