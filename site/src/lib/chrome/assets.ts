/** Responsive hero still (AVIF/WebP/JPEG). Source frame: `Desktop.00_00_00_00.Still002.jpg` (ImageMagick). */
const HERO_POSTER_BASE = "/wp-content/uploads/2024/11/stockholm-hero-poster";

export const HERO_SV_ASSETS = {
  /** Default OG / JSON-LD image: same 1920w JPEG as hero `<picture>` fallback (`seo.ts` → absolute `www` URL). */
  poster: `${HERO_POSTER_BASE}-1920w.jpg`,
  /** Legacy WebP path; video hero LCP preloads use AVIF in `[...slug].astro` (`lcpImagePreloads`) to match `<picture>` order. */
  posterPreload: `${HERO_POSTER_BASE}-960w.webp`,
  posterAvif960: `${HERO_POSTER_BASE}-960w.avif`,
  posterWebp960: `${HERO_POSTER_BASE}-960w.webp`,
  posterJpeg960: `${HERO_POSTER_BASE}-960w.jpg`,
  posterAvif1920: `${HERO_POSTER_BASE}-1920w.avif`,
  posterWebp1920: `${HERO_POSTER_BASE}-1920w.webp`,
  posterJpeg1920: `${HERO_POSTER_BASE}-1920w.jpg`,
  /** 1080p H.264, CRF ~26, capped ~3.5 Mbps, faststart (re-encoded from legacy Desktop.mp4). */
  video: "/wp-content/uploads/2024/12/stockholm-hero-desktop.mp4",
  /** 540p H.264 for narrow viewports; matches hero layout breakpoint 900px. */
  videoMobile: "/wp-content/uploads/2024/12/stockholm-hero-mobile.mp4",
} as const;

/** Portrait mobile still for `shared-hero-header.is-small` (≤767px). Source: `Mobile-BG.00_00_00_00.Still002.jpg`. */
const HEADER_SMALL_MOBILE_BASE =
  "/wp-content/uploads/2025/10/Mobile-BG.00_00_00_00.Still002-header-mobile";

export const HEADER_SMALL_SV_ASSETS = {
  mobile: {
    avif640: `${HEADER_SMALL_MOBILE_BASE}-640w.avif`,
    avif960: `${HEADER_SMALL_MOBILE_BASE}-960w.avif`,
    webp640: `${HEADER_SMALL_MOBILE_BASE}-640w.webp`,
    webp960: `${HEADER_SMALL_MOBILE_BASE}-960w.webp`,
    jpeg640: `${HEADER_SMALL_MOBILE_BASE}-640w.jpg`,
    jpeg960: `${HEADER_SMALL_MOBILE_BASE}-960w.jpg`,
  },
} as const;

/** Preload for LCP on `chrome-hdr-*-small` pages (mobile lab; matches `(max-width: 767px)` art direction). */
export const HEADER_SMALL_LCP_PRELOAD_WEBP = HEADER_SMALL_SV_ASSETS.mobile.webp960;

const BOOK_HERO_BASE = "/wp-content/uploads/2024/11/Andetag-21-399-scaled";

/** Mid-page “Boka” band (`HeroSection` cover) on Stockholm marketing pages. Source: `Andetag-21-399-scaled.jpg`. */
export const STOCKHOLM_BOOK_HERO_COVER = {
  jpeg960: `${BOOK_HERO_BASE}-hero-960w.jpg`,
  webp640: `${BOOK_HERO_BASE}-hero-640w.webp`,
  webp960: `${BOOK_HERO_BASE}-hero-960w.webp`,
} as const;
