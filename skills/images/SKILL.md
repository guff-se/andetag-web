---
name: images
description: Use when selecting and wiring photographs for a page on the ANDETAG Astro site (site/)—inline figure, hero cover, gallery tile, or testimonial background, refreshing an existing image, or ingesting a new upload (save under `assets/images/`, canonical filename + trilingual alt + `photos.yaml`, then `site/public` + derivatives + wire as needed). Also use for the artwork catalogue photo pipeline: calibrating and generating derivatives for artwork photos in `assets/artworks/` → `site/public/images/artworks/<id>/`, and adding or updating entries in `artworks.ts`. Triggers include "add a hero here", "add this new photo to the site", "images for the NPF page", "replace the intro figure", "add photos for andetag 40", "rescale the artwork images". Default components `ResponsiveInlinePicture`, `HeroSection`, `GallerySection`.
---

## Purpose

Help an agent **pick and wire** photographs that match a page's intent in one pass, using the **existing UI components** the site already uses (unless the user asks for a different pattern). The agent does **not** stop to ask "which of these do you want?" before wiring. Put candidate reasoning, `file` names, and slot decisions in the **PR / commit message**; the user reviews the built page in preview and approves at merge.

Markup, alt text, derivatives, and path constants stay consistent with peers. The **catalog** of photo metadata (alt in `sv + en + de`, tags) is `assets/images/photos.yaml`. **Archival originals** (source-of-truth before derivatives) live under `assets/images/<canonical-filename>.jpg` alongside the catalog. The **served** masters and their derivatives live under `site/public/wp-content/uploads/<year>/<month>/` (see `docs/responsive-image-workflow.md`). New uploads must land in **`assets/images/`** first, get a **new canonical `file` name** and full **`alt` block + `tags`**, then—when the site should show them—copy or sync the file to `site/public/…`, generate derivatives, and wire. Wiring constants live in `site/src/lib/content/stockholm-body-responsive-images.ts` (body figures, testimonial backgrounds, most hero covers) and `site/src/lib/chrome/assets.ts` (chrome-level hero assets). **Default wiring:** `<MediaCopySection>` for any inline image-beside-copy figure (it wraps `ResponsiveInlinePicture` and owns the grid + figure CSS), `HeroSection` for page heroes, `GallerySection` (plus `stockholm-marketing-gallery.ts` / gallery props) for gallery-style strips, bare `ResponsiveInlinePicture` only for the rare inset variant (§B step 7) — follow nearby bodies on the same page or route family.

This skill is **not** for:

- Re-cropping, re-toning, or editing the pixels of an existing photo (that is a content operation on the master file, outside the agent's scope).
- Deciding whether a new page should exist at all (see `skills/page/SKILL.md`).
- **Berlin-only** image requests with no catalog match and no file to ingest — escalate (see **When to escalate**).
- Icons, logos, or SVG assets (the responsive workflow explicitly excludes these).

## When to use

- A page needs a new photograph (hero cover, inline figure, aside, gallery tile, testimonial background).
- An existing photograph should be replaced (alt text is drifting, the visual no longer matches copy, a better candidate exists).
- A new page body is being authored and should ship with real photos wired, not placeholders.
- A **new photograph** is supplied (file upload, path in repo, or attachment): ingest it per §E (archive, filename, alts, `photos.yaml`, then `site/public` + wiring if the task includes a page).
- The user wants a post-hoc **rationale** (still document it in the PR or a short note — do not use it to block implementation).

## Files touched

Paths are relative to the repo root.

- **Read / consult:**
  - `assets/images/photos.yaml` — curated catalog. Fields: `file`, `original`, `alt.{sv,en,de}`, `tags`. Version `1`. **For existing entries:** use `alt` verbatim when wiring. **For new uploads (§E):** the agent **authors** all three alts in one go (calm, concrete, sensory; Andetag voice) so the PR can be reviewed at merge.
  - `assets/images/*.jpg` — **Archival masters** for new uploads: canonical filename, stored here before or alongside serving under `site/public/…`.
  - `docs/responsive-image-workflow.md` — ImageMagick derivative recipe (`-640w.webp`, `-960w.webp`, `-960w.jpg`) and the `SUFFIX` table (`gallery` / `body` / `aside` / `hero` / `testimonial`).
  - `docs/alt-text-review.md` — alt-text tone and review notes (if the catalog entry is missing or needs editing).
  - `docs/Tone of Voice.md` — voice guidance for any copy changes around the figure.
  - `docs/Andetag SEO Manual.md` §image / alt — SEO expectations for alt text (single locale per page, keyword-aware but not stuffed).
- **Possibly write:**
  - `site/public/wp-content/uploads/<year>/<month>/<slug>.jpg` — master and derivatives (if not already served).
  - `site/src/lib/content/stockholm-body-responsive-images.ts` — new `BodyPictureSources` export (jpeg960, webp640, webp960).
  - `site/src/lib/chrome/assets.ts` — for chrome-level hero covers (for example `STOCKHOLM_BOOK_HERO_COVER`).
  - `site/src/lib/content/stockholm-marketing-gallery.ts` — gallery tiles (`thumbWebp640`, `thumbWebp960`, `src`, `fullSrc`).
  - The page body component under `site/src/components/page-bodies/*.astro` (both `*Sv.astro` and `*En.astro` for Stockholm) — by default, wire through **`MediaCopySection`** (`site/src/components/content/MediaCopySection.astro`, which internally renders a `ResponsiveInlinePicture`), **`HeroSection`** (`site/src/components/content/HeroSection.astro`), and/or **`GallerySection`** (`site/src/components/content/GallerySection.astro`) the same way sibling pages in the project do, unless the user specified a different component or layout. Bare `ResponsiveInlinePicture` (`site/src/components/ui/ResponsiveInlinePicture.astro`) is reserved for the rare inset variant — see §B step 7.
  - `assets/images/photos.yaml` — new rows when ingesting a new photograph; preserve field order and the header comment block. Never append a row without a real file in `assets/images/`.
  - `assets/images/<new-slug>.jpg` — write when ingesting: this is the **archived** original under the **new** `file` name; set `original` in YAML to the **uploaded** filename (e.g. `IMG_1234.jpg`).

## Layout rules (read before §A)

These five rules are non-negotiable. They are what separates a wired image from a horrible-looking page. Violating any of them ships a regression even if `npm test` and `npm run build` are green — tests do not catch layout. **Always verify with Claude Preview** (`mcp__Claude_Preview__preview_*`) at desktop and mobile before calling the work done; build success is not visual success.

### L1. Heroes are midpoints, not headers

`HeroSection` is a **break between large blocks**, not a decoration under the page H1. Use it only when:

- The page has **enough body** for the hero to split: each chunk above and below the hero must contain **≥80% of one viewport's worth** of body content (roughly ≥3–4 substantial paragraphs/sections each, or one full InfoFrame + one ContentSection). If the page is shorter than that, **drop the hero** and use one or two inline figures instead (§L3).
- The hero is **not** the second element on the page. There must be at least one full content section (lead `<h1>` + intro is **not** enough; you need at least one full `ContentSection` or equivalent block) above the hero. A hero immediately after the lead, with a few paragraphs above and the rest of the page below, looks like a header decoration and reads as broken.
- The hero is **not** the last element on the page either (footer-adjacent heroes leave nothing below to "break to").

A short experiential page (lead + 2–3 sections + FAQ) **does not need a hero**; it needs 1–2 inline figures (§L3). Reach for `HeroSection` on location hubs, the home, or pages tall enough that a viewport-height visual band has body on both sides of it.

### L2. Pair figures with copy via `<MediaCopySection>` — never wrap a section component in a grid div

The sanctioned way to put an image beside copy is the **`<MediaCopySection>`** component (`site/src/components/content/MediaCopySection.astro`). It owns the 2-column grid, the figure CSS, and the vertical alignment, so page bodies stay readable and layout bugs stay scoped to one component.

**Forbidden anti-pattern:** wrapping a `<ContentSection>`, `<InfoFrame>`, or `<AccordionSection>` inside an ad-hoc `<div class="page-X__Y-grid">` to put a `<ResponsiveInlinePicture>` next to it. Those components are **page-block** primitives — they own their outer margins, vertical rhythm, and width assumptions and assume they are the only child of their slot. Inside a grid cell, they terminate at their natural content height while the figure fills its cell, leaving a dead block under the prose. This pattern shipped twice in 2026-04 corporate-events PRs before being replaced by `<MediaCopySection>`; do not bring it back.

**Forbidden anti-pattern:** `<ResponsiveInlinePicture>` placed as a free-floating block between two `<ContentSection>`s. That is a banner, and a portrait master in that slot is a wall. If the figure has no natural copy partner, use the **inset variant** (single `<figure class="page-<slug>__<slot>-figure">` with `max-width: min(52rem, 88%); margin-inline: auto;`) — see `page-stockholm-home__intro-figure`. The inset variant is reserved for tight intro pairs where the surrounding copy already has its own width constraint.

### L3. `<MediaCopySection>` contract

```astro
<MediaCopySection
  heading="Section heading"
  headingLevel="h2"
  bodyHtml={trustedHtmlString}        /* optional — for paragraph copy without nested components */
  imageSources={someBodyPictureSources}
  imageAlt={photoAltSv /* or .en, .de */}
  imageWidth={masterWidth}
  imageHeight={masterHeight}
  mediaSide="end"                     /* "end" = image right (default); "start" = image left */
  mediaWidth="third"                  /* "third" = image 1/3 + copy 2/3 (default); "half" = 1/1 */
>
  <InfoFrame … />                     {/* anything that needs Astro components goes in the slot */}
</MediaCopySection>
```

- **Heading** renders inside the prose half via `heading` + `headingLevel`. Do **not** put a `<ContentSection heading="…" markdown="" />` next to a MediaCopySection to "label" it — that produces an orphan H2.
- **Mobile:** the grid stacks to a single column, prose first, image second, regardless of `mediaSide`. Source order matters; the component places the prose div before the figure on purpose.
- **Image aspect:** the component does **not** crop. It centers the shorter sibling vertically (`align-items: center`). Pair aspects to copy length per **§L4** so neither side has a long dead zone.

### L4. Image aspect must match copy length

Even with `<MediaCopySection>`, a portrait at column-1/3 width is ~1.5× the column width tall. Pair the aspect to the copy:

| Copy length (rough) | Best aspect | Why |
|---|---|---|
| Short: heading + 2–4 short paragraphs (~250–300px tall at 2/3 column) | **Landscape** (3:2 / 16:9) at 1/3 width → ~165–245px | Image height matches prose height |
| Medium: heading + 4–6 paragraphs or a small InfoFrame (~400–500px) | **Landscape** at 1/2 width → ~300–360px, or **portrait** at 1/3 width → ~535px (slightly taller, OK) | Both work; lean landscape if copy is short within the band |
| Dense: heading + InfoFrame, or 6+ paragraphs (~500–650px) | **Portrait** (2:3 / 3:4) at 1/3 width → ~535–710px | Portrait pairs cleanly with dense vertical copy |

If the copy and image aspect mismatch, the prose centers vertically with whitespace above and below — readable but ugly. **Pick the image to match the copy**, not the other way around. When wiring two figures on one page, reach for **one landscape + one portrait** so each section has its right partner.

### L5. Spread images evenly down the page

If a page has two figures, place them roughly at **~35–40%** and **~65–70%** of the page height (counting collapsed accordions at their collapsed height). Both images in the first 1/3 leaves the bottom 2/3 visually empty; both at the bottom leaves the top text-heavy. A rough check: list the page's sections in order, count blocks, and place figure 1 after the first **third** of blocks and figure 2 after the second **third**. For one figure, place it near the visual middle.

This rule cooperates with §L1 (heroes already act as a break in the middle): if you ship a hero, that *is* the middle break, and inline figures should land before and after it — not stacked next to it.

### L6. Verify with Claude Preview before declaring done

`npm test && npm run build` only proves the code parses and the dist HTML emits. They do **not** detect: empty grid cells from height mismatch, orphan H2s, font / casing regressions, mobile stack order bugs, or images that overflow their column. **Run Claude Preview** (`mcp__Claude_Preview__preview_start` against `.claude/launch.json`'s `site-dev`, then `preview_screenshot` + `preview_inspect`) at **desktop (1280)** and **mobile (375)** widths. Iterate on CSS / props until the screenshot looks balanced. Only then commit.

## Locale parity rules

- Stockholm pages render in `sv + en`. Both bodies read the **same** `BodyPictureSources` constant, so a single wiring change reaches both locales. The `alt=` attribute on the `<ResponsiveInlinePicture>` is locale-specific — pull `alt.sv` into the Swedish body and `alt.en` into the English body from `photos.yaml`.
- **New catalog rows (§E)** must include `alt.de` as well as `alt.sv` and `alt.en` (aligned meaning, Andetag voice). `tags` are required for searchability.
- Berlin pages: use `alt.de` from the catalog for any listed image. If the product asks for a Berlin-only page image path with **no** suitable catalog row and no new file to ingest, **escalate** (do not invent filenames or alt for an unseen asset).
- Never ship an image with alt text in only one language on a Stockholm pair; the pair must carry `alt.sv` and `alt.en` together.
- Alt text stays faithful to what is visible in the frame. Do not claim a colour the light paints on a sculpture is the sculpture's intrinsic colour (the catalog header at `assets/images/photos.yaml` lines 1–24 documents this rule).

## Workflow

### A. Select, wire, and document (default path)

1. Determine the page's intent from its body (what does it promise? what does the hero need to feel like? is there an aside figure?). If the ask is so vague that you cannot choose a slot (hero vs inline vs gallery), ask **one** focused question — not a menu of every candidate photo. Otherwise proceed without confirmation.
2. If the user provided a **new file** that is not yet in `photos.yaml`, run **§E** first (archive, filename, alts, YAML row) so a `file` exists to select.
3. Read `assets/images/photos.yaml`. Scan `tags` and `alt.{sv,en}` for semantic matches (for example `main-room`, `neurodivergent`/`accessibility` cues, `visitors / solo / group / contemplation`, `textile-art`, `blue / pink / warm-light`, `entrance`, `corridor`, `gallery`).
4. Pick a **count** that matches the page:
   - Location hub (`/sv/stockholm/`, `/en/stockholm/`): 1 hero cover + 1–2 inline figures + a gallery if present. Typically 4–6 photos.
   - Factual anchor (hours, how-to-find-us, accessibility, tickets): 0–1 inline figure. Text-dominant.
   - Experiential page (Art Yoga, Dejt, NPF Stockholm, Vilken typ av upplevelse, corporate-events): 1–2 inline figures by default. **Reach for `HeroSection` only if §L1 holds** — short experiential pages should drop the hero and ship inline only.
   - SEO landing: 1 hero (reuse parent location's cover) only if §L1 holds, otherwise 1 inline. 1 extra inline if the copy asks for one.
   - Testimonials strip / background: exactly one `testimonial` background, reused across consumers.
5. Balance **relevance** against **variation**:
   - Relevance: tags overlap the page's anchor concepts.
   - Variation: do not pick three frames that are visually identical (same angle, same lighting). Across a page, prefer one wide room shot, one human-scale moment, one detail.
6. **Plan placement** before wiring. List the page's sections in order, decide which sections are the natural copy partners for each figure (per **§L3**), and check that the resulting positions meet **§L4** (~35–40% and ~65–70% of page height for two images). If a hero is in the plan, confirm **§L1** (≥80% viewport on each side; not the second element). Adjust before touching code: re-placing a wired figure costs more than picking the right slot first.
7. **Wire immediately** using §B (inline via `<MediaCopySection>`), §C (hero), and/or §D (gallery) as needed. **Unless the user said otherwise:** use the same **components and props shape** as similar pages — `HeroSection` with a cover from `stockholm-body-responsive-images` or `assets.ts`, `<MediaCopySection>` for any inline image-beside-copy figure, `GallerySection` with data from `stockholm-marketing-gallery.ts`. Copy structure from a peer `page-bodies` file rather than inventing a one-off `<img>`, raw `<picture>`, or ad-hoc grid wrapper.
8. **Verify in Claude Preview** per **§L6**. Build success is not visual success.
9. **Document for review** in the PR body (or a short `## Images` section in the PR description): for each slot, the chosen `file` from the catalog, one line of rationale, the components/constants touched, and the aspect-pairing decision per **§L4**. The **human approves** the preview/merge, not a separate "pick one of three" step in chat. If **§E** added new files, note the new `file` and `original` in the PR.

### B. Wire a selected image as an inline body figure

Use after selecting a file in §A, or when the catalog choice is already fixed. **Default pattern: `<MediaCopySection>` pairing the figure with one specific copy block on the page** (§L2, §L3). Free-floating full-width bands between sections are not allowed; ad-hoc `<div class="page-<slug>__<section>-grid">` wrappers around `<ContentSection>` / `<InfoFrame>` / `<AccordionSection>` are forbidden (§L2).

1. Confirm the master file is served under `site/public/wp-content/uploads/<year>/<month>/<slug>.jpg`. If not:
   - Copy or generate the master at the target path. Use the published year/month if the photo is pre-existing; use the current year/month if the photograph is new. Keep the slug readable.
   - Generate the three derivatives per `docs/responsive-image-workflow.md` §2, with `SUFFIX=body` (or `aside` for sidebar figures). Verify all four files (master + three derivatives) land in the same directory.
2. Add a `BodyPictureSources` export in `site/src/lib/content/stockholm-body-responsive-images.ts`. Name it after the photo and slot (for example `corporateEventsGroupBody`, `introAside18_058Body`). Three string fields: `jpeg960`, `webp640`, `webp960`, all pointing to the derivative paths under `/wp-content/uploads/…`.
3. **Pick the copy partner.** The figure must be the alongside-content for one specific section on the page (per §L3) — not a free-floating band. The natural partner is usually a heading + a `bodyHtml` paragraph block, an `InfoFrame`, an `AccordionSection`, or a `ButtonGroup`. Choose the partner whose copy length **matches the image aspect** (§L4).
4. In the Stockholm body pair (`FooSv.astro`, `FooEn.astro`):
   - Import `MediaCopySection` from `../content/MediaCopySection.astro` and the new `BodyPictureSources` constant.
   - Replace the section's existing `<ContentSection heading=…/>` (when paired with the figure) with a `<MediaCopySection>` that carries the heading via the `heading` + `headingLevel` props and the body via `bodyHtml` (for trusted HTML strings) and/or `<slot>` content (for nested Astro components like `<InfoFrame>` / `<AccordionSection>`).
   - Pass `imageSources`, `imageAlt` (locale-specific from `photos.yaml`), `imageWidth` and `imageHeight` (master dimensions — do not invent them), `mediaSide` (`"end"` for image-right, `"start"` for image-left), and `mediaWidth` (`"third"` default; `"half"` only when copy is short and you want a 1/1 split).
5. Example — section with paragraph copy and a trailing `InfoFrame`:

   ```astro
   ---
   import MediaCopySection from "../content/MediaCopySection.astro";
   import InfoFrame from "../content/InfoFrame.astro";
   import { practicalInfoBody } from "../../lib/content/stockholm-body-responsive-images";

   const practicalFrameHtml = "<p><strong>Address:</strong> …</p>" + "<p><strong>Capacity:</strong> …</p>";
   ---
   <MediaCopySection
     heading="Practical information"
     headingLevel="h2"
     imageSources={practicalInfoBody}
     imageAlt="Visitors conversing in a corridor with luminous textile sculptures."
     imageWidth={960}
     imageHeight={1440}
     mediaSide="start"
     mediaWidth="third"
   >
     <InfoFrame heading="Details before booking" headingLevel="h3" bodyHtml={practicalFrameHtml} />
   </MediaCopySection>
   ```
6. **No new CSS hook needed.** `<MediaCopySection>` owns its grid, figure, alignment, and responsive stacking centrally in `site/src/styles/components.css` under `.media-copy*`. Do not add per-page grid rules; if the layout looks wrong, fix it inside the component (and tell the user — that's a structural change, not a wiring change).
7. **Inset variant (rare).** If the figure has **no** natural copy partner — e.g. a single intro paragraph that already caps its width and reads as a self-contained masthead — use the inset pattern instead: a bare `<figure class="page-<slug>__<slot>-figure"><ResponsiveInlinePicture …/></figure>` with `max-width: min(52rem, 88%); margin-inline: auto;` on the figure class. See `page-stockholm-home__intro-figure`. This is rare; the default is `<MediaCopySection>`.
8. Verify per **§L6** (Claude Preview at desktop + mobile) and §Verification (`npm test && npm run build`).

### C. Wire a selected image as a hero cover

1. Use `SUFFIX=hero` when generating derivatives.
2. Add a `HeroCoverImage` (or equivalent) export:
   - Chrome-level heroes (home, shared) → `site/src/lib/chrome/assets.ts` (pattern: `STOCKHOLM_BOOK_HERO_COVER`).
   - Page-specific heroes → `site/src/lib/content/stockholm-body-responsive-images.ts` (pattern: `artYogaHeroCover`, `dejtTestimonialHeroCover`).
3. Pass the cover through the page’s **`HeroSection`** (import from `../content/HeroSection.astro` or the path used on sibling page bodies) — mirror props and layout from an existing page of the same family.
4. Verify: §Verification.

### D. Wire a selected image as a gallery tile

1. Generate derivatives with `SUFFIX=gallery`.
2. Append an entry to the relevant gallery array in `site/src/lib/content/stockholm-marketing-gallery.ts` with:
   - `src` = `jpeg960` derivative (for `<img>` fallback).
   - `thumbWebp640`, `thumbWebp960` = derivatives.
   - `fullSrc` = master (for lightbox or preview).
   - `alt` = `alt.sv` or `alt.en` per locale (the module is typically consumed separately in Swedish and English bodies).
3. Expose the gallery through the page’s existing **`GallerySection`** (or shared body partial that already uses it) — do not hand-roll a new gallery grid unless the user asked for a divergent design.
4. Verify: §Verification.

### E. Ingest a new uploaded photograph (archive → filename → alts → `photos.yaml` → serve → wire)

Use when the user (or a shoot handoff) provides **a new image file** not yet in the library. The deliverable is always: **file on disk under `assets/images/`**, a **new canonical `file` name**, **trilingual `alt` + `tags`**, and an **appended** `photos:` entry. Human review is the PR merge, not a separate approval round for the alt copy.

1. **Obtain the bytes** — The user must supply a path in the repo, an attachment, or a URL you can save. **Do not** claim a new row exists without a real file. If no file is available, **escalate** and stop.
2. **Choose the canonical `file` name (new filename)** — Lowercase, kebab-case, hyphen-separated, human-readable, ending in `.jpg` unless the project already uses another extension consistently. **Rules** (see `assets/images/photos.yaml` header lines 18–24):
   - If the source export is an **Andetag artwork** (`Andetag N-…` in the original name), preserve the number: `artwork-andetag-N-…jpg`.
   - Otherwise describe the scene: place + subject + light/mood, e.g. `corridor-visitors-on-pillows-evening.jpg`.
   - `file` in YAML = this new name; it must match the file saved in `assets/images/`.
3. **Save the original in `assets/images/`** — Write the image to `assets/images/<file>` (same as the new canonical name). This is the **long-term archive**; `original` in YAML is the **uploaded** filename (e.g. `IMG_8821.jpg` or `Export-2026-01.jpg`) **preserved verbatim**.
4. **Author `alt.sv`, `alt.en`, and `alt.de` ("automatic" in workflow terms)** — The agent **generates** all three in one pass from what is (or can be) seen in the image, following `docs/Tone of Voice.md`, `docs/alt-text-review.md`, and the **light vs. textile** rule in the `photos.yaml` header. Do not stuff keywords. Keep to a similar length to peer rows (~≤125 characters when reasonable for `en`/`de`). "Automatic" does **not** mean placeholder text — it means the agent composes the catalog string without a separate human draft step; the PR is the check.
5. **Choose `tags`** — Lowercase, hyphenated tokens matching library style: room/area, subjects (`visitor`, `group`), mood, lighting, artwork refs when applicable.
6. **Append to `assets/images/photos.yaml`** — Add a new list item with `file`, `original`, `alt` (all three keys), and `tags`. Match YAML indentation; keep list order consistent with the rest of the file (typically append to `photos:`).
7. **Serve on the site (when the task needs the image live)** — Copy the same master to `site/public/wp-content/uploads/<year>/<month>/` using the **same basename** as `file` (or the project’s month convention; align with `docs/responsive-image-workflow.md` and neighboring uploads). Run ImageMagick to produce the three derivatives for the right `SUFFIX` (§B–D). The copy in `public` is the **served** master; the copy in `assets/images/` remains the **catalog archive**.
8. **Wire** — If the task needs the image on a page, complete **step 7** (served master + derivatives), then **§B/C/D** using the new `file` and `alt.sv` / `alt.en` from the row you added. If the task is **library-only** (catalog + archive for later), stop after **step 6**; skip steps 7–8 until a page build needs the asset.

**Summary:** `assets/images/<new-name>.jpg` = archived original; `photos.yaml` = metadata; `site/public/…` = web master + derivatives for pages.

### F. Replace an image (same slot, new file)

1. If the replacement asset is **not yet** in `photos.yaml`, ingest it with **§E** first. Otherwise select the best existing `file` per the same slot and tag filters as §A — no separate confirmation before wiring.
2. Update the `BodyPictureSources` / `HeroCoverImage` / gallery entry to point at the new master and derivatives (generate them first per §B step 1). Keep using **`ResponsiveInlinePicture`**, **`HeroSection`**, or **`GallerySection`** as for the old image unless the user asked to change the pattern.
3. Update `alt` on every call site where the old image appeared (grep the constant name across `site/src/components/page-bodies/`).
4. Leave the old master and derivatives on disk unless the user asks for cleanup — retention costs are near zero and broken external references are not.
5. Document the swap in the PR. Verify: §Verification.

### G. Artwork photo pipeline (artworks catalogue — separate from page photos)

This is a **completely separate pipeline** from §B–F. Artwork photos do not go through `assets/images/`, `photos.yaml`, `wp-content/uploads/`, or any `BodyPictureSources` constant. Use this section whenever the task involves adding or replacing photos for a specific artwork in the catalogue (Andetag originals or Gems).

#### G.1 File locations

| Role | Path |
|---|---|
| Source archive (full-res originals) | `assets/artworks/<Artwork Name>-<mood>.jpg` |
| Served directory | `site/public/images/artworks/<artwork-id>/` |
| Catalogue entry | `site/src/lib/content/artworks.ts` |

`<artwork-id>` follows the pattern `andetag-N` for originals (e.g. `andetag-40`) and `gem-<name>` for gems (e.g. `gem-emerald`).

#### G.2 Mood variants and derivative set

Each artwork typically has up to 6 moods. Each mood gets **4 derivatives** (not 3 as in the standard workflow):

| Mood stem | `ArtworkMood` | Source filename pattern |
|---|---|---|
| `light` | `"light"` | `Andetag N-light.jpg` |
| `dark` | `"dark"` | `Andetag N-dark.jpg` |
| `mid` | `"mid"` | `Andetag N-mid.jpg` |
| `alt-1` | `"alternative"` | `Andetag N-alt.jpg` |
| `alt-2` | `"alternative"` | `Andetag N-alt2.jpg` |
| `alt-3` | `"alternative"` | `Andetag N-altN.jpg` |

Derivatives per mood (ImageMagick from repo root, `INPUT` = source file, `DIR` = served directory):

```bash
magick "$INPUT" -resize 640x  -strip -define webp:method=6 -quality 82 "$DIR/<mood>-640w.webp"
magick "$INPUT" -resize 960x  -strip -define webp:method=6 -quality 82 "$DIR/<mood>-960w.webp"
magick "$INPUT" -resize 960x  -strip -quality 82            "$DIR/<mood>-960w.jpg"
magick "$INPUT" -resize 1920x -strip -quality 82            "$DIR/<mood>-1920w.jpg"
```

#### G.3 Calibrating -light images before generating derivatives

The `-light` photos are shown side by side in the artworks gallery. Their wall-background brightness and white balance must match. **Always calibrate a new or replaced `-light` image before generating derivatives**, and **recalibrate + regenerate all existing `-light` derivatives whenever the fleet median shifts** (e.g. after a batch of new works lands).

**Calibration algorithm** (Python / Pillow):

```python
# 1. Sample the white wall from each -light image:
#    - Take all pixels with brightness > 120 AND max-min channel < 30
#    - These are bright near-neutral pixels = wall, not artwork
#    - Corner sampling is NOT used — vignetting varies by lens and zoom,
#      making corners unrepresentative. Full-frame wall-pixel sampling
#      naturally excludes vignette-darkened areas (they fall below brightness threshold).
px = arr.reshape(-1, 3).astype(float)
wall = px[(px.mean(1) > 120) & (px.max(1) - px.min(1) < 30)]
cr, cg, cb = wall[:,0].mean(), wall[:,1].mean(), wall[:,2].mean()

# 2. Compute per-channel gain against the fleet median (R≈186, G≈185, B≈188 as of 2026-04):
gain_r, gain_g, gain_b = med_r / cr, med_g / cg, med_b / cb

# 3. Apply gain and clamp:
corrected = np.clip(arr * [gain_r, gain_g, gain_b], 0, 255).astype(uint8)

# 4. Save at quality=95, subsampling=0 to minimise recompression loss.
```

**Fleet median** (re-derive whenever a substantial batch is added or replaced — run the sampling script across all current `-light` masters and take `statistics.median` per channel):

- As of 2026-04-30: R ≈ 186, G ≈ 185, B ≈ 188 (nearly neutral, slight blue cast)
- Store calibrated masters back to `assets/artworks/` in-place; the original commit history is the backup.

**Exception**: if a calibrated image looks visually over-brightened after review, revert that specific image to its original (`git checkout`) and leave it uncalibrated. Document exceptions in the commit message.

#### G.4 Wiring into `artworks.ts`

The `origPhotos(n)` helper auto-generates light/dark/mid entries for any `andetag-N` id. For additional moods (alt variants), use `gemPhoto()` with the artwork's own id:

```typescript
// Standard 3 moods — use helper:
images: origPhotos(40),

// With additional alt images — spread helper + manual entries:
images: [
  ...origPhotos(40),
  gemPhoto("andetag-40", "alt-1", "alternative",
    "Verket Andetag no. 40, alternativ vy av textilskulpturen.",
    "The artwork Andetag no. 40, alternative view of the textile sculpture."),
  gemPhoto("andetag-40", "alt-2", "alternative", "…sv…", "…en…"),
],
```

Catalogue fields required for a new original:

```typescript
{
  id: "andetag-N",
  series: "original",
  number: N,
  title: { sv: "Andetag no. N", en: "Andetag no. N" },
  year: YYYY,
  dimensionsCm: { w: W, h: H },   // width × height in cm
  format: "landscape" | "portrait" | "diptych",
  status: "for-sale" | "sold",
  priceSek: NNNNNN,               // omit if price on request
  location: ANDETAG_MUSEUM,       // or a city constant for sold works
  images: origPhotos(N),
}
```

#### G.5 Checklist for adding a new artwork

1. Pull the branch; confirm source files land in `assets/artworks/`.
2. Calibrate the `-light` image against the current fleet median (§G.3). Save in-place.
3. `mkdir -p site/public/images/artworks/<artwork-id>`.
4. Generate 4 derivatives per mood present (§G.2). Loop all moods in one script run.
5. Add the catalogue entry to `artworks.ts` (after the last existing original, before gems).
6. `cd site && npm test && npm run build`. Both must pass.
7. Commit: source calibration change + derivatives + catalogue entry in one commit.

## Verification

Run from `site/`.

```bash
npm test          # 29 files, 134 tests at time of writing
npm run build     # 65 pages
```

Pass means both exit 0. A missing derivative or broken import shows up as a build failure or a visible 404 in `dist/**/index.html` for the `<picture>` source set.

Post-build spot checks (from repo root):

```bash
# Every derivative referenced by BodyPictureSources constants exists on disk
grep -h "wp-content/uploads" site/src/lib/content/stockholm-body-responsive-images.ts site/src/lib/chrome/assets.ts \
  | tr -d ',"' | awk '{for (i=1;i<=NF;i++) if ($i ~ /^\/wp-content/) print $i}' \
  | sort -u | while read -r p; do test -f "site/public$p" || echo "MISSING $p"; done

# Every alt used in built dist matches the photos.yaml entry (manual eyeballing)
grep -ho 'alt="[^"]*"' site/dist/sv/stockholm/index.html | head -20
```

If `skills/site-integrity/SKILL.md` is in place when this skill runs, defer image-reference integrity to that check rather than scripting it here.

## When to escalate

Stop and ask before proceeding if:

- No **existing** row in `assets/images/photos.yaml` fits the page, **and** the user has **not** supplied a new file to ingest — do not invent catalog rows or filenames without bytes. They may add a shoot file; then use **§E**.
- A **Berlin** page needs an image that is **not** in the catalog and there is **no** new upload to add per §E (Berlin is pre-launch; do not fabricate paths or alt for unseen assets).
- The user requests a single-locale wiring on a Stockholm pair (violates parity).
- The master file is missing from `assets/images/` **and** from `site/public/wp-content/uploads/` when you need to wire an image that is supposed to exist — request the source asset from the user.
- A requested alt text includes colour claims that contradict the catalog's light-vs-textile rule (`assets/images/photos.yaml` header lines 1–24). Propose a corrected alt in the PR; do not ship a catalog edit that breaks that rule.
- Derivative generation is not possible in the current environment (ImageMagick missing). Skill cannot complete; ask the user to run §2 of `docs/responsive-image-workflow.md` locally.

## Examples

### Example 1: images for the NPF Stockholm page

Action:

1. Read the NPF body intent: calm entry, predictability, optional skip of main room, low sensory load.
2. Scan `photos.yaml` for tags: `accessibility`, `calm`, `solo`, `rest`, `lockers`, `entrance`.
3. Plan placement (§A.6): hero only if §L1 holds; otherwise drop and use two inline figures at ~35% / ~70% page height. Pair aspects to copy length per §L4 — landscape with the short "what to expect" copy, portrait with the dense practical-info block.
4. Pick and wire in one go:
   - Hero (only if §L1): `main-room-visitor-profile-blue-sculptures.jpg` — `HeroSection` + hero derivatives (`SUFFIX=hero`).
   - Inline 1: `lockers-visitors-preparing.jpg` (landscape) → `<MediaCopySection mediaSide="end" mediaWidth="third">` next to the short "what to expect" copy. `SUFFIX=body`.
   - Inline 2: `corridor-lounge-illuminated-sculptures.jpg` (portrait) → `<MediaCopySection mediaSide="start" mediaWidth="third">` wrapping the practical-info `<InfoFrame>` in its slot.
5. Verify in Claude Preview at 1280 + 375 (§L6); `npm test && npm run build`. In the PR: short table of slot, `file`, aspect, copy partner, `alt.sv` / `alt.en` verbatim from the catalog.

### Example 2: replace the Stockholm home intro figure

Action:

1. Current figure uses `mainRoomLookingBody` (`main-room-looking-body-960w.jpg`). Find a better file with `main-room` + `visitor` + `group` tags, e.g. `main-room-wall-of-light-four-visitors.jpg` (wide, four-person, pink+violet wall of light).
2. Generate the `-body-640w.webp`, `-body-960w.webp`, `-body-960w.jpg` under `site/public/wp-content/uploads/2026/<month>/` (use 2026/04 per the catalog timeline).
3. Update `stockholm-body-responsive-images.ts` — new `BodyPictureSources` or update the existing constant; keep **`ResponsiveInlinePicture`** in `StockholmHomeSv.astro` / `StockholmHomeEn.astro` and swap sources + `alt.sv` / `alt.en` from `photos.yaml`.
4. `npm test && npm run build` in `site/`. Grep `dist/sv/stockholm/index.html` for the new derivative path. Note the swap in the PR.

### Example 3: ingest a new upload (§E), then optionally wire

Action:

1. User provides `IMG_7742.jpg` (visitors on pillows in the corridor). Save bytes to `assets/images/corridor-visitors-on-pillows-evening.jpg` (new canonical name); set `original: IMG_7742.jpg` in YAML.
2. Generate `alt.sv` / `alt.en` / `alt.de` and `tags` in the same style as neighboring rows (faithful to the frame; light-vs-textile rule in the catalog header).
3. Append the new list item to `assets/images/photos.yaml`.
4. **If** the task is **library-only**, stop — the next page change can pick this `file` via §A.
5. **If** the task also needs the image on a page: copy the same master to `site/public/wp-content/uploads/<year>/<month>/corridor-visitors-on-pillows-evening.jpg`, run ImageMagick per `docs/responsive-image-workflow.md`, add `BodyPictureSources` (or hero/gallery constants), wire with `ResponsiveInlinePicture` / `HeroSection` / `GallerySection`, `npm test && npm run build`.
