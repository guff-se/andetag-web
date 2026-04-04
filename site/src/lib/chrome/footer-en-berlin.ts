import pageShellMeta from "../../data/page-shell-meta.json";

/** Berlin location social profiles (not andetag.museum). */
export const BERLIN_SOCIAL_INSTAGRAM_HREF = "https://www.instagram.com/andetag.berlin/" as const;
export const BERLIN_SOCIAL_FACEBOOK_HREF = "https://www.facebook.com/andetag.berlin" as const;

type FooterLink = {
  label: string;
  href: string;
};

type FooterSocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "pinterest" | "spotify";
};

export const EN_BERLIN_HOME_PATH = "/en/berlin/" as const;

/** English Stockholm home (footer column 1 peer of Berlin; same as **`hero-en-berlin.ts`**). */
export const EN_BERLIN_STOCKHOLM_FOOTER_PATH = "/en/stockholm/" as const;

/** Story links in footer column 2 (excluding Berlin home). */
export const EN_BERLIN_FOOTER_COL2_PATHS = [
  "/en/berlin/about-andetag/",
  "/en/berlin/music/",
  "/en/berlin/optical-fibre-textile/",
  "/en/berlin/about-the-artists-malin-gustaf-tadaa/",
] as const;

const EN_BERLIN_PRIVACY_PATH = "/en/berlin/privacy/" as const;

/** Every href shown in the English Berlin footer nav (two columns) plus privacy (bottom bar only). */
export const EN_BERLIN_FOOTER_NAV_PATHS = [
  EN_BERLIN_HOME_PATH,
  EN_BERLIN_STOCKHOLM_FOOTER_PATH,
  ...EN_BERLIN_FOOTER_COL2_PATHS,
] as const;

/** All paths validated against **`page-shell-meta.json`** (includes privacy shell). */
export const EN_BERLIN_FOOTER_PATHS = [...EN_BERLIN_FOOTER_NAV_PATHS, EN_BERLIN_PRIVACY_PATH] as const;

export type BerlinLocationFooterModel = {
  /** `aria-label` for the two-column location link nav. */
  locationNavAriaLabel: string;
  /** Section titles above each column (visit destinations | background story links). */
  columnHeadings: readonly [string, string];
  /** Column 1: Berlin + Stockholm; column 2: remaining Berlin pages. */
  locationLinkColumns: [FooterLink[], FooterLink[]];
  copyright: string;
  privacyLink: FooterLink;
  socialLinks: FooterSocialLink[];
};

const EN_COL2_LABELS: Record<(typeof EN_BERLIN_FOOTER_COL2_PATHS)[number], string> = {
  "/en/berlin/about-andetag/": "The artwork",
  "/en/berlin/music/": "the music",
  "/en/berlin/optical-fibre-textile/": "the textile",
  "/en/berlin/about-the-artists-malin-gustaf-tadaa/": "About the Artists",
};

/**
 * English Berlin footer: two **`shared-footer-col`** columns (privacy in **`shared-footer-privacy`**).
 */
export function getEnglishBerlinFooterModel(): BerlinLocationFooterModel {
  const pages = pageShellMeta.pages as Record<string, { title?: string }>;

  for (const path of EN_BERLIN_FOOTER_PATHS) {
    if (!pages[path]) {
      throw new Error(`footer-en-berlin: missing page-shell-meta entry for ${path}`);
    }
  }

  const column0: FooterLink[] = [
    { href: EN_BERLIN_HOME_PATH, label: "ANDETAG Berlin" },
    { href: EN_BERLIN_STOCKHOLM_FOOTER_PATH, label: "ANDETAG Stockholm" },
  ];

  const column1: FooterLink[] = EN_BERLIN_FOOTER_COL2_PATHS.map((path) => ({
    href: path,
    label: EN_COL2_LABELS[path],
  }));

  const socialLinks: FooterSocialLink[] = [
    { label: "Instagram", href: BERLIN_SOCIAL_INSTAGRAM_HREF, icon: "instagram" },
    { label: "Facebook", href: BERLIN_SOCIAL_FACEBOOK_HREF, icon: "facebook" },
    { label: "Pinterest", href: "https://pinterest.com/malintadaa", icon: "pinterest" },
    { label: "Spotify", href: "/spotify/", icon: "spotify" },
  ];

  return {
    locationNavAriaLabel: "Berlin pages",
    columnHeadings: ["Visit ANDETAG", "Background"] as const,
    locationLinkColumns: [column0, column1],
    copyright: "© 2026 Tadaa Art AB",
    privacyLink: { label: "Privacy policy", href: EN_BERLIN_PRIVACY_PATH },
    socialLinks,
  };
}
