import type { Destination, FooterVariantId, HeaderVariantId, Language } from "../chrome/types";
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
  headerVariantId: HeaderVariantId;
  footerVariantId: FooterVariantId;
  hreflang: Record<Language, string | null>;
  xDefaultPath: string | null;
  title: string;
  description: string;
};

const metaPages = pageShellMeta.pages as Record<string, PageShellSourceMeta>;

/** Stockholm (and shared Swedish) pages with Swedish + English equivalents. Order: [sv, en]. */
export const STOCKHOLM_SV_EN_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/sv/stockholm/", "/en/"],
  ["/sv/musik/", "/en/music/"],
  ["/sv/om-andetag/", "/en/about-andetag/"],
  ["/sv/om-konstnarerna-malin-gustaf-tadaa/", "/en/about-the-artists-malin-gustaf-tadaa/"],
  ["/sv/optisk-fibertextil/", "/en/optical-fibre-textile/"],
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
  ["/sv/stockholm/museum-stockholm/", "/en/stockholm/museum-stockholm/"],
  ["/sv/stockholm/npf-stockholm/", "/en/stockholm/npf-visitors/"],
  ["/sv/stockholm/utstallning-stockholm/", "/en/stockholm/exhibition-stockholm/"],
];

const EN_BRAND_PATHS = new Set<string>([
  "/en/about-andetag/",
  "/en/about-the-artists-malin-gustaf-tadaa/",
  "/en/music/",
  "/en/optical-fibre-textile/",
]);

const svByEn = new Map<string, string>();
const enBySv = new Map<string, string>();
for (const [sv, en] of STOCKHOLM_SV_EN_PAIRS) {
  svByEn.set(en, sv);
  enBySv.set(sv, en);
}

function layoutVariantsForPath(
  canonicalPath: string,
  language: Language,
  destination: Destination,
): { headerVariantId: HeaderVariantId; footerVariantId: FooterVariantId } {
  if (
    canonicalPath === "/sv/stockholm/" ||
    canonicalPath === "/en/" ||
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

  if (language === "de" && destination === "berlin") {
    return {
      headerVariantId: "chrome-hdr-de-berlin-hero",
      footerVariantId: "chrome-ftr-de-berlin",
    };
  }

  if (language === "en" && EN_BRAND_PATHS.has(canonicalPath)) {
    return {
      headerVariantId: "chrome-hdr-en-stockholm-brand",
      footerVariantId: "chrome-ftr-en-stockholm",
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

  if (canonicalPath === "/en/stockholm/") {
    return {
      hreflang: { sv: "/sv/stockholm/", en: "/en/stockholm/", de: null },
      xDefaultPath: "/sv/stockholm/",
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

/** Paths served by `[...slug].astro` (all shells except root redirect in `index.astro`). */
export function slugParamForShellPath(canonicalPath: string): string {
  return canonicalPath.replace(/^\/+|\/+$/g, "");
}
