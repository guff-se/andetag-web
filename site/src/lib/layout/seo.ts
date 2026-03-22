import type { Language } from "./types";

const CANONICAL_HOST = "https://www.andetag.museum";

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
