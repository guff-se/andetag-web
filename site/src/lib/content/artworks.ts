/**
 * Single source of truth for the Andetag artworks catalogue.
 *
 * Data imported from artworks.csv (2026-04-29). Fields used:
 *   Name → id + series + number/title
 *   Status → "Andetag Stockholm" | "In storage" → for-sale  /  "Sold" → sold
 *   Size → dimensionsCm (WxH in centimetres)
 *   Price SEK → priceSek (for-sale works only)
 *   Year → year
 *   Location → location (sold works; city-level privacy)
 *
 * Fields ignored: Frame type, FW Version, Owner, Exhibited at, Shop url,
 *   Sold by, Inventory (Accounting), original currency price.
 *
 * Images live in assets/artworks/ (source) and are served from
 * site/public/images/artworks/{id}/ (derivatives). Each original has
 * light, dark, and mid photos (nos. 22 and 29 have dark + mid only).
 * Gems use placeholder images until their own photos are processed.
 */

export type ArtworkSeries = "original" | "gem";
export type ArtworkStatus = "for-sale" | "sold";
export type ArtworkFormat = "landscape" | "portrait";

export type ArtworkMood =
  /** Spotlight on, room lit — primary card image. */
  | "light"
  /** Spotlight on, full darkness — card cross-fade target on hover. */
  | "dark"
  /** Ambient / mid-level room light. */
  | "mid"
  /** Close-up of the textile weave or detail. */
  | "closeup"
  /** Artwork with a person for scale or atmosphere. */
  | "person"
  /** Artwork in its installed context / room. */
  | "context"
  /** Alternative shot that doesn't fit the above. */
  | "alternative";

export type ArtworkImage = {
  /** 960 px JPEG fallback for the card grid. Public path under /images/artworks/. */
  src: string;
  webp640: string;
  webp960: string;
  /** Full-resolution file (≤ 600 KB, 1920 px wide) loaded on lightbox click. */
  fullSrc?: string;
  mood: ArtworkMood;
  alt: { sv: string; en: string };
};

export type ArtworkLocation = {
  /** Public label, e.g. "Stockholm, SE". Never a private address. */
  label: { sv: string; en: string };
  /** Coordinates for the SVG map. Jittered to ≥1 km when `privacy === "city"`. */
  lat: number;
  lon: number;
  /** `exhibition` for publicly shown works; `city` anonymises private collections. */
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
  /** Width × height, centimetres. */
  dimensionsCm: { w: number; h: number };
  format: ArtworkFormat;
  status: ArtworkStatus;
  /** SEK. Optional even when `for-sale` (renders as "price on request" when absent). */
  priceSek?: number;
  location: ArtworkLocation;
  /** Always ≥ 1. Two ideally (ambient + illuminated) for the card cross-fade. */
  images: readonly ArtworkImage[];
};

// ─── Locations ────────────────────────────────────────────────────────────────

const ANDETAG_MUSEUM: ArtworkLocation = {
  label: { sv: "ANDETAG, Stockholm", en: "ANDETAG, Stockholm" },
  lat: 59.3358,
  lon: 18.0631,
  privacy: "exhibition",
};

const STOCKHOLM: ArtworkLocation = {
  label: { sv: "Stockholm, SE", en: "Stockholm, SE" },
  lat: 59.3293,
  lon: 18.0686,
  privacy: "city",
};

const GOTHENBURG: ArtworkLocation = {
  label: { sv: "Göteborg, SE", en: "Gothenburg, SE" },
  lat: 57.7089,
  lon: 11.9746,
  privacy: "city",
};

const SIGTUNA: ArtworkLocation = {
  label: { sv: "Sigtuna, SE", en: "Sigtuna, SE" },
  lat: 59.6167,
  lon: 17.7167,
  privacy: "city",
};

const GRASTORP: ArtworkLocation = {
  label: { sv: "Grästorp, SE", en: "Grästorp, SE" },
  lat: 58.327,
  lon: 12.66,
  privacy: "city",
};

const OSTERGUND: ArtworkLocation = {
  label: { sv: "Östersund, SE", en: "Östersund, SE" },
  lat: 63.1792,
  lon: 14.6357,
  privacy: "city",
};

const NEW_YORK: ArtworkLocation = {
  label: { sv: "New York, US", en: "New York, US" },
  lat: 40.7128,
  lon: -74.006,
  privacy: "city",
};

const MIAMI: ArtworkLocation = {
  label: { sv: "Miami, US", en: "Miami, US" },
  lat: 25.7617,
  lon: -80.1918,
  privacy: "city",
};

const SEATTLE: ArtworkLocation = {
  label: { sv: "Seattle, US", en: "Seattle, US" },
  lat: 47.6062,
  lon: -122.3321,
  privacy: "city",
};

const CHARLOTTESVILLE: ArtworkLocation = {
  label: { sv: "Charlottesville, US", en: "Charlottesville, US" },
  lat: 38.0293,
  lon: -78.4767,
  privacy: "city",
};

const SAN_JOSE_CR: ArtworkLocation = {
  label: { sv: "San José, CR", en: "San José, CR" },
  lat: 9.9281,
  lon: -84.0907,
  privacy: "city",
};

const FARO: ArtworkLocation = {
  label: { sv: "Faro, PT", en: "Faro, PT" },
  lat: 37.0194,
  lon: -7.9322,
  privacy: "city",
};

const LISBON: ArtworkLocation = {
  label: { sv: "Lissabon, PT", en: "Lisbon, PT" },
  lat: 38.7169,
  lon: -9.1399,
  privacy: "city",
};

// ─── Photos ───────────────────────────────────────────────────────────────────

function p(
  id: string,
  mood: "light" | "dark" | "mid",
  sv: string,
  en: string,
): ArtworkImage {
  return {
    src: `/images/artworks/${id}/${mood}-960w.jpg`,
    webp640: `/images/artworks/${id}/${mood}-640w.webp`,
    webp960: `/images/artworks/${id}/${mood}-960w.webp`,
    fullSrc: `/images/artworks/${id}/${mood}-1920w.jpg`,
    mood,
    alt: { sv, en },
  };
}

function origPhotos(n: number): readonly ArtworkImage[] {
  const id = `andetag-${n}`;
  const num = `no. ${n}`;
  const hasLight = n !== 22 && n !== 29;
  const arr: ArtworkImage[] = [];
  if (hasLight) {
    arr.push(p(
      id, "light",
      `Verket Andetag ${num}, textilskulptur i spotlight.`,
      `The artwork Andetag ${num}, textile sculpture in spotlight.`,
    ));
  }
  arr.push(p(
    id, "dark",
    `Verket Andetag ${num}, lysande textilskulptur i mörker.`,
    `The artwork Andetag ${num}, luminous textile sculpture in darkness.`,
  ));
  arr.push(p(
    id, "mid",
    `Verket Andetag ${num}, textilskulptur i mjukt omgivningsljus.`,
    `The artwork Andetag ${num}, textile sculpture in soft ambient light.`,
  ));
  return arr;
}

// Gem placeholder images — replace once dedicated gem photos are processed.
const GEM_EMERALD_PH: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2-gallery-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2-gallery-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2-gallery-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-10-53-copy-2.jpg",
  mood: "light",
  alt: {
    sv: "Verket Andetag no. 10 i magenta och lila toner, med en besökares profil i mjukt ljus.",
    en: "The artwork Andetag no. 10 in magenta and violet tones, with a visitor's profile in soft light.",
  },
};

const GEM_RUBY_PH: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-19-508-copy-gallery-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-19-508-copy-gallery-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-19-508-copy-gallery-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-19-508-copy.jpg",
  mood: "light",
  alt: {
    sv: "Närbild av verket Andetag no. 19, persika och rosa textil med leopardliknande mönster.",
    en: "Close-up of the artwork Andetag no. 19, peach and pink textile with a leopard-like pattern.",
  },
};

const GEM_SAPPHIRE_PH: ArtworkImage = {
  src: "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-960w.jpg",
  webp640: "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-640w.webp",
  webp960: "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-960w.webp",
  fullSrc: "/wp-content/uploads/2024/11/Andetag-21-399-scaled.jpg",
  mood: "light",
  alt: {
    sv: "Verket Andetag no. 21, lysande textilskulptur i rosa och violetta toner.",
    en: "The artwork Andetag no. 21, a luminous textile sculpture in pink and violet tones.",
  },
};

// ─── Catalogue ────────────────────────────────────────────────────────────────

export const ARTWORKS: readonly Artwork[] = [
  // ── Originals ──────────────────────────────────────────────────────────────
  {
    id: "andetag-1",
    series: "original",
    number: 1,
    title: { sv: "Andetag no. 1", en: "Andetag no. 1" },
    year: 2023,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "sold",
    location: NEW_YORK,
    images: origPhotos(1),
  },
  {
    id: "andetag-2",
    series: "original",
    number: 2,
    title: { sv: "Andetag no. 2", en: "Andetag no. 2" },
    year: 2023,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: NEW_YORK,
    images: origPhotos(2),
  },
  {
    id: "andetag-3",
    series: "original",
    number: 3,
    title: { sv: "Andetag no. 3", en: "Andetag no. 3" },
    year: 2023,
    dimensionsCm: { w: 110, h: 190 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(3),
  },
  {
    id: "andetag-4",
    series: "original",
    number: 4,
    title: { sv: "Andetag no. 4", en: "Andetag no. 4" },
    year: 2023,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: NEW_YORK,
    images: origPhotos(4),
  },
  {
    id: "andetag-5",
    series: "original",
    number: 5,
    title: { sv: "Andetag no. 5", en: "Andetag no. 5" },
    year: 2023,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(5),
  },
  {
    id: "andetag-6",
    series: "original",
    number: 6,
    title: { sv: "Andetag no. 6", en: "Andetag no. 6" },
    year: 2023,
    dimensionsCm: { w: 90, h: 110 },
    format: "portrait",
    status: "sold",
    location: SIGTUNA,
    images: origPhotos(6),
  },
  {
    id: "andetag-7",
    series: "original",
    number: 7,
    title: { sv: "Andetag no. 7", en: "Andetag no. 7" },
    year: 2023,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(7),
  },
  {
    id: "andetag-8",
    series: "original",
    number: 8,
    title: { sv: "Andetag no. 8", en: "Andetag no. 8" },
    year: 2023,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(8),
  },
  {
    id: "andetag-9",
    series: "original",
    number: 9,
    title: { sv: "Andetag no. 9", en: "Andetag no. 9" },
    year: 2023,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: GRASTORP,
    images: origPhotos(9),
  },
  {
    id: "andetag-10",
    series: "original",
    number: 10,
    title: { sv: "Andetag no. 10", en: "Andetag no. 10" },
    year: 2023,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(10),
  },
  {
    id: "andetag-11",
    series: "original",
    number: 11,
    title: { sv: "Andetag no. 11", en: "Andetag no. 11" },
    year: 2023,
    dimensionsCm: { w: 99, h: 226 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(11),
  },
  {
    id: "andetag-12",
    series: "original",
    number: 12,
    title: { sv: "Andetag no. 12", en: "Andetag no. 12" },
    year: 2023,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: CHARLOTTESVILLE,
    images: origPhotos(12),
  },
  {
    id: "andetag-13",
    series: "original",
    number: 13,
    title: { sv: "Andetag no. 13", en: "Andetag no. 13" },
    year: 2023,
    dimensionsCm: { w: 90, h: 110 },
    format: "portrait",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(13),
  },
  {
    id: "andetag-14",
    series: "original",
    number: 14,
    title: { sv: "Andetag no. 14", en: "Andetag no. 14" },
    year: 2023,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(14),
  },
  {
    id: "andetag-15",
    series: "original",
    number: 15,
    title: { sv: "Andetag no. 15", en: "Andetag no. 15" },
    year: 2023,
    dimensionsCm: { w: 90, h: 110 },
    format: "portrait",
    status: "sold",
    location: SAN_JOSE_CR,
    images: origPhotos(15),
  },
  {
    id: "andetag-16",
    series: "original",
    number: 16,
    title: { sv: "Andetag no. 16", en: "Andetag no. 16" },
    year: 2023,
    dimensionsCm: { w: 90, h: 110 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(16),
  },
  {
    id: "andetag-17",
    series: "original",
    number: 17,
    title: { sv: "Andetag no. 17", en: "Andetag no. 17" },
    year: 2024,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: MIAMI,
    images: origPhotos(17),
  },
  {
    id: "andetag-18",
    series: "original",
    number: 18,
    title: { sv: "Andetag no. 18", en: "Andetag no. 18" },
    year: 2024,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "sold",
    location: FARO,
    images: origPhotos(18),
  },
  {
    id: "andetag-19",
    series: "original",
    number: 19,
    title: { sv: "Andetag no. 19", en: "Andetag no. 19" },
    year: 2024,
    dimensionsCm: { w: 90, h: 110 },
    format: "portrait",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(19),
  },
  {
    id: "andetag-20",
    series: "original",
    number: 20,
    title: { sv: "Andetag no. 20", en: "Andetag no. 20" },
    year: 2024,
    dimensionsCm: { w: 90, h: 110 },
    format: "portrait",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(20),
  },
  {
    id: "andetag-21",
    series: "original",
    number: 21,
    title: { sv: "Andetag no. 21", en: "Andetag no. 21" },
    year: 2024,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: STOCKHOLM,
    images: origPhotos(21),
  },
  {
    id: "andetag-22",
    series: "original",
    number: 22,
    title: { sv: "Andetag no. 22", en: "Andetag no. 22" },
    year: 2024,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(22),
  },
  {
    id: "andetag-23",
    series: "original",
    number: 23,
    title: { sv: "Andetag no. 23", en: "Andetag no. 23" },
    year: 2024,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "sold",
    location: SEATTLE,
    images: origPhotos(23),
  },
  {
    id: "andetag-24",
    series: "original",
    number: 24,
    title: { sv: "Andetag no. 24", en: "Andetag no. 24" },
    year: 2024,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(24),
  },
  {
    id: "andetag-25",
    series: "original",
    number: 25,
    title: { sv: "Andetag no. 25", en: "Andetag no. 25" },
    year: 2024,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(25),
  },
  {
    id: "andetag-26",
    series: "original",
    number: 26,
    title: { sv: "Andetag no. 26", en: "Andetag no. 26" },
    year: 2024,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(26),
  },
  {
    id: "andetag-27",
    series: "original",
    number: 27,
    title: { sv: "Andetag no. 27", en: "Andetag no. 27" },
    year: 2024,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "sold",
    location: GOTHENBURG,
    images: origPhotos(27),
  },
  {
    id: "andetag-28",
    series: "original",
    number: 28,
    title: { sv: "Andetag no. 28", en: "Andetag no. 28" },
    year: 2025,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(28),
  },
  {
    id: "andetag-29",
    series: "original",
    number: 29,
    title: { sv: "Andetag no. 29", en: "Andetag no. 29" },
    year: 2025,
    dimensionsCm: { w: 85, h: 110 },
    format: "portrait",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(29),
  },
  {
    id: "andetag-30",
    series: "original",
    number: 30,
    title: { sv: "Andetag no. 30", en: "Andetag no. 30" },
    year: 2025,
    dimensionsCm: { w: 99, h: 226 },
    format: "portrait",
    status: "sold",
    location: LISBON,
    images: origPhotos(30),
  },
  {
    id: "andetag-31",
    series: "original",
    number: 31,
    title: { sv: "Andetag no. 31", en: "Andetag no. 31" },
    year: 2025,
    dimensionsCm: { w: 110, h: 90 },
    format: "landscape",
    status: "for-sale",
    priceSek: 240000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(31),
  },
  {
    id: "andetag-35",
    series: "original",
    number: 35,
    title: { sv: "Andetag no. 35", en: "Andetag no. 35" },
    year: 2025,
    dimensionsCm: { w: 110, h: 190 },
    format: "portrait",
    status: "for-sale",
    priceSek: 393000,
    location: ANDETAG_MUSEUM,
    images: origPhotos(35),
  },

  // ── Gems ───────────────────────────────────────────────────────────────────
  // Each entry represents the series; `edition.available` = total size − sold units.
  // Images are placeholders until dedicated Gem photos are processed.
  {
    id: "gem-emerald",
    series: "gem",
    edition: { size: 10, available: 9 }, // 1/10 sold (Östersund)
    title: { sv: "Emerald", en: "Emerald" },
    year: 2025,
    dimensionsCm: { w: 60, h: 75 },
    format: "portrait",
    status: "for-sale",
    priceSek: 85000,
    location: ANDETAG_MUSEUM,
    images: [GEM_EMERALD_PH],
  },
  {
    id: "gem-ruby",
    series: "gem",
    edition: { size: 6, available: 6 }, // 0/6 sold
    title: { sv: "Ruby", en: "Ruby" },
    year: 2025,
    dimensionsCm: { w: 75, h: 60 },
    format: "landscape",
    status: "for-sale",
    priceSek: 85000,
    location: ANDETAG_MUSEUM,
    images: [GEM_RUBY_PH],
  },
  {
    id: "gem-sapphire",
    series: "gem",
    edition: { size: 6, available: 3 }, // 3/6 sold (Stockholm, New York, Stockholm)
    title: { sv: "Sapphire", en: "Sapphire" },
    year: 2025,
    dimensionsCm: { w: 75, h: 56 },
    format: "landscape",
    status: "for-sale",
    priceSek: 85000,
    location: ANDETAG_MUSEUM,
    images: [GEM_SAPPHIRE_PH],
  },
];

/** Planned total for the series (not all works exist yet). */
export const ANDETAG_ORIGINAL_TOTAL = 50;
export const ANDETAG_GEM_TOTAL = 3;

/** Catalogue totals derived from actual data (used by intro copy + schema). */
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
