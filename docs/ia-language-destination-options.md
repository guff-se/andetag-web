# IA Language and Destination Options (Phase 1)

Purpose: define language and destination information architecture options that preserve URL contracts and support Stockholm plus Berlin rollout.

## Reused Inputs

- `docs/grand-plan.md`
- `docs/url-migration-policy.md`
- `docs/url-matrix.csv`
- `docs/existing-site-structure.md`

## Constraints

- Preserve inbound links and SEO value: legacy URLs **`301`** to agreed canonicals where paths change.
- Keep coherent `sv`, `en`, and `de` hreflang relationships.
- Avoid IA rewrites when Berlin expands from pre-launch to full destination.
- Keep Swedish Stockholm as first fully migrated release.

## Option A: Explicit language prefix for every locale (current decision)

Pattern:

- **Swedish:** **`/sv/stockholm/...`** for Stockholm pages; shared Swedish brand pages **`/sv/<slug>/`** (for example **`/sv/musik/`**, **`/sv/om-andetag/`**).
- **English:** **`/en/stockholm/...`**, **`/en/berlin/...`**, English hub **`/en/`**, plus shared **`/en/about-andetag/`** and similar.
- **German:** **`/de/berlin/...`** and related **`/de/...`** routes.

Legacy unprefixed Swedish URLs from the old site (**`/`**, **`/stockholm/...`**, **`/musik/`**, and so on) **`301`** to the matching **`/sv/...`** canonical. See **`docs/url-matrix.csv`** and **`site/public/_redirects`**.

Pros:

- One rule: every locale is visible in the path; matches developer and analytics mental models.
- Symmetric with English and German; scales cleanly if Swedish content grows beyond Stockholm.

Cons:

- Requires a complete redirect map at launch; internal links and sitemaps must use **`/sv/...`** canonicals only.

URL contract impact:

- Matrix **`redirect`** rows plus repo **`_redirects`** for all legacy Swedish paths; no duplicate indexable Swedish content at old and new URLs.

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

Use **Option A** (explicit **`/sv/`** prefix and Stockholm segment **`/sv/stockholm/...`**). Normative policy and redirect rules live in **`docs/url-migration-policy.md`**.

Implementation notes:

- Swedish Stockholm home is **`/sv/stockholm/`**; production **`/`** is entry routing (Worker), not the Swedish home document.
- Keep **`/en/`** as English hub; keep **`/de/berlin/`** as German Berlin canonical root.
- Resolve **`/en/berlin-en/`** as legacy alias only, with canonical **`/en/berlin/`**.
- Keep destination and language switcher behavior route-driven (not JS state only), so canonical/hreflang output remains deterministic.

## Decision Status

- **Option A** with explicit **`/sv/`** is the active URL model for the rebuilt site; this document supersedes the earlier Phase 1 wording that described unprefixed Swedish **`/stockholm/...`**.
