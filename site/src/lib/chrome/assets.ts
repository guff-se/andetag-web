/** Responsive hero still (AVIF/WebP/JPEG). Source frame: `Desktop.00_00_00_00.Still002.jpg` (ImageMagick). */
const HERO_POSTER_BASE = "/wp-content/uploads/2024/11/stockholm-hero-poster";

export const HERO_SV_ASSETS = {
  /** Default OG / JSON-LD image: same 1920w JPEG as hero `<picture>` fallback (`seo.ts` → absolute `www` URL). */
  poster: `${HERO_POSTER_BASE}-1920w.jpg`,
  /** Preload for LCP: mobile-first WebP (matches `(max-width: 900px)` poster sources). */
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

export const HEADER_SMALL_SV_ASSETS = {
  desktopBackground: "/wp-content/uploads/2025/10/Desktop.00_00_00_00.Still002.jpg",
  mobileBackground: "/wp-content/uploads/2025/10/Mobile-BG.00_00_00_00.Still002.jpg",
} as const;

const BOOK_HERO_BASE = "/wp-content/uploads/2024/11/Andetag-21-399-scaled";

/** Mid-page “Boka” band (`HeroSection` cover) on Stockholm marketing pages. Source: `Andetag-21-399-scaled.jpg`. */
export const STOCKHOLM_BOOK_HERO_COVER = {
  jpeg960: `${BOOK_HERO_BASE}-hero-960w.jpg`,
  webp640: `${BOOK_HERO_BASE}-hero-640w.webp`,
  webp960: `${BOOK_HERO_BASE}-hero-960w.webp`,
} as const;
