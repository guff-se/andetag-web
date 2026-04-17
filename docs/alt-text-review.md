# Alt Text Review

Review document for all images on the ANDETAG site. For Gustaf to approve, correct, or reject before implementation.

**How the suggestions were generated:** Claude Opus 4.7 viewed each image and wrote descriptive alt text based on what is actually visible in the frame, in Swedish, English, and German. VERIFY flags from the previous pass have been resolved against the real images.

**Principles applied:**
- Alt text describes what the image *shows*, not what keyword we want to rank for.
- Content images get descriptive alt text. Decorative/atmospheric backgrounds get `alt=""`.
- Alt text should be in the page language (sv/en/de).
- Keep it under ~125 characters when possible.
- Do not repeat the surrounding heading or caption.

**Legend:**
- OK = current alt is fine, no change needed
- FIX = needs a new or improved alt
- AI = new description written after viewing the photo

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
| `main-room-looking` (derivatives) | StockholmHomeSv | Besökare i silhuett som blickar upp mot lysande konst i ANDETAG | OK |
| `main-room-looking` (derivatives) | StockholmHomeEn | Silhouette of a visitor looking up at luminous art at ANDETAG | OK |
| `main-room-meditation` (derivatives) | StockholmHomeSv | Person som mediterar omgiven av ljus och textilkonst under Art Yoga på ANDETAG | OK |
| `main-room-meditation` (derivatives) | StockholmHomeEn | Person meditating surrounded by light and textile art during Art Yoga at ANDETAG | OK |

---

## 5. Berlin After Hours image (no change needed)

| Image | Page | Current alt | Status |
|-------|------|-------------|--------|
| `ANDETAG-After-Hours-1-photo-Pekka-Paakko` (derivatives) | BerlinHomeDe | Besucher in gedimmtem Licht zwischen leuchtender Textilkunst in ANDETAG | OK |
| `ANDETAG-After-Hours-1-photo-Pekka-Paakko` (derivatives) | BerlinHomeEn | Visitors in low light among luminous textile art at ANDETAG | OK |

---

## 6. Empty alt on content images: AI-written replacements

Each image was viewed and described. Replace the empty `alt=""` with the suggested text.

### 6a. Date page illustration

**Image:** `date1-copy-e1769692334982.jpeg`
**Used in:** DejtSv.astro (line 79), DejtEn.astro (line 69)
**Current alt:** `""` (empty)
**What it shows:** A visitor in silhouette with a pink fur blanket, leaning back against another person, gazing up at a dense field of glowing, iridescent textile sculptures in purple, orange, blue and silver floating on a black wall.

| Page | Suggested alt |
|------|---------------|
| sv | `"Besökare i silhuett lutar sig mot varandra framför lysande textilskulpturer på ANDETAG Stockholm"` |
| en | `"Visitors leaning on each other in silhouette in front of glowing textile sculptures at ANDETAG Stockholm"` |

### 6b. Artists page lead aside

**Image:** `ANDETAG-Art-Week-Opening-2-photo-by-Gustaf-Tadaa-1024x683.jpg`
**Used in:** OmKonstnarernaSv.astro, OmKonstnarernaEn.astro, DieKuenstlerDe.astro (line 35 each)
**Current alt:** `""` (empty)
**What it shows:** Malin and Gustaf Tadaa posing together in a peach-walled gallery, framed by two textile wall sculptures — a blue-green one on the left and a pink-and-black one on the right. Malin in a pink floral jacket, Gustaf in an ornate white-and-gold jacket.

| Page | Suggested alt |
|------|---------------|
| sv | `"Malin och Gustaf Tadaa mellan två textilkonstverk under Art Week-invigningen på ANDETAG Stockholm"` |
| en | `"Malin and Gustaf Tadaa between two textile artworks at the Art Week opening at ANDETAG Stockholm"` |
| de | `"Malin und Gustaf Tadaa zwischen zwei Textilkunstwerken bei der Eröffnung der Art Week im ANDETAG"` |

### 6c. Optical fibre textile: Malin at the loom

**Image:** `malin-vaver-768x1024.jpg`
**Used in:** OptiskFibertextilSv.astro (line 23), OpticalFibreTextileEn.astro (line 22), OptischeFasertextilDe.astro (line 22)
**Current alt:** `""` (empty)
**What it shows:** Malin Tadaa standing at a large green industrial jacquard loom in a textile factory, wearing headphones, a black tank top and jeans. Yellow and blue warp threads cascade down from the loom; other looms line the factory behind her.

| Page | Suggested alt |
|------|---------------|
| sv | `"Malin Tadaa vid en storformats-jacquardvävstol i textilfabriken, vävande optisk fibertextil med gula och blå trådar"` |
| en | `"Malin Tadaa at a large-format jacquard loom in the textile factory weaving optical fibre textile with yellow and blue warp threads"` |
| de | `"Malin Tadaa am großformatigen Jacquard-Webstuhl in der Textilfabrik beim Weben optischer Fasertextilien mit gelben und blauen Kettfäden"` |

### 6d. Optical fibre textile: fabric on the loom

**Image:** `malin-vaver2-768x1024.jpg`
**Used in:** OptiskFibertextilSv.astro (line 70), OpticalFibreTextileEn.astro (line 83), OptischeFasertextilDe.astro (line 83)
**Current alt:** `""` (empty)
**What it shows:** Close-up of rose-pink and deep-burgundy jacquard-woven textile coming off the loom (the loom bar labelled "STEVEN" is visible at the top), showing an intricate winding vine-like pattern in the weave.

| Page | Suggested alt |
|------|---------------|
| sv | `"Närbild av rosa och vinröd optisk fibertextil på vävstolen med slingrande jacquardmönster"` |
| en | `"Close-up of pink and burgundy optical fibre textile on the loom with a winding jacquard pattern"` |
| de | `"Nahaufnahme von rosa und burgunderrotem optischem Fasertextil auf dem Webstuhl mit geschwungenem Jacquardmuster"` |

### 6e. Vilken Typ / What Kind of Experience hero image

**Image:** `TADAA-LONG-V1.00_07_24_06.Still008-2-1024x576.jpg`
**Used in:** VilkenTypAvUpplevelseSv.astro (line 48-52), VilkenTypAvUpplevelseEn.astro (line 46-51)
**Current alt:** `""` (empty)
**What it shows:** A group of visitors lying down on cushions and blankets in a darkened room, heads together, surrounded by soft out-of-focus coloured lights (purple, green, red) that suggest the glowing textile sculptures just off-frame.

| Page | Suggested alt |
|------|---------------|
| sv | `"Besökare vilar tillsammans på kuddar i ett mörklagt rum omgivna av färgade ljus på ANDETAG Stockholm"` |
| en | `"Visitors resting together on cushions in a darkened room surrounded by breathing light art at ANDETAG"` |

---

## 7. Gallery alt text: AI-written replacements

**Image source:** `stockholm-marketing-gallery.ts`
**Used on:** Stockholm home (sv + en), SEO landing pages (sv + en), Vilken Typ pages (sv + en)

Each gallery image was viewed and described in all three languages so the Swedish pages can get dedicated `sv` alts instead of reusing English.

| # | Master file | Current (en) | Suggested en | Suggested sv | Suggested de |
|---|-------------|--------------|--------------|--------------|--------------|
| 1 | `TERRAN-6074-scaled.jpg` | `fine art stockholm` | `Three glowing textile wall sculptures in a warm-lit gallery at ANDETAG Stockholm with a visitor on a round ottoman` | `Tre lysande textilskulpturer i ett varmt upplyst galleri på ANDETAG Stockholm med en besökare på en rund sittpuff` | `Drei leuchtende Textilwandskulpturen in einem warm beleuchteten Galerieraum im ANDETAG mit Besucherin auf rundem Hocker` |
| 2 | `Andetag-13-35-copy-2.jpg` | `optical fiber art textile installation` | `Close-up of optical fibre textile illuminated in magenta, cyan and violet` | `Närbild av optisk fibertextil upplyst i magenta, cyan och violett` | `Nahaufnahme von optischem Fasertextil in Magenta, Cyan und Violett beleuchtet` |
| 3 | `TERRAN-5983-scaled.jpg` | `a perfect place for a date in stockholm` | `Visitor sitting on the floor looking up at a cluster of glowing pink textile sculptures at ANDETAG Stockholm` | `Besökare sitter på golvet och blickar upp mot ett kluster av lysande rosa textilskulpturer på ANDETAG Stockholm` | `Besucherin sitzt am Boden und blickt zu einer Gruppe leuchtender rosa Textilskulpturen im ANDETAG auf` |
| 4 | `TERRAN-6038-scaled.jpg` | `calm down in stockholm` | `Quiet lounge with a white sofa beneath a backlit textile sculpture at ANDETAG Stockholm` | `Tyst loungehörna med vit soffa under en upplyst textilskulptur på ANDETAG Stockholm` | `Ruhige Lounge-Ecke mit weißem Sofa unter einer beleuchteten Textilskulptur im ANDETAG` |
| 5 | `Andetag-10-53-copy-2.jpg` | `unique light art stockholm` | `Visitor gazing at a large glowing textile sculpture in purple and magenta at ANDETAG Stockholm` | `Besökare betraktar en stor lysande textilskulptur i lila och magenta på ANDETAG Stockholm` | `Besucherin betrachtet eine große leuchtende Textilskulptur in Violett und Magenta im ANDETAG` |
| 6 | `TERRAN-59311-scaled.jpg` | `a meditative experience in stockholm` | `Person meditating cross-legged beneath a symmetrical spread of glowing textile sculptures at ANDETAG Stockholm` | `Person sitter i meditation under ett symmetriskt arrangemang av lysande textilskulpturer på ANDETAG Stockholm` | `Person meditiert im Schneidersitz unter einer symmetrischen Anordnung leuchtender Textilskulpturen im ANDETAG` |
| 7 | `Andetag-19-508-copy.jpg` | `mindfulness exhibition stockholm` | `Glowing multicoloured textile sculpture suspended in a dark room at ANDETAG Stockholm` | `Lysande flerfärgad textilskulptur svävar i ett mörklagt rum på ANDETAG Stockholm` | `Leuchtende mehrfarbige Textilskulptur schwebt in einem abgedunkelten Raum im ANDETAG` |
| 8 | `Andetag-10-69-copy.jpg` | `things to do in stockholm` | `Close-up of peach-and-pink jacquard textile at ANDETAG Stockholm with dark leopard-like patterning` | `Närbild av persika- och rosafärgad jacquardvävd textil på ANDETAG Stockholm med mörkt leopardliknande mönster` | `Nahaufnahme eines pfirsich-rosa Jacquardstoffs im ANDETAG mit dunklem leopardenartigem Muster` |

**Implementation note:** `stockholm-marketing-gallery.ts` currently exports HOME alts (English) that Swedish pages fall back to. Add a dedicated `sv` array and, for the DE-facing Berlin pages using this gallery, a `de` array.

---

## 8. Schema.org image captions: minor improvement

| Image | Current caption | Suggested caption |
|-------|----------------|-------------------|
| `andetag-logo-white-shadow.png` | `ANDETAG logo` | OK, no change |
| `stockholm-hero-poster-1920w.jpg` | `ANDETAG Stockholm` | `Breathing textile art installation at ANDETAG Stockholm` |

---

## 9. StockholmHomeSharedBody intro aside: AI-written replacement

**Image:** `Andetag-18-058-copy2-1024x683.jpg`
**Used in:** StockholmHomeSharedBody.astro (line 36-38)
**Current alt:** `"immersive art installation stockholm andetag"` (keyword-stuffed)
**What it shows:** Extreme close-up of draped optical fibre textile — magenta, pink and pearl-white folds with a gold-and-black snake-scale-like jacquard pattern — lit from within so the fibres glow through the weave.

| Page | Suggested alt |
|------|---------------|
| sv (shared body used on SEO landing pages) | `"Närbild av rosa och guldmönstrad optisk fibertextil som lyser inifrån"` |
| en (if ever reused on en shared body) | `"Close-up of pink-and-gold patterned optical fibre textile glowing from within"` |
| de | `"Nahaufnahme von rosa-gold gemustertem optischem Fasertextil, das von innen leuchtet"` |

---

## Summary of work

| Category | Count | Action |
|----------|-------|--------|
| Decorative images | 7 types | No change |
| Partner logos | 9 | No change |
| Artist portraits | 6 uses | No change |
| Home intro/yoga images | 4 uses | No change |
| Berlin After Hours | 2 uses | No change |
| **Empty content alts** | **~13 uses across sv/en/de** | **Add AI-written alt** |
| **Gallery keyword-stuffed alts** | **8 images × 3 languages** | **Replace all + add sv/de arrays** |
| **Shared body keyword-stuffed alt** | **1 image** | **Replace** |
| Schema.org caption | 1 | Minor tweak |
| **Total changes** | **~30 alt text edits** | |

---

## Next steps

1. Gustaf reviews `alt-text-review.html` (AI-written descriptions next to each photo) and approves, edits, or rejects each one.
2. Update `stockholm-marketing-gallery.ts` (add `sv`/`de` arrays, replace HOME alts), individual page bodies (fill empty alts), and `schema-org.ts` (caption).
3. Run `npm test` and `npm run build`.
