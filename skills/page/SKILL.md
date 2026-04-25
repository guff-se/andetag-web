---
name: page
description: Use when adding, editing, renaming, or removing a content page on the ANDETAG Astro site (site/). Triggers include "add a new Stockholm page", "create a German Berlin page", a **new event that needs its own page** (often reached via `skills/events/SKILL.md` first), "rename /en/stockholm/faq/", "change the copy on the opening-hours page", "delete the art yoga page", and any task that touches site/src/pages/, page-bodies, page-shell-registry, or page-body-registry. User-attached images and proactive page illustration route through `skills/images/SKILL.md`. **Testing** includes a **content SEO pass** per `skills/seo/SKILL.md` **§H** (page-pair review) before merge.
---

## Purpose

This skill teaches an agent how to add, edit, rename, or remove a canonical content page on the ANDETAG Astro site so that routing, hreflang pairs, navigation, page-shell meta (title + description), page body component, and the content itself all stay consistent.

It is **not** for:

- FAQ entry changes (see `skills/faq/SKILL.md`).
- **Event semantics** as such — offer rows, JSON-LD, Understory links, home blocks (see `skills/events/SKILL.md`). **Exception:** this skill **does** own **new canonical URLs and shells** for an event that should have its own page; the events skill often **hands off here first** (§B), then takes back offer/schema/copy wiring.
- Operational facts like opening hours or ticket prices (see `skills/operational-facts/SKILL.md`).
- **Choosing and cataloguing photographs** — ingest, alt text, and responsive wiring (see `skills/images/SKILL.md`). The page skill **coordinates** with that skill (see **§Coordination** below) but does not invent image assets.
- Testimonial or review updates (see `skills/testimonials/SKILL.md`).
- Redirect-only work with no page body change (edit `site/public/_redirects` directly, following `docs/seo/url-architecture.md`).

If the request is a content tweak inside an existing page body (`*Sv.astro` / `*En.astro` / `*De.astro`) and nothing else, skip most of the Workflow and apply only §A and §Verification — still apply **§Coordination** for imagery if the edit materially changes length or sectioning.

## When to use

- The user wants a **new canonical page** at a URL that does not exist yet.
- The workflow from **`skills/events/SKILL.md`** needs **Step 1: page pair and shells** — a recurring or one-off event that should live at its own `sv`/`en` paths. Run this skill’s **§B** (and minimal bodies), then continue in the events skill for data and booking wiring.
- The user wants to **edit copy, sections, or structure** inside an existing page body.
- The user wants to **rename** a page's canonical slug (this is a move, not just an edit).
- The user wants to **remove** a page.

Do **not** use this skill if the request only changes the header, footer, or a shared component that is not tied to a specific page.

## Coordination: events skill and images skill

### Events skill (handoff)

If the user’s goal is an **event with a dedicated page**, **`skills/events/SKILL.md`** may trigger this skill explicitly: create the `sv`/`en` pair, registries, `pageBodies`, meta, and **minimal** `*Sv.astro` / `*En.astro` per **§B**. Event-specific offer objects, `schema-org.ts` emitters, booking CTAs, and filled marketing copy are **out of scope here**; they follow the events skill after routes exist. Model event-style bodies on `ArtYogaSv.astro` / `ArtYogaEn.astro` when useful.

### Images skill (attachments and balance)

- **User-attached images** (for this new page or page edit): do **not** only drop files into `public/`. Run **`skills/images/SKILL.md`**, especially **§E** (ingest: `assets/images/`, new canonical `file`, trilingual `alt`, `photos.yaml` row) and then wire per that skill (`ResponsiveInlinePicture`, `HeroSection`, `GallerySection`, derivatives). Attachments are part of the same PR as the page work unless the user says otherwise.
- **Photo / text ratio (proactive):** When you **add a new page** or **add substantial new copy** to an existing page, **estimate** whether the result matches the project’s visual density for that page *type* (compare to a **peer**: e.g. experiential / event-style pages with a hero + one or more figures vs. a thin factual page with none). If the page is **over-weight text** for its type and nothing in the brief forbids photography, use **`skills/images/SKILL.md` on your own initiative** to select and wire additional images from `assets/images/photos.yaml` (or ingest new files if the user provided them). **Skip** proactive adds when the user explicitly asked for a text-only or intentionally minimal layout, or when the page type is text-dominant (e.g. hours-only anchor) with no visual gap vs. peers.

### SEO skill (content feedback as part of testing)

Before calling a page change **merge-ready**, run **`skills/seo/SKILL.md` §H** (page-pair content review) on the **affected canonical path(s)**. That pass reviews shell meta, on-page copy signals (headings, first paragraph, internal links, keyword fit, tone), and the matching **`dist/**`** HTML for title/description/canonical/hreflang/OG for those locales. Treat **§H** output as part of **§Verification** — fix issues or document an intentional exception (and **EX-NNNN** if the SEO skill says one is required) before merge. Full-site SEO sweeps and Rich Results live checks remain the SEO skill’s own verification matrix; **§H** is scoped to the page work at hand.

## Files touched

Read before editing. Write paths are marked `write`.

| Area | File | Notes |
|------|------|-------|
| Shell title + description (write) | `site/src/data/page-shell-meta.json` | For **new** pages, add `pages` entries for both locales with `title`, `description`, and `sourceFile: "curated"`. `PAGE_SHELL_PATHS` is `Object.keys(metaPages).sort()` — a path missing from this JSON is not a shell route. This file is the only shell-meta source; there is no separate markdown catalog or batch extractor. |
| Shell registry (`write`) | `site/src/lib/routes/page-shell-registry.ts` | Append the new hreflang pair to `STOCKHOLM_SV_EN_PAIRS` (Stockholm sv+en) or `BERLIN_DE_EN_STORY_PAIRS` (Berlin de+en story). For Berlin English story pages that should canonicalise to the Stockholm English equivalent, add a row to `BERLIN_EN_STORY_SEO_CANONICAL`. |
| Body registry (`write`) | `site/src/lib/page-registry/page-body-registry.ts` | Add both new paths to the `PAGE_CUSTOM_BODY_PATHS` set. Paths in this set must have a matching entry in the `pageBodies` map in `[...slug].astro`. |
| File-based route (`write`) | `site/src/pages/[...slug].astro` | Import the new body component(s) and add entries to the `pageBodies` map. Keys must match `PAGE_CUSTOM_BODY_PATHS` exactly. |
| Page body components (`write`, new) | `site/src/components/page-bodies/<Name>Sv.astro`, `<Name>En.astro`, `<Name>De.astro` | Naming convention: locale suffix last. Shared-locale bodies use no suffix. Import section components from `site/src/components/content/`, UI from `ui/`, embeds from `embeds/`. |
| Chrome navigation (`write`) | `site/src/lib/chrome/navigation.ts` | Edit `NAVIGATION_VARIANTS` for the locale(s) that should list the page. Ids include `sv-main`, `en-main`, `en-main-berlin`, `de-main`. |
| Cross-location nav (`write`, if global) | `site/src/lib/routes/chrome-navigation-resolve.ts` | Only if the page exists across multiple destinations (e.g. a topic shared by Stockholm + Berlin). Add a `TopicSlots` row to `GLOBAL_TRILINGUAL_TOPICS` so `resolveChromeNavigationHref()` can find peers. |
| Redirects (`write`, renames only) | `site/public/_redirects` | When renaming, add a single-hop 301 from the old path to the new path. Follow existing formatting. Keep chains single-hop. |
| URL matrix (`write`, renames or adds) | `docs/url-matrix.csv` | Reference table. Add a row for the new canonical or a redirect row for the old path. |
| Content helpers (`write`, as needed) | `site/src/lib/content/*.ts` | Shared content like offer data (`stockholm-offers.ts`), gallery tiles (`stockholm-marketing-gallery.ts`), responsive image constants (`stockholm-body-responsive-images.ts`). Prefer re-use over duplication. |

**Sitemap:** auto-generated by `@astrojs/sitemap` (configured in `site/astro.config.mjs`). No manual sitemap edits needed. The config filters out `/404`, root `/`, and the `/en/` redirect entry.

## Locale parity rules

**Non-negotiable** per `AGENTS.md` §Coherence checklist and `docs/seo/url-architecture.md` §3:

- **Stockholm:** every canonical page exists in **Swedish + English**. Add both in the same PR. Declare the pair in `STOCKHOLM_SV_EN_PAIRS`.
- **Berlin:** every story-style canonical page exists in **German + English**. Declare the pair in `BERLIN_DE_EN_STORY_PAIRS`.
- **No cross-location parity.** Stockholm pages do not need a Berlin version, and vice versa.
- **Berlin English story pages** point `<link rel="canonical">` at the Stockholm English equivalent via `BERLIN_EN_STORY_SEO_CANONICAL` — do not omit this when adding a Berlin English story page.
- **Hreflang** is computed automatically in `resolveSeo()` from the pair tables plus the path-language mapping. Do not hand-write hreflang tags.
- **Swedish slugs** are Swedish words (e.g. `biljetter`, `oppettider`, `hitta-hit`). **English slugs** are English words (e.g. `tickets`, `opening-hours`, `how-to-find-us`). Pair table rows reflect the slug difference per language.

If the user asks for a single-locale change, confirm explicitly before skipping parity. Silent one-locale edits cause hreflang drift and are forbidden.

## Workflow

### A. Edit existing page (copy or sections only)

1. Identify the body component(s) for the canonical path. Start at `site/src/pages/[...slug].astro` → `pageBodies` map. For Stockholm, edit **both** `*Sv.astro` and `*En.astro` files unless the user asked for a single locale.
2. Apply the change. Keep tone consistent with `docs/Tone of Voice.md`. Copy follows `docs/Andetag SEO Manual.md` constraints (no fabricated URLs, metadata, or prices).
3. If the edit touches shared data (offers, FAQ, reviews), change the single source listed in `docs/content-model.md`, not the consuming pages.
4. If the edit **substantially lengthens** the page or **adds sections** in a type that usually carries imagery, re-check **photo / text balance** (see **Coordination**) and, if needed, add figures or a hero via `skills/images/SKILL.md` in the same task.
5. Verification: §Verification.

### B. Add a new page pair

Example: new Stockholm page `/sv/stockholm/new-page/` + `/en/stockholm/new-page/`.

1. **Shell title and description** — Add matching objects under `pages` in `site/src/data/page-shell-meta.json` (with `sourceFile: "curated"`) for each `sv` and `en` path. **Do not fabricate** a title or description that does not reflect the page’s real content; follow `skills/seo/SKILL.md` and `docs/Andetag SEO Manual.md`.
2. **Hreflang pair** — in `site/src/lib/routes/page-shell-registry.ts`, append `["/sv/stockholm/new-page/", "/en/stockholm/new-page/"]` to `STOCKHOLM_SV_EN_PAIRS` (Berlin de+en story goes to `BERLIN_DE_EN_STORY_PAIRS`; add a `BERLIN_EN_STORY_SEO_CANONICAL` row if Berlin English).
3. **Body registry** — add both paths to `PAGE_CUSTOM_BODY_PATHS` in `site/src/lib/page-registry/page-body-registry.ts`.
4. **Body components** — create `site/src/components/page-bodies/NewPageSv.astro` and `NewPageEn.astro`. Structure them after an existing sibling of similar shape (e.g. `OppettiderSv.astro` + `OppettiderEn.astro` for factual anchors, `ArtYogaSv.astro` + `ArtYogaEn.astro` for event-style pages). Reuse section components from `content/` and UI helpers from `ui/`.
5. **Route wiring** — in `site/src/pages/[...slug].astro`, add imports for both components and add entries to the `pageBodies` map keyed by canonical path. Keys must exactly match `PAGE_CUSTOM_BODY_PATHS`.
6. **Navigation** — in `site/src/lib/chrome/navigation.ts`, add nav entries under the right variant ids (`sv-main` + `en-main` for Stockholm; `en-main-berlin` + `de-main` for Berlin). Use keyword-aligned anchor text (≤5 words) per `docs/Andetag SEO Manual.md` §15. For cross-location topics, also update `GLOBAL_TRILINGUAL_TOPICS` in `site/src/lib/routes/chrome-navigation-resolve.ts`.
7. **Images** — follow **`skills/images/SKILL.md`** (catalog, ingest, derivatives, and components — not ad-hoc `<img>`). User-attached files: §E of that skill. Fulfil **photo / text balance** (see **Coordination**): if the new body is still text-heavy vs. a peer of the same kind, add figures or a hero from the catalog before calling the page done. Technical recipe remains `docs/responsive-image-workflow.md` for derivatives; do **not** hotlink or invent placeholders (`AGENTS.md`, Source integrity).
8. Verification: §Verification.

### C. Rename a page

1. **Add a 301** in `site/public/_redirects` from the old canonical path to the new one. Keep redirects single-hop (no chains).
2. **Update the pair table** (`STOCKHOLM_SV_EN_PAIRS` or `BERLIN_DE_EN_STORY_PAIRS`) to use the new path.
3. **Shell meta** — move or duplicate `title` / `description` in `page-shell-meta.json` from the old keys to the new keys. Remove the old path’s `pages` entry.
4. Update `PAGE_CUSTOM_BODY_PATHS` (swap old → new).
5. Update `[...slug].astro` (swap the `pageBodies` map key).
6. Rename the body component file(s) if the component name should track the new slug (not strictly required, but keeps the codebase scannable).
7. Update `navigation.ts` to point nav items at the new path.
8. Update `docs/url-matrix.csv` with the rename row.
9. Verification: §Verification.

### D. Remove a page

1. Decide the landing experience for existing inbound links. Usually a 301 to the closest sibling or the location hub. Add the 301 to `site/public/_redirects`.
2. Remove the pair row from `STOCKHOLM_SV_EN_PAIRS` or `BERLIN_DE_EN_STORY_PAIRS` (remove both locales in the same PR).
3. Remove the path(s) from `page-shell-meta.json`.
4. Remove the path(s) from `PAGE_CUSTOM_BODY_PATHS`.
5. Remove the `pageBodies` imports and map entries in `[...slug].astro`.
6. Delete the body component file(s) under `site/src/components/page-bodies/`.
7. Remove nav entries in `navigation.ts`. If the page was a cross-location topic, remove its row from `GLOBAL_TRILINGUAL_TOPICS`.
8. Update `docs/url-matrix.csv`.
9. Verification: §Verification.

## Verification

Run from `site/` before requesting merge.

```bash
npm test          # Vitest suite; catches registry mismatches, navigation drift, path constants
npm run build     # Static build; fails if PAGE_SHELL_PATHS has a path without a body, etc.
```

Pass means:

- `npm test` exits 0 with all files passing.
- `npm run build` exits 0 and lists the expected page count (previously 65 for Stockholm + Berlin + privacy; recalculate if you added or removed pages).
- For new or renamed pages, confirm the new path appears under `site/dist/<path>/index.html` after build, and the old path either no longer exists (renames handled by the 301) or is absent (removals).
- **SEO content feedback** — Apply **`skills/seo/SKILL.md` §H** to every canonical path this task added or meaningfully changed (both locales of a pair when Stockholm/Berlin rules apply). Record the outcome in the PR: either **"§H pass"** or a short list of fixes applied / exceptions cited. Do not skip **§H** for substantial copy, meta, nav, or structure edits; a typo-only fix may not need a deep pass (use judgment).

Optional:

- If images changed, follow the performance recipe in `skills/performance-check/SKILL.md` (runs `npm run lighthouse:all` or a targeted `LIGHTHOUSE_PATHS` subset).
- Beyond **§H**, spot-check the built shell meta if needed: `site/dist/<path>/index.html` for `<title>`, `<meta name="description">`, `<link rel="canonical">`, and hreflang alternates.

## When to escalate

Stop and ask the user (or Gustaf) before proceeding if:

- The request implies a **single-locale** Stockholm or Berlin page change, breaking the parity rule, and the user has not explicitly asked to ship only one locale.
- Shell `title` / `description` are still unset or ambiguous; ask the user (or Gustaf) before inventing copy.
- The rename would create a redirect chain (the old path already redirects somewhere). Resolve by flattening to single-hop.
- The new page needs a new page-body **shell variant** (header or footer beyond the existing `HeaderVariantId` / `FooterVariantId` set in `site/src/lib/chrome/types.ts`). Shell variant work is out of scope for content-level skills.
- The change touches routing for `/` or `/en/` (entry routing). These live in `site/workers/entry-routing-logic.ts`; edits belong to a routing-layer task, not a page task.
- A decision row (`SEO-NNNN` in `docs/seo/decisions.md`) covers the affected path. Re-read the row before editing.

## Examples

### Example 1: edit copy on the Stockholm opening-hours page

The user says: *"Change the note on the Stockholm opening-hours page so it says the museum is closed on 2026-06-06 (Swedish National Day). Add the same note in English."*

Action: open `site/src/components/page-bodies/OppettiderSv.astro` and `OppettiderEn.astro`, add the closure note in the appropriate section of each. Run `npm test && npm run build`. Run `skills/seo/SKILL.md` **§H** on the opening-hours paths; note `§H pass` or fixes in the PR. Report both files edited.

### Example 2: add a new Stockholm Swedish + English page

The user says: *"Add a page about school group visits at `/sv/stockholm/skolgrupper/` and `/en/stockholm/school-groups/`. Short page, FAQ-style, two photos from the hall."*

Action:

1. Add shell rows in `page-shell-meta.json` for `/sv/stockholm/skolgrupper/` and `/en/stockholm/school-groups/` (with `sourceFile: "curated"`).
2. Append `["/sv/stockholm/skolgrupper/", "/en/stockholm/school-groups/"]` to `STOCKHOLM_SV_EN_PAIRS`.
3. Add both paths to `PAGE_CUSTOM_BODY_PATHS`.
4. Create `SkolgrupperSv.astro` and `SchoolGroupsEn.astro` under `page-bodies/`, modelled on an existing factual-anchor sibling.
5. Wire imports + `pageBodies` entries in `[...slug].astro`.
6. Add nav entries in `navigation.ts` under `sv-main` and `en-main`.
7. For the two photos, follow `skills/images/SKILL.md` and `docs/responsive-image-workflow.md` (pick from `photos.yaml` or ingest if supplied); if the first draft is still text-heavy vs. a similar experience page, add another inline or hero per **Coordination** before finishing.
8. `npm test && npm run build` from `site/`. `skills/seo/SKILL.md` **§H** for both new paths. Report all files and `§H` outcome in the PR body.

### Example 3: new event page (handoff from the events skill)

The user (via the events flow) needs `/sv/stockholm/<sv-slug>/` and `/en/stockholm/<en-slug>/` for a one-off or recurring program, with shells and minimal bodies before event data and schema.

Action: run **§B** in this skill to create the pair, meta, registries, `pageBodies`, nav, and thin `*Sv.astro` / `*En.astro` (mirror `ArtYoga*.astro` if helpful). If the user attached hero photos, run **`skills/images/SKILL.md` §E** and wire. `npm test && npm run build`, then **`skills/seo/SKILL.md` §H** on the new paths. Return to **`skills/events/SKILL.md`** for `stockholm-offers.ts` (or equivalent), `schema-org.ts` occurrence emitters, and event copy; re-**§H** after event copy if it materially changes the page bodies or meta.
