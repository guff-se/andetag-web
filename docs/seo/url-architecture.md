# URL architecture

Ongoing contract for canonical URLs, redirects, hreflang, entry routing, and the XML sitemap on `andetag.museum`. This is the post-migration successor to `docs/archive/url-migration-policy.md` (kept for migration-era framing only). When a rule and the archived migration doc disagree, this file wins.

Related runtime files: `site/workers/entry-router.ts`, `site/public/_redirects`, `site/src/lib/routes/page-shell-registry.ts`, `site/src/lib/chrome/seo.ts`, `site/wrangler.jsonc`.

---

## §1. Canonical URL rules

- Canonical domain: `https://www.andetag.museum`.
- Canonical protocol: `https`.
- Canonical path style: trailing slash for HTML content pages (`/path/`).
- Slugs: ASCII-only, lowercase, hyphen-separated.
- Canonicals never include tracking query parameters.

## §2. Global redirect rules

- Non-canonical host → canonical host (`andetag.museum` → `www.andetag.museum`): `301`.
- `http` → `https`: `301`.
- Non-trailing-slash HTML page paths → trailing-slash paths: `301`.
- Uppercase path requests → lowercase canonical paths: `301`.
- Preserve all query parameters through redirects (including `utm_*`, `gclid`, `fbclid`, `msclkid`).
- Normalize malformed paths (duplicate slashes, percent-encoded unreserved ASCII, mixed-case hex bytes) to canonical form via `301`.

Trailing-slash normalization applies only to HTML content routes, never to file-extension endpoints (`.pdf`, `.jpg`, `.xml`, `.json`).

## §3. Language and destination routing

| Language root | Canonical | Redirect rule |
|---------------|-----------|---------------|
| Swedish | `/sv/stockholm/` | `/sv` and `/sv/` → `/sv/stockholm/` (`301`) |
| German | `/de/berlin/` | `/de` and `/de/` → `/de/berlin/` (`301`) |
| English Berlin | `/en/berlin/` | `/en/berlin-en/` → `/en/berlin/` (`301`) |
| English Art Yoga | `/en/stockholm/art-yoga/` | `/en/stockholm/art-yoga-en/` → `/en/stockholm/art-yoga/` (`301`) |

### Location-scoped story URLs

Normative path list: `docs/url-matrix.csv` and `site/public/_redirects`. Single-hop `301` to final canonicals.

- **Swedish stories:** canonical `/sv/stockholm/{slug}/`. Legacy `/sv/{slug}/` and unprefixed Swedish URLs `301` here.
- **English stories:** SEO canonical `/en/stockholm/{slug}/`. Berlin English duplicates use HTML `rel="canonical"` to the Stockholm English URL for the four scoped topics — see `BERLIN_EN_STORY_SEO_CANONICAL` in `page-shell-registry.ts` (decision: `docs/seo/decisions.md` SEO-0016). Legacy English **global** paths like `/en/music/` `301` to `/en/stockholm/music/`.
- **German stories:** canonical `/de/berlin/{slug}/`. Legacy flat `/de/...` story URLs `301` where published.
- **Privacy:** four canonical shells (`/sv/stockholm/privacy/`, `/en/stockholm/privacy/`, `/de/berlin/privacy/`, `/en/berlin/privacy/`); legacy `/privacy/` and `/privacy-policy/` `301` to the Swedish Stockholm privacy.

Internal `hreflang` for these pages is **same-location only** (Stockholm `sv`↔`en`, Berlin `de`↔`en`). No cross-location hreflang pairs.

### Swedish language prefix

All canonical Swedish HTML pages use an explicit `/sv/` language prefix, symmetric with `/en/...` and `/de/...`.

- Stockholm Swedish content lives under `/sv/stockholm/...` (home `/sv/stockholm/`, trailing slash), including the four story topics at `/sv/stockholm/{slug}/`.
- Legacy `/sv/musik/`-style paths and unprefixed URLs from the live WordPress site (`/`, `/stockholm/...`, `/musik/`, `/om-andetag/`) are **not** canonical: matrix lists them as `redirect` rows with `301` straight to the matching `/sv/stockholm/...` path.
- Rare legacy paths not rebuilt on `www` but retained on the WordPress archive host use a `301` to `https://old.andetag.museum/...` (same path where applicable). Example: `/display/` → `https://old.andetag.museum/display/`.

---

## §4. Entry routing and the `andetag_entry` cookie

Purpose: one **necessary** (strictly functional) first-party cookie plus edge logic so `/` and `/en/` can remember visitor choice, funnel by browser language, and use Cloudflare geolocation (`cf.country`, ISO 3166-1 alpha-2) when the browser language is neither Swedish nor German.

This is the policy contract. Implementation lives in `site/workers/entry-router.ts` with `site/wrangler.jsonc` (`assets.run_worker_first: true`). Static `site/public/_redirects` must **not** define `/` → Swedish home — that would bypass the Worker. Redirect status codes here are for **entry routes** only.

### Cookie: `andetag_entry`

| Attribute | Value |
|-----------|--------|
| Name | `andetag_entry` |
| Purpose | Remember the visitor's chosen entry lane (language or destination entry) for routing only. No analytics or marketing use. |
| Consent | **`necessary`** only: must not be gated behind optional CMP consent categories; document in CookieConsent as essential / functional (aligned with `docs/tracking-and-consent-requirements.md`). |
| Format | `v1:<token>` (version prefix allows future migrations). |
| Tokens | `sv` (Swedish Stockholm), `de` (German Berlin), `en-s` (English Stockholm), `en-b` (English Berlin). |
| `Path` | `/` |
| `Secure` | `true` in production |
| `HttpOnly` | `true` (set only by the edge; not readable by page JS) |
| `SameSite` | `Lax` |
| Max-Age | **180 days** (`15552000` seconds); refresh on each qualifying navigation. |

**When to set or refresh:**

- `sv`: user lands on any page under `/sv/` (Swedish language prefix) or is sent there from entry routing.
- `de`: user lands on any page under `/de/berlin/`.
- `en-s`: user chooses Stockholm on the English hub, lands on any page under `/en/stockholm/`, or is sent there from `/` or `/en/` when `cf.country` is `SE` (no `sv`/`de` in `Accept-Language`, no routing cookie).
- `en-b`: user chooses Berlin on the English hub, lands on any page under `/en/berlin/`, or is sent there from `/` or `/en/` when `cf.country` is `DE` under the same conditions as `en-s`.

Do **not** set `andetag_entry` when sending a visitor to the English hub (`/en/`) only to show the chooser (no committed lane yet). Do set it when committing `sv`, `de`, `en-s`, or `en-b`.

### Root path `/`

`/` is **not** an on-page Stockholm-vs-Berlin chooser. It routes by language lane (Swedish, German, or English). For English-lane visitors (top `Accept-Language` primary is not `sv` or `de`), `cf.country` `SE` or `DE` sends them straight to `/en/stockholm/` or `/en/berlin/` with the matching cookie; otherwise they go to the `/en/` hub. Crawlers are handled separately so they always reach a full English Stockholm page.

Handled at the edge for `GET` (and `HEAD` as appropriate).

**Verified bots** (maintained allowlist or platform bot signal), no cookie (ignore any `andetag_entry`): `302` to `/en/stockholm/`, **omit `Set-Cookie`**, **ignore `Accept-Language`**. Single hop.

**Everyone else, no cookie:**

1. Parse `Accept-Language` (if missing, empty, or no ranges, treat as no `sv`/`de` preference). Sort ranges by descending `q` and take only the highest-q primary (first in that order; ties keep parser order).
   - If primary is `sv`: `302` to `/sv/stockholm/`, `Set-Cookie` `andetag_entry=v1:sv`.
   - If `de`: `302` to `/de/berlin/`, set `v1:de`.
2. If top primary is not `sv` or `de`, use Cloudflare `cf.country` (when present and a normal two-letter code):
   - `SE`: `302` to `/en/stockholm/`, `Set-Cookie` `v1:en-s`.
   - `DE`: `302` to `/en/berlin/`, `Set-Cookie` `v1:en-b`.
3. Otherwise: `302` to `/en/` (English hub), **omit `Set-Cookie`** (visitor picks Stockholm or Berlin on the hub).

**With cookie:** if `andetag_entry` is present and valid, `302` to the mapped path:

| Token | Target |
|-------|--------|
| `v1:sv` | `/sv/stockholm/` |
| `v1:de` | `/de/berlin/` |
| `v1:en-s` | `/en/stockholm/` |
| `v1:en-b` | `/en/berlin/` |

### English hub `/en/`

Handled at the edge for the exact entry URL only (respect trailing-slash normalization). Does not apply to other `/en/*` paths.

- Verified bots (no routing cookie): `302` to `/en/stockholm/`, omit `Set-Cookie` (same default English location as bot handling on `/`).
- Valid cookie `v1:en-s` or `v1:en-b`: `302` to `/en/stockholm/` or `/en/berlin/`.
- Cookie `v1:sv`: `302` to `/en/stockholm/` (English counterpart of Swedish preference).
- Cookie `v1:de`: `302` to `/en/berlin/`.
- Humans with no valid routing cookie:
   1. If highest-q primary in `Accept-Language` is `sv`: `302` to `/sv/stockholm/`, `Set-Cookie` `v1:sv`.
   2. If `de`: `302` to `/de/berlin/`, `Set-Cookie` `v1:de`.
   3. Else if `cf.country` is `SE`: `302` to `/en/stockholm/`, `Set-Cookie` `v1:en-s`.
   4. Else if `cf.country` is `DE`: `302` to `/en/berlin/`, `Set-Cookie` `v1:en-b`.
   5. Else: serve the static English hub (`200`), omit `Set-Cookie`.

### Crawlers

Verified bots on `/` or `/en/` always reach `/en/stockholm/` in one hop, not the English hub, so crawlers index a full English Stockholm page. Document bot detection, `cf.country`, and sample `User-Agent` or platform signals in redirect tests.

When entry behavior changes, update `docs/Andetag SEO Manual.md` §5 hreflang baseline and `x-default` examples to match.

### Status codes for entry routes

- Entry routes use `302` (except legacy `301` rules elsewhere).
- Query strings on `/` and `/en/` must be preserved on redirect per the global query rule.

---

## §5. SEO landing page policy

The following Swedish Stockholm SEO landing pages remain indexable and live at their canonical paths:

- `/sv/stockholm/aktivitet-inomhus-stockholm/`
- `/sv/stockholm/att-gora-stockholm/`
- `/sv/stockholm/event-stockholm/` (English peer: `/en/stockholm/event-stockholm/`)
- `/sv/stockholm/museum-stockholm/`
- `/sv/stockholm/npf-stockholm/`
- `/sv/stockholm/utstallning-stockholm/`

Legacy `/stockholm/...` requests `301` to the `/sv/stockholm/...` equivalents.

**Pretty Links–style paths:** short `302` quicklinks (print, campaigns, external targets) and any `/stockholm/...` slug that must **not** follow the generic splat (e.g. a legacy slug that maps to a different canonical Swedish shell) live in `site/public/_redirects` in the comment-marked block **immediately before** the `/stockholm/*` rule. `302` keeps retargeting flexible; use `301` when the intent is a permanent SEO move to a canonical path. See `skills/quicklinks/SKILL.md`.

Policy notes:
- These pages may share base content blocks but each can keep distinct SEO intent fields (title, meta description, hero/header text, opening copy).
- Do not collapse them into one canonical URL.

---

## §6. Privacy URL policy

- Canonical privacy pages are **per location and language**: `/sv/stockholm/privacy/`, `/en/stockholm/privacy/`, `/de/berlin/privacy/`, `/en/berlin/privacy/`.
- Legacy `/privacy/` and `/privacy-policy/` `301` to `/sv/stockholm/privacy/` (single hop).

---

## §7. Query parameter policy

- Query parameters do not create canonical variants.
- Canonical URLs are emitted without query strings.
- Requests with query parameters resolve to the same canonical page path, preserving parameters through any redirects.
- Known tracking parameters (`utm_*`, `gclid`, `fbclid`, `msclkid`) are allowed for attribution and must not be used for indexable URL expansion.

---

## §8. Non-HTML endpoint policy

- WordPress / system endpoints (`/wp-json/`, `/xmlrpc.php`, feed URLs, admin endpoints) are non-HTML and not indexable pages.
- Non-HTML assets (images, videos, PDFs) are served from local project-hosted paths (`site/public/`) and are excluded from page canonical maps.
- Any legacy non-HTML endpoint retained for compatibility must be explicitly listed in `docs/url-matrix.csv` with `page_type=non_html` and `status` set to `redirect` or `remove`.

---

## §9. Internal asset locality

- Internal assets must not use absolute `https://www.andetag.museum/...` references in Astro templates, styles, or scripts.
- Allowed internal asset reference format is root-relative pathing (e.g. `/wp-content/uploads/2024/11/andetag-logo-white-shadow.png`) backed by files in `site/public/`.

---

## §10. Berlin transition

- Berlin temporary prelaunch / waitlist content and live content use the **same stable destination URLs**.
- When business stage changes (waitlist → open), replace content in place. Avoid URL changes unless unavoidable.

---

## §11. XML sitemap and canonicalization

**Stakeholder intent:** preserve inbound links and ranking signals. URLs and redirects stay conservative; metadata and on-page SEO may improve over time. Improvements must not silently drop routes or break asset URLs.

### Per-page requirements

- Every indexable HTML URL has a self-referencing canonical tag and `hreflang` (and equivalents) where language alternates exist, per `page-shell-registry.ts` and `docs/Andetag SEO Manual.md` §5.

### Sitemap rules

The published XML sitemap at `https://www.andetag.museum/sitemap-0.xml` follows these rules:

1. **Include** only canonical, indexable HTML URLs: same conceptual set as `keep` indexable rows in `docs/url-matrix.csv` plus the shell registry. Build from one coherent source so nothing indexable is omitted by accident.
2. **Exclude:**
   - `redirect` / alias-only URLs (not canonical; crawlers follow `301` from inbound links).
   - `noindex` pages, preview tools, non-public routes.
   - Non-HTML resources (PDFs, images, video files, feeds, `xml`, `json`).
   - Query-string variants as separate entries: canonical URLs are path-only.
3. **Pagination or filters:** if the static site ever exposes them, list only the canonical page URL unless a deliberate exception is logged in `docs/seo/decisions.md`.
4. **Entry URLs:** include `/sv/stockholm/`, hubs, and inner pages per matrix `keep` rules. `/` and `/en/` are routing URLs (`302` / hub `200` per §4) — the Astro sitemap excludes the root URL `https://www.andetag.museum/` because `site/src/pages/index.astro` is only a `301` to `/sv/stockholm/`.
5. **Media and deep links:** keep stable `/wp-content/uploads/...` paths in `site/public/` so bookmarks and external embeds keep working. If a media path must change, add a `301` and a matrix or decision note; do not leave old URLs `404` without approval.

### Regression checks

After any sitemap or redirect change, spot-check sample legacy URLs from Search Console or backlinks still `301` or `200` as expected, and that high-value paths appear once in the sitemap as canonical. See `skills/site-integrity/SKILL.md` for the full audit recipe.

---

## §12. Source integrity (non-negotiable)

- Never fabricate canonical paths, redirects, or entry-routing rules.
- If a desired URL is missing from `docs/url-matrix.csv` and `site/public/_redirects`, add the row deliberately with rationale; do not silently invent a destination.
- `archive/legacy-wordpress-site/site-html/` is a **frozen** WordPress scrape: reference only. Authoritative URL contract is this file, the page shell registry, and `_redirects`.
