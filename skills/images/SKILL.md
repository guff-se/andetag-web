---
name: images
description: Use when selecting or suggesting photographs for a page on the ANDETAG Astro site (site/), wiring a new inline figure, hero cover, gallery tile, or testimonial background, or when refreshing an existing image. Triggers include "what photos should we use on this page", "add a hero image here", "propose 3 images for the NPF page", "replace the intro figure", or "this page needs a photograph of the main room". Reads the curated catalog at assets/images/photos.yaml; outputs candidate filenames with rationale; then wires the pick through the responsive-image pipeline.
---

## Purpose

Help an agent pick photographs that match a page's intent, then wire the chosen image(s) through the responsive-image pipeline so markup, alt text, derivatives, and path constants stay consistent. The single source of curated photo metadata (alt text in `sv + en + de`, tags) is `assets/images/photos.yaml`. The served masters and their derivatives live under `site/public/wp-content/uploads/<year>/<month>/`. Wiring constants live in `site/src/lib/content/stockholm-body-responsive-images.ts` (body figures, testimonial backgrounds, most hero covers) and `site/src/lib/chrome/assets.ts` (chrome-level hero assets).

This skill is **not** for:

- Re-cropping, re-toning, or editing the pixels of an existing photo (that is a content operation on the master file, outside the agent's scope).
- Deciding whether a new page should exist at all (see `skills/page/SKILL.md`).
- Berlin image selection — `photos.yaml` currently has no Berlin entries; escalate.
- Icons, logos, or SVG assets (the responsive workflow explicitly excludes these).

## When to use

- A page needs a new photograph (hero cover, inline figure, aside, gallery tile, testimonial background).
- An existing photograph should be replaced (alt text is drifting, the visual no longer matches copy, a better candidate exists).
- A new page body is being authored and the author wants image recommendations before writing markup.
- The user asks for a rationale ("why these three photos and not others").

## Files touched

Paths are relative to the repo root.

- **Read / consult:**
  - `assets/images/photos.yaml` — curated catalog. Fields: `file`, `original`, `alt.{sv,en,de}`, `tags`. Version `1`. **Alt text is already in all three languages — use verbatim.**
  - `docs/responsive-image-workflow.md` — ImageMagick derivative recipe (`-640w.webp`, `-960w.webp`, `-960w.jpg`) and the `SUFFIX` table (`gallery` / `body` / `aside` / `hero` / `testimonial`).
  - `docs/alt-text-review.md` — alt-text tone and review notes (if the catalog entry is missing or needs editing).
  - `docs/Tone of Voice.md` — voice guidance for any copy changes around the figure.
  - `docs/Andetag SEO Manual.md` §image / alt — SEO expectations for alt text (single locale per page, keyword-aware but not stuffed).
- **Possibly write:**
  - `site/public/wp-content/uploads/<year>/<month>/<slug>.jpg` — master and derivatives (if not already served).
  - `site/src/lib/content/stockholm-body-responsive-images.ts` — new `BodyPictureSources` export (jpeg960, webp640, webp960).
  - `site/src/lib/chrome/assets.ts` — for chrome-level hero covers (for example `STOCKHOLM_BOOK_HERO_COVER`).
  - `site/src/lib/content/stockholm-marketing-gallery.ts` — gallery tiles (`thumbWebp640`, `thumbWebp960`, `src`, `fullSrc`).
  - The page body component under `site/src/components/page-bodies/*.astro` (both `*Sv.astro` and `*En.astro` for Stockholm) — imports and `<ResponsiveInlinePicture sources={…} width={…} height={…} alt="…" />` or equivalent for `HeroSection` / `GallerySection`.
  - `assets/images/photos.yaml` — only if adding a brand-new catalog entry (new photograph received from the photographer). Preserve field order and comments at the top of the file.

## Locale parity rules

- Stockholm pages render in `sv + en`. Both bodies read the **same** `BodyPictureSources` constant, so a single wiring change reaches both locales. The `alt=` attribute on the `<ResponsiveInlinePicture>` is locale-specific — pull `alt.sv` into the Swedish body and `alt.en` into the English body from `photos.yaml`.
- Berlin pages render in `en + de`. Same pattern, but `photos.yaml` has no Berlin entries today — **escalate** instead of fabricating alt text or tags.
- Never ship an image with alt text in only one language on a Stockholm pair; the pair must carry `alt.sv` and `alt.en` together.
- Alt text stays faithful to what is visible in the frame. Do not claim a colour the light paints on a sculpture is the sculpture's intrinsic colour (the catalog header at `assets/images/photos.yaml` lines 1–24 documents this rule).

## Workflow

### A. Suggest images for a page (no wiring yet)

1. Determine the page's intent from its body (what does it promise? what does the hero need to feel like? is there an aside figure?). If unclear, ask the user.
2. Read `assets/images/photos.yaml`. Scan `tags` and `alt.{sv,en}` for semantic matches (for example `main-room`, `neurodivergent`/`accessibility` cues, `visitors / solo / group / contemplation`, `textile-art`, `blue / pink / warm-light`, `entrance`, `corridor`, `gallery`).
3. Pick a **count** that matches the page:
   - Location hub (`/sv/stockholm/`, `/en/stockholm/`): 1 hero cover + 1–2 inline figures + a gallery if present. Typically 4–6 photos.
   - Factual anchor (hours, how-to-find-us, accessibility, tickets): 0–1 inline figure. Text-dominant.
   - Experiential page (Art Yoga, Dejt, NPF Stockholm, Vilken typ av upplevelse): 1 hero + 1–2 inline. Lean on mood.
   - SEO landing: 1 hero (reuse parent location's cover) + 1 inline if the copy asks for one.
   - Testimonials strip / background: exactly one `testimonial` background, reused across consumers.
4. Balance **relevance** against **variation**:
   - Relevance: tags overlap the page's anchor concepts.
   - Variation: do not pick three frames that are visually identical (same angle, same lighting). Across a page, prefer one wide room shot, one human-scale moment, one detail.
5. Output a table to the user:

   | Slot | Candidate `file` | Why | Alt (sv) | Alt (en) |
   |------|------------------|-----|----------|----------|
   | Hero | `main-room-wide-hall-visitors-resting.jpg` | wide room establishing shot, conveys stillness and scale | `<from photos.yaml>` | `<from photos.yaml>` |

6. Wait for the user's pick (or direction) before wiring. The skill does not auto-wire suggested images without confirmation.

### B. Wire a selected image as an inline body figure

1. Confirm the master file is served under `site/public/wp-content/uploads/<year>/<month>/<slug>.jpg`. If not:
   - Copy or generate the master at the target path. Use the published year/month if the photo is pre-existing; use the current year/month if the photograph is new. Keep the slug readable.
   - Generate the three derivatives per `docs/responsive-image-workflow.md` §2, with `SUFFIX=body` (or `aside` for sidebar figures). Verify all four files (master + three derivatives) land in the same directory.
2. Add a `BodyPictureSources` export in `site/src/lib/content/stockholm-body-responsive-images.ts`. Name it after the photo and slot (for example `mainRoomLookingBody`, `introAside18_058Body`). Three string fields: `jpeg960`, `webp640`, `webp960`, all pointing to the derivative paths under `/wp-content/uploads/…`.
3. In the Stockholm body pair (`FooSv.astro`, `FooEn.astro`):
   - Import `ResponsiveInlinePicture from "../ui/ResponsiveInlinePicture.astro"` and the new `BodyPictureSources` constant.
   - Add `<ResponsiveInlinePicture sources={…} width={<master_width>} height={<master_height>} alt="<alt>" />` where `alt` is `alt.sv` (Swedish) or `alt.en` (English) from `photos.yaml`.
   - Wrap in `<figure class="page-<slug>__<slot>-figure">` for layout hooks.
   - Pass `width`/`height` matching the master for correct aspect ratio; do not invent dimensions.
4. Verify: §Verification.

### C. Wire a selected image as a hero cover

1. Use `SUFFIX=hero` when generating derivatives.
2. Add a `HeroCoverImage` (or equivalent) export:
   - Chrome-level heroes (home, shared) → `site/src/lib/chrome/assets.ts` (pattern: `STOCKHOLM_BOOK_HERO_COVER`).
   - Page-specific heroes → `site/src/lib/content/stockholm-body-responsive-images.ts` (pattern: `artYogaHeroCover`, `dejtTestimonialHeroCover`).
3. Pass the cover through the page's `HeroSection` usage (follow existing peers).
4. Verify: §Verification.

### D. Wire a selected image as a gallery tile

1. Generate derivatives with `SUFFIX=gallery`.
2. Append an entry to the relevant gallery array in `site/src/lib/content/stockholm-marketing-gallery.ts` with:
   - `src` = `jpeg960` derivative (for `<img>` fallback).
   - `thumbWebp640`, `thumbWebp960` = derivatives.
   - `fullSrc` = master (for lightbox or preview).
   - `alt` = `alt.sv` or `alt.en` per locale (the module is typically consumed separately in Swedish and English bodies).
3. Verify: §Verification.

### E. Add a brand-new entry to `photos.yaml` (photograph received from photographer)

1. Slug the file: snake-lowercase hyphen-separated, descriptive, include the artwork number if it is a numbered Andetag work (for example `artwork-andetag-13-night-and-day.jpg`, see catalog header lines 18–24).
2. Commit the master under `assets/images/<slug>.jpg` (this is the source-of-truth archive — the `site/public/...` path is a separate wiring step).
3. Append a row to `photos.yaml` with `file`, `original` (original export name, preserved verbatim), `alt.sv`, `alt.en`, `alt.de`, and `tags`. Match the indentation and spacing of surrounding entries.
4. Alt text must be faithful: describe what is visible, attribute colour to emitted light vs. textile material correctly, use the Andetag voice (calm, concrete, sensory). Reference `docs/alt-text-review.md` if unsure.
5. Do not wire yet — wiring follows §B/C/D once a page actually needs the image.

### F. Replace an image (same slot, new file)

1. Suggest replacements per §A, filtered to the same slot and tags.
2. Update the `BodyPictureSources` / `HeroCoverImage` / gallery entry to point at the new master and derivatives (generate them first per §B step 1).
3. Update `alt` on every call site where the old image appeared (grep the constant name across `site/src/components/page-bodies/`).
4. Leave the old master and derivatives on disk unless the user asks for cleanup — retention costs are near zero and broken external references are not.
5. Verify: §Verification.

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

- No photo in `assets/images/photos.yaml` matches the page's intent. **Do not fabricate alt text or invent filenames.** Ask the user for direction — they may be able to point at an unphotographed shoot or request new photography.
- A Berlin page needs an image (no catalog entries exist; Berlin is pre-launch).
- The user requests a single-locale wiring on a Stockholm pair (violates parity).
- The master file is missing from `assets/images/` **and** from `site/public/wp-content/uploads/` — request the source asset from the user.
- A requested alt text includes colour claims that contradict the catalog's light-vs-textile rule (`assets/images/photos.yaml` header lines 1–24). Propose a corrected alt; confirm before shipping.
- Derivative generation is not possible in the current environment (ImageMagick missing). Skill cannot complete; ask the user to run §2 of `docs/responsive-image-workflow.md` locally.

## Examples

### Example 1: suggest images for the NPF Stockholm page

Action:

1. Read the NPF body intent: calm entry, predictability, optional skip of main room, low sensory load.
2. Scan `photos.yaml` for tags: `accessibility`, `calm`, `solo`, `rest`, `lockers`, `entrance`.
3. Candidate set:
   - Hero: `main-room-visitor-profile-blue-sculptures.jpg` (solo, calm, cool light — matches "low sensory").
   - Inline 1 (intro aside): `lockers-visitors-preparing.jpg` (predictable wayfinding moment).
   - Inline 2 (after-the-visit aside, optional): `corridor-lounge-illuminated-sculptures.jpg` (seated, quiet corridor).
4. Present the table with `alt.sv` / `alt.en` from `photos.yaml`. Wait for user confirmation before §B/C wiring.

### Example 2: replace the Stockholm home intro figure

Action:

1. Current figure uses `mainRoomLookingBody` (`main-room-looking-body-960w.jpg`). Find better candidates with `main-room` + `visitor` + `group` tags.
2. Suggest `main-room-wall-of-light-four-visitors.jpg` (wide, four-person composition, pink+violet wall of light — establishes "many people at rest").
3. On confirm: generate the `-body-640w.webp`, `-body-960w.webp`, `-body-960w.jpg` under `site/public/wp-content/uploads/2026/<month>/` (use 2026/04 per the catalog timeline).
4. Update `stockholm-body-responsive-images.ts` — rename `mainRoomLookingBody` or add a new constant `mainRoomWallOfLightBody`; consumers (`StockholmHomeSv.astro`, `StockholmHomeEn.astro`) switch the import name and pass `alt.sv`/`alt.en` from `photos.yaml`.
5. `npm test && npm run build` in `site/`. Grep `dist/sv/stockholm/index.html` for the new derivative path.

### Example 3: add a brand-new photograph to the catalog only

Action:

1. Master arrives as `IMG_7742.jpg` showing visitors seated on pillows in the corridor.
2. Slug: `corridor-visitors-on-pillows-evening.jpg`. Commit under `assets/images/`.
3. Append to `photos.yaml`:
   ```yaml
     - file: corridor-visitors-on-pillows-evening.jpg
       original: IMG_7742.jpg
       alt:
         sv: "Besökare sitter på kuddar i korridoren i ANDETAG under kvällstid."
         en: "Visitors seated on pillows in the corridor at ANDETAG in the evening."
         de: "Besuchende sitzen abends auf Kissen im Gang bei ANDETAG."
       tags: [corridor, visitors, seating, evening, rest]
   ```
4. No wiring yet — the entry is available for §A selection on a future page.
