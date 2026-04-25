import type { Destination, FooterVariantId, HeaderVariantId, Language } from "../chrome/types";
import pageShellMeta from "../../data/page-shell-meta.json";
import { resolveMetaTokens } from "./page-shell-meta-tokens";

export type PageShellSourceMeta = {
  sourceFile: string;
  title: string;
  description: string;
  /** Optional root-relative share image (`/wp-content/...`). See `docs/content-model.md` `ogImage`. */
  ogImage?: string;
};

export type PageShellRoute = {
  canonicalPath: string;
  /** When set, `<link rel="canonical">` uses this path; URL bar stays `canonicalPath`. */
  seoCanonicalPath: string | null;
  language: Language;
  destination: Destination;
  headerVariantId: HeaderVariantId;
  footerVariantId: FooterVariantId;
  hreflang: Record<Language, string | null>;
  xDefaultPath: string | null;
  title: string;
  description: string;
  /** Root-relative OG image path, or null to use site default (Phase 7). */
  ogImage: string | null;
};

const metaPages = pageShellMeta.pages as Record<string, PageShellSourceMeta>;

/** Stockholm Swedish + English pairs. Order: [sv, en]. */
// NOTE: These pairs overlap with GLOBAL_TRILINGUAL_TOPICS in chrome-navigation-resolve.ts.
// If routes change, both tables must be updated. Consider deriving from a shared source.
export const STOCKHOLM_SV_EN_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/sv/stockholm/", "/en/stockholm/"],
  ["/sv/stockholm/musik/", "/en/stockholm/music/"],
  ["/sv/stockholm/om-andetag/", "/en/stockholm/about-andetag/"],
  [
    "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/",
    "/en/stockholm/about-the-artists-malin-gustaf-tadaa/",
  ],
  ["/sv/stockholm/optisk-fibertextil/", "/en/stockholm/optical-fibre-textile/"],
  ["/sv/stockholm/art-yoga/", "/en/stockholm/art-yoga/"],
  ["/sv/stockholm/besokaromdomen/", "/en/stockholm/visitor-reviews/"],
  ["/sv/stockholm/biljetter/", "/en/stockholm/tickets/"],
  ["/sv/stockholm/dejt/", "/en/stockholm/date/"],
  ["/sv/stockholm/foretagsevent/", "/en/stockholm/corporate-events/"],
  ["/sv/stockholm/fragor-svar/", "/en/stockholm/faq/"],
  ["/sv/stockholm/gruppbokning/", "/en/stockholm/group-bookings/"],
  ["/sv/stockholm/hitta-hit/", "/en/stockholm/how-to-find-us/"],
  ["/sv/stockholm/oppettider/", "/en/stockholm/opening-hours/"],
  ["/sv/stockholm/presentkort/", "/en/stockholm/giftcard/"],
  ["/sv/stockholm/sasongskort/", "/en/stockholm/season-pass/"],
  ["/sv/stockholm/tillganglighet/", "/en/stockholm/accessibility/"],
  ["/sv/stockholm/vilken-typ-av-upplevelse/", "/en/stockholm/what-kind-of-experience/"],
  ["/sv/stockholm/aktivitet-inomhus-stockholm/", "/en/stockholm/indoor-activity-stockholm/"],
  ["/sv/stockholm/att-gora-stockholm/", "/en/stockholm/things-to-do-stockholm/"],
  ["/sv/stockholm/event-stockholm/", "/en/stockholm/event-stockholm/"],
  ["/sv/stockholm/museum-stockholm/", "/en/stockholm/museum-stockholm/"],
  ["/sv/stockholm/npf-stockholm/", "/en/stockholm/neurodivergent-art/"],
  ["/sv/stockholm/utstallning-stockholm/", "/en/stockholm/exhibition-stockholm/"],
];

/** Berlin German story page ↔ Berlin English (same topic, different slug). Order: [de, en]. */
export const BERLIN_DE_EN_STORY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/de/berlin/ueber-andetag/", "/en/berlin/about-andetag/"],
  ["/de/berlin/die-kuenstler-malin-gustaf-tadaa/", "/en/berlin/about-the-artists-malin-gustaf-tadaa/"],
  ["/de/berlin/musik-von-andetag/", "/en/berlin/music/"],
  ["/de/berlin/optische-fasertextil/", "/en/berlin/optical-fibre-textile/"],
];

const PRIVACY_STOCKHOLM_SV = "/sv/stockholm/privacy/";
const PRIVACY_STOCKHOLM_EN = "/en/stockholm/privacy/";
const PRIVACY_BERLIN_DE = "/de/berlin/privacy/";
const PRIVACY_BERLIN_EN = "/en/berlin/privacy/";

/** Berlin English story URLs: canonical tag points at Stockholm English. */
const BERLIN_EN_STORY_SEO_CANONICAL: Readonly<Record<string, string>> = {
  "/en/berlin/about-andetag/": "/en/stockholm/about-andetag/",
  "/en/berlin/about-the-artists-malin-gustaf-tadaa/": "/en/stockholm/about-the-artists-malin-gustaf-tadaa/",
  "/en/berlin/music/": "/en/stockholm/music/",
  "/en/berlin/optical-fibre-textile/": "/en/stockholm/optical-fibre-textile/",
};

const svByEn = new Map<string, string>();
const enBySv = new Map<string, string>();
for (const [sv, en] of STOCKHOLM_SV_EN_PAIRS) {
  svByEn.set(en, sv);
  enBySv.set(sv, en);
}

const deBerlinByEnBerlin = new Map<string, string>();
const enBerlinByDeBerlin = new Map<string, string>();
for (const [de, en] of BERLIN_DE_EN_STORY_PAIRS) {
  deBerlinByEnBerlin.set(en, de);
  enBerlinByDeBerlin.set(de, en);
}

function layoutVariantsForPath(
  canonicalPath: string,
  language: Language,
  destination: Destination,
): { headerVariantId: HeaderVariantId; footerVariantId: FooterVariantId } {
  if (canonicalPath === "/en/") {
    return {
      headerVariantId: "chrome-hdr-en-header-selector",
      footerVariantId: "chrome-ftr-en-stockholm",
    };
  }

  if (
    canonicalPath === "/sv/stockholm/" ||
    canonicalPath === "/en/stockholm/" ||
    canonicalPath === "/de/berlin/"
  ) {
    const headerVariantId: HeaderVariantId =
      canonicalPath === "/sv/stockholm/"
        ? "chrome-hdr-sv-stockholm-hero"
        : canonicalPath === "/de/berlin/"
          ? "chrome-hdr-de-berlin-hero"
          : "chrome-hdr-en-stockholm-hero";
    return {
      headerVariantId,
      footerVariantId:
        canonicalPath === "/sv/stockholm/"
          ? "chrome-ftr-sv-stockholm"
          : canonicalPath === "/de/berlin/"
            ? "chrome-ftr-de-berlin"
            : "chrome-ftr-en-stockholm",
    };
  }

  if (canonicalPath === "/en/berlin/") {
    return {
      headerVariantId: "chrome-hdr-en-berlin-hero",
      footerVariantId: "chrome-ftr-en-berlin",
    };
  }

  if (canonicalPath.startsWith("/en/berlin/") && canonicalPath !== "/en/berlin/") {
    return {
      headerVariantId: "chrome-hdr-en-berlin-small",
      footerVariantId: "chrome-ftr-en-berlin",
    };
  }

  if (canonicalPath.startsWith("/de/berlin/") && canonicalPath !== "/de/berlin/") {
    return {
      headerVariantId: "chrome-hdr-de-berlin-small",
      footerVariantId: "chrome-ftr-de-berlin",
    };
  }

  if (language === "en") {
    return {
      headerVariantId: "chrome-hdr-en-stockholm-small",
      footerVariantId: "chrome-ftr-en-stockholm",
    };
  }

  return {
    headerVariantId: "chrome-hdr-sv-stockholm-small",
    footerVariantId: "chrome-ftr-sv-stockholm",
  };
}

function resolveSeo(canonicalPath: string): {
  hreflang: Record<Language, string | null>;
  xDefaultPath: string | null;
} {
  if (canonicalPath === "/en/") {
    return {
      hreflang: { sv: "/sv/stockholm/", en: "/en/", de: null },
      xDefaultPath: "/en/",
    };
  }

  if (canonicalPath === PRIVACY_STOCKHOLM_SV) {
    return {
      hreflang: { sv: PRIVACY_STOCKHOLM_SV, en: PRIVACY_STOCKHOLM_EN, de: null },
      xDefaultPath: PRIVACY_STOCKHOLM_EN,
    };
  }
  if (canonicalPath === PRIVACY_STOCKHOLM_EN) {
    return {
      hreflang: { sv: PRIVACY_STOCKHOLM_SV, en: PRIVACY_STOCKHOLM_EN, de: null },
      xDefaultPath: PRIVACY_STOCKHOLM_EN,
    };
  }
  if (canonicalPath === PRIVACY_BERLIN_DE) {
    return {
      hreflang: { sv: null, en: PRIVACY_BERLIN_EN, de: PRIVACY_BERLIN_DE },
      xDefaultPath: PRIVACY_BERLIN_EN,
    };
  }
  if (canonicalPath === PRIVACY_BERLIN_EN) {
    return {
      hreflang: { sv: null, en: PRIVACY_BERLIN_EN, de: PRIVACY_BERLIN_DE },
      xDefaultPath: PRIVACY_BERLIN_EN,
    };
  }

  if (canonicalPath === "/de/berlin/" || canonicalPath === "/en/berlin/") {
    return {
      hreflang: {
        sv: null,
        en: "/en/berlin/",
        de: "/de/berlin/",
      },
      xDefaultPath: "/en/berlin/",
    };
  }

  const enPeerStockholm = enBySv.get(canonicalPath);
  if (enPeerStockholm) {
    return {
      hreflang: { sv: canonicalPath, en: enPeerStockholm, de: null },
      xDefaultPath: enPeerStockholm,
    };
  }

  const svPeer = svByEn.get(canonicalPath);
  if (svPeer) {
    return {
      hreflang: { sv: svPeer, en: canonicalPath, de: null },
      xDefaultPath: canonicalPath,
    };
  }

  const enPeerBerlin = enBerlinByDeBerlin.get(canonicalPath);
  if (enPeerBerlin) {
    return {
      hreflang: { sv: null, en: enPeerBerlin, de: canonicalPath },
      xDefaultPath: enPeerBerlin,
    };
  }

  const dePeer = deBerlinByEnBerlin.get(canonicalPath);
  if (dePeer) {
    return {
      hreflang: { sv: null, en: canonicalPath, de: dePeer },
      xDefaultPath: canonicalPath,
    };
  }

  throw new Error(`Unhandled hreflang resolution for ${canonicalPath}`);
}

function languageAndDestinationForPath(canonicalPath: string): {
  language: Language;
  destination: Destination;
} {
  if (canonicalPath.startsWith("/de/")) {
    return { language: "de", destination: "berlin" };
  }
  if (canonicalPath.startsWith("/en/")) {
    if (canonicalPath.startsWith("/en/berlin")) {
      return { language: "en", destination: "berlin" };
    }
    return { language: "en", destination: "stockholm" };
  }
  if (canonicalPath.startsWith("/sv/")) {
    return { language: "sv", destination: "stockholm" };
  }
  throw new Error(`Unknown shell path for language mapping: ${canonicalPath}`);
}

export const PAGE_SHELL_PATHS = Object.keys(metaPages).sort();

export function getPageShellRoute(canonicalPath: string): PageShellRoute {
  const meta = metaPages[canonicalPath];
  if (!meta) {
    throw new Error(`Unknown shell path: ${canonicalPath}`);
  }

  const { language, destination } = languageAndDestinationForPath(canonicalPath);
  const { headerVariantId, footerVariantId } = layoutVariantsForPath(
    canonicalPath,
    language,
    destination,
  );
  const { hreflang, xDefaultPath } = resolveSeo(canonicalPath);
  const seoCanonicalPath = BERLIN_EN_STORY_SEO_CANONICAL[canonicalPath] ?? null;

  return {
    canonicalPath,
    seoCanonicalPath,
    language,
    destination,
    headerVariantId,
    footerVariantId,
    hreflang,
    xDefaultPath,
    title: resolveMetaTokens(meta.title, language),
    description: resolveMetaTokens(meta.description, language),
    ogImage: meta.ogImage ?? null,
  };
}

/** Paths served by `[...slug].astro` (all shells except root redirect in `index.astro`). */
export function slugParamForShellPath(canonicalPath: string): string {
  return canonicalPath.replace(/^\/+|\/+$/g, "");
}
