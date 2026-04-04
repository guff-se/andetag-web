/**
 * Shared Stockholm marketing gallery: same eight full-resolution JPEGs with
 * generated responsive thumbs (`*-gallery-{640,960}w.webp`, `*-gallery-960w.jpg`).
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

const HOME_ALTS = [
  "fine art stockholm",
  "optical fiber art textile installation",
  "a perfect place for a date in stockholm",
  "calm down in stockholm",
  "unique light art stockholm",
  "a meditative experience in stockholm",
  "mindfulness exhibition stockholm",
  "things to do in stockholm",
] as const;

const SEO_EN_ALTS = [
  "Contemporary fine art installation in Stockholm",
  "Optical fibre textile art installation",
  "A calm date idea in central Stockholm",
  "Quiet space to slow down in Stockholm",
  "Light-based art installation Stockholm",
  "Meditative art experience in Stockholm",
  "Mindful exhibition environment Stockholm",
  "Things to do in Stockholm indoors",
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

/** Short English alts: home, shared body, Swedish SEO landing, Vilken typ pages. */
export const stockholmMarketingGalleryHome: readonly StockholmMarketingGalleryImage[] = FULL_SRC.map(
  (path, i) => entry(path, HOME_ALTS[i]!),
);

/** Longer English alts for `StockholmSeoLandingEn` only. */
export const stockholmMarketingGallerySeoEn: readonly StockholmMarketingGalleryImage[] = FULL_SRC.map(
  (path, i) => entry(path, SEO_EN_ALTS[i]!),
);
