# SEO decisions log

Durable, ongoing SEO decisions that deviate from a "naive default" rule (e.g. self-canonical everywhere, single `@type`, scrape-the-Yoast-title). Each row stays in force until explicitly overturned by a new dated entry.

This file is the post-migration successor to the SEO-relevant rows in `docs/archive/migration-exceptions.md`. IDs are preserved (`SEO-NNNN` retains the trailing number from the originating migration `EX-NNNN` row so links from skills, PRs, and code comments still resolve mentally). Migration-era rows about phase-only deviations (build, scaffolding, deployment) live in `docs/archive/migration-exceptions.md`.

## How to add a row

1. Confirm the change is a **decision that deviates from a default SEO rule** (canonical, hreflang, schema parent type, on-page copy override, sitemap inclusion). Trivial fixes do not need a row.
2. Append a new row with: ID (next free `SEO-NNNN`), date (`YYYY-MM-DD`), scope, what changed, why, SEO impact, approval, follow-up.
3. Reference the row from the relevant skill, code comment, or PR description.
4. Never delete rows. Append a dated note when a decision is overturned.

---

## Active decisions

### `SEO-0012` — TripAdvisor: static review rendering, not plugin runtime

- **Date:** 2026-03-23 (carries `EX-0002` 2026-03-22 + `EX-0012`)
- **Scope:** integration / on-page rendering / schema
- **Decision:** No WordPress TripAdvisor shortcode or plugin runtime on the rebuilt site. Reviews are rendered as **static copy** plus the `TestimonialCarousel` component on Stockholm SEO landings; the besökaromdömen page additionally has an outbound link to the TripAdvisor profile. Source data: `site/src/lib/content/stockholm-reviews.ts`.
- **Rationale:** Static stack has no plugin runtime; review content is stable enough to ship as code; outbound link preserves user intent for those wanting fresh reviews.
- **SEO impact:** Low. Reviews still feed `aggregateRating` + `Review` JSON-LD on Museum/LocalBusiness (see `SEO-0017`). External outbound link counts as one PageRank-style outbound to TripAdvisor.
- **Approval:** Gustaf.
- **Follow-up:** When TripAdvisor figures change, edit `stockholm-reviews.ts`. See `skills/testimonials/SKILL.md`.

### `SEO-0015` — `/en/` hub: destination-neutral copy override

- **Date:** 2026-03-24
- **Scope:** content / on-page metadata
- **Decision:** `/en/` uses destination-neutral `<title>` and meta description aligned with `docs/Andetag SEO Manual.md` §1 and §1.1 (**breathing museum**, definite article where applicable). On-page copy is the header-selector hero only — no `<main>` body. The `page-shell-meta.json` row for `/en/` is the SEO source of truth; keep the hub row stable (do not replace with copy sourced from any legacy export).
- **Rationale:** Legacy `en.html` is a full Stockholm marketing home, not a two-city chooser. The hub UX requires coherent copy that does not commit to a destination before the visitor picks one.
- **SEO impact:** Low at adoption time (SERP snippet and social preview vs legacy Yoast). After `SEO-0021`, on-page metadata on `/en/` serves UX and sharing only; the shell is not an index target.
- **Approval:** Gustaf.
- **Follow-up:** Maintain the hand-authored `/en/` row in `page-shell-meta.json`. Do not optimize `/en/` head copy for ranking (`SEO-0021`).

### `SEO-0016` — Berlin English story shells canonicalize to Stockholm English

- **Date:** 2026-04-04
- **Scope:** SEO / canonical / hreflang
- **Decision:** For the four Berlin English story topics (`/en/berlin/about-andetag/`, `/en/berlin/music/`, `/en/berlin/optical-fibre-textile/`, `/en/berlin/about-the-artists-malin-gustaf-tadaa/`), the HTML `<link rel="canonical">`, `og:url`, and crawler-visible canonical all point to the **Stockholm English** URL for the same topic (e.g. `/en/berlin/music/` → `/en/stockholm/music/`). The Berlin English URL remains the address users see. Hreflang on that shell pairs English (self, Berlin path) with German (Berlin path) only — **no Swedish alternate**.
- **Rationale:** One consolidated English index target per story topic; avoids duplicate English story URLs; aligns with the location-scoped story matrix.
- **SEO impact:** Medium (intentionally consolidates English ranking signals onto Stockholm English).
- **Approval:** Gustaf (documents `docs/seo/url-architecture.md` §3 and `BERLIN_EN_STORY_SEO_CANONICAL` in `page-shell-registry.ts`).
- **Follow-up:** Sitemap and sharing QA treats Stockholm English as the indexed English story URL. Do not "fix" Berlin English to self-canonical.

### `SEO-0017` — Stockholm: paired `Museum` + `LocalBusiness` schema for review eligibility

- **Date:** 2026-04-06 (LocalBusiness pairing added 2026-04-14)
- **Scope:** SEO / schema (JSON-LD entity graph)
- **Decision:** Entity-first graph in `site/src/lib/chrome/schema-org.ts`. Stockholm shells emit a venue node with `@type: ["Museum", "LocalBusiness"]`:
  - `Museum` for semantics.
  - `LocalBusiness` (paired only here) so nested `aggregateRating` and `Review` satisfy Google's review-snippet list of valid parent types — `Museum` alone is not on that list.
  - No `TouristAttraction`. Legacy standalone `ArtGallery` dropped.
  - Museum `url` follows shell language (`/sv/stockholm/` vs `/en/stockholm/`).
  - `aggregateRating` and featured `Review` come from `stockholm-reviews.ts` only (see `SEO-0012`).
  - 6 `Offer` nodes from `stockholm-offers.ts`.
  - Four dated `Event` nodes for Art Yoga via `computeArtYogaOccurrenceSeriesIso` (build-time).
  - **Berlin pre-opening:** `Place` only (no aggregateRating, no opening-hours).
- **Rationale:** Aligns with `docs/Andetag SEO Manual.md` §6 and §11. AggregateRating per §6; offers from centralised price data (stable for 1+ year); `Event` uses `eventSchedule` for recurring Art Yoga.
- **SEO impact:** Low (graph hygiene). Star ratings, price range, and event rich results eligible in SERP for Stockholm pages.
- **Approval:** Gustaf, 2026-04-12.
- **Follow-up:** Monitor Rich Results in GSC for 2-4 weeks post-cutover. Maintenance: `skills/testimonials/` (review data), `skills/operational-facts/` (prices), `skills/events/` (Art Yoga occurrences).

### `SEO-0019` — `/sv/stockholm/utstallning-stockholm/`: corrected Swedish spelling

- **Date:** 2026-04-10
- **Scope:** content / metadata
- **Decision:** `<title>` in `page-shell-meta.json` and the on-page H1 for `/sv/stockholm/utstallning-stockholm/` use correct Swedish **konstutställning** (double **n**). The legacy Yoast scrape contained the typo **konstutställing**.
- **Rationale:** Typo in scraped HTML; live WP footer was already corrected; aligns with dictionary form.
- **SEO impact:** Low. SERP title and on-page H1 show corrected spelling vs legacy scrape.
- **Approval:** Gustaf.
- **Follow-up:** Keep the corrected spelling in `page-shell-meta.json` when editing this path (legacy frozen HTML, if still present in `archive/`, is not a source of truth).

### `SEO-0020` — x-default → English; verified-bot bare-host 301; `/en/` served to bots

- **Date:** 2026-04-25
- **Scope:** SEO / hreflang / entry routing / sitemap / on-page schema
- **Decision:**
  - **x-default flips to the English sibling** for every shell that emits hreflang. Stockholm pairs use `/en/stockholm/...`, Berlin pairs use `/en/berlin/...`, and the `/en/` hub uses `/en/`. Privacy shells use the English privacy URL of their location.
  - **Verified bots at `/`** receive a `301` to `/en/stockholm/` (was `302`). Verified-bot detection uses `cf.botManagement.verifiedBot` with a User-Agent fallback (Googlebot, Bingbot, etc.) inside `site/workers/entry-routing-logic.ts`.
  - **Verified bots at `/en/`** receive the static EN hub asset (`200`) instead of being routed onward by cookie or UA defaults, so the global English root remains directly indexable (**superseded by `SEO-0021` on 2026-05-01**).
  - **Sitemap excludes the four Berlin English story shells** that `SEO-0016` canonicalizes to Stockholm English (`/en/berlin/about-andetag/`, `/en/berlin/music/`, `/en/berlin/optical-fibre-textile/`, `/en/berlin/about-the-artists-malin-gustaf-tadaa/`); they continue to serve as `200` HTML to humans.
  - **`SiteNavigationElement` JSON-LD** is added to the entity graph: one node per locale on Stockholm shells (`sv`, `en`) and one on Berlin shells (`de`, `en`), listing the in-locale primary subpages.
- **Rationale:** English is the broadest-audience locale and the most defensible global default for unauthenticated requests; flipping x-default away from the Swedish hub aligns the international targeting with the actual content depth in English. Returning `301` to bots at the bare host stops engines from caching `/` as the canonical entry. At the time, serving `/en/` to bots preserved the indexed global hub; that specific part was later reversed in `SEO-0021` when `/en/` was reclassified as a human selector utility. The sitemap exclusion mirrors the canonical decision in `SEO-0016`. `SiteNavigationElement` gives crawlers an explicit primary-nav signal per locale.
- **SEO impact:** Medium. International SERPs may shift toward the English page when no language match is determined. `/en/stockholm/` is the primary global landing page for English-speaking discovery; `/en/` remained indexed only until `SEO-0021`. Sitemap row count drops by four (consistent with the canonical decision, not a new exclusion of indexable content).
- **Approval:** Gustaf, 2026-04-25.
- **Follow-up:** Historical only after `SEO-0021`. Tests at the time: `site/src/lib/routes/page-shell-registry.test.ts` (x-default parity), `site/workers/entry-routing-logic.test.ts` and `site/workers/entry-router.test.ts` (`301` + serve-asset), `site/src/lib/chrome/schema-org.test.ts` (`SiteNavigationElement`).

### `SEO-0021` — `/en/` selector hub de-indexed; bots routed to `/en/stockholm/`

- **Date:** 2026-05-01
- **Scope:** SEO / indexation / entry routing / sitemap
- **Decision:**
  - **`/en/`** remains the live Stockholm-vs-Berlin chooser for humans who reach it directly, but it is **not** an SEO target: HTML emits `meta robots="noindex,follow"`, and the Astro sitemap filter excludes `/en/`.
  - **Verified bots at `/en/`** receive a redirect to `/en/stockholm/` instead of the selector asset (supersedes the bot-handling bullet in `SEO-0020`).
  - Ranking signals for English discovery consolidate on **`/en/stockholm/`** and other indexable English shells.
- **Rationale:** Gustaf clarified that `/en/` is a manual-entry utility, not a page to rank. Humans can still use it when they navigate to `/en/`; root `/` routes English-lane visitors to `/en/stockholm/` by default (see `docs/seo/url-architecture.md` §4).
- **SEO impact:** Low–medium. Removes `/en/` from the indexable set; expected consolidation onto `/en/stockholm/`. On-page title/description on `/en/` (`SEO-0015`) remain for UX and social preview only, not SERP targeting.
- **Approval:** Gustaf.
- **Follow-up:** Tests: `site/workers/entry-routing-logic.test.ts`, `site/workers/entry-router.test.ts`, built HTML spot-check for `noindex`, sitemap exclusion. See `docs/seo/url-architecture.md` §4 and `docs/Andetag SEO Manual.md` §12.1.

### `SEO-0022` — Artworks subsystem at location-free URLs

- **Date:** 2026-05-04
- **Scope:** SEO / URL contract / hreflang / sitemap
- **Decision:** The artworks subsystem (collection page + one page per artwork) lives at **location-free** canonical paths, deviating from the standard `/{lang}/{location}/...` shape:
  - Collection: `/en/artworks/` and `/sv/konstverk/`.
  - Per-artwork: `/en/artworks/<slug>/` and `/sv/konstverk/<slug>/`, where `<slug>` is `andetag-no-<N>` for originals and `andetag-gem-<name>` for gems (computed from `Artwork.id` via `artworkPublicSlug()` in `site/src/lib/content/artworks.ts`).
  - Hreflang stays Stockholm-style sv ↔ en, x-default = en. No Berlin/Stockholm cross-pairing.
  - Stockholm chrome is the Phase 1 default for both languages on every artwork URL.
  - JSON-LD `@id` for each `VisualArtwork` stays on `Artwork.id` (`<host>/#artwork-<id>`); only the browser-facing path uses `<slug>`.
  - Per-artwork pages live in dedicated dynamic Astro routes (`site/src/pages/en/artworks/[slug].astro`, `site/src/pages/sv/konstverk/[slug].astro`), **not** in `page-shell-meta.json`.
  - Per-artwork JSON-LD adds `mainEntity` on the `WebPage` node and a single `VisualArtwork` node for the focused work.
  - Sold-status pages are indexable and emit no inquiry/CTA. Available works embed the `InquiryForm` pre-filled with `?about=<Artwork.id>`.
- **Rationale:** Single global inventory of unique works supports sales conversations from either Stockholm or Berlin without duplicating the catalogue. The full subsystem was unmerged at the time of the decision, so there were no legacy URLs to preserve. Subsystem-scoped exception, not a site-wide pattern shift.
- **SEO impact:** Low. Artwork pages are a new index surface; they do not displace existing canonicals. Hreflang scope unchanged.
- **Approval:** Gustaf, 2026-05-04.
- **Follow-up:** Shipped with Stockholm chrome on all artwork URLs. Cookie-driven dual chrome on the same URL (Berlin vs Stockholm nav) is not planned unless Berlin sales require it.

### `SEO-0023` — Swedish shells: no "breathing museum" bridge phrase

- **Date:** 2026-05-30
- **Scope:** content / metadata / locale keyword strategy
- **Decision:** Do **not** use *andande konstmuseum*, *atmende museum*, or literal translations of the English discoverability phrase **breathing museum** in Swedish titles, meta descriptions, or as a forced SEO keyword. The brand name **ANDETAG** is self-explanatory in Swedish (literally “a breath”). Swedish shells use the name and natural Swedish vocabulary (*konstprojekt*, *konstupplevelse*, *stillhet*, *andetag*) instead. The English phrase **breathing museum** and German **Atemmuseum** / **atmendes Museum** remain required bridge phrases for **non-Swedish locales only** (SEO Manual §1.1, `docs/Tone of Voice.md`).
- **Rationale:** Translating the English discoverability phrase into Swedish reads unnatural and duplicates what the brand name already conveys.
- **SEO impact:** Low. Clarifies locale asymmetry already practiced on live copy (e.g. `/sv/stockholm/om-andetag/` meta stays konstprojekt-framed while English About shells may use *breathing art museum*).
- **Approval:** Gustaf.
- **Follow-up:** SEO skill §B meta checks and page-pair reviews must not flag missing *breathing museum* on Swedish shells. Do not literal-translate English meta refreshes into Swedish.

---

## Cross-references

- URL contract: `docs/seo/url-architecture.md`.
- Page intent and keyword strategy: `docs/Andetag SEO Manual.md`.
- Tone for any copy override: `docs/Tone of Voice.md`.
- Workflow for SEO edits: `skills/seo/SKILL.md`.
- Runtime: `site/src/lib/routes/page-shell-registry.ts`, `site/src/lib/chrome/schema-org.ts`, `site/src/lib/chrome/seo.ts`.
