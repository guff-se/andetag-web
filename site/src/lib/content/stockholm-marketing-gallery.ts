/**
 * Shared Stockholm marketing gallery: same eight full-resolution JPEGs with
 * generated responsive thumbs (`*-gallery-{640,960}w.webp`, `*-gallery-960w.jpg`).
 *
 * Alt text per locale (EN/SV/DE); tone: `docs/Tone of Voice.md`, gallery component: `docs/component-usage.md`.
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
  "/wp-content/uploads/2026/04/reception-lobby-with-sculpture.jpg",
  "/wp-content/uploads/2026/05/gallery-visitors-admiring-iridescent-work.jpg",
  "/wp-content/uploads/2026/05/gallery-info-panel-and-visitors.jpg",
  "/wp-content/uploads/2026/05/artwork-andetag-16-hand-close-up.jpg",
  "/wp-content/uploads/2026/05/artwork-andetag-3-silhouette-contemplation.jpg",
  "/wp-content/uploads/2026/05/theme-kids-lying-among-sculptures.jpg",
  "/wp-content/uploads/2026/05/main-room-wide-hall-visitors-resting.jpg",
  "/wp-content/uploads/2026/05/main-room-visitors-on-pillows-suspended-art.jpg",
] as const;

const HOME_ALTS_EN = [
  "The museum lobby with framed textile works, a sofa with visitors, and a large wall sculpture at ANDETAG.",
  "Two visitors contemplating a shimmering textile sculpture in violet, gold, and green.",
  "The exhibition gallery with the ANDETAG info panel on the wall and visitors viewing textile works.",
  "Close-up with a hand pointing toward the artwork Andetag no. 16, green and silver shimmering optical fibre textile.",
  "Silhouette of a visitor before two textile sculptures glowing in violet and magenta light, the artwork Andetag no. 3.",
  "Two children lying on the floor surrounded by large, luminous Andetag sculptures in blue and violet.",
  "Wide view of the main room at ANDETAG, visitors resting before a wall of breathing light art.",
  "Visitors resting on pillows beneath floating, luminous textile sculptures.",
] as const;

const HOME_ALTS_SV = [
  "Museets foajé med inramade textilverk, soffa med besökare och en stor väggskulptur i ANDETAG.",
  "Två besökare betraktar en skimrande textilskulptur i lila, guld och grönt.",
  "Utställningens galleri med ANDETAGs infotext på väggen och besökare som betraktar textilverk.",
  "Närbild där en hand pekar mot verket Andetag nr 16, grönt och silver skimrande optisk fibertextil.",
  "Siluett av besökare framför två textilskulpturer som lyser i lila och magenta, verket Andetag no. 3.",
  "Två barn ligger på golvet omgivna av stora, lysande Andetag-skulpturer i blått och lila.",
  "Översikt av ANDETAGs huvudrum med besökare som ligger ner framför en lysande textilväggsinstallation.",
  "Besökare vilar på kuddar under svävande, lysande textilskulpturer.",
] as const;

const HOME_ALTS_DE = [
  "Das Museumsfoyer mit gerahmten Textilwerken, einem Sofa mit Besuchenden und einer großen Wandskulptur bei ANDETAG.",
  "Zwei Besucherinnen betrachten eine schimmernde Textilskulptur in Violett, Gold und Grün.",
  "Die Ausstellungsgalerie mit dem ANDETAG-Infoschild an der Wand und Besuchenden vor Textilwerken.",
  "Nahaufnahme mit einer Hand, die zum Werk Andetag Nr. 16 zeigt, grün und silbern schimmernde optische Fasertextilie.",
  "Silhouette einer Besucherin vor zwei Textilskulpturen, die in violett und magenta leuchten, dem Werk Andetag no. 3.",
  "Zwei Kinder liegen auf dem Boden, umgeben von großen, leuchtenden Andetag-Skulpturen in Blau und Violett.",
  "Weite Sicht in den Hauptraum von ANDETAG mit Besuchenden vor einer leuchtenden Textilwandinstallation.",
  "Besuchende ruhen auf Kissen unter schwebenden, leuchtenden Textilskulpturen.",
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

/** German: reserved for Berlin or other DE surfaces that reuse this gallery. */
export const stockholmMarketingGalleryHomeDe: readonly StockholmMarketingGalleryImage[] = FULL_SRC.map(
  (path, i) => entry(path, HOME_ALTS_DE[i]!),
);

/** English SEO landing bodies: same descriptive alts as `stockholmMarketingGalleryHomeEn`. */
export const stockholmMarketingGallerySeoEn = stockholmMarketingGalleryHomeEn;
