# Migration Exceptions Log

Purpose: record approved deviations from source parity in a consistent and reviewable format.

## What Counts as an Exception

Log an exception when any of the following applies:

- URL path changes from source without strict one-to-one parity.
- Content is intentionally removed, merged, or materially rewritten.
- Component behavior differs from source in a way users can notice.
- Integration behavior changes (`keep`, `replace`, `remove`) with conversion or SEO impact.
- Tracking/consent behavior differs from approved requirements.

## Required Fields

Each exception entry must include:

- `exception_id`: stable ID (`EX-0001`, `EX-0002`, ...)
- `date`: ISO format `YYYY-MM-DD`
- `phase`: project phase where exception is introduced
- `scope`: affected area (URL, content, component, integration, tracking)
- `source_reference`: source URL/file(s) in current site artifacts
- `decision`: concise description of what is changed
- `rationale`: why this is necessary
- `seo_impact`: expected SEO effect (`none`, `low`, `medium`, `high`)
- `user_impact`: expected user-facing effect
- `approval`: approver name and status
- `follow_up`: actions required before launch or post-launch

## Log Table Template

| exception_id | date | phase | scope | source_reference | decision | rationale | seo_impact | user_impact | approval | follow_up |
|--------------|------|-------|-------|------------------|----------|-----------|------------|-------------|----------|-----------|
| EX-0001 | YYYY-MM-DD | 2 | URL | `/en/berlin-en/` | redirect alias to `/en/berlin/` | canonical normalization | low | none | pending | add redirect test |

## Status Rules

- New entries start as `pending` in `approval`.
- Only approved entries may be treated as accepted implementation behavior.
- Rejected entries must remain in log with rejection note, do not delete history.

## Cross-Reference Rules

- Reference related policy docs when relevant (`docs/url-migration-policy.md`, `docs/content-model.md`).
- Include `exception_id` in URL matrix notes or implementation PR descriptions when applicable.
