---
name: page
description: Use when adding, editing, renaming, or removing a content page on the ANDETAG Astro site (site/). Triggers include "add a new Stockholm page", "create a German Berlin page", a **new event that needs its own page** (often reached via `skills/events/SKILL.md` first), **"add a landing page"** or any request whose primary purpose is to rank for a query rather than introduce new content (see **§Page classification**), "rename /en/stockholm/faq/", "change the copy on the opening-hours page", "delete the art yoga page", and any task that touches site/src/pages/, page-bodies, page-shell-registry, or page-body-registry. User-attached images and proactive page illustration route through `skills/images/SKILL.md`. **Testing** includes a **content SEO pass** per `skills/seo/SKILL.md` **§H** (page-pair review) before merge.
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
- The user wants a **new SEO landing page** — a thin clone of the home page tuned for one query family (see **§Page classification** below). Run **§E**, not **§B**.
- The workflow from **`skills/events/SKILL.md`** needs **Step 1: page pair and shells** — a recurring or one-off event that should live at its own `sv`/`en` paths. Run this skill’s **§B** (and minimal bodies), then continue in the events skill for data and booking wiring.
- The user wants to **edit copy, sections, or structure** inside an existing page body.
- The user wants to **rename** a page's canonical slug (this is a move, not just an edit).
- The user wants to **remove** a page.

Do **not** use this skill if the request only changes the header, footer, or a shared component that is not tied to a specific page.

## Page classification: standard vs SEO landing

Two structural classes of canonical page exist on this site. **Decide which class the request is** before running a workflow — they touch different files and have different parity, navigation, and verification rules.

### Standard page (default)

A page that introduces unique content: factual anchors (`oppettider`, `hitta-hit`), story pages (`om-andetag`, `optisk-fibertextil`), event pages (`art-yoga`), audience pages with substantive copy of their own (`foretagsevent`, `npf-stockholm`, `vilken-typ-av-upplevelse`). Its body is bespoke; it lives in the **main navigation**; it warrants its own imagery and copy decisions. **Default to this class.** Use **§A**–**§D**.

### SEO landing page

A thin clone of the Stockholm home page that exists **only to rank for a query family**. The body delegates to the shared `StockholmSeoLandingSv` / `StockholmSeoLandingEn` component and overrides only:

- `h1Text` (or `h1Html`)
- `introMarkdown` (the lead paragraph beside the booking aside)
- `galleryId` (unique per page, for lightbox grouping)

Everything else (FAQ, gallery, tickets columns, testimonials, video, map, CTAs) is inherited unchanged. Landings are **not in the main menu**; they appear in the **footer `seoLinks` strip** in `footer-sv.ts` and `footer-en-stockholm.ts`. Hreflang parity rules still apply (sv + en pair, both shipped together). Use **§E**, not **§B**.

To see the current set of landings, read the `seoLinks` arrays in `site/src/lib/chrome/footer-sv.ts` and `site/src/lib/chrome/footer-en-stockholm.ts` — those are the only surfaces that exclusively list SEO landing pages, so they are always up to date. Each entry's `href` is the canonical slug for that landing.

### How to classify a new request

Run this in order; first match wins.

1. **Did the user say "landing page", "SEO landing", or describe the page as a clone / variant of the home page targeted at a search term?** → SEO landing (§E).
2. **Is the user's brief essentially "rank on the word X"?** Does it boil down to picking a slug, an H1 phrase, and a lead paragraph that re-uses the brand pitch with X swapped in? → SEO landing (§E). Examples: *Activity*, *Museum*, *Meditation* — they all promote brand keywords without adding new substance. (Read `footer-sv.ts` `seoLinks` for the current full list.)
3. **Does the request require unique sections, distinct facts, audience-specific guidance, or a different page shape than the home page?** → Standard page (§B). Examples: *Corporate events* needs booking flows, group sizes, and B2B copy. *Neurodiversity / NPF* needs sensory guidance, accessibility specifics, and bespoke imagery. Both are SEO-motivated, but neither fits the shared-body template.
4. **When unclear, ask Gustaf.** Do not silently choose the heavier path — a standard page that should have been a landing is wasted effort, and a landing that should have been standard ships thin content.

A request can also start as a landing and become a standard page later if substantive content is added; that is a class **upgrade** (rewrite the body to bespoke sections, move the link from `seoLinks` to the main nav). Treat it as a separate task and confirm with the user.

## Coordination: events skill and images skill

### Events skill (handoff)

If the user’s goal is an **event with a dedicated page**, **`skills/events/SKILL.md`** may trigger this skill explicitly: create the `sv`/`en` pair, registries, `pageBodies`, meta, and **minimal** `*Sv.astro` / `*En.astro` per **§B**. Event-specific offer objects, `schema-org.ts` emitters, booking CTAs, and filled marketing copy are **out of scope here**; they follow the events skill after routes exist. Model event-style bodies on `ArtYogaSv.astro` / `ArtYogaEn.astro` when useful.

### Images skill (attachments and balance)

- **User-attached images** (for this new page or page edit): do **not** only drop files into `public/`. Run **`skills/images/SKILL.md`**, especially **§E** (ingest: `assets/images/`, new canonical `file`, trilingual `alt`, `photos.yaml` row) and then wire per that skill (`MediaCopySection` for image-beside-copy figures, `HeroSection`, `GallerySection`, derivatives — bare `ResponsiveInlinePicture` only for the rare inset variant). Attachments are part of the same PR as the page work unless the user says otherwise.
- **Photo / text ratio (proactive):** When you **add a new page** or **add substantial new copy** to an existing page, **estimate** whether the result matches the project’s visual density for that page *type* (compare to a **peer**: e.g. experiential / event-style pages with a hero + one or more figures vs. a thin factual page with none). If the page is **over-weight text** for its type and nothing in the brief forbids photography, use **`skills/images/SKILL.md` on your own initiative** to select and wire additional images from `assets/images/photos.yaml` (or ingest new files if the user provided them). **Skip** proactive adds when the user explicitly asked for a text-only or intentionally minimal layout, or when the page type is text-dominant (e.g. hours-only anchor) with no visual gap vs. peers.

### SEO skill (content feedback as part of testing)

Before calling a page change **merge-ready**, run **`skills/seo/SKILL.md` §H** (page-pair content review) on the **affected canonical path(s)**. That pass reviews shell meta, on-page copy signals (headings, first paragraph, internal links, keyword fit, tone), and the matching **`dist/**`** HTML for title/description/canonical/hreflang/OG for those locales. Treat **§H** output as part of **§Verification** — fix issues or document an intentional exception (and **EX-NNNN** if the SEO skill says one is required) before merge. Full-site SEO sweeps and Rich Results live checks remain the SEO skill’s own verification matrix; **§H** is scoped to the page work at hand.

## Visual rhythm: balancing full-bleed bands and regular content

Full-bleed bands are high-contrast, visually dominant sections that expand to the full viewport width. The following components create bands:

| Component / element | Width | Background |
|---|---|---|
| `HeroSection` (`is-cover`) | full-bleed | photo + overlay |
| `HeroSection` (`is-solid`) | full-bleed | aubergine `--component-surface` |
| `TestimonialCarousel` | full-bleed | photo + light overlay |
| `.page-*__video-band` | full-bleed | aubergine |
| `.page-*__cta-secondary-band` | full-bleed | lavender |
| `GallerySection` | full-bleed | transparent (images) |

`ContentSection`, `InfoFrame`, `AccordionSection`, `MediaCopySection`, `ArtworkSalesSlider`, and similar sit on the page's light background and are **not** bands.

### The stacking rule

**Never place two full-bleed bands consecutively without at least one regular content section between them.** A run of bands creates visual fatigue and makes each band less impactful. This rule applies across the entire page, including sections above and below the one you are adding or editing.

### Before adding any band to an existing page

1. Read the full page body. List every existing band above and below your insertion point.
2. If adding the new band would create two consecutive bands, use a regular section (`ContentSection`, a custom component, or a copy-and-CTA block) instead.
3. If the surrounding page already has two consecutive bands you did not introduce, flag it — but do not silently leave it worse.

### Choosing the right component

| Situation | Use |
|---|---|
| Promotional or story content with a suitable catalog photo | `HeroSection is-cover` (run `skills/images/SKILL.md` to find the photo first) |
| Same, but no suitable photo exists | `HeroSection is-solid` (fallback only — check the catalog before defaulting here) |
| Promotional content that shows artwork/product items | `ContentSection` heading + a display component (e.g. `ArtworkSalesSlider`); no dark band needed |
| Text-only promotional or factual copy | `ContentSection` alone |
| Band already adjacent to this position | Any of the above **except** a band; favor a regular section regardless of content type |

### Reference rhythm: Stockholm home

The Stockholm home page demonstrates correct alternation. Reading top to bottom:

1. H1 + intro copy — *regular*
2. Gallery — *full-bleed*
3. Tickets + pricing — *regular*
4. `HeroSection is-cover` (booking CTA) — *full-bleed*
5. Art Yoga section — *regular*
6. `TestimonialCarousel` — *full-bleed*
7. `ContentSection` + `ArtworkSalesSlider` (collect) — *regular*
8. Video band — *full-bleed*
9. Partners + contact + press — *regular*
10. CTA secondary band — *full-bleed*
11. Map — *regular*

No two bands appear in a row. Use this as the reference when building or auditing any Stockholm page.

### Text elements within existing bands

When adding a label or heading inside an existing dark band (e.g. the video band), use the established `component-eyebrow` class on a semantic heading element (`<h2>`, not `<p>`). Put only positioning and size in a page-specific class — font family, color, text-transform, and letter-spacing are already encoded in `component-eyebrow` and must not be duplicated.

## Files touched

Read before editing. Write paths are marked `write`.

| Area | File | Notes |
|------|------|-------|
| Shell title + description (write) | `site/src/data/page-shell-meta.json` | For **new** pages, add `pages` entries for both locales with `title`, `description`, and `sourceFile: "curated"`. `PAGE_SHELL_PATHS` is `Object.keys(metaPages).sort()` — a path missing from this JSON is not a shell route. This file is the only shell-meta source; there is no separate markdown catalog or batch extractor. |
| Shell registry (`write`) | `site/src/lib/routes/page-shell-registry.ts` | Append the new hreflang pair to `STOCKHOLM_SV_EN_PAIRS` (Stockholm sv+en) or `BERLIN_DE_EN_STORY_PAIRS` (Berlin de+en story). For Berlin English story pages that should canonicalise to the Stockholm English equivalent, add a row to `BERLIN_EN_STORY_SEO_CANONICAL`. |
| Body registry (`write`) | `site/src/lib/page-registry/page-body-registry.ts` | Add both new paths to the `PAGE_CUSTOM_BODY_PATHS` set. Paths in this set must have a matching entry in the `pageBodies` map in `[...slug].astro`. |
| File-based route (`write`) | `site/src/pages/[...slug].astro` | Import the new body component(s) and add entries to the `pageBodies` map. Keys must match `PAGE_CUSTOM_BODY_PATHS` exactly. |
| Page body components (`write`, new) | `site/src/components/page-bodies/<Name>Sv.astro`, `<Name>En.astro`, `<Name>De.astro` | Naming convention: locale suffix last. Shared-locale bodies use no suffix. Import section components from `site/src/components/content/` (`ContentSection`, `MediaCopySection` for any image-beside-copy figure, `HeroSection`, `GallerySection`, `InfoFrame`, `AccordionSection`, `ButtonGroup`), UI from `ui/`, embeds from `embeds/`. **Never** wrap a `ContentSection` / `InfoFrame` / `AccordionSection` in an ad-hoc grid `<div>` to add a side image — use `<MediaCopySection>` (see `skills/images/SKILL.md` §L2). |
| Chrome navigation (`write`) | `site/src/lib/chrome/navigation.ts` | Edit `NAVIGATION_VARIANTS` for the locale(s) that should list the page. Ids include `sv-main`, `en-main`, `en-main-berlin`, `de-main`. **SEO landing pages do not go here** — they belong in the footer `seoLinks` strip below. |
| Footer SEO links (`write`, landings only) | `site/src/lib/chrome/footer-sv.ts`, `site/src/lib/chrome/footer-en-stockholm.ts` | The `seoLinks` array is the **only** surface that lists SEO landing pages (footer strip, separate from the main navigation). Add an entry for each new landing in the matching locale. Update `site/src/lib/chrome/footer-en-stockholm.test.ts` if the order/contents are asserted. |
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

1. Identify the body component(s) for the canonical path. Start at `site/src/pages/[...slug].astro` → `pageBodies` map. For Stockholm, edit **both** `*Sv.astro` and `*En.astro` files unless the user asked for a single locale. **For SEO landings** the body is a thin delegator (it imports `StockholmSeoLandingSv` / `…En`); edits to `h1Text` / `h1Html` and `introMarkdown` go in that delegator. Do **not** edit `StockholmSeoLandingSv.astro` / `StockholmSeoLandingEn.astro` directly to change copy for one landing — those files are shared by every landing and changes propagate to all of them.
2. Apply the change. Keep tone consistent with `docs/Tone of Voice.md`. Copy follows `docs/Andetag SEO Manual.md` constraints (no fabricated URLs, metadata, or prices).
3. If the edit touches shared data (offers, FAQ, reviews), change the single source listed in `docs/content-model.md`, not the consuming pages.
4. If the edit **adds a new section** of any kind, apply the **band-balance check** (see **§Visual rhythm**): read the surrounding bands before and after the insertion point; if the new section is a band and the neighbouring section is also a band, use a regular content component instead.
5. If the edit **substantially lengthens** the page or **adds sections** in a type that usually carries imagery, re-check **photo / text balance** (see **Coordination**) and, if needed, add figures or a hero via `skills/images/SKILL.md` in the same task.
5. Verification: §Verification.

### B. Add a new page pair

Example: new Stockholm page `/sv/stockholm/new-page/` + `/en/stockholm/new-page/`.

1. **Shell title and description** — Add matching objects under `pages` in `site/src/data/page-shell-meta.json` (with `sourceFile: "curated"`) for each `sv` and `en` path. **Do not fabricate** a title or description that does not reflect the page’s real content; follow `skills/seo/SKILL.md` and `docs/Andetag SEO Manual.md`.
2. **Hreflang pair** — in `site/src/lib/routes/page-shell-registry.ts`, append `["/sv/stockholm/new-page/", "/en/stockholm/new-page/"]` to `STOCKHOLM_SV_EN_PAIRS` (Berlin de+en story goes to `BERLIN_DE_EN_STORY_PAIRS`; add a `BERLIN_EN_STORY_SEO_CANONICAL` row if Berlin English).
3. **Body registry** — add both paths to `PAGE_CUSTOM_BODY_PATHS` in `site/src/lib/page-registry/page-body-registry.ts`.
4. **Body components** — create `site/src/components/page-bodies/NewPageSv.astro` and `NewPageEn.astro`. Structure them after an existing sibling of similar shape (e.g. `OppettiderSv.astro` + `OppettiderEn.astro` for factual anchors, `ArtYogaSv.astro` + `ArtYogaEn.astro` for event-style pages). Reuse section components from `content/` and UI helpers from `ui/`.
5. **Route wiring** — in `site/src/pages/[...slug].astro`, add imports for both components and add entries to the `pageBodies` map keyed by canonical path. Keys must exactly match `PAGE_CUSTOM_BODY_PATHS`.
6. **Navigation** — in `site/src/lib/chrome/navigation.ts`, add nav entries under the right variant ids (`sv-main` + `en-main` for Stockholm; `en-main-berlin` + `de-main` for Berlin). Use keyword-aligned anchor text (≤5 words) per `docs/Andetag SEO Manual.md` §15. For cross-location topics, also update `GLOBAL_TRILINGUAL_TOPICS` in `site/src/lib/routes/chrome-navigation-resolve.ts`.
7. **Band balance** — apply the **§Visual rhythm** check across the full new body before declaring it done. List every full-bleed band in the page top-to-bottom and confirm no two are adjacent. If you added a `HeroSection` and it would sit next to another band, replace it with a regular content section (or move it to a position with regular content on both sides).
8. **Images** — follow **`skills/images/SKILL.md`** (catalog, ingest, derivatives, and components — not ad-hoc `<img>`). User-attached files: §E of that skill. Fulfil **photo / text balance** (see **Coordination**): if the new body is still text-heavy vs. a peer of the same kind, add figures or a hero from the catalog before calling the page done. Technical recipe remains `docs/responsive-image-workflow.md` for derivatives; do **not** hotlink or invent placeholders (`AGENTS.md`, Source integrity).
9. Verification: §Verification.

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
7. Remove nav entries in `navigation.ts`. **For SEO landings:** remove the entry from `seoLinks` in `footer-sv.ts` and `footer-en-stockholm.ts` (and update `footer-en-stockholm.test.ts`) instead. If the page was a cross-location topic, remove its row from `GLOBAL_TRILINGUAL_TOPICS`.
8. Update `docs/url-matrix.csv`.
9. Verification: §Verification.

### E. Add a new SEO landing page

Use this when **§Page classification** classified the request as an SEO landing. The page is a thin clone of the Stockholm home, surfaced only via the footer `seoLinks` strip. **Stockholm only** — there is no Berlin landing pattern; if the user asks for a Berlin landing, stop and confirm with Gustaf.

Before starting, confirm the new landing meets `docs/Andetag SEO Manual.md` **§17.2** (criteria for a new SEO landing — either §17.2a validated cluster or §17.2b greenfield positioning). If the slug is already in §17.3 (candidate landings under evaluation), reference that row in the PR. If neither path applies, escalate.

Example: a new "Stillness" landing at `/sv/stockholm/stillhet-stockholm/` + `/en/stockholm/stillness-stockholm/`.

1. **Slug pair.** Pick the Swedish lexical anchor as the slug stem and append `-stockholm`. The English slug is its translation, also with `-stockholm` (existing `museum-stockholm` and `event-stockholm` keep the same word in both locales — that is fine when the noun is identical). Pair table row goes into `STOCKHOLM_SV_EN_PAIRS` in `site/src/lib/routes/page-shell-registry.ts`.
2. **Shell meta.** Add `pages` entries for both paths in `site/src/data/page-shell-meta.json` with `sourceFile: "curated"`, a title in the `ANDETAG | <descriptor> | ANDETAG Stockholm` shape used by existing landings, and a description that names the entity, location, and core attribute (per `docs/Andetag SEO Manual.md` §17 and the one-sentence opener rule). Do not invent unique facts that the shared body does not actually carry.
3. **Body registry.** Add both paths to `PAGE_CUSTOM_BODY_PATHS` in `site/src/lib/page-registry/page-body-registry.ts`.
4. **Body components — thin delegators.** Create `site/src/components/page-bodies/Stockholm<Topic>Sv.astro` and `Stockholm<Topic>En.astro`. Each file is a few lines: import `StockholmSeoLandingSv` (or `…En`), define `introMarkdown` (the lead paragraphs beside the booking aside), and pass `galleryId`, `h1Text` (or `h1Html`), and `introMarkdown` as props. Model on `StockholmAktivitetInomhusSv.astro` / `StockholmIndoorActivityEn.astro`. **Do not** duplicate the FAQ, gallery, tickets, testimonials, video, or map blocks — they live in the shared body and must be inherited unchanged so the existing landings stay structurally identical.
5. **Route wiring.** In `site/src/pages/[...slug].astro`, import both new components and add entries to the `pageBodies` map keyed by the canonical paths. Keys must exactly match `PAGE_CUSTOM_BODY_PATHS`.
6. **Footer surface (not main nav).** Add an entry to the `seoLinks` array in `site/src/lib/chrome/footer-sv.ts` and `site/src/lib/chrome/footer-en-stockholm.ts`. Use a one- or two-word label aligned with the H1 keyword (read the existing `seoLinks` entries in `footer-sv.ts` for the label style). Do **not** edit `NAVIGATION_VARIANTS` in `site/src/lib/chrome/navigation.ts` — landings are deliberately absent from the main menu.
7. **Footer test.** If `site/src/lib/chrome/footer-en-stockholm.test.ts` (or an sv peer, if added later) asserts the `seoLinks` list, update the expected labels and hrefs to include the new landing. Run `npm test` and confirm the assertions pass.
8. **Internal linking.** Per `docs/Andetag SEO Manual.md` §15 / §17.2, the new landing must link back to ≥2 cluster pages and receive ≥2 inbound in-body links. Inbound links go in body copy on at least two existing pages (typically the Stockholm hub plus one topical sibling). Outbound links are usually already covered by the shared body (booking, biljetter, säsongskort, etc.) — verify by reading the rendered output, do not add bespoke link blocks to a landing.
9. **Imagery.** Skip the **photo / text balance** check for landings — the page reuses the home's gallery, intro figure, and testimonial backgrounds. Adding new imagery to the shared body changes every landing at once and is out of scope here.
10. **Verification.** §Verification, plus a **`skills/seo/SKILL.md` §H** pass on both new paths (the title / meta / H1 / first paragraph are the entire SEO surface for landings — get them right). Confirm the new entries render in the footer `seoLinks` strip on the live preview, and that the page is **absent** from the main navigation.

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
- **SEO content feedback** — Apply **`skills/seo/SKILL.md` §H** to every canonical path this task added or meaningfully changed (both locales of a pair when Stockholm/Berlin rules apply). Record the outcome in the PR: either **"§H pass"** or a short list of fixes applied / exceptions cited. **For any PR that adds or fully rewrites a body component (`*Sv.astro`, `*En.astro`, `*De.astro`), §H is a blocking pre-merge gate — not a post-preview optional.** Deferring §H to after the Cloudflare preview is only acceptable for shell-only changes (meta, registry, schema) where body copy is untouched. A typo-only fix may not need a full §H pass (use judgment); a body rewrite always does.
- **Em dash scan** — Before committing any body component change, run `grep -rn $'—' site/src/components/page-bodies/ site/src/lib/content/` (U+2014 em dash) and `grep -rn $'–' site/src/components/page-bodies/` (U+2013 en dash). Neither is permitted in editorial prose per `docs/Tone of Voice.md` §Punctuation. Exclude `stockholm-reviews.ts` (verbatim TripAdvisor quotes are exempt).

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
- **Landing classification ambiguity.** A request that could plausibly be either an SEO landing or a standard page (e.g. an audience or use-case page that the user has not framed as a search-target clone). Pick a class only after asking — silently choosing wrong wastes work or thins the page below the §17.2 bar.
- **Berlin landing requested.** No Berlin SEO landing pattern exists; the shared body is Stockholm-only. Confirm with Gustaf before inventing a Berlin variant.

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

### Example 3: add a new SEO landing page

The user says: *"Add a Stockholm landing page targeting `lugn aktivitet stockholm` and the English equivalent. Same structure as the existing landings."*

Action:

1. Classify per **§Page classification**: this is a search-target clone with no unique content — **SEO landing (§E)**, not a standard page.
2. Confirm `docs/Andetag SEO Manual.md` §17.2 fit (validated cluster vs greenfield). Note which path applies in the PR.
3. Pick the slug pair (e.g. `/sv/stockholm/lugn-aktivitet-stockholm/` + `/en/stockholm/calm-activity-stockholm/`) and append to `STOCKHOLM_SV_EN_PAIRS`.
4. Add shell meta entries (curated title + description) in `page-shell-meta.json` for both paths.
5. Add both paths to `PAGE_CUSTOM_BODY_PATHS`.
6. Create thin delegators `StockholmLugnAktivitetSv.astro` + `StockholmCalmActivityEn.astro` modelled on `StockholmAktivitetInomhusSv.astro` / `StockholmIndoorActivityEn.astro` — H1, lead `introMarkdown`, unique `galleryId`, nothing else.
7. Wire imports + `pageBodies` entries in `[...slug].astro`.
8. Add the link to `seoLinks` in `footer-sv.ts` and `footer-en-stockholm.ts` (label e.g. `Lugn aktivitet` / `Calm activity`). Update `footer-en-stockholm.test.ts` if the list is asserted. **Do not** touch `navigation.ts`.
9. Add ≥2 inbound in-body links from existing cluster pages (typically the Stockholm hub + one topical sibling) per §17.2 / §15.
10. `npm test && npm run build`. Run `skills/seo/SKILL.md` **§H** on both new paths and record the outcome in the PR. Confirm the new link appears in the footer `seoLinks` strip on the preview and **not** in the main menu.

### Example 4: new event page (handoff from the events skill)

The user (via the events flow) needs `/sv/stockholm/<sv-slug>/` and `/en/stockholm/<en-slug>/` for a one-off or recurring program, with shells and minimal bodies before event data and schema.

Action: run **§B** in this skill to create the pair, meta, registries, `pageBodies`, nav, and thin `*Sv.astro` / `*En.astro` (mirror `ArtYoga*.astro` if helpful). If the user attached hero photos, run **`skills/images/SKILL.md` §E** and wire. `npm test && npm run build`, then **`skills/seo/SKILL.md` §H** on the new paths. Return to **`skills/events/SKILL.md`** for `stockholm-offers.ts` (or equivalent), `schema-org.ts` occurrence emitters, and event copy; re-**§H** after event copy if it materially changes the page bodies or meta.
