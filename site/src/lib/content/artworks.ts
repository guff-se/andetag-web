/**
 * Single source of truth for the Andetag artworks catalogue.
 *
 * Used by:
 *   - `KonstverkSv.astro` / `ArtworksEn.astro` page bodies (cards, filters, list).
 *   - `ArtworkMap.astro` (one pin per artwork).
 *   - `schema-org.ts` (CollectionPage + VisualArtwork + Offer JSON-LD).
 *   - `artworks.test.ts` (invariants).
 *
 * Notion sync (`skills/artworks/SKILL.md`, planned) regenerates this file from the
 * Notion database. Until then the entries below are hand-typed fixtures using the
 * subset of artwork photos that already have served responsive derivatives under
 * `site/public/wp-content/uploads/2024/11/`. Prices are intentionally omitted on
 * every entry so nothing fabricated ships; cards render "Pris på förfrågan" /
 * "Price on request" until Gustaf supplies real numbers through Notion.
 */

export type ArtworkSeries = "original" | "gem";
export type ArtworkStatus = "for-sale" | "sold";
export type ArtworkFormat = "landscape" | "portrait" | "diptych";

export type ArtworkImage = {
  /** ~960px JPEG fallback inside `<picture>`. Public path. */
  src: string;
  webp640: string;
  webp960: string;
  /** Full-resolution JPEG for the lightbox. Optional; falls back to `src`. */
  fullSrc?: string;
  /** Visual mood. Cards cross-fade `ambient` ↔ `illuminated` on hover. */
  mood: "ambient" | "illuminated" | "detail" | "context";
  alt: { sv: string; en: string };
};

export type ArtworkLocation = {
  /** Public label, e.g. "Stockholm, SE". Never a private address. */
  label: { sv: string; en: string };
  /** Coordinates for the SVG map. Jittered to ≥1 km when `privacy === "city"`. */
  lat: number;
  lon: number;
  /** Sharper geo allowed for `exhibition`; `city` anonymises private collections. */
  privacy: "exhibition" | "city";
};

export type ArtworkEdition = {
  size: 6 | 10;
  available: number;
};

export type Artwork = {
  /** Stable slug. Used as DOM id, map pin id, and `?about=` inquiry pre-fill. */
  id: string;
  series: ArtworkSeries;
  /** Originals only. Uniquely 1..50. */
  number?: number;
  /** Gems only. Total edition size + units still available. */
  edition?: ArtworkEdition;
  title: { sv: string; en: string };
  year: number;
  /** Width × height (× depth optional), centimetres. */
  dimensionsCm: { w: number; h: number; d?: number };
  format: ArtworkFormat;
  status: ArtworkStatus;
  /** SEK. Optional even when `for-sale` (renders as "price on request" when absent). */
  priceSek?: number;
  location: ArtworkLocation;
  /** Always ≥ 1. Two ideally (ambient + illuminated) so the card can cross-fade. */
  images: readonly ArtworkImage[];
};

const ANDETAG_MUSEUM_LOC: ArtworkLocation = {
  label: { sv: "ANDETAG, Stockholm", en: "ANDETAG, Stockholm" },
  lat: 59.3358,
  lon: 18.0631,
  privacy: "exhibition",
};

const STOCKHOLM_PRIVATE: ArtworkLocation = {
  label: { sv: "Stockholm, SE", en: "Stockholm, SE" },
  lat: 59.3293,
  lon: 18.0686,
  privacy: "city",
};

const BERLIN_PRIVATE: ArtworkLocation = {
  label: { sv: "Berlin, DE", en: "Berlin, DE" },
  lat: 52.52,
  lon: 13.405,
  privacy: "city",
};

const COPENHAGEN_PRIVATE: ArtworkLocation = {
  label: { sv: "Köpenhamn, DK", en: "Copenhagen, DK" },
  lat: 55.6761,
  lon: 12.5683,
  privacy: "city",
};

const OSLO_PRIVATE: ArtworkLocation = {
  label: { sv: "Oslo, NO", en: "Oslo, NO" },
  lat: 59.9139,
  lon: 10.7522,
  privacy: "city",
};

const LONDON_PRIVATE: ArtworkLocation = {
  label: { sv: "London, UK", en: "London, UK" },
  lat: 51.5074,
  lon: -0.1278,
  privacy: "city",
};

const PARIS_PRIVATE: ArtworkLocation = {
  label: { sv: "Paris, FR", en: "Paris, FR" },
  lat: 48.8566,
  lon: 2.3522,
  privacy: "city",
};

const AMSTERDAM_PRIVATE: ArtworkLocation = {
  label: { sv: "Amsterdam, NL", en: "Amsterdam, NL" },
  lat: 52.3676,
  lon: 4.9041,
  privacy: "city",
};

const NYC_PRIVATE: ArtworkLocation = {
  label: { sv: "New York, US", en: "New York, US" },
  lat: 40.7128,
  lon: -74.006,
  privacy: "city",
};

const HELSINKI_PRIVATE: ArtworkLocation = {
  label: { sv: "Helsingfors, FI", en: "Helsinki, FI" },
  lat: 60.1699,
  lon: 24.9384,
  privacy: "city",
};

const GOTHENBURG_PRIVATE: ArtworkLocation = {
  label: { sv: "Göteborg, SE", en: "Gothenburg, SE" },
  lat: 57.7089,
  lon: 11.9746,
  privacy: "city",
};

/** Served Andetag artwork photos (subset with derivatives in `site/public/wp-content/uploads/2024/11/`). */
const PHOTO_10_53: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2-gallery-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2-gallery-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2-gallery-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2.jpg",
  mood: "illuminated",
  alt: {
    sv: "Verket Andetag no. 10 i magenta och lila toner, med en besökares profil i mjukt ljus.",
    en: "The artwork Andetag no. 10 in magenta and violet tones, with a visitor's profile in soft light.",
  },
};

const PHOTO_10_69: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-10-69-copy-gallery-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-10-69-copy-gallery-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-10-69-copy-gallery-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-10-69-copy.jpg",
  mood: "illuminated",
  alt: {
    sv: "Verket Andetag no. 10 lyser i blått, rosa, gult och orange mot en vit vägg.",
    en: "The artwork Andetag no. 10 glowing in blue, pink, yellow, and orange against a white wall.",
  },
};

const PHOTO_13_35: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-13-35-copy-2-gallery-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-13-35-copy-2-gallery-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-13-35-copy-2-gallery-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-13-35-copy-2.jpg",
  mood: "detail",
  alt: {
    sv: "Detalj av verket Andetag no. 13, skimrande veck i optisk fibertextil i rosa, lila, grönt och silver.",
    en: "Detail of the artwork Andetag no. 13, shimmering optical fibre textile folds in pink, violet, green, and silver.",
  },
};

const PHOTO_18_058: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-18-058-copy2-1024x683-aside-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-18-058-copy2-1024x683-aside-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-18-058-copy2-1024x683-aside-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-18-058-copy2-1024x683.jpg",
  mood: "illuminated",
  alt: {
    sv: "Verket Andetag no. 18 i mjukt rosa och violett ljus.",
    en: "The artwork Andetag no. 18 in soft pink and violet light.",
  },
};

const PHOTO_19_508: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-19-508-copy-gallery-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-19-508-copy-gallery-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-19-508-copy-gallery-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-19-508-copy.jpg",
  mood: "illuminated",
  alt: {
    sv: "Närbild av verket Andetag no. 19, persika och rosa textil med leopardliknande mönster.",
    en: "Close-up of the artwork Andetag no. 19, peach and pink textile with a leopard-like pattern.",
  },
};

const PHOTO_21_399: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-21-399-scaled.jpg",
  mood: "illuminated",
  alt: {
    sv: "Verket Andetag no. 21, lysande textilskulptur i rosa och violetta toner.",
    en: "The artwork Andetag no. 21, a luminous textile sculpture in pink and violet tones.",
  },
};

const PHOTO_27_037: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled-testimonial-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled-testimonial-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled-testimonial-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-27-037-copy-scaled.jpg",
  mood: "ambient",
  alt: {
    sv: "Verket Andetag no. 27, mjuka veck i optisk fibertextil i varma toner.",
    en: "The artwork Andetag no. 27, soft folds of optical fibre textile in warm tones.",
  },
};

export const ARTWORKS: readonly Artwork[] = [
  {
    id: "andetag-3",
    series: "original",
    number: 3,
    title: { sv: "Andetag no. 3", en: "Andetag no. 3" },
    year: 2024,
    dimensionsCm: { w: 110, h: 160 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM_PRIVATE,
    images: [PHOTO_27_037],
  },
  {
    id: "andetag-9",
    series: "original",
    number: 9,
    title: { sv: "Andetag no. 9", en: "Andetag no. 9" },
    year: 2024,
    dimensionsCm: { w: 180, h: 120 },
    format: "landscape",
    status: "sold",
    location: COPENHAGEN_PRIVATE,
    images: [PHOTO_18_058],
  },
  {
    id: "andetag-10",
    series: "original",
    number: 10,
    title: { sv: "Andetag no. 10", en: "Andetag no. 10" },
    year: 2024,
    dimensionsCm: { w: 120, h: 170 },
    format: "portrait",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_10_53, PHOTO_10_69],
  },
  {
    id: "andetag-11",
    series: "original",
    number: 11,
    title: { sv: "Andetag no. 11", en: "Andetag no. 11" },
    year: 2024,
    dimensionsCm: { w: 200, h: 130 },
    format: "landscape",
    status: "sold",
    location: BERLIN_PRIVATE,
    images: [PHOTO_13_35],
  },
  {
    id: "andetag-13",
    series: "original",
    number: 13,
    title: { sv: "Andetag no. 13", en: "Andetag no. 13" },
    year: 2024,
    dimensionsCm: { w: 220, h: 140 },
    format: "diptych",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_13_35, PHOTO_18_058],
  },
  {
    id: "andetag-16",
    series: "original",
    number: 16,
    title: { sv: "Andetag no. 16", en: "Andetag no. 16" },
    year: 2024,
    dimensionsCm: { w: 100, h: 140 },
    format: "portrait",
    status: "sold",
    location: OSLO_PRIVATE,
    images: [PHOTO_19_508],
  },
  {
    id: "andetag-18",
    series: "original",
    number: 18,
    title: { sv: "Andetag no. 18", en: "Andetag no. 18" },
    year: 2024,
    dimensionsCm: { w: 190, h: 120 },
    format: "landscape",
    status: "sold",
    location: AMSTERDAM_PRIVATE,
    images: [PHOTO_18_058],
  },
  {
    id: "andetag-19",
    series: "original",
    number: 19,
    title: { sv: "Andetag no. 19", en: "Andetag no. 19" },
    year: 2024,
    dimensionsCm: { w: 130, h: 180 },
    format: "portrait",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_19_508],
  },
  {
    id: "andetag-21",
    series: "original",
    number: 21,
    title: { sv: "Andetag no. 21", en: "Andetag no. 21" },
    year: 2024,
    dimensionsCm: { w: 110, h: 165 },
    format: "portrait",
    status: "sold",
    location: LONDON_PRIVATE,
    images: [PHOTO_21_399],
  },
  {
    id: "andetag-27",
    series: "original",
    number: 27,
    title: { sv: "Andetag no. 27", en: "Andetag no. 27" },
    year: 2025,
    dimensionsCm: { w: 200, h: 130 },
    format: "landscape",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_27_037],
  },
  {
    id: "andetag-30",
    series: "original",
    number: 30,
    title: { sv: "Andetag no. 30", en: "Andetag no. 30" },
    year: 2025,
    dimensionsCm: { w: 240, h: 140 },
    format: "diptych",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_27_037],
  },
  {
    id: "andetag-34",
    series: "original",
    number: 34,
    title: { sv: "Andetag no. 34", en: "Andetag no. 34" },
    year: 2025,
    dimensionsCm: { w: 170, h: 110 },
    format: "landscape",
    status: "sold",
    location: PARIS_PRIVATE,
    images: [PHOTO_27_037],
  },
  {
    id: "andetag-37",
    series: "original",
    number: 37,
    title: { sv: "Andetag no. 37", en: "Andetag no. 37" },
    year: 2025,
    dimensionsCm: { w: 110, h: 160 },
    format: "portrait",
    status: "sold",
    location: NYC_PRIVATE,
    images: [PHOTO_21_399],
  },
  {
    id: "andetag-41",
    series: "original",
    number: 41,
    title: { sv: "Andetag no. 41", en: "Andetag no. 41" },
    year: 2025,
    dimensionsCm: { w: 130, h: 175 },
    format: "portrait",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_19_508],
  },
  {
    id: "andetag-44",
    series: "original",
    number: 44,
    title: { sv: "Andetag no. 44", en: "Andetag no. 44" },
    year: 2025,
    dimensionsCm: { w: 200, h: 135 },
    format: "landscape",
    status: "sold",
    location: HELSINKI_PRIVATE,
    images: [PHOTO_18_058],
  },
  {
    id: "andetag-47",
    series: "original",
    number: 47,
    title: { sv: "Andetag no. 47", en: "Andetag no. 47" },
    year: 2026,
    dimensionsCm: { w: 120, h: 170 },
    format: "portrait",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_10_53],
  },
  {
    id: "andetag-49",
    series: "original",
    number: 49,
    title: { sv: "Andetag no. 49", en: "Andetag no. 49" },
    year: 2026,
    dimensionsCm: { w: 230, h: 140 },
    format: "diptych",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_13_35],
  },
  {
    id: "andetag-50",
    series: "original",
    number: 50,
    title: { sv: "Andetag no. 50", en: "Andetag no. 50" },
    year: 2026,
    dimensionsCm: { w: 140, h: 200 },
    format: "portrait",
    status: "sold",
    location: GOTHENBURG_PRIVATE,
    images: [PHOTO_21_399],
  },
  {
    id: "gem-aurora",
    series: "gem",
    edition: { size: 6, available: 4 },
    title: { sv: "Aurora", en: "Aurora" },
    year: 2025,
    dimensionsCm: { w: 60, h: 80 },
    format: "portrait",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_10_53],
  },
  {
    id: "gem-solstice",
    series: "gem",
    edition: { size: 10, available: 6 },
    title: { sv: "Solstice", en: "Solstice" },
    year: 2025,
    dimensionsCm: { w: 90, h: 60 },
    format: "landscape",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_27_037],
  },
  {
    id: "gem-pulse",
    series: "gem",
    edition: { size: 10, available: 3 },
    title: { sv: "Pulse", en: "Pulse" },
    year: 2026,
    dimensionsCm: { w: 60, h: 90 },
    format: "portrait",
    status: "for-sale",
    location: ANDETAG_MUSEUM_LOC,
    images: [PHOTO_19_508],
  },
];

export const ANDETAG_ORIGINAL_TOTAL = 50;
export const ANDETAG_GEM_TOTAL = 3;

/** Total stock counters derived from the catalogue (used by intro copy + schema). */
export function getCatalogueTotals(artworks: readonly Artwork[]): {
  originals: { listed: number; forSale: number; sold: number };
  gems: { listed: number; forSale: number; soldUnits: number; totalUnits: number };
} {
  const originals = artworks.filter((a) => a.series === "original");
  const gems = artworks.filter((a) => a.series === "gem");

  const totalUnits = gems.reduce((acc, g) => acc + (g.edition?.size ?? 0), 0);
  const availableUnits = gems.reduce((acc, g) => acc + (g.edition?.available ?? 0), 0);

  return {
    originals: {
      listed: originals.length,
      forSale: originals.filter((a) => a.status === "for-sale").length,
      sold: originals.filter((a) => a.status === "sold").length,
    },
    gems: {
      listed: gems.length,
      forSale: gems.filter((a) => a.status === "for-sale").length,
      totalUnits,
      soldUnits: totalUnits - availableUnits,
    },
  };
}
