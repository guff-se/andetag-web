import type { Destination, Language } from "../chrome/types";
import { STOCKHOLM_SV_EN_PAIRS } from "./page-shell-registry";
import { ARTWORK_COLLECTION_PATHS } from "./artwork-shell-routes";
import { findArtworkByPublicSlug, artworkPublicSlug } from "../content/artworks";

/**
 * Site chrome: single resolver for language and destination controls.
 * Normative coupling rules: `docs/seo/url-architecture.md` §3.
 */

type TopicSlots = {
  svStockholm?: string;
  enStockholm?: string;
  englishBerlin?: string;
  germanBerlin?: string;
};

function normalizeTrailingSlash(path: string): string {
  if (path === "/" || path === "") return "/sv/stockholm/";
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return withSlash;
}

/** Legacy English hub path aliases to the Stockholm home shell path. */
const INPUT_PATH_ALIASES: Record<string, string> = {
  "/en/": "/en/stockholm/",
};

function normalizePathForLookup(canonicalPath: string): string {
  const n = normalizeTrailingSlash(canonicalPath);
  return INPUT_PATH_ALIASES[n] ?? n;
}

function normalizeEnStockholmPeer(enPath: string): string {
  return enPath === "/en/" ? "/en/stockholm/" : enPath;
}

function buildStockholmBilingualTopics(): TopicSlots[] {
  return STOCKHOLM_SV_EN_PAIRS.map(([sv, en]) => ({
    svStockholm: sv,
    enStockholm: normalizeEnStockholmPeer(en),
  }));
}

// NOTE: These topic paths overlap with STOCKHOLM_SV_EN_PAIRS in page-shell-registry.ts.
// If routes change, both tables must be updated. Consider deriving from a shared source.
const GLOBAL_TRILINGUAL_TOPICS: TopicSlots[] = [
  {
    svStockholm: "/sv/stockholm/om-andetag/",
    enStockholm: "/en/stockholm/about-andetag/",
    englishBerlin: "/en/berlin/about-andetag/",
    germanBerlin: "/de/berlin/ueber-andetag/",
  },
  {
    svStockholm: "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/",
    enStockholm: "/en/stockholm/about-the-artists-malin-gustaf-tadaa/",
    englishBerlin: "/en/berlin/about-the-artists-malin-gustaf-tadaa/",
    germanBerlin: "/de/berlin/die-kuenstler-malin-gustaf-tadaa/",
  },
  {
    svStockholm: "/sv/stockholm/musik/",
    enStockholm: "/en/stockholm/music/",
    englishBerlin: "/en/berlin/music/",
    germanBerlin: "/de/berlin/musik-von-andetag/",
  },
  {
    svStockholm: "/sv/stockholm/optisk-fibertextil/",
    enStockholm: "/en/stockholm/optical-fibre-textile/",
    englishBerlin: "/en/berlin/optical-fibre-textile/",
    germanBerlin: "/de/berlin/optische-fasertextil/",
  },
];

const BERLIN_HOME_TOPIC: TopicSlots = {
  englishBerlin: "/en/berlin/",
  germanBerlin: "/de/berlin/",
};

const PRIVACY_TOPIC: TopicSlots = {
  svStockholm: "/sv/stockholm/privacy/",
  enStockholm: "/en/stockholm/privacy/",
  englishBerlin: "/en/berlin/privacy/",
  germanBerlin: "/de/berlin/privacy/",
};

const ALL_TOPICS: TopicSlots[] = [
  ...buildStockholmBilingualTopics(),
  ...GLOBAL_TRILINGUAL_TOPICS,
  BERLIN_HOME_TOPIC,
  PRIVACY_TOPIC,
];

const TOPIC_PATH_INDEX = new Map<string, TopicSlots>();
for (const topic of ALL_TOPICS) {
  for (const p of Object.values(topic)) {
    if (p) TOPIC_PATH_INDEX.set(p, topic);
  }
}

export function inferChromePathContext(canonicalPath: string): {
  language: Language;
  destination: Destination;
} {
  const path = normalizeTrailingSlash(canonicalPath);
  if (path.startsWith("/de/")) {
    return { language: "de", destination: "berlin" };
  }
  if (path.startsWith("/en/")) {
    if (path.startsWith("/en/berlin")) {
      return { language: "en", destination: "berlin" };
    }
    return { language: "en", destination: "stockholm" };
  }
  if (path.startsWith("/sv/")) {
    return { language: "sv", destination: "stockholm" };
  }
  return { language: "sv", destination: "stockholm" };
}

function slotFor(lang: Language, dest: Destination): keyof TopicSlots | null {
  if (dest === "stockholm") {
    if (lang === "sv") return "svStockholm";
    if (lang === "en") return "enStockholm";
    return null;
  }
  if (lang === "en") return "englishBerlin";
  if (lang === "de") return "germanBerlin";
  return null;
}

function pickFromTopic(topic: TopicSlots, lang: Language, dest: Destination): string | null {
  const slot = slotFor(lang, dest);
  if (!slot) return null;
  const value = topic[slot];
  return value ?? null;
}

function findTopicForPath(canonicalPath: string): TopicSlots | undefined {
  return TOPIC_PATH_INDEX.get(normalizePathForLookup(canonicalPath));
}

export function defaultChromeHome(lang: Language, dest: Destination): string {
  if (dest === "stockholm") {
    return lang === "sv" ? "/sv/stockholm/" : "/en/stockholm/";
  }
  return lang === "de" ? "/de/berlin/" : "/en/berlin/";
}

/**
 * Resolve the target URL for chrome language or destination controls.
 * Pass exactly one of `language` or `destination` when simulating a single control change
 * (the implementation accepts both for tests and future combined updates).
 */
export function resolveChromeNavigationHref(
  canonicalPath: string,
  intent: Partial<{ language: Language; destination: Destination }>,
): string {
  const path = normalizeTrailingSlash(canonicalPath);
  const { language: curLang, destination: curDest } = inferChromePathContext(path);

  let lang = intent.language ?? curLang;
  let dest = intent.destination ?? curDest;

  if (intent.language !== undefined) {
    lang = intent.language;
    if (intent.language === "sv" && curDest === "berlin") {
      dest = "stockholm";
    }
    if (intent.language === "de" && curDest === "stockholm") {
      dest = "berlin";
    }
  }

  if (intent.destination !== undefined) {
    dest = intent.destination;
    if (dest === "stockholm" && lang === "de") {
      lang = "en";
    }
    if (dest === "berlin" && lang === "sv") {
      lang = "en";
    }
  }

  if (dest === "stockholm" && lang === "de") {
    lang = "en";
  }
  if (dest === "berlin" && lang === "sv") {
    lang = "en";
  }

  const topic = findTopicForPath(path);
  if (topic) {
    const hit = pickFromTopic(topic, lang, dest);
    if (hit) return hit;
  }

  const artworkPeer = resolveArtworkPeer(path, lang, dest);
  if (artworkPeer) return artworkPeer;

  return defaultChromeHome(lang, dest);
}

/**
 * Per-artwork pages and the collection live at location-free URLs (`SEO-0022`).
 * The language switcher must keep the visitor on the same artwork (or collection)
 * when toggling sv ↔ en. Berlin/German targets fall back to the default home —
 * there is no German artworks subsystem.
 */
function resolveArtworkPeer(
  path: string,
  lang: Language,
  dest: Destination,
): string | null {
  if (dest === "berlin" || lang === "de") return null;

  if (path === ARTWORK_COLLECTION_PATHS.sv || path === ARTWORK_COLLECTION_PATHS.en) {
    return lang === "sv" ? ARTWORK_COLLECTION_PATHS.sv : ARTWORK_COLLECTION_PATHS.en;
  }

  const m =
    path.match(/^\/en\/artworks\/([^/]+)\/$/) ??
    path.match(/^\/sv\/konstverk\/([^/]+)\/$/);
  if (!m) return null;

  const artwork = findArtworkByPublicSlug(m[1]!);
  if (!artwork) return null;

  const slug = artworkPublicSlug(artwork);
  return lang === "sv"
    ? `${ARTWORK_COLLECTION_PATHS.sv}${slug}/`
    : `${ARTWORK_COLLECTION_PATHS.en}${slug}/`;
}
