import type { Language } from "./types";

const CANONICAL_HOST = "https://www.andetag.museum";

export function buildCanonicalUrl(canonicalPath: string): string {
  return `${CANONICAL_HOST}${canonicalPath}`;
}

export function buildHreflangLinks(hreflang: Record<Language, string | null>) {
  return (Object.entries(hreflang) as Array<[Language, string | null]>)
    .filter((entry): entry is [Language, string] => entry[1] !== null)
    .map(([language, path]) => ({
      hreflang: language,
      href: buildCanonicalUrl(path),
    }));
}
