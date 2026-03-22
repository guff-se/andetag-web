# URL Matrix Schema

Purpose: define the required schema for the must-keep URL matrix that will be populated in Phase 1 from sitemap and page inventory data.

## Reused Inputs

This schema is based on existing findings in:

- `docs/existing-site-structure.md` (language and route patterns)
- `docs/parser-plan.md` (page registry and canonical path expectations)
- `docs/url-migration-policy.md` (canonical and redirect behavior)

## Required Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `source_url` | string (absolute URL) | yes | URL observed in current source (sitemap, crawl, or known alias list). |
| `canonical_url` | string (absolute URL) | yes | Final canonical production URL after normalization. |
| `lang` | enum (`sv`, `en`, `de`, `none`) | yes | Language context of the source URL. Use `none` for non-language utility endpoints. |
| `destination` | enum (`stockholm`, `berlin`, `shared`, `none`) | yes | Destination/city context for routing strategy. |
| `page_type` | enum | yes | One of: `content`, `landing`, `legal`, `system`, `asset`, `non_html`. |
| `status` | enum | yes | One of: `keep`, `redirect`, `remove`, `unknown`. |
| `redirect_type` | enum (`none`, `301`, `302`) | yes | Redirect behavior required from source to canonical. |
| `notes` | string | no | Rationale, exception references, or validation notes. |

## Recommended Derived Columns

These are optional in Phase 0 and can be added in Phase 1 for stronger QA:

- `source_kind` (`sitemap`, `crawl`, `manual`)
- `http_status_observed`
- `exception_id` (links to `docs/migration-exceptions.md`)
- `owner`

## Validation Rules

1. `source_url` and `canonical_url` must include protocol and host.
2. `canonical_url` must follow canonical host and trailing slash policy in `docs/url-migration-policy.md`.
3. `redirect_type` must be `none` when `source_url == canonical_url`.
4. `status=redirect` requires `redirect_type` not equal to `none`.
5. `page_type=non_html` must map to `status=remove` or `status=redirect` (never indexable canonical content).

## CSV Header (Reference)

```csv
source_url,canonical_url,lang,destination,page_type,status,redirect_type,notes
```

## Example Rows

```csv
https://www.andetag.museum/en/berlin-en/,https://www.andetag.museum/en/berlin/,en,berlin,content,redirect,301,legacy alias from WP slug variant
https://www.andetag.museum/stockholm/faq/,https://www.andetag.museum/stockholm/faq/,sv,stockholm,content,keep,none,canonical as-is
https://www.andetag.museum/wp-json/,https://www.andetag.museum/wp-json/,none,none,non_html,remove,none,WordPress API endpoint not migrated and not indexed
```
