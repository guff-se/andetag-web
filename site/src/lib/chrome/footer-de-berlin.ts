import pageShellMeta from "../../data/page-shell-meta.json";
import type { BerlinLocationFooterModel } from "./footer-en-berlin";
import {
  BERLIN_SOCIAL_FACEBOOK_HREF,
  BERLIN_SOCIAL_INSTAGRAM_HREF,
  EN_BERLIN_STOCKHOLM_FOOTER_PATH,
} from "./footer-en-berlin";

export const DE_BERLIN_HOME_PATH = "/de/berlin/" as const;

/** Same order as **`EN_BERLIN_FOOTER_COL2_PATHS`**: artwork, music, textile, artists. */
export const DE_BERLIN_FOOTER_COL2_PATHS = [
  "/de/berlin/ueber-andetag/",
  "/de/berlin/musik-von-andetag/",
  "/de/berlin/optische-fasertextil/",
  "/de/berlin/die-kuenstler-malin-gustaf-tadaa/",
] as const;

const DE_BERLIN_PRIVACY_PATH = "/de/berlin/privacy/" as const;

export const DE_BERLIN_FOOTER_NAV_PATHS = [
  DE_BERLIN_HOME_PATH,
  EN_BERLIN_STOCKHOLM_FOOTER_PATH,
  ...DE_BERLIN_FOOTER_COL2_PATHS,
] as const;

export const DE_BERLIN_FOOTER_PATHS = [...DE_BERLIN_FOOTER_NAV_PATHS, DE_BERLIN_PRIVACY_PATH] as const;

const DE_COL2_LABELS: Record<(typeof DE_BERLIN_FOOTER_COL2_PATHS)[number], string> = {
  "/de/berlin/ueber-andetag/": "Das Kunstwerk",
  "/de/berlin/musik-von-andetag/": "Musik",
  "/de/berlin/optische-fasertextil/": "Textil",
  "/de/berlin/die-kuenstler-malin-gustaf-tadaa/": "Die Künstler",
};

/**
 * German Berlin footer: same two-column shape as English (Stockholm → **`/en/stockholm/`**).
 */
export function getGermanBerlinFooterModel(): BerlinLocationFooterModel {
  const pages = pageShellMeta.pages as Record<string, { title?: string }>;

  for (const path of DE_BERLIN_FOOTER_PATHS) {
    if (!pages[path]) {
      throw new Error(`footer-de-berlin: missing page-shell-meta entry for ${path}`);
    }
  }

  const column0 = [
    { href: DE_BERLIN_HOME_PATH, label: "ANDETAG Berlin" },
    { href: EN_BERLIN_STOCKHOLM_FOOTER_PATH, label: "ANDETAG Stockholm" },
  ];

  const column1 = DE_BERLIN_FOOTER_COL2_PATHS.map((path) => ({
    href: path,
    label: DE_COL2_LABELS[path],
  }));

  const socialLinks: BerlinLocationFooterModel["socialLinks"] = [
    { label: "Instagram", href: BERLIN_SOCIAL_INSTAGRAM_HREF, icon: "instagram" },
    { label: "Facebook", href: BERLIN_SOCIAL_FACEBOOK_HREF, icon: "facebook" },
    { label: "Pinterest", href: "https://pinterest.com/malintadaa", icon: "pinterest" },
    { label: "Spotify", href: "/spotify/", icon: "spotify" },
  ];

  return {
    locationNavAriaLabel: "Seiten ANDETAG Berlin",
    columnHeadings: ["Visit ANDETAG", "Background"] as const,
    locationLinkColumns: [column0, column1],
    copyright: "© 2026 Tadaa Art AB",
    privacyLink: { label: "Datenschutz", href: DE_BERLIN_PRIVACY_PATH },
    consentPreferencesLabel: "Cookie-Einstellungen",
    socialLinks,
  };
}
