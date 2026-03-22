# IA Language and Destination Options (Phase 1)

Purpose: define language and destination information architecture options that preserve URL contracts and support Stockholm plus Berlin rollout.

## Reused Inputs

- `docs/grand-plan.md`
- `docs/url-migration-policy.md`
- `docs/url-matrix.csv`
- `docs/existing-site-structure.md`

## Constraints

- Preserve existing must-keep URL contracts and redirect behavior.
- Keep coherent `sv`, `en`, and `de` hreflang relationships.
- Avoid IA rewrites when Berlin expands from pre-launch to full destination.
- Keep Swedish Stockholm as first fully migrated release.

## Option A: Language-first, destination in path (recommended)

Pattern:

- Swedish default routes: `/stockholm/...`
- English routes: `/en/stockholm/...` and `/en/berlin/...`
- German routes: `/de/berlin/...`

Pros:

- Preserves current URL patterns with minimal rewrite risk.
- Keeps migration path straightforward for existing sitemap and redirects.
- Works with current business rollout order (Stockholm first, Berlin later).

Cons:

- Swedish root does not include explicit destination segment on home (`/`).
- Destination switching logic is slightly asymmetric between Swedish and non-Swedish paths.

URL contract impact:

- No required path changes beyond already documented alias redirects.
- Supports current policy redirects (`/de/` to `/de/berlin/`, `/en/berlin-en/` to `/en/berlin/`).

## Option B: Destination-first, language nested under destination

Pattern:

- `/stockholm/sv/...`, `/stockholm/en/...`, `/berlin/de/...`, `/berlin/en/...`

Pros:

- Fully symmetric destination architecture.
- Clear future multi-city expansion model.

Cons:

- Breaks existing URL contracts for almost all indexed pages.
- Requires large redirect map and creates avoidable SEO risk during migration.

URL contract impact:

- High, broad route renaming required.

## Option C: Language subdomains by destination

Pattern:

- `stockholm.andetag.museum`, `berlin.andetag.museum`, each with language path variants.

Pros:

- Distinct destination boundaries for future teams/campaigns.

Cons:

- Significant canonical/hreflang complexity and migration risk.
- Infrastructure and analytics complexity increases immediately.
- Not aligned with current must-keep URL policy.

URL contract impact:

- Very high, effectively full URL model replacement.

## Recommendation

Use Option A (language-first, destination in path), because it preserves current URL contracts and supports staged rollout with the least SEO and implementation risk.

Implementation notes:

- Keep `/` and `/en/` as Stockholm home routes in the first release.
- Keep `/de/berlin/` as German Berlin canonical root.
- Resolve `/en/berlin-en/` as legacy alias only, with canonical `/en/berlin/`.
- Keep destination and language switcher behavior route-driven (not JS state only), so canonical/hreflang output remains deterministic.

## Decision Status

- Recommended Option A is accepted as architecture input for Phase 2 routing and navigation implementation.
