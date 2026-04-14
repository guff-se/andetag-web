# Alt Text Review

Review document for all images on the ANDETAG site. For Gustaf to approve, correct, or reject before implementation.

**Principles applied:**
- Alt text describes what the image *shows*, not what keyword we want to rank for.
- Content images get descriptive alt text. Decorative/atmospheric backgrounds get `alt=""`.
- Alt text should be in the page language (sv/en/de).
- Keep it under ~125 characters when possible.
- Do not repeat the surrounding heading or caption.

**Legend:**
- OK = current alt is fine, no change needed
- FIX = needs a new or improved alt
- VERIFY = I cannot see the image; please confirm my description is accurate

---

## 1. Decorative / atmospheric images (no change needed)

These correctly use `alt=""` (or `aria-hidden="true"`) because they are backgrounds, overlays, or purely atmospheric. No action required.

| Image | Used in | Current alt | Status |
|-------|---------|-------------|--------|
| `stockholm-hero-poster-*` | SiteHeader (video poster + static bg) | `""` + `aria-hidden` | OK |
| `Mobile-BG.00_00_00_00.Still002-header-mobile-*` | SiteHeader small variant | `""` + `aria-hidden` | OK |
| `Andetag-21-399-scaled-hero-*` | HeroSection "Boka" band (home pages) | `""` (HeroSection bg) | OK |
| `Andetag-27-037-copy-scaled-testimonial-*` | TestimonialCarousel background | `""` (atmospheric) | OK |
| `Art-Yoga-...-hero-*` | HeroSection on Art Yoga page | `""` (HeroSection bg) | OK |
| `TADAA-LONG-V1.00_07_29_05.Still009-2-2-hero-*` | HeroSection on Dejt pages | `""` (HeroSection bg) | OK |
| `tripadvisor-5dots.png` | TestimonialCarousel aggregate | `""` (decorative beside score text) | OK |

---

## 2. Partner logos (no change needed)

All use the company name as alt text, which is correct for logos inside a link that already has an `aria-label`.

| Image | Current alt | Status |
|-------|-------------|--------|
| `SVGOMG-Image-1.svg` | Ateljé Lyktan | OK |
| `Toniton-1.svg` | Toniton | OK |
| `Fogia-Logo.png` | Fogia | OK |
| `g1036.png.png` | dotAudio | OK |
| `download.svg` | Stoddard | OK |
| `kvadrat-1024x217.png` | Kvadrat | OK |
| `Object-Carpet-Logo.svg` | OBJECT CARPET | OK |
| `uniqorna-black.svg` | Uniqorna | OK |
| `tripadvisor-logo.svg` | Tripadvisor | OK |

---

## 3. Artist portraits (no change needed)

| Image | Page lang | Current alt | Status |
|-------|-----------|-------------|--------|
| `Malin-Tadaa-Andetag-2025-face-1-1024x1024.jpg` | sv | Porträtt av Malin Tadaa | OK |
| `Malin-Tadaa-Andetag-2025-face-1-1024x1024.jpg` | en | Portrait of Malin Tadaa | OK |
| `Malin-Tadaa-Andetag-2025-face-1-1024x1024.jpg` | de | Porträt von Malin Tadaa | OK |
| `Gustaf-Tadaa-Andetag-2025-face-1-1024x1024.jpg` | sv | Porträtt av Gustaf Tadaa | OK |
| `Gustaf-Tadaa-Andetag-2025-face-1-1024x1024.jpg` | en | Portrait of Gustaf Tadaa | OK |
| `Gustaf-Tadaa-Andetag-2025-face-1-1024x1024.jpg` | de | Porträt von Gustaf Tadaa | OK |

---

## 4. Home page intro + Art Yoga images (no change needed)

| Image | Page | Current alt | Status |
|-------|------|-------------|--------|
| `andrum-looking` (derivatives) | StockholmHomeSv | Besökare i silhuett som blickar upp mot lysande konst i ANDETAG | OK |
| `andrum-looking` (derivatives) | StockholmHomeEn | Silhouette of a visitor looking up at luminous art at ANDETAG | OK |
| `andrum-meditation` (derivatives) | StockholmHomeSv | Person som mediterar omgiven av ljus och textilkonst under Art Yoga på ANDETAG | OK |
| `andrum-meditation` (derivatives) | StockholmHomeEn | Person meditating surrounded by light and textile art during Art Yoga at ANDETAG | OK |

---

## 5. Berlin After Hours image (no change needed)

| Image | Page | Current alt | Status |
|-------|------|-------------|--------|
| `ANDETAG-After-Hours-1-photo-Pekka-Paakko` (derivatives) | BerlinHomeDe | Besucher in gedimmtem Licht zwischen leuchtender Textilkunst in ANDETAG | OK |
| `ANDETAG-After-Hours-1-photo-Pekka-Paakko` (derivatives) | BerlinHomeEn | Visitors in low light among luminous textile art at ANDETAG | OK |

---

## 6. Empty alt on content images: NEEDS FIX

These are content images (not decorative backgrounds), but they currently have `alt=""`. Each needs a real description.

### 6a. Date page illustration

**Image:** `date1-copy-e1769692334982.jpeg`
**Used in:** DejtSv.astro (line 79), DejtEn.astro (line 69)
**Current alt:** `""` (empty)
**Context:** Aside illustration on the romantic date page

VERIFY: I believe this is an illustration or photo related to a date/couple at ANDETAG. Please confirm what this image actually shows, then choose or edit:

| Page | Suggested alt |
|------|---------------|
| sv | `"Par som sitter tillsammans i ljuset på ANDETAG"` |
| en | `"Couple sitting together in the light at ANDETAG"` |

### 6b. Artists page lead aside

**Image:** `ANDETAG-Art-Week-Opening-2-photo-by-Gustaf-Tadaa-1024x683.jpg` (derivatives via `artWeekOpeningLeadAside`)
**Used in:** OmKonstnarernaSv.astro (line 35), OmKonstnarernaEn.astro (line 35), DieKuenstlerDe.astro (line 35)
**Current alt:** `""` (empty)
**Context:** Lead image on the About the Artists page. Filename suggests Art Week opening event photo.

VERIFY: I believe this shows a scene from the Art Week opening. Please confirm, then choose or edit:

| Page | Suggested alt |
|------|---------------|
| sv | `"Besökare i ANDETAG under Art Week-invigningen"` |
| en | `"Visitors at ANDETAG during the Art Week opening"` |
| de | `"Besucher in ANDETAG bei der Eröffnung der Art Week"` |

### 6c. Optical fibre textile: Malin weaving (first image)

**Image:** `malin-vaver-768x1024.jpg` (derivatives via `malinVaverOpticalFibertextil`)
**Used in:** OptiskFibertextilSv.astro (line 23), OpticalFibreTextileEn.astro (line 22), OptischeFasertextilDe.astro (line 22)
**Current alt:** `""` (empty)
**Context:** Textile page, first figure. Filename: "malin-vaver" (Malin weaves). This is likely a photo of Malin at the loom.

VERIFY: Is this Malin weaving at the jacquard loom?

| Page | Suggested alt |
|------|---------------|
| sv | `"Malin Tadaa vid jacquardvävstolen, väver optisk fibertextil"` |
| en | `"Malin Tadaa at the jacquard loom, weaving optical fibre textile"` |
| de | `"Malin Tadaa am Jacquard-Webstuhl beim Weben von optischem Fasertextil"` |

### 6d. Optical fibre textile: second weaving image

**Image:** `malin-vaver2-768x1024.jpg` (derivatives via `malinVaver2OpticalFibertextil`)
**Used in:** OptiskFibertextilSv.astro (line 70), OpticalFibreTextileEn.astro (line 83), OptischeFasertextilDe.astro (line 83)
**Current alt:** `""` (empty)
**Context:** Textile page, second figure. Follows prose about studio work and hand-sewing.

VERIFY: Is this a close-up of the textile, or Malin doing studio/hand-sewing work?

| Page | Suggested alt |
|------|---------------|
| sv | `"Närbild av handvävd optisk fibertextil som lyser inifrån"` |
| en | `"Close-up of hand-woven optical fibre textile glowing from within"` |
| de | `"Nahaufnahme von handgewebtem optischem Fasertextil, das von innen leuchtet"` |

### 6e. Vilken Typ / What Kind of Experience hero image

**Image:** `TADAA-LONG-V1.00_07_24_06.Still008-2-1024x576.jpg`
**Used in:** VilkenTypAvUpplevelseSv.astro (line 48-52), VilkenTypAvUpplevelseEn.astro (line 46-51)
**Current alt:** `""` (empty)
**Context:** Hero figure on the "What kind of experience" page. Filename suggests a video still from the TADAA long film.

VERIFY: What does this still frame show?

| Page | Suggested alt |
|------|---------------|
| sv | `"Lysande textilkonstverk i andningsrummet på ANDETAG"` |
| en | `"Glowing textile artwork in the breathing room at ANDETAG"` |

---

## 7. Gallery alt text: NEEDS REWRITE

The eight gallery images are the **biggest issue**. Current alts read like search queries, not image descriptions. Google specifically warns against keyword-stuffing alt text.

**Image source:** `stockholm-marketing-gallery.ts`
**Used on:** Stockholm home (sv + en), SEO landing pages (sv + en), Vilken Typ pages (sv + en)

### Current alts vs. suggested replacements

I cannot see the images, so the descriptions below are my best guess from filenames and context. **Please review each one and correct the description to match what the photo actually shows.**

| # | Master file | Current HOME alt | Current SEO_EN alt | Status |
|---|-------------|-----------------|-------------------|--------|
| 1 | `TERRAN-6074-scaled.jpg` | `fine art stockholm` | `Contemporary fine art installation in Stockholm` | FIX |
| 2 | `Andetag-13-35-copy-2.jpg` | `optical fiber art textile installation` | `Optical fibre textile art installation` | FIX |
| 3 | `TERRAN-5983-scaled.jpg` | `a perfect place for a date in stockholm` | `A calm date idea in central Stockholm` | FIX |
| 4 | `TERRAN-6038-scaled.jpg` | `calm down in stockholm` | `Quiet space to slow down in Stockholm` | FIX |
| 5 | `Andetag-10-53-copy-2.jpg` | `unique light art stockholm` | `Light-based art installation Stockholm` | FIX |
| 6 | `TERRAN-59311-scaled.jpg` | `a meditative experience in stockholm` | `Meditative art experience in Stockholm` | FIX |
| 7 | `Andetag-19-508-copy.jpg` | `mindfulness exhibition stockholm` | `Mindful exhibition environment Stockholm` | FIX |
| 8 | `Andetag-10-69-copy.jpg` | `things to do in stockholm` | `Things to do in Stockholm indoors` | FIX |

### What good gallery alts should look like

Each alt should describe what the photo actually shows. Examples of the **pattern** (you'll need to fill in the real descriptions):

| # | Suggested HOME alt (en) | Suggested SEO_EN alt |
|---|------------------------|---------------------|
| 1 | `Glowing optical fibre textile close-up at ANDETAG` | `Glowing optical fibre textile installation at ANDETAG Stockholm` |
| 2 | `Visitor sitting among woven light artworks` | `Visitor immersed in optical fibre textile art at ANDETAG` |
| 3 | `Two people resting on cushions in the breathing room` | `Calm breathing room for couples at ANDETAG Stockholm` |
| 4 | `Soft light shifting across textile surfaces` | `Shifting light across hand-woven textile art at ANDETAG` |
| 5 | `Blue and amber light patterns in woven fabric` | `Light patterns in woven optical fibre textile at ANDETAG` |
| 6 | `Visitor lying down surrounded by breathing light` | `Meditative breathing room with textile art at ANDETAG Stockholm` |
| 7 | `Overview of the exhibition space with glowing walls` | `ANDETAG exhibition space with luminous textile walls` |
| 8 | `Detail of optical fibres glowing in textile weave` | `Detail of optical fibre art at ANDETAG Stockholm` |

**For Swedish pages:** The gallery currently uses the HOME alts for sv pages too. We should add a dedicated SV array. Suggested pattern: same descriptive approach but in Swedish.

---

## 8. Schema.org image captions: minor improvement

| Image | Current caption | Suggested caption |
|-------|----------------|-------------------|
| `andetag-logo-white-shadow.png` | `ANDETAG logo` | OK, no change |
| `stockholm-hero-poster-1920w.jpg` | `ANDETAG Stockholm` | `Breathing textile art installation at ANDETAG Stockholm` |

---

## 9. StockholmHomeSharedBody intro aside: NEEDS FIX

**Image:** `Andetag-18-058-copy2-1024x683.jpg` (derivatives via `introAside18_058Body`)
**Used in:** StockholmHomeSharedBody.astro (line 36-38)
**Current alt:** `"immersive art installation stockholm andetag"` (keyword-stuffed, reads like a search query)

VERIFY: What does this photo show?

| Page | Suggested alt |
|------|---------------|
| sv (shared body, used on SEO landing pages) | `"Lysande optisk fibertextil i utställningen ANDETAG"` |

---

## Summary of work

| Category | Count | Action |
|----------|-------|--------|
| Decorative images | 7 types | No change |
| Partner logos | 9 | No change |
| Artist portraits | 6 uses | No change |
| Home intro/yoga images | 4 uses | No change |
| Berlin After Hours | 2 uses | No change |
| **Empty content alts** | **~13 uses across sv/en/de** | **Add descriptive alt** |
| **Gallery keyword-stuffed alts** | **8 images x multiple pages** | **Rewrite all** |
| **Shared body keyword-stuffed alt** | **1 image** | **Rewrite** |
| Schema.org caption | 1 | Minor tweak |
| **Total changes** | **~30 alt text edits** | |

---

## Next steps

1. Gustaf reviews this document and corrects image descriptions (especially gallery photos I cannot see).
2. We update `stockholm-marketing-gallery.ts` (gallery alts), individual page bodies (empty alts), and `schema-org.ts` (caption).
3. Run `npm test` and `npm run build`.
4. Add Swedish-language gallery alts (currently the sv pages use the English HOME alts).
