---
name: seo
description: Use when changing SEO-sensitive elements on the ANDETAG Astro site (site/) — titles, meta descriptions, canonical tags, hreflang, Open Graph, Twitter cards, JSON-LD entity graph, robots directives, internal linking, sitemap inclusion, keyword framing, or tone; or when **`skills/page/SKILL.md` §Verification** (or a page PR) requires **per-page content feedback** (see **§H**). Triggers include "update the meta description", "change the title", "fix the hreflang", "add a schema field", "check canonicals", "is this a good SEO title", "can we target this keyword", "update the AggregateRating", "does this respect our tone", "review this copy for SEO", "SEO check for this new page". Enforces the locked architecture in docs/seo/url-architecture.md, the keyword and schema doctrine in docs/Andetag SEO Manual.md, and the copy constraints in docs/Tone of Voice.md. Source integrity is non-negotiable — no fabricated URLs, keywords, ratings, prices, or schema fields. Rich Results validation is manual (live deploy, not lab). For organic-traffic correlation, routes through the performance-check skill's §E stats bridge.
---

## Purpose

Keep the on-page SEO and entity-graph of `andetag.museum` coherent with the locked architecture and the brand doctrine. This skill is the **gatekeeper** for anything that a crawler, AI, or SERP preview will read — page titles, meta descriptions, canonicals, hreflang, Open Graph, Twitter cards, JSON-LD, robots, sitemap membership, keyword framing, internal links. It does **not** design new pages (that is `skills/page`), update operational facts (that is `skills/operational-facts`), or measure performance (that is `skills/performance-check`). It reviews, extends, and fixes the SEO contract of what already exists, and blocks edits that would silently break it. **`skills/page` invokes it for testing:** when a page task finishes implementable work, run **§H** to deliver **SEO content feedback** on the affected page pair(s) before merge (titles/descriptions, on-page copy signals, and built HTML checks scoped to those URLs — not a whole-site audit unless the change demands it).

This skill draws structural inspiration from the MIT-licensed community skills at `coreyhaines31/marketingskills/skills/seo-audit` and `JeffLi1993/seo-audit-skill` — their section shape (initial assessment → technical → international → on-page → schema) is a reasonable baseline. Nothing is copied verbatim; the substance is the ANDETAG docs. See §G "OSS survey notes" for what was reviewed and why no full adoption happened.

This skill is **not** for:

- **Writing or shipping new pages.** Page creation/removal/renames are `skills/page`. When this skill finds an SEO regression it cannot fix in-body (a missing shell, a stale registry row), route to `page`.
- **Changing operational facts** (hours, prices, contact, address). That is `skills/operational-facts`; however, this skill reviews the JSON-LD representation when those facts propagate to `schema-org.ts`.
- **Running Lighthouse / Core Web Vitals.** That is `skills/performance-check`. CWV field data correlates with ranking but is measured elsewhere; the report template in §F cross-links.
- **Rewriting the URL architecture.** Locked by `docs/seo/url-architecture.md` and `site/workers/entry-router.ts`. Any proposed change is out of scope — escalate, do not "optimise" it.
- **Inventing new schema types or markup patterns** not already grounded in `docs/Andetag SEO Manual.md` §6 and `docs/seo/decisions.md` `SEO-0017`. Expansion requires a new row in `docs/seo/decisions.md` approved by Gustaf.

## When to use

- A PR edits a `<title>`, `<meta name="description">`, `<meta property="og:*">`, `<link rel="canonical">`, hreflang link, robots meta, or any JSON-LD node on a shell.
- A content change in `site/src/lib/content/` or `site/src/lib/chrome/schema-org.ts` propagates to structured data (prices, reviews, events, FAQ, opening hours).
- A new page is being proposed or wired (coordinate with `skills/page`): confirm keyword fit, canonical path, hreflang parity, sitemap inclusion, shell meta.
- **Page-skill verification** — `skills/page` requires a **§H** pass on each affected path before merge; run **§H** when acting as the SEO reviewer for that page work or when asked for "SEO feedback on this page" in isolation.
- `docs/meta-texts-catalog.md` is being re-applied to `site/src/data/page-shell-meta.json`.
- An agent is asked to write or review a page title, meta description, H1, H2, or in-body copy for SEO fit.
- A GSC alert, a search snippet change, or a Rich Results console warning needs diagnosis.
- Someone asks "can we target keyword X", "should this be a separate page", "is this going to help us rank", or "this page is not ranking — what's wrong".
- A finding from `skills/site-integrity/SKILL.md` flagged a canonical/hreflang drift or a sitemap row.
- Before merging any PR that touches `page-shell-registry.ts`, `schema-org.ts`, `SiteLayout.astro`, or `seo.ts`.

## Files touched

Read-first in every invocation (the doctrine changes more often than the code):

- `docs/Andetag SEO Manual.md` — positioning, keyword constraints, URL architecture, indexation, hreflang, schema strategy, GEO (AI-recommendability), internal linking. **Normative** for on-page SEO.
- `docs/Tone of Voice.md` — copy constraints. Em dash (U+2014) is prohibited. Words we avoid (mind-blowing, magical, healing, transformative, life-changing, revolutionary, spiritual, must-see, unforgettable). Invitational, not instructional.
- `docs/seo/url-architecture.md` — URL architecture, canonical rules, redirect policy, sitemap membership rules, entry routing at `/` and `/en/`, location-scoped story URLs, privacy URL policy, query-parameter policy.
- `docs/seo/decisions.md` — durable SEO deviations from default rules. Most-cited rows: `SEO-0015` (`/en/` hub copy), `SEO-0016` (Berlin English canonicals → Stockholm English), `SEO-0017` (Museum + LocalBusiness for AggregateRating/Review), `SEO-0019` (konstutställning spelling override vs the scraped Yoast title). Each drift from a "default" SEO rule has a row; edits that contradict a row must update it or add a new one.
- `docs/meta-texts-catalog.md` — curated titles and descriptions per shell. **Edits apply here first**, then propagate to `site/src/data/page-shell-meta.json`. Do not rely on `site/scripts/extract-page-shell-meta.mjs` to preserve hand-tuned copy.

Read for the runtime contract:

- `site/src/lib/routes/page-shell-registry.ts` — `STOCKHOLM_SV_EN_PAIRS`, `BERLIN_DE_EN_STORY_PAIRS`, `BERLIN_EN_STORY_SEO_CANONICAL`, `resolveSeo()` builds the hreflang record and `x-default`. Canonical/hreflang changes start here.
- `site/src/lib/chrome/seo.ts` — `CANONICAL_HOST` (`https://www.andetag.museum`), `OG_SITE_NAME` (`ANDETAG`), `languageToHreflangAttribute` (sv → `sv-SE`, en → `en`, de → `de-DE`), `languageToOgLocale` (underscore form `sv_SE` / `en_US` / `de_DE`), `ogLocaleAlternates`, `buildHreflangLinks`. **Do not edit these without checking the SEO Manual §5.**
- `site/src/lib/chrome/schema-org.ts` — entity graph. Museum + LocalBusiness, Organization, WebSite, WebPage, ImageObject, Event (Art Yoga), FAQPage (when on `/sv/stockholm/fragor-svar/` or `/en/stockholm/faq/`), Place (Berlin). Addresses, opening hours, offers, aggregateRating, review sourced from `stockholm-*.ts` in `site/src/lib/content/`.
- `site/src/layouts/SiteLayout.astro` — where `<title>`, `<meta name="description">`, canonical + hreflang, OG, Twitter, and JSON-LD are emitted per shell. `robots?: "index,follow" | "noindex,nofollow"` prop (default indexable).
- `site/src/data/page-shell-meta.json` — per-shell `title`, `description`, optional `ogImage`. Keyed by canonical path.

Read for content-level SEO:

- `site/src/lib/content/stockholm-reviews.ts` — AggregateRating + Review source (`skills/testimonials`).
- `site/src/lib/content/stockholm-offers.ts` — Offer nodes + Art Yoga Event (`skills/operational-facts`, `skills/events`).
- `site/src/lib/content/stockholm-faq.ts` — FAQPage source (`skills/faq`).
- `site/public/_redirects` — canonical targets for legacy URLs. Every SEO canonical **must** resolve as `200`, never through a `301`.
- `docs/url-matrix.csv` — `keep` rows are indexable; `redirect` rows must not appear in the sitemap; `remove` rows must 404 or gone.
- `site/dist/sitemap-0.xml` (built artifact) — list of canonical indexable URLs. Excludes `/` (router), `_redirects` aliases, noindex.

Write-path (only with explicit triggers):

- `site/src/data/page-shell-meta.json` — after applying `docs/meta-texts-catalog.md`.
- `docs/meta-texts-catalog.md` — when updating titles/descriptions (edit here first).
- `site/src/lib/chrome/schema-org.ts` — only to reflect already-approved data changes (new Offer because price changed, etc.); never to invent a new schema type without a new EX row.
- `site/src/lib/routes/page-shell-registry.ts` — only when a new locale pair or a new Berlin English story canonical is being wired (coordinate with `skills/page`).
- `CHANGELOG.md` — `### Changed` or `### Added` row per edit, per the project's `docs/changelog-standards.md`.
- `docs/seo/decisions.md` — new `SEO-NNNN` row when a decision deviates from a default SEO rule.

## Locale parity rules

- **Stockholm `sv` ↔ `en`.** Every Stockholm shell in `STOCKHOLM_SV_EN_PAIRS` has both locales. A title or description edit on one side without the other is a regression; a hreflang entry without a live peer is a regression.
- **Berlin `en` ↔ `de`.** Same rule for `BERLIN_DE_EN_STORY_PAIRS`. No Swedish alternate for Berlin.
- **No cross-location hreflang.** Stockholm English and Berlin English are peers only on the **hub** `/en/` (whose hreflang record is `{ sv: /sv/stockholm/, en: /en/, de: null }` with `x-default: /sv/stockholm/`). For **topic** pages, Stockholm and Berlin do **not** hreflang-link to each other.
- **Berlin English story pages** (`/en/berlin/about-andetag/`, `/en/berlin/music/`, `/en/berlin/optical-fibre-textile/`, `/en/berlin/about-the-artists-malin-gustaf-tadaa/`) use HTML `rel="canonical"` pointing to the Stockholm English equivalent (`SEO-0016`). This is **intentional** — do not "fix" it to self-canonical. `og:url` in `SiteLayout.astro` follows the SEO canonical (so social shares also point to Stockholm English).
- **Swedish titles and descriptions** live under `/sv/` and use `sv-SE` for hreflang and `sv_SE` for OG locale. English uses `en` hreflang and `en_US` OG locale (by convention in this repo). German uses `de-DE` / `de_DE`.
- **Quotes are not translated across locales** (TripAdvisor policy — see `skills/testimonials`).

## Workflow

### A. Clarify the change shape

Before editing anything, decide what kind of SEO change this is. The rest of the workflow depends on it.

| Change shape | What it touches | Primary doc |
|--------------|-----------------|-------------|
| Title or meta description edit | `docs/meta-texts-catalog.md` + `site/src/data/page-shell-meta.json` | SEO Manual §1, §1.1, §12 (keyword line per page); Tone of Voice |
| Canonical or hreflang change | `page-shell-registry.ts`, `seo.ts` | SEO Manual §5; `docs/seo/url-architecture.md` §4 (entry routing) |
| Robots directive | `SiteLayout.astro` (shell-level) or body `<meta name="robots">` | SEO Manual §4 |
| Open Graph / Twitter | `SiteLayout.astro` + `ogImage` field on shell meta | SEO Manual §5 OG baseline |
| JSON-LD / structured data | `schema-org.ts` (graph), `stockholm-*.ts` (data) | SEO Manual §6; `docs/seo/decisions.md` `SEO-0017` |
| Internal link additions | in-body Astro files, `navigation.ts` | SEO Manual §15 |
| Keyword targeting / page positioning | `docs/Andetag SEO Manual.md` §12 + body copy | SEO Manual §2, §12; `docs/seo/url-architecture.md` §5 (SEO landing page policy) |
| Sitemap membership | `url-matrix.csv` + built `dist/sitemap-0.xml` | `docs/seo/url-architecture.md` §11 (sitemap rules) |
| New page | coordinate with `skills/page` | SEO Manual §12 + `page` skill |

### B. Technical SEO audit (mandatory before committing any change in scope)

Run these checks against the built `dist/` — a stale `dist/` makes the audit meaningless. Use `skills/site-integrity` for the deeper sweep; this skill handles the SEO-specific subset.

1. **Title**
   - Exactly one `<title>` per page (`grep -c "<title>" dist/<path>/index.html`).
   - Length: aim for ~50–65 characters visible. The ANDETAG pattern appends `| ANDETAG Stockholm` (or `| ANDETAG Berlin`) as a brand suffix — common in `page-shell-meta.json`. Don't strip the suffix unless you add a new EX row.
   - Matches the row in `docs/meta-texts-catalog.md`. If the catalog and `page-shell-meta.json` disagree, catalog wins (edit JSON to match) — unless the row carries a decision note (`SEO-0015` `/en/` hub, `SEO-0019` konstutställning spelling) in `docs/seo/decisions.md`.
   - Contains the primary keyword from SEO Manual §12 for that page. For English hub + location `/en/`, `/en/stockholm/`, and English home-like pages, **"breathing museum"** must appear in title OR description per §1.1.
2. **Meta description**
   - Present on every indexable shell (the hub and leaf shells; 404 has none intentionally).
   - Length: ~120–160 characters visible. Swedish tends slightly longer; allow up to ~170.
   - Not identical across shells in the same locale family (de-duplication).
   - Tone: calm, concrete, invitational. No em dash (U+2014) — use commas, colons, or parentheses. No banned words (mind-blowing, magical, healing, transformative, life-changing, revolutionary, spiritual, must-see, unforgettable) unless quoting a review (reviews are fair game per `SEO-0017`'s lineage).
3. **Canonical**
   - Exactly one `<link rel="canonical">` per page.
   - Absolute URL rooted at `https://www.andetag.museum` (never `andetag.museum` bare or `http://`).
   - For standard shells: self-referential (matches the shell path with trailing slash).
   - For Berlin English story shells (`/en/berlin/about-andetag/`, `/en/berlin/music/`, `/en/berlin/optical-fibre-textile/`, `/en/berlin/about-the-artists-malin-gustaf-tadaa/`): points to the **Stockholm English** equivalent per `BERLIN_EN_STORY_SEO_CANONICAL` (`SEO-0016`). Do not flag this as an error.
   - Never points through a `301` — destination must be a `200` in the built site.
4. **Hreflang**
   - Self-referential entry present (except Berlin English story shells, where the SEO canonical pair means the English "self" is Stockholm; verify against `resolveSeo()` output).
   - All referenced alternates must be `200` in `dist/`.
   - `x-default` present per registry; Stockholm pairs point to the Swedish URL, Berlin pairs point to the German URL, `/en/` hub points to `/sv/stockholm/`.
   - Same-location only. No Stockholm ↔ Berlin hreflang on topic pages.
   - BCP47 values: `sv-SE`, `en`, `de-DE`, `x-default`.
5. **Open Graph + Twitter**
   - `og:url` matches `<link rel="canonical">` (including Berlin English SEO canonical).
   - `og:title` and `og:description` match `<title>` and `<meta name="description">`.
   - `og:locale` underscore form (`sv_SE`, `en_US`, `de_DE`); `og:locale:alternate` present for each sibling with a live hreflang.
   - `og:site_name` = `ANDETAG`.
   - `og:type` = `website` (SEO Manual Phase 6 baseline; change to `article` only when a news-style publication warrants it, and only with an EX row).
   - Default `og:image` is `HERO_SV_ASSETS.poster` (Stockholm hero still frame). Per-page overrides use `page-shell-meta.json → ogImage` (root-relative path, no host).
   - Twitter card: `summary_large_image`. `twitter:image` = `og:image` (same URL).
6. **Robots**
   - Indexable shells have **no** `<meta name="robots">` (or `index,follow`).
   - Non-indexable routes: 404 has `noindex,nofollow`; `/component-showcase/` retired 2026-03-23 (no live noindex needed); Understory endpoints / ticket modals never served as HTML shells.
   - Transactional confirmation / cancellation links are external (Understory domain), not ours.
7. **Structured data (JSON-LD)**
   - Exactly one `<script type="application/ld+json">` per page; `@graph` pattern (Organization, WebSite, WebPage, Museum-LocalBusiness or Place, plus topical nodes).
   - Stockholm pages: `@type: ["Museum", "LocalBusiness"]` on the venue node (`SEO-0017` — not a drift, a documented decision).
   - `aggregateRating.reviewCount` is a **JSON number**, not a string (`193`, not `"193"`). `ratingValue` is a **string** (`"4.9"`, not `4.9`) per Google's own doc examples. Mixing these breaks Rich Results.
   - `Offer.price` is a **string** (`"245"`), `priceCurrency` is `"SEK"` (ISO 4217).
   - `Event.startDate` / `endDate` are ISO 8601 with `+01:00`/`+02:00` offset per `computeArtYogaOccurrenceSeriesIso`. `eventSchedule` is preserved — do not remove the recurring rule in favour of the dated events alone.
   - `FAQPage.mainEntity.Question.acceptedAnswer.Answer.text` preserves HTML (`bodyHtml` field in `stockholm-faq.ts`).
   - Berlin pre-opening pages use `Place`, not `Museum` — re-check when Berlin opens (SEO Manual §11).
8. **Internal links** (spot-check when editing body copy)
   - Never cross languages in-body (SEO Manual §15.1).
   - Never point to a non-canonical path (no missing `/sv/`, no redirect target).
   - Anchor text descriptive, ≤5 words, keyword-aligned; no "click here" / "read more" on its own.
   - Density 1–3 per prose block target; pillar hubs allowed more.
9. **Sitemap**
   - `dist/sitemap-0.xml` lists exactly the canonical indexable URLs: same set as `keep` indexable rows in `docs/url-matrix.csv` plus shell registry.
   - Excludes `/` (router), `_redirects` aliases, noindex, Berlin English story shells (they are indexed via the Stockholm English canonical they point to — confirm current behavior against registry when editing).
   - After edit: `npm run build` and re-grep the sitemap.

### C. International SEO (Stockholm sv+en, Berlin en+de)

- **Parity check.** Before shipping any title/description edit on a Stockholm shell, fetch the paired `en` row from `page-shell-meta.json` and confirm it is also consistent with the new intent. Same for Berlin `de` ↔ `en`.
- **Keyword asymmetry is allowed.** Swedish uses Swedish signals (`konstupplevelse stockholm`, `textilkonst stockholm`); English uses English signals (`breathing museum`, `quiet museum stockholm`); German uses German signals (`Atemmuseum`, `atmendes Museum`). Do not literal-translate a meta description — rewrite for the locale.
- **Tone asymmetry is allowed but bounded.** Per Tone of Voice: Swedish more restrained, English slightly more explanatory, German "quiet clarity, not formality". The Swedish name `andetag` (breath) needs a bridge phrase ("breathing museum", "Atemmuseum") in English / German once per page.
- **Do not introduce a fourth language.** Any locale beyond `sv` / `en` / `de` is out of scope until Gustaf scopes it.

### D. On-page SEO

- **H1 per page.** Exactly one. Keyword-aligned but not stuffed. Body modules own H1 (not `SiteLayout`); verify by grep on `dist/`.
- **Heading hierarchy.** `h1 → h2 → h3`, no skips. Landmark roles (`<main>`, `<nav>`, `<footer>`) unchanged.
- **First paragraph** should state what the page is, using the page's keyword line from SEO Manual §12 naturally — not in the first five words, not as a list of terms.
- **Image alt text** pulls from `assets/images/photos.yaml` per `skills/images`. Do not hand-write alt that contradicts the catalog — extend the catalog instead.
- **Internal links** per §B.8 above; §15 of the SEO Manual lists the required contextual targets per page (Opening hours → Tickets + How to find us; Tickets → Opening hours + Art Yoga + Season pass; etc.). Audit before shipping a body rewrite.
- **Trust signals.** About, Contact, Privacy pages exist (EEAT). This skill does not add a new Contact page — that is `skills/page`.

### E. Schema and entity graph

- **The graph is already coherent.** Additions should be exceptional and backed by a new EX row. Removals should be reversible.
- **AggregateRating / Review** propagate from `stockholm-reviews.ts` — do not edit the JSON-LD directly; edit the source and let `schema-org.ts` propagate. See `skills/testimonials`.
- **Offer** propagates from `stockholm-offers.ts`. See `skills/operational-facts` for price edits.
- **Event** (Art Yoga) propagates from `STOCKHOLM_ART_YOGA_EVENT` and `computeArtYogaOccurrenceSeriesIso`. See `skills/events`.
- **FAQPage** propagates from `stockholm-faq.ts` (Swedish) and the shared `stockholm-what-is-andetag-faq-copy.ts`. See `skills/faq`.
- **Berlin = Place**, not Museum (pre-opening). Changing this requires a new EX row at Berlin opening (SEO Manual §11).
- **Validation** happens live: after deploy, run URL Inspection in GSC or the Rich Results Test on the affected live URL. Local lab does not equal Google's parser. Do not claim Rich Results eligibility without a live test.

### F. Source integrity (non-negotiable)

The most common failure mode for SEO work with an agent is **invented facts**. This is corrosive: a fabricated citation, URL, keyword claim, or schema field survives in the code and ships. Guardrails:

1. **URLs.** Every URL in a title, description, canonical, hreflang, `og:url`, JSON-LD `url`, or in-body link **must** come from one of: `STOCKHOLM_SV_EN_PAIRS` / `BERLIN_DE_EN_STORY_PAIRS` / `PAGE_SHELL_PATHS` / `docs/url-matrix.csv` / `site/public/_redirects`. If it is not there, it does not exist. Do not invent paths; propose them via `skills/page`.
2. **Keywords.** Use the GSC-derived signals in SEO Manual §2 only. Do not introduce keywords "because they trend". If the request is to target a new keyword, check §2 for overlap; if absent, flag the gap and escalate — do not silently add it.
3. **Metadata.** No fabricated titles / descriptions. If `docs/meta-texts-catalog.md` has the row, use it; if not, draft and add the row to the catalog first.
4. **Schema fields.** Never hand-type a `ratingValue`, `reviewCount`, price, opening hour, or address into `schema-org.ts`. Those come from their source-of-truth files (`stockholm-reviews.ts`, `stockholm-offers.ts`, the `STOCKHOLM_*` constants). If a field is missing from Google's documented schema for that type, do not add it.
5. **Quotes.** Testimonial text is verbatim TripAdvisor copy. No rewording for tone. No translation across locales (see `skills/testimonials`, `SEO-0012`, `SEO-0017`).
6. **Source artifacts.** `archive/legacy-wordpress-site/site-html/` is the **frozen** WP scrape — reference only. `SEO-0019` (utställning spelling) and the migration-only `EX-0007` (en-stockholm Yoast drift, in `docs/migration-exceptions.md` until archive) document where the scrape cannot be trusted. Always prefer `page-shell-meta.json` + `stockholm-*.ts` + `schema-org.ts` over the archived HTML.
7. **"Agreed sources."** The phase-9 todo names `seo-content/` as a potential future directory for approved SEO drafts. It does not exist yet (April 2026); until it does, approved sources are the docs and runtime modules above.

If source data is missing, say so. Do not fabricate.

### G. OSS survey notes (P9-13 adoption record)

Skills reviewed before authoring (all MIT-licensed, structural inspiration only):

- **`coreyhaines31/marketingskills/skills/seo-audit`** — best section structure for a general SEO audit skill. Influenced the ordering of this SKILL.md (technical → international → on-page → schema → source integrity). No copy adopted verbatim; the generic "when to use" triggers would be meaningless here without ANDETAG's locked architecture.
- **`JeffLi1993/seo-audit-skill`** — single-page audit format (URL in, report out). The two-layer pattern (deterministic script + agent judgment) informed the §B mandatory checks list. Not adopted because the ANDETAG pipeline is static and already has Vitest-based parity tests + `skills/site-integrity` for the deterministic half.
- **`kostja94/marketing-skills`** — 160+ page-type skills. Reviewed for naming conventions; ANDETAG's page set is small and locked, so breadth was not useful.

No skill was installed as a dependency; the frontmatter and workflow above are written to this project. If a future release of `seo-audit` adds a pattern worth adopting (for example a standardised Rich Results test checklist), extend §E rather than vendor the upstream file — ANDETAG's doctrine is specific enough that upstream drift would regress us.

### H. Page-pair content review (invocation from `skills/page` or a focused page PR)

Use when **`skills/page/SKILL.md`** (or a PR that only adds/edits specific pages) needs **SEO feedback on individual page content** before merge. This is a **scoped** pass — the touched canonical path(s) only — not a substitute for a full `skills/site-integrity` sweep or a whole-site GSC review.

1. **Identify scope** — List every `sv` / `en` (or `de` / `en` for Berlin) path changed or introduced. If only body copy changed, both locales of the pair still get **§H** when the page skill runs verification.
2. **Read doctrine first** — `docs/Andetag SEO Manual.md` §1, §2 (keyword line for that page type from §12 where applicable), §15 internal linking; `docs/Tone of Voice.md` for banned phrasing and em dash (U+2014) prohibition.
3. **Shell / meta** — For each path, read `site/src/data/page-shell-meta.json` (and `docs/meta-texts-catalog.md` if the row is curated there). Check title and meta description against **§B.1** and **§B.2** (length, keyword presence where required e.g. §1.1 "breathing museum" on English home-like shells, de-duplication, no banned words). If **§B** or **§C** already covers international parity, confirm the peer locale row still makes sense.
4. **On-page (body)** — For each edited `*Sv.astro` / `*En.astro` (or `*De.astro`), apply **§D**: single `h1` intent, heading hierarchy, first paragraph, internal links and anchor text (§15.1 / §15 contextual targets when the page has required peer links). If images changed, alts must stay aligned with `assets/images/photos.yaml` per `skills/images`.
5. **Built HTML** — After `npm run build`, for each path run the relevant slices of **§B** on `site/dist/<path>/index.html`: **§B.1** title, **§B.2** description, **§B.3** canonical, **§B.4** hreflang, **§B.5** OG/Twitter mirror (Berlin English story **§B.3** self-canonical → Stockholm: `SEO-0016`, not a bug).
6. **Source integrity** — **§F** for any new or edited in-body link: no invented paths; only canonical targets from the registry / url-matrix / known routes.
7. **Output (required for page PRs)** — Write a **short review block**: `§H: pass` or a numbered list of **issues** (severity, file, suggested fix). If a fix would violate a default rule, flag **`SEO-NNNN`** (new row in `docs/seo/decisions.md`) or escalation to Gustaf. The page-PR author resolves issues or documents an approved deviation.

**Not in §H by default:** full sitemap validation, all redirects, CWV — defer to `skills/site-integrity` and `skills/performance-check` when the page change has broader blast radius. **JSON-LD** — only re-audit **§B.7** if this task edited `schema-org.ts` or content sources that flow to the graph; otherwise note "graph unchanged" unless a page type always warrants a diff.

## Verification

Before asking for merge, run:

1. `cd site && npm test` — all existing parity and registry tests must pass. Of direct relevance: `page-shell-registry.test.ts`, `url-matrix-parity.test.ts`, `schema-org.test.ts`, `build-output-structure.test.ts`, `chrome-navigation-resolve.test.ts`.
2. `cd site && npm run build` — `dist/` rebuilt from the edited source.
3. **SEO audit per §B** — every dimension that applies to the change. For a title / description edit, §B.1 + §B.2 + §B.5 (OG mirror) + §C parity are required; for a canonical / hreflang edit, §B.3 + §B.4 + §C; for a schema edit, §B.7 + §E. **When the work was triggered or reviewed from `skills/page`**, also complete **§H** and attach its outcome to the PR.
4. **`skills/site-integrity`** for the cross-cutting sanity sweep (sitemap, redirect chains, image references).
5. **`skills/performance-check`** only if the edit could affect LCP / CLS (new hero, new preload, new OG image) — most SEO-only edits do not.
6. **Live Rich Results Test** (manual, deploy required): run on one affected live URL after merge. Expected outcomes: Stockholm pages eligible for AggregateRating / Review / Event / FAQPage rich results; Berlin pre-opening no rich results (Place only); 404 none.

### PR report line

The PR or release note must contain a one-line SEO summary of the change, bindings to the doctrine, and the rollback target. Template:

```
SEO: <change summary> — titles <N shells touched>, descriptions <N>, canonical/hreflang <none|updated>, JSON-LD <none|type/node>, robots <unchanged>. Docs: <SEO Manual §, Tone of Voice §, docs/seo/url-architecture.md §, SEO-NNNN if new>. Rich Results: <pending live test|N/A>. Rollback: `git revert <sha>`.
```

Example:

> SEO: propagate renamed season-pass tier to Offer + meta description — titles 2 shells touched, descriptions 2, canonical/hreflang none, JSON-LD Offer node updated (2 Stockholm locales), robots unchanged. Docs: SEO Manual §6, `stockholm-offers.ts` single-source. Rich Results: pending live test on `/en/stockholm/season-pass/`. Rollback: `git revert abc1234`.

### Pass vs needs-exception

- **Pass** — §B audit clean for the affected dimensions, §C parity holds, §F source-integrity holds, existing tests green, build green. **Page-originated work:** **§H** is clean or all issues are resolved / documented.
- **Needs decision row** — any deviation from a default SEO rule that is intentional (Berlin English canonicals → Stockholm English is already `SEO-0016`; a new intentional deviation needs a new `SEO-NNNN` row in `docs/seo/decisions.md`). Do not ship silently; log the row with owner Gustaf and the commit SHA.

## When to escalate

Stop and ask before proceeding if:

- A requested change would alter `CANONICAL_HOST`, `OG_SITE_NAME`, or the `languageToHreflangAttribute` mapping. These are locked; changing them is a migration, not a maintenance edit.
- A requested keyword is outside SEO Manual §2 and the request is "target this new keyword". Run `../stats/cli` (read-only; see `skills/performance-check` §E for the stats bridge) to confirm whether GSC data supports the keyword before escalating; do not silently add it.
- A requested schema type is not already in `schema-org.ts` and is not listed in SEO Manual §6 (for example `Product`, `Recipe`, `HowTo`). Flag to Gustaf — schema expansion requires a `SEO-NNNN` row in `docs/seo/decisions.md` and a Rich Results strategy.
- A requested Rich Results change requires Google-side validation beyond the Rich Results Test (for example manual verification of `aggregateRating` within Google Business Profile). That is operational, not a code change.
- A `noindex` is being added to a page that was previously indexable. This is a traffic loss. Requires explicit approval and a `SEO-NNNN` row in `docs/seo/decisions.md`.
- A canonical edit would orphan inbound links (legacy `/stockholm/*` pointed at the old path, new canonical lives elsewhere). Check `docs/url-matrix.csv` first; if the move is intentional, add a `redirect` row.
- GSC / GA4 data requested but `../stats/cli` is not installed or authenticated. Do not fabricate numbers; report the gap (same rule as `skills/performance-check` §E).
- `docs/meta-texts-catalog.md` has a row that disagrees with `page-shell-meta.json` and neither is marked with a `SEO-NNNN` decision row. One of them is stale; ask Gustaf which wins.
- A Tone of Voice call is ambiguous (is "quietly striking" ok? is "life-changing" ever ok in a quoted review?). When in doubt, err calm. Escalate before shipping.
- A Berlin page edit would contradict the pre-opening scope (SEO Manual §11: `Place` only, no Museum, no tickets, lead capture only). Berlin opening status change is Gustaf's call.

## Examples

### Example 1: edit the `/en/stockholm/` meta description

Request: "Rewrite the English Stockholm home meta description to lead with 'breathing museum' and include 'Hötorget' for local intent."

Action:

1. **Clarify**. Title or description edit (§A).
2. **Read** `docs/meta-texts-catalog.md` `/en/stockholm/` row and `page-shell-meta.json` matching key. Confirm current copy and length.
3. **Draft.** Keep under ~160 chars. Include **breathing museum** (SEO Manual §1.1). Include Hötorget (location signal §2). Calm, concrete, invitational (Tone of Voice). No em dash. No banned word.
4. **Apply** to `docs/meta-texts-catalog.md` first, then propagate to `page-shell-meta.json`.
5. **Parity.** Swedish `/sv/stockholm/` uses Swedish signals; confirm it still reads naturally (it does not need to translate the English change — keyword asymmetry is allowed §C).
6. **Audit** §B.2, §B.5 (og:description mirror), §C parity, §F no fabricated facts.
7. **`npm test && npm run build`**, spot-check `dist/en/stockholm/index.html` for the new description + og:description + twitter:description agreement.
8. PR report line per §Verification.

### Example 2: propose adding `aggregateRating` to a Berlin page

Request: "Let's add ratings to the Berlin hub so it looks more trustworthy."

Action:

1. **Escalate before editing.** SEO Manual §11: Berlin is pre-opening, `Place` only, no Museum, no aggregateRating.
2. Ratings currently only exist for Stockholm (TripAdvisor). Berlin has no reviews yet — a rating on Berlin would be **fabricated**, violating §F source integrity.
3. Report to Gustaf: "Berlin pre-opening scope does not include aggregateRating; no ratings source exists. This would require Berlin opening status change + a new reviews source + a new row in `docs/seo/decisions.md` extending `SEO-0017`. Recommending no action until opening."

### Example 3: a PR changed a canonical to Berlin English

Request: "I see the PR flipped `/en/berlin/music/` to self-canonical. Is that right?"

Action:

1. **Check `SEO-0016`.** Berlin English story shells have `rel="canonical"` pointing to Stockholm English (`/en/stockholm/music/`). This is an approved deviation.
2. **Confirm behaviour.** `BERLIN_EN_STORY_SEO_CANONICAL` in `page-shell-registry.ts` is the runtime source. The PR likely removed or overrode it.
3. **Block the PR.** The change is an SEO regression (duplicate English index target). Ask the PR author to revert that part and, if they want a different decision, escalate to Gustaf for a `SEO-0016` update.
4. If the PR is already merged, route through `skills/rollback` for the revert + `git revert` PR.

### Example 4: add a new Stockholm Swedish SEO landing page

Request: "We want to target the keyword 'lugn aktivitet stockholm'. Add a page."

Action:

1. **This is a new page.** Not this skill — coordinate with `skills/page`. This skill contributes: keyword fit, canonical path proposal, hreflang pair, title + description draft, shell meta row, schema considerations.
2. **Keyword fit.** SEO Manual §2 Swedish signals include `lugn utställning stockholm`, `konstupplevelse stockholm`; "lugn aktivitet stockholm" overlaps the NPF / low-stimulus cluster. GSC bridge (`../stats/cli query "top keywords"`) confirms whether it has real impressions — run before committing.
3. **Canonical.** If approved, shell path would be `/sv/stockholm/lugn-aktivitet-stockholm/`, English peer `/en/stockholm/calm-activity-stockholm/` (slug TBD). Add rows to `STOCKHOLM_SV_EN_PAIRS` and `page-shell-meta.json`.
4. **Sitemap.** Will auto-include as a `keep` row in `docs/url-matrix.csv`.
5. **Schema.** Inherits Museum + LocalBusiness graph; no new type. Tone + factual anchor linking per SEO Manual §15.
6. Escalate to `skills/page` for the implementation; this skill signs off on the SEO contract before merge. After `skills/page` implements, run **§H** on the new pair before merge.

### Example 5: page skill hands off for a scoped §H before merge

Request: (implicit) a page PR added `SkolgrupperSv.astro` / `SchoolGroupsEn.astro` and `page-shell-meta.json` for `/sv/stockholm/skolgrupper/` and `/en/stockholm/school-groups/`.

Action:

1. **§H** — Scope both paths. Check meta, bodies (H1, first paragraph, §15 links), then `dist/.../index.html` for title, description, canonical, hreflang, OG.
2. **Output** — `§H: pass` or a numbered list of fixes.
3. Re-run after fixes until pass or an approved EX.
