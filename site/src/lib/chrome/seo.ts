import type { Language } from "./types";
import { HERO_SV_ASSETS } from "./assets";

const CANONICAL_HOST = "https://www.andetag.museum";

/** Open Graph `og:site_name` (matches `docs/content-model.md` shared `seo.siteName`). */
export const OG_SITE_NAME = "ANDETAG";

/** BCP47 values emitted in `<link rel="alternate" hreflang="…">` (see docs/phase-4-todo.md). */
export function languageToHreflangAttribute(language: Language): string {
  switch (language) {
    case "sv":
      return "sv-SE";
    case "en":
      return "en";
    case "de":
      return "de-DE";
    default: {
      const _exhaustive: never = language;
      return _exhaustive;
    }
  }
}

export function buildCanonicalUrl(canonicalPath: string): string {
  return `${CANONICAL_HOST}${canonicalPath}`;
}

/** Default share image: Stockholm hero still (self-hosted; `HERO_SV_ASSETS.poster`). */
export function defaultOgImageAbsoluteUrl(): string {
  return buildCanonicalUrl(HERO_SV_ASSETS.poster);
}

/** `og:locale` / `og:locale:alternate` use underscore form (common OG convention). */
export function languageToOgLocale(language: Language): string {
  switch (language) {
    case "sv":
      return "sv_SE";
    case "en":
      return "en_US";
    case "de":
      return "de_DE";
    default: {
      const _exhaustive: never = language;
      return _exhaustive;
    }
  }
}

/** Sibling locales that have a real hreflang URL (excludes `x-default`). */
export function ogLocaleAlternates(
  pageLanguage: Language,
  hreflang: Record<Language, string | null>,
): string[] {
  const out: string[] = [];
  for (const lang of ["sv", "en", "de"] as const) {
    if (lang === pageLanguage) continue;
    if (hreflang[lang] != null) out.push(languageToOgLocale(lang));
  }
  return out;
}

export function buildHreflangLinks(
  hreflang: Record<Language, string | null>,
  xDefaultPath: string | null,
) {
  const links = (Object.entries(hreflang) as Array<[Language, string | null]>)
    .filter((entry): entry is [Language, string] => entry[1] !== null)
    .map(([language, path]) => ({
      hreflang: languageToHreflangAttribute(language),
      href: buildCanonicalUrl(path),
    }));

  if (xDefaultPath) {
    links.push({
      hreflang: "x-default",
      href: buildCanonicalUrl(xDefaultPath),
    });
  }

  return links;
}
