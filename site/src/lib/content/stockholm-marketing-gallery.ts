/**
 * Shared Stockholm marketing gallery: same eight full-resolution JPEGs with
 * generated responsive thumbs (`*-gallery-{640,960}w.webp`, `*-gallery-960w.jpg`).
 *
 * Alt text per locale: `docs/alt-text-review.md` §7.
 */

export type StockholmMarketingGalleryImage = {
  /** ~960px JPEG fallback inside `<picture>` */
  src: string;
  fullSrc: string;
  thumbWebp640: string;
  thumbWebp960: string;
  alt: string;
  caption?: string;
};

const FULL_SRC = [
  "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6074-scaled.jpg",
  "/wp-content/uploads/2024/11/Andetag-13-35-copy-2.jpg",
  "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-5983-scaled.jpg",
  "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6038-scaled.jpg",
  "/wp-content/uploads/2024/11/Andetag-10-53-copy-2.jpg",
  "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-59311-scaled.jpg",
  "/wp-content/uploads/2024/11/Andetag-19-508-copy.jpg",
  "/wp-content/uploads/2024/11/Andetag-10-69-copy.jpg",
] as const;

const HOME_ALTS_EN = [
  "Three glowing textile wall sculptures in a warm-lit gallery at ANDETAG Stockholm with a visitor on a round ottoman",
  "Close-up of optical fibre textile illuminated in magenta, cyan and violet",
  "Visitor sitting on the floor looking up at a cluster of glowing pink textile sculptures at ANDETAG Stockholm",
  "Quiet lounge with a white sofa beneath a backlit textile sculpture at ANDETAG Stockholm",
  "Visitor gazing at a large glowing textile sculpture in purple and magenta at ANDETAG Stockholm",
  "Person meditating cross-legged beneath a symmetrical spread of glowing textile sculptures at ANDETAG Stockholm",
  "Glowing multicoloured textile sculpture suspended in a dark room at ANDETAG Stockholm",
  "Close-up of peach-and-pink jacquard textile at ANDETAG Stockholm with dark leopard-like patterning",
] as const;

const HOME_ALTS_SV = [
  "Tre lysande textilskulpturer i ett varmt upplyst galleri på ANDETAG Stockholm med en besökare på en rund sittpuff",
  "Närbild av optisk fibertextil upplyst i magenta, cyan och violett",
  "Besökare sitter på golvet och blickar upp mot ett kluster av lysande rosa textilskulpturer på ANDETAG Stockholm",
  "Tyst loungehörna med vit soffa under en upplyst textilskulptur på ANDETAG Stockholm",
  "Besökare betraktar en stor lysande textilskulptur i lila och magenta på ANDETAG Stockholm",
  "Person sitter i meditation under ett symmetriskt arrangemang av lysande textilskulpturer på ANDETAG Stockholm",
  "Lysande flerfärgad textilskulptur svävar i ett mörklagt rum på ANDETAG Stockholm",
  "Närbild av persika- och rosafärgad jacquardvävd textil på ANDETAG Stockholm med mörkt leopardliknande mönster",
] as const;

const HOME_ALTS_DE = [
  "Drei leuchtende Textilwandskulpturen in einem warm beleuchteten Galerieraum im ANDETAG mit Besucherin auf rundem Hocker",
  "Nahaufnahme von optischem Fasertextil in Magenta, Cyan und Violett beleuchtet",
  "Besucherin sitzt am Boden und blickt zu einer Gruppe leuchtender rosa Textilskulpturen im ANDETAG auf",
  "Ruhige Lounge-Ecke mit weißem Sofa unter einer beleuchteten Textilskulptur im ANDETAG",
  "Besucherin betrachtet eine große leuchtende Textilskulptur in Violett und Magenta im ANDETAG",
  "Person meditiert im Schneidersitz unter einer symmetrischen Anordnung leuchtender Textilskulpturen im ANDETAG",
  "Leuchtende mehrfarbige Textilskulptur schwebt in einem abgedunkelten Raum im ANDETAG",
  "Nahaufnahme eines pfirsich-rosa Jacquardstoffs im ANDETAG mit dunklem leopardenartigem Muster",
] as const;

function entry(fullSrc: (typeof FULL_SRC)[number], alt: string): StockholmMarketingGalleryImage {
  const base = fullSrc.slice(0, -".jpg".length);
  return {
    fullSrc,
    src: `${base}-gallery-960w.jpg`,
    thumbWebp640: `${base}-gallery-640w.webp`,
    thumbWebp960: `${base}-gallery-960w.webp`,
    alt,
  };
}

/** English: Stockholm home, Vilken typ (en), English SEO landings (same descriptive alts as former SEO_EN). */
export const stockholmMarketingGalleryHomeEn: readonly StockholmMarketingGalleryImage[] = FULL_SRC.map(
  (path, i) => entry(path, HOME_ALTS_EN[i]!),
);

/** Swedish: Stockholm home, shared body, Swedish SEO landings, Vilken typ (sv). */
export const stockholmMarketingGalleryHomeSv: readonly StockholmMarketingGalleryImage[] = FULL_SRC.map(
  (path, i) => entry(path, HOME_ALTS_SV[i]!),
);

/** German: reserved for Berlin or other DE surfaces that reuse this gallery (`docs/alt-text-review.md` §7). */
export const stockholmMarketingGalleryHomeDe: readonly StockholmMarketingGalleryImage[] = FULL_SRC.map(
  (path, i) => entry(path, HOME_ALTS_DE[i]!),
);

/** English SEO landing bodies: same descriptive alts as `stockholmMarketingGalleryHomeEn`. */
export const stockholmMarketingGallerySeoEn = stockholmMarketingGalleryHomeEn;
