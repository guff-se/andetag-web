# Artworks subsystem: implementation plan

**Status:** **Closed / shipped.** The live contract is `docs/seo/decisions.md` `SEO-0022`, `docs/seo/url-architecture.md` §3 (Artworks subsystem), and `docs/content-model.md`. This file is a historical implementation plan; do not extend it.

Status: **Implemented** — Phase 1 shipped in PR #24 (`feature/artworks`), merged to `main` 2026-04.
Owner: Gustaf.
Drafted: 2026-05-04. Implemented: 2026-04.

Phase 1 is live on production `www.andetag.museum`. Phase 2 (cookie-driven dual chrome, §10) and Phase 3 (About/story page migration to location-free URLs, §11) remain deferred.

This document is kept as a reference for the subsystem design and for the two deferred phases. Do not treat it as an action item.

---

## 1. Goals

1. Design the **complete artworks URL contract** in one pass: collection page(s) + one page per artwork.
2. Use **location-free** canonical URLs for the artworks subsystem so a single tree serves both Stockholm and Berlin sales contexts.
3. Make every artwork **individually linkable, shareable, and indexable** for sales follow-up and SEO/GEO.
4. Keep the rest of the site's URL contract (location-scoped under `/sv/stockholm/`, `/en/stockholm/`, `/de/berlin/`, `/en/berlin/`) untouched. Artworks is a **deliberate, documented exception** under §3 of `docs/seo/url-architecture.md`.
5. Defer the **cookie-driven dual-chrome variant** decision (Worker serves Stockholm or Berlin chrome from the same external URL) to a follow-up phase, with a clear contract for what that phase would change (§10).

## 2. Non-goals

- Migrating other "global" pages (About, Optical fibre textile, Music, Artists) to location-free URLs. Out of scope; user has explicitly deferred.
- Creating German per-artwork pages. Add when Berlin opens or when copy is ready.
- Adding e-commerce or checkout. Inquiry stays a contact form, as today.
- Implementing the cookie-driven chrome variant (§10).

---

## 3. URL contract

### 3.1 Recommended canonical paths

| Surface | Language | Path |
|---------|----------|------|
| Collection | English | `/en/artworks/` |
| Collection | Swedish | `/sv/konstverk/` |
| Collection | German (deferred) | `/de/kunstwerk/` |
| Per-artwork | English | `/en/artworks/<slug>/` |
| Per-artwork | Swedish | `/sv/konstverk/<slug>/` |
| Per-artwork | German (deferred) | `/de/kunstwerke/<slug>/` |

**Why move the collection too:** The full artworks subsystem is unmerged. Designing **collection + per-artwork** at the same URL root is symmetric and self-consistent: `/en/artworks/<slug>/` clearly belongs under `/en/artworks/`. The alternative (collection at `/en/stockholm/artworks/`, individual works at `/en/artworks/<slug>/`) creates a parent-child mismatch and an awkward "up" link.

This decision is the most material change versus what is on the unmerged branch today (which puts the collection at `/en/stockholm/artworks/` and `/sv/stockholm/konstverk/`). It is flagged for explicit confirmation in §13.

### 3.1.1 Public URL slug (human-readable name)

Per-artwork URLs use a **public slug** derived from `Artwork.id` in `site/src/lib/content/artworks.ts`, not the raw `id` string in the path:

| Series | `Artwork.id` (unchanged in data) | Public `<slug>` in URL |
|--------|----------------------------------|-------------------------|
| Original | `andetag-10` | `andetag-no-10` |
| Gem | `gem-emerald` | `andetag-gem-emerald` |

Examples:

- English: `/en/artworks/andetag-no-10/`, `/en/artworks/andetag-gem-emerald/`
- Swedish: `/sv/konstverk/andetag-no-10/`, `/sv/konstverk/andetag-gem-emerald/`

**Implementation:** add a single pure function, e.g. `artworkPublicSlug(a: Artwork): string`, next to or inside `artworks.ts`, and use it everywhere the canonical path segment is built (Astro `getStaticPaths`, `ArtworkCard` `href`, modal "Open page", sitemap, url-matrix sync script, tests).

**What stays on `Artwork.id`:** DOM fragment ids, inquiry `?about=`, JSON-LD `@id` (`#artwork-<Artwork.id>`), image directories under `site/public/images/artworks/<Artwork.id>/`, and any CSV or admin keys. Only the **browser-facing path segment** uses `<slug>`. If a future migration wants slug-based `@id`s, that is a separate SEO decision.

### 3.2 Hreflang and canonical

- Collection: sv ↔ en pair via `hreflang`. `x-default` = English. `<link rel="canonical">` self-referential.
- Per-artwork: same pattern. Each language variant of a given work paired sv ↔ en. `x-default` = English. Self-referential canonical.
- No Berlin/Stockholm cross-pairing (consistent with `docs/seo/url-architecture.md` §3 "Internal hreflang for these pages is same-location only"; here there is no location prefix at all, so the question does not arise).

### 3.3 Trailing slash, host, protocol

Same as the rest of the site: `https://www.andetag.museum`, trailing slash, ASCII lowercase. The Worker's existing trailing-slash and case rules apply unchanged.

### 3.4 Sitemap

All collection and per-artwork URLs that we publish are listed in `sitemap-0.xml`. No paginated or filtered variants. Works that are not given a page (if any) are simply absent from both the collection card render and the sitemap.

### 3.5 Documentation updates required (same task as code)

- `docs/seo/url-architecture.md`: new subsection under §3 "Language and destination routing" describing the location-free artworks subsystem (collection + per-artwork), including hreflang scope and explicit deviation from the standard `/{lang}/{location}/...` shape.
- `docs/seo/decisions.md`: new `SEO-NNNN` row recording the deviation, with rationale (single source of truth for global inventory; sales-support intent; subsystem-scoped, not site-wide).
- `docs/url-matrix.csv`: add `keep` rows for collection (sv + en) and every published artwork URL (sv + en).
- `docs/Andetag SEO Manual.md` §12 (page inventory): add "Artworks subsystem" as a single entry.
- `CHANGELOG.md`: under `### Added` per `docs/changelog-standards.md`.

---

## 4. Content per surface

### 4.1 Collection page

Same as the body component already drafted in `ArtworksEn.astro` / `KonstverkSv.astro`, with one change: the existing `ArtworkCard` becomes (or is wrapped in) a link to the per-artwork page. The modal flow stays as a quick-view; an explicit "Open page" link inside the modal opens the canonical artwork URL.

Internal links inside the collection page that currently point at sibling story pages (`/en/stockholm/about-andetag/`, `/en/stockholm/optical-fibre-textile/`, `/en/stockholm/about-the-artists-malin-gustaf-tadaa/`) stay as-is. Those pages remain location-scoped (out of scope here).

### 4.2 Per-artwork page

Each page renders, from `site/src/lib/content/artworks.ts`:

- **Title (H1):** `Andetag no. <number>` for originals; gem name for gems. Page `<title>` follows §13 decision.
- Year, dimensions (W x H cm), format (landscape / portrait / diptych), series (original / gem).
- **Status:** on-exhibition, in-studio, or sold. Sold pages show "In a collection" with the existing city-level location label.
- **Price (SEK):** for available works only. Hidden when sold or if the work is a commissioned piece.
- **Image set:** light, dark, mid (where available), close-ups, person-scale, alternative views. Reuse existing derivatives under `site/public/images/artworks/<Artwork.id>/` (directory name stays the internal id). Lead image is the `light` mood; gallery cycles through remaining moods.
- **Per-work narrative paragraph** (1 to 3 sentences) where Malin or Gustaf has written one. Absence is acceptable; do not invent copy.
- **Inquiry CTA:** the existing `InquiryForm` pre-filled with `?about=<Artwork.id>` (stable internal key, not the public slug).
- **"Visit the artworks" CTA:** explicit link pair to `/en/stockholm/` and `/en/berlin/` (or the Swedish equivalents) so a visitor reading the page knows where they can experience an Andetag in person. One short sentence + two links. Replaces the dual-chrome cue that Phase 2 would later automate.
- **Back-up link** to the collection page (top of page or breadcrumb-style).

Sold/private collection works keep `Artwork.location.privacy === "city"` (≥1 km jitter on the world map). The per-artwork page must not expose collector identity unless explicit consent is recorded in copy.

### 4.3 Tone and copy

Follow `docs/Tone of Voice.md`. **No em dashes** in body or metadata. Calm, factual, no superlatives outside the §1.2 allow-list in the SEO Manual.

### 4.4 Schema (JSON-LD)

- **Collection page:** keep the existing `CollectionPage` + `hasPart` references to per-artwork `@id`s, as already modelled in `site/src/lib/chrome/schema-org.ts` (`artworkCollectionNode`, `visualArtworkNode`).
- **Per-artwork page:** emits one `WebPage` node whose `mainEntity` is the same `VisualArtwork` `@id` already used by the collection (`<host>/#artwork-<Artwork.id>`). The graph stays single-entity-per-work across both surfaces. The page `url` field in JSON-LD should use the **canonical public URL** (with `<slug>`), not a fragment-only id.

No `Product`/`Offer` schema for now. Reassess if/when pricing strategy and shipping are formalised; coordinate with `skills/seo/SKILL.md` at that point.

### 4.5 Internal linking

- Collection card → per-artwork page (default click target).
- Modal → per-artwork page ("Open page" link).
- Per-artwork page → collection page (top-of-page link or breadcrumb).
- Per-artwork page → both location homes (Stockholm, Berlin) via the §4.2 CTA pair.
- Cross-language pair handled by `hreflang` and the existing `SiteLayout` machinery; no on-page language switcher beyond what already exists.

---

## 5. Code surfaces

### 5.1 Routing approach

Use a **dedicated dynamic Astro route** for per-artwork pages, not the existing `[...slug].astro` shell, because the data shape differs (one body component receives an `Artwork` prop, not a no-arg shell body). The collection pages stay on `[...slug].astro`.

```ts
// site/src/pages/<route>.astro — pseudocode
import { artworkPublicSlug } from "../../lib/content/artworks"; // or adjacent module

export function getStaticPaths() {
  return ARTWORKS.flatMap((a) => {
    const slug = artworkPublicSlug(a);
    return [
      { params: { lang: "en", category: "artworks", slug }, props: { artwork: a, language: "en" } },
      { params: { lang: "sv", category: "konstverk", slug }, props: { artwork: a, language: "sv" } },
    ];
  });
}
```

The route delegates head, header, and footer to `SiteLayout` and renders one body component per language: `ArtworkPageEn.astro` / `ArtworkPageSv.astro`. The exact route filename is decided during implementation (Astro nested `[lang]/[category]/[slug].astro`, or two static-prefix routes — both work).

### 5.2 Page-shell-registry integration

The current `PageShellRoute` system is path-keyed (`page-shell-meta.json` + `page-body-registry.ts`). Two viable options:

**Option A: Compute shell entries in TS at build time.**

Expose a helper such as `artworkShellRoute(artwork, language)` that returns a full `PageShellRoute` for any artwork URL. The new dedicated route owns its own shell resolution. `[...slug].astro` does not change. Auditable, no JSON churn per artwork edit.

**Option B: Reuse `[...slug].astro` with synthetic paths.**

Add every `/en/artworks/<slug>/` and `/sv/konstverk/<slug>/` to `PAGE_CUSTOM_BODY_PATHS` and `pageBodies`. Body component receives no props and looks up the artwork by parsing the path (map slug back to `Artwork.id` via a reverse lookup table built from `ARTWORKS`).

**Recommendation: Option A.** It keeps `[...slug].astro` focused on no-arg shells, makes the artwork body component testable in isolation, and avoids a 100-row map in the slug router.

### 5.3 Chrome (header/footer) selection

For Phase 1 (this plan), pick **Stockholm chrome** as the default for collection and per-artwork pages, in both English and Swedish. Rationale:

- Stockholm is the open museum; most sales conversations originate there.
- Swedish has only one venue.
- Berlin sales paths still work: §4.2 CTA pair gives every per-artwork page two clear links to the location homes.
- This avoids the Worker variant work entirely for Phase 1.

Phase 2 (deferred, §10) revisits if the team observes meaningful Berlin sales friction.

### 5.4 Navigation

The existing `navigation.ts` does not need new top-level entries. The artworks subsystem is reached from collection cards, in-page links, and external/CRM URLs. No menu surface clutter.

### 5.5 Files touched

- **New:**
  - `site/src/pages/<artwork-route>.astro` (filename TBD per Astro conventions during implementation).
  - `site/src/components/page-bodies/ArtworkPageEn.astro`, `ArtworkPageSv.astro`.
  - `site/src/lib/routes/artwork-shell-routes.ts` (or extension of `page-shell-registry.ts`).
  - `site/src/lib/content/artwork-page-copy.ts` — per-artwork narrative paragraphs, keyed by `id`, `{ sv: string | null, en: string | null }`.
- **Edited:**
  - `site/src/components/content/ArtworkCard.astro` and/or `ArtworkGrid.astro`: wrap each tile in a link to the canonical per-artwork URL.
  - `site/src/components/content/ArtworkModal.astro`: add an "Open page" link.
  - `site/src/lib/chrome/schema-org.ts`: expose per-artwork `WebPage` mode that references the existing `VisualArtwork` `@id`.
  - `site/src/lib/routes/page-shell-registry.ts`: move collection canonical paths to `/en/artworks/` and `/sv/konstverk/` (subject to §13 decision); update hreflang pairs accordingly.
  - `site/src/lib/page-registry/page-body-registry.ts` and `site/src/pages/[...slug].astro`: rekey collection paths.
  - `site/src/lib/chrome/navigation.ts`: any nav `href` that points at the old collection paths.
  - `site/src/data/page-shell-meta.json`: rekey collection meta.
  - Any internal `<a>` references to the collection inside other page bodies (search for `/stockholm/artworks/` and `/stockholm/konstverk/` during implementation).
  - Sitemap generator: include the new collection + per-artwork URLs.
  - `docs/seo/url-architecture.md`, `docs/seo/decisions.md`, `docs/url-matrix.csv`, `docs/Andetag SEO Manual.md` §12, `CHANGELOG.md`.

### 5.6 Tests

- New unit tests for `artwork-shell-routes.ts` (canonical, hreflang pair, sitemap inclusion).
- Update `page-shell-registry.test.ts` (or sibling) for the new collection paths and at least one representative per-artwork case.
- Build assertion: `dist/en/artworks/index.html`, `dist/sv/konstverk/index.html`, `dist/en/artworks/andetag-no-12/index.html`, `dist/sv/konstverk/andetag-no-12/index.html` all exist and emit the expected canonical, hreflang, and JSON-LD.
- `url-matrix-parity.test.ts` (or equivalent): parity for the new rows.
- Em-dash scan: `grep -rn $'—' site/src/components/page-bodies/ site/src/lib/content/`.

---

## 6. Build and CI

1. `getStaticPaths` generates one HTML per `(language, artwork)` plus the two collection pages.
2. Sitemap and `url-matrix.csv` rebuilt from the same source list. If `url-matrix.csv` is hand-maintained today, add a small `node site/scripts/sync-artwork-matrix.mjs` that prints the rows deterministically; run it in CI (or as a pre-commit hook) to keep matrix and code in sync.
3. CI (`.github/workflows/ci.yml`) runs `npm test && npm run build`. No new pipeline.

---

## 7. SEO doctrine alignment (§H pre-check)

Before merging, run `skills/seo/SKILL.md` §H against:

- The two collection pages.
- A representative subset of per-artwork pages: one for-sale original, one sold, one gem, in both languages (six pages total).

Confirm:

- Canonical self-reference.
- Hreflang sv ↔ en, x-default = en.
- Title pattern locked per §13.
- Meta description: factual, 1 sentence, optional second sentence with status. Within ~155 chars.
- OG: per-artwork hero image (light mood) at 1200x630 or nearest existing derivative.
- Robots: indexable.
- Internal links: every artwork is linked from at least the collection grid; gems also from the §"Andetag Gems" section.
- Em dash audit clean.

---

## 8. Verification gate

Per `AGENTS.md` and `skills/page/SKILL.md`:

- `cd site && npm test`
- `cd site && npm run build`
- Spot-check `dist/en/artworks/index.html`, `dist/sv/konstverk/index.html`, `dist/en/artworks/andetag-no-12/index.html`, `dist/sv/konstverk/andetag-no-12/index.html` (and one gem path, e.g. `andetag-gem-emerald`) for canonical, hreflang, OG, JSON-LD `VisualArtwork` + `WebPage` (per-artwork) and `CollectionPage` (collection).
- Walk Cloudflare preview on three artworks (one for-sale, one sold, one gem) in both languages.
- `skills/site-integrity/SKILL.md` audit on the new URL set (link resolution, sitemap canonicalness, image references).

---

## 9. Risks and open questions

| Risk / question | Mitigation |
|-----------------|------------|
| Thin pages: 50+ near-identical bodies risk Panda-style quality drag. | Require per-artwork narrative or distinct factual block (year, dims, status, location, image variety) before publishing. Start with a curated subset (e.g. available originals + gems, ~20 pages) and grow. |
| Subsystem-level URL deviation from the rest of the site (location-free vs `/sv/stockholm/...`). | Documented as `SEO-NNNN` in `docs/seo/decisions.md`; called out in `docs/seo/url-architecture.md` §3. Hreflang stays sv ↔ en; no cross-location pairing arises. |
| Sold-work privacy. | `Artwork.location.privacy === "city"` enforces ≥1 km jitter; per-artwork copy must not expose collector identity unless explicit consent is recorded. |
| German artwork pages absent. | German users see English variant via `hreflang`; acceptable until Berlin opens and German copy lands. |
| Sitemap size bump (≈100 new URLs at full coverage). | Negligible for Cloudflare assets and Google. |
| Schema `@id` collision risk. | Reuse `<host>/#artwork-<Artwork.id>` so the same entity is referenced by collection (`hasPart`) and per-artwork (`mainEntity`). Public page URL uses `<slug>`; `@id` stays on internal id until a deliberate change. Tested. |

---

## 10. Phase 2 (deferred): cookie-driven dual chrome

Out of scope for the current plan. Scoped here so the contract is clear if we revisit.

### 10.1 Goal

Same external URL `/en/artworks/<slug>/` (and `/en/artworks/`) serves the visitor's preferred location chrome (Stockholm or Berlin) based on the existing `andetag_entry` cookie, without a redirect.

### 10.2 Mechanism

Worker (`site/workers/entry-router.ts`) inspects the request before `ASSETS.fetch`:

1. If `pathname` matches an English artworks path and `parseEntryToken(parseEntryCookieValue(request.headers.get("Cookie"))) === "en-b"`, build a new internal `Request` to a hidden mirror path (e.g. `/en/artworks/__berlin/...`) and call `ASSETS.fetch(thatRequest)`.
2. All other cases (no cookie, `en-s`, `sv`, `de`, verified bots) serve the default Stockholm-chrome asset.
3. Append `Vary: Cookie` to the response headers for the affected paths.
4. Extend `entryTokenForContentPath()` so that serving an English artworks page refreshes the cookie according to which chrome was served.

### 10.3 Build

- Astro generates **two** files per English artwork: `dist/en/artworks/<slug>/index.html` (Stockholm chrome) and `dist/en/artworks/__berlin/<slug>/index.html` (Berlin chrome). Same for the collection page.
- The Berlin-chrome variant emits the **same canonical** and `og:url` as the public path; it is excluded from the sitemap; it carries `noindex` as defence-in-depth (it should never be reached directly because the Worker is the sole serving path).
- Swedish artworks do not get a variant; only one Stockholm chrome.

### 10.4 Cost estimate

Half a day to one day, including Worker tests, dual-route Astro setup, cache headers, bot defaulting, cookie-refresh extension, and a staging walk. Medium complexity, mostly operational (cache, bots, refresh) rather than algorithmic.

### 10.5 Trigger

Open Phase 2 only after Phase 1 ships and the team observes:

- Berlin sales friction (e.g. inquiries that mention nav confusion), **or**
- A deliberate Berlin-launch decision that Berlin chrome must persist across global pages.

Until then, the visible "Stockholm or Berlin" CTA pair on per-artwork pages is sufficient.

---

## 11. Phase 3 (deferred, separate plan): About migration

Migrating About, Optical fibre textile, Music, Artists to location-free URLs is a larger SEO and redirect project (per-locale shells, hreflang resnap, navigation in three languages, Berlin English currently canonicalises to Stockholm English per `BERLIN_EN_STORY_SEO_CANONICAL`). User explicitly deferred. Treat as its own plan when prioritised.

This artworks plan does **not** lock the site into a "location-free" pattern. It is a subsystem-scoped exception, deliberately so.

---

## 12. Implementation checkpoints — completed

Phase 1 shipped as PR #24. All steps 1–4 below were completed in that PR.

1. **Doctrine:** `docs/seo/url-architecture.md` §3 (artworks subsystem), `docs/seo/decisions.md` (`SEO-0022`), `docs/url-matrix.csv`, `docs/Andetag SEO Manual.md` §12 updated. **Done.**
2. **Collection rekey:** `/en/artworks/` and `/sv/konstverk/` in registry, navigation, schema, internal links. **Done.**
3. **Per-artwork route:** `site/src/pages/en/artworks/[slug].astro` + `site/src/pages/sv/konstverk/[slug].astro`, body components, schema `mainEntity`, `ArtworkCard` as `<a>`, modal "Open page" link, sitemap. **Done.**
4. **Launch content:** all artworks and gems generate pages; per-artwork narrative from `Artwork` structured fields (no separate copy module). **Done.**
5. **Phase 2 PR:** deferred — see §10.5 trigger conditions.

---

## 13. Decisions — resolved

All decisions were settled during implementation (PR #24).

1. **Collection at location-free URLs?** **Resolved: yes.** `/en/artworks/` and `/sv/konstverk/` are live.
2. **Title pattern.** **Resolved:** `Andetag no. <N> (<format>, <year>) | ANDETAG` for originals; gem title equivalent. Implemented in `artwork-shell-routes.ts`.
3. **Public URL slug.** **Resolved:** originals `andetag-no-<N>`; gems `andetag-gem-<name>`. `artworkPublicSlug()` in `artworks.ts`; internal `Artwork.id` unchanged.
4. **Sold pages indexable?** **Resolved: yes.** Sold pages are indexed; inquiry CTA is hidden; collector-map shown instead.
5. **Curated vs all on day one?** **Resolved:** all artworks and gems generate pages on launch.
6. **Per-artwork copy module.** **Resolved differently from plan:** a separate `artwork-page-copy.ts` was not created. Per-artwork narrative is driven entirely from structured fields in `Artwork` in `artworks.ts`. No prose-only copy module is needed.
7. **Berlin per-artwork CTA copy.** **Resolved:** "Visit in Stockholm or Berlin" link pair implemented in `ArtworkPageEn.astro` and `ArtworkPageSv.astro`.
