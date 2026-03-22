import type { Destination, FooterVariantId, HeaderVariantId, Language } from "../layout/types";
import pageShellMeta from "../../data/page-shell-meta.json";

export type PageShellSourceMeta = {
  sourceFile: string;
  title: string;
  description: string;
};

export type PageShellRoute = {
  canonicalPath: string;
  language: Language;
  destination: Destination;
  headerVariantId: HeaderVariantId | "header-4136";
  footerVariantId: FooterVariantId;
  hreflang: Record<Language, string | null>;
  xDefaultPath: string | null;
  title: string;
  description: string;
};

const metaPages = pageShellMeta.pages as Record<string, PageShellSourceMeta>;

/** Stockholm (and shared Swedish) pages with Swedish + English equivalents. Order: [sv, en]. */
const SV_EN_PAIRS: Array<[string, string]> = [
  ["/", "/en/"],
  ["/musik/", "/en/music/"],
  ["/om-andetag/", "/en/about-andetag/"],
  ["/om-konstnarerna-malin-gustaf-tadaa/", "/en/about-the-artists-malin-gustaf-tadaa/"],
  ["/optisk-fibertextil/", "/en/optical-fibre-textile/"],
  ["/stockholm/art-yoga/", "/en/stockholm/art-yoga/"],
  ["/stockholm/besokaromdomen/", "/en/stockholm/visitor-reviews/"],
  ["/stockholm/biljetter/", "/en/stockholm/tickets/"],
  ["/stockholm/dejt/", "/en/stockholm/date/"],
  ["/stockholm/foretagsevent/", "/en/stockholm/corporate-events/"],
  ["/stockholm/fragor-svar/", "/en/stockholm/faq/"],
  ["/stockholm/gruppbokning/", "/en/stockholm/group-bookings/"],
  ["/stockholm/hitta-hit/", "/en/stockholm/how-to-find-us/"],
  ["/stockholm/oppettider/", "/en/stockholm/opening-hours/"],
  ["/stockholm/presentkort/", "/en/stockholm/giftcard/"],
  ["/stockholm/sasongskort/", "/en/stockholm/season-pass/"],
  ["/stockholm/tillganglighet/", "/en/stockholm/accessibility/"],
  ["/stockholm/vilken-typ-av-upplevelse/", "/en/stockholm/what-kind-of-experience/"],
];

const SV_ONLY_STOCKHOLM = new Set<string>([
  "/stockholm/aktivitet-inomhus-stockholm/",
  "/stockholm/att-gora-stockholm/",
  "/stockholm/museum-stockholm/",
  "/stockholm/npf-stockholm/",
  "/stockholm/utstallning-stockholm/",
]);

const EN_BRAND_PATHS = new Set<string>([
  "/en/about-andetag/",
  "/en/about-the-artists-malin-gustaf-tadaa/",
  "/en/music/",
  "/en/optical-fibre-textile/",
]);

const svByEn = new Map<string, string>();
const enBySv = new Map<string, string>();
for (const [sv, en] of SV_EN_PAIRS) {
  svByEn.set(en, sv);
  enBySv.set(sv, en);
}

function layoutVariantsForPath(
  canonicalPath: string,
  language: Language,
  destination: Destination,
): { headerVariantId: HeaderVariantId | "header-4136"; footerVariantId: FooterVariantId } {
  if (canonicalPath === "/" || canonicalPath === "/en/" || canonicalPath === "/de/berlin/") {
    const header: HeaderVariantId =
      canonicalPath === "/" ? "header-192" : canonicalPath === "/en/" ? "header-918" : "header-4344";
    return {
      headerVariantId: header,
      footerVariantId:
        canonicalPath === "/" ? "footer-207" : canonicalPath === "/en/" ? "footer-3100" : "footer-4229",
    };
  }

  if (canonicalPath === "/en/berlin/") {
    return { headerVariantId: "header-4136", footerVariantId: "footer-3100" };
  }

  if (language === "de" && destination === "berlin") {
    return { headerVariantId: "header-4344", footerVariantId: "footer-4229" };
  }

  if (language === "en" && EN_BRAND_PATHS.has(canonicalPath)) {
    return { headerVariantId: "header-4287", footerVariantId: "footer-3100" };
  }

  if (language === "en") {
    return { headerVariantId: "header-3305", footerVariantId: "footer-3100" };
  }

  return { headerVariantId: "header-2223", footerVariantId: "footer-207" };
}

function resolveSeo(canonicalPath: string): {
  hreflang: Record<Language, string | null>;
  xDefaultPath: string | null;
} {
  if (canonicalPath === "/privacy/") {
    return {
      hreflang: { sv: "/privacy/", en: "/privacy/", de: "/privacy/" },
      xDefaultPath: "/privacy/",
    };
  }

  if (canonicalPath === "/de/berlin/" || canonicalPath === "/en/berlin/") {
    return {
      hreflang: {
        sv: null,
        en: "/en/berlin/",
        de: "/de/berlin/",
      },
      xDefaultPath: "/de/berlin/",
    };
  }

  const enPeer = enBySv.get(canonicalPath);
  if (enPeer) {
    return {
      hreflang: { sv: canonicalPath, en: enPeer, de: null },
      xDefaultPath: canonicalPath,
    };
  }

  const svPeer = svByEn.get(canonicalPath);
  if (svPeer) {
    return {
      hreflang: { sv: svPeer, en: canonicalPath, de: null },
      xDefaultPath: svPeer,
    };
  }

  if (SV_ONLY_STOCKHOLM.has(canonicalPath)) {
    return {
      hreflang: { sv: canonicalPath, en: null, de: null },
      xDefaultPath: canonicalPath,
    };
  }

  if (canonicalPath === "/en/stockholm/") {
    return {
      hreflang: { sv: null, en: "/en/stockholm/", de: null },
      xDefaultPath: "/",
    };
  }

  if (canonicalPath.startsWith("/de/") && canonicalPath !== "/de/berlin/") {
    return {
      hreflang: { sv: null, en: null, de: canonicalPath },
      xDefaultPath: "/de/berlin/",
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
  if (canonicalPath === "/privacy/") {
    return { language: "sv", destination: "stockholm" };
  }
  return { language: "sv", destination: "stockholm" };
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

  return {
    canonicalPath,
    language,
    destination,
    headerVariantId,
    footerVariantId,
    hreflang,
    xDefaultPath,
    title: meta.title,
    description: meta.description,
  };
}

/** Paths served by `[...slug].astro` (excludes `/`, handled by `index.astro`). */
export function slugParamForShellPath(canonicalPath: string): string {
  if (canonicalPath === "/") {
    throw new Error("Use index.astro for /");
  }
  return canonicalPath.replace(/^\/+|\/+$/g, "");
}
