/** Responsive hero still (AVIF/WebP/JPEG). Source frame: `Desktop.00_00_00_00.Still002.jpg` (ImageMagick). */
const HERO_POSTER_BASE = "/wp-content/uploads/2024/11/stockholm-hero-poster";

/**
 * Default `og:image` / JSON-LD hero URL while **`www.andetag.museum`** is still legacy WordPress.
 * That host does not serve `stockholm-hero-poster-*.jpg` yet (404 HTML); crawlers need `image/jpeg`.
 * After Phase 8 static cutover on `www`, point this at `${HERO_POSTER_BASE}-1920w.jpg` (or keep this URL for share stability).
 */
const HERO_POSTER_OG_SCHEMA_PATH = "/wp-content/uploads/2024/11/Desktop.00_00_00_00.Still002.jpg";

export const HERO_SV_ASSETS = {
  /** Default OG / JSON-LD image (must resolve on live `www` for Facebook and others). */
  poster: HERO_POSTER_OG_SCHEMA_PATH,
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
