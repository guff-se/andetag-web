/**
 * Per-artwork canonical paths and shell-route resolution.
 *
 * Per-artwork pages live at location-free URLs (`/en/artworks/<slug>/` and
 * `/sv/konstverk/<slug>/`). They use Stockholm chrome by Phase 1 default
 * (`docs/seo/decisions.md` SEO-0022: location-free artworks subsystem).
 *
 * They do **not** live in `page-shell-meta.json` because the body component
 * needs an `Artwork` prop. They are served by a dedicated dynamic Astro route
 * (`site/src/pages/en/artworks/[slug].astro` + sv equivalent), not by the
 * `[...slug].astro` shell.
 */
import type { Artwork } from "../content/artworks";
import { ARTWORKS, artworkPublicSlug } from "../content/artworks";
import type { Language } from "../chrome/types";
import type { PageShellRoute } from "./page-shell-registry";

export const ARTWORK_COLLECTION_PATHS = {
  sv: "/sv/konstverk/",
  en: "/en/artworks/",
} as const;

export type ArtworkPageLanguage = "sv" | "en";

export function artworkCanonicalPath(a: Artwork, language: ArtworkPageLanguage): string {
  return `${ARTWORK_COLLECTION_PATHS[language]}${artworkPublicSlug(a)}/`;
}

/** Title pattern for the page `<title>`. Plan §13 decision 2. */
function artworkPageTitle(a: Artwork, language: ArtworkPageLanguage): string {
  const formatLabel =
    language === "sv"
      ? a.format === "landscape"
        ? "liggande"
        : a.format === "portrait"
          ? "stående"
          : "diptyk"
      : a.format === "landscape"
        ? "landscape"
        : a.format === "portrait"
          ? "portrait"
          : "diptych";
  const head =
    a.series === "original"
      ? language === "sv"
        ? `Andetag no. ${a.number}`
        : `Andetag no. ${a.number}`
      : a.title[language];
  return `${head} (${formatLabel}, ${a.year}) | ANDETAG`;
}

function artworkPageDescription(a: Artwork, language: ArtworkPageLanguage): string {
  const dim = `${a.dimensionsCm.w} × ${a.dimensionsCm.h} cm`;
  const head =
    a.series === "original"
      ? language === "sv"
        ? `Andetag no. ${a.number}`
        : `Andetag no. ${a.number}`
      : a.title[language];
  if (language === "sv") {
    if (a.status === "sold") {
      return `${head}, textilskulptur i optisk fibertextil. ${dim}, ${a.year}. I en privat samling.`;
    }
    return `${head}, textilskulptur i optisk fibertextil. ${dim}, ${a.year}. Skriv till oss för förfrågan.`;
  }
  if (a.status === "sold") {
    return `${head}, optical fibre textile sculpture. ${dim}, ${a.year}. In a private collection.`;
  }
  return `${head}, optical fibre textile sculpture. ${dim}, ${a.year}. Write to us to inquire.`;
}

export function artworkShellRoute(a: Artwork, language: ArtworkPageLanguage): PageShellRoute {
  const canonicalPath = artworkCanonicalPath(a, language);
  const svPath = artworkCanonicalPath(a, "sv");
  const enPath = artworkCanonicalPath(a, "en");
  const hreflang: Record<Language, string | null> = {
    sv: svPath,
    en: enPath,
    de: null,
  };
  const headerVariantId =
    language === "sv" ? "chrome-hdr-sv-stockholm-small" : "chrome-hdr-en-stockholm-small";
  const footerVariantId =
    language === "sv" ? "chrome-ftr-sv-stockholm" : "chrome-ftr-en-stockholm";
  return {
    canonicalPath,
    seoCanonicalPath: null,
    language,
    destination: "stockholm",
    headerVariantId,
    footerVariantId,
    hreflang,
    xDefaultPath: enPath,
    title: artworkPageTitle(a, language),
    description: artworkPageDescription(a, language),
    ogImage: null,
  };
}

/** All canonical per-artwork paths (both languages) for sitemap/url-matrix parity. */
export function allArtworkCanonicalPaths(): readonly string[] {
  const paths: string[] = [];
  for (const a of ARTWORKS) {
    paths.push(artworkCanonicalPath(a, "sv"));
    paths.push(artworkCanonicalPath(a, "en"));
  }
  return paths;
}
