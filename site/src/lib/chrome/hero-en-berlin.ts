import type { HeaderVariantId, Language } from "./types";
import {
  CHROME_LANGUAGE_LABELS,
  getChromeTopLanguageAlternates,
  getLanguagesAvailableForDestination,
} from "./navigation";
import {
  inferChromePathContext,
  resolveChromeNavigationHref,
} from "../routes/chrome-navigation-resolve";

type HeroSubMenuItem = {
  label: string;
  href: string;
};

type HeroMenuItem = {
  label: string;
  href: string | null;
  active: boolean;
  subMenu: HeroSubMenuItem[];
};

type FlagItem = {
  code: Language;
  href: string;
  active: boolean;
  label: string;
  flag: string;
};

const FLAG_BY_LANGUAGE: Record<Language, string> = {
  sv: "🇸🇪",
  en: "🇬🇧",
  de: "🇩🇪",
};

/**
 * Primary nav labels and order from `site-html/en-berlin-en.html`
 * (`elementor-nav-menu` ~231–239). Parent href was `/en/berlin-en/`; legacy WP linked **ANDETAG Stockholm**
 * to **`/en/`**; rebuilt site uses **`/en/stockholm/`** (English Stockholm home). Content links were legacy **`/en/about-andetag/`** etc.;
 * Berlin pages use **`/en/berlin/...`**.
 */
const BERLIN_HOME_PATH = "/en/berlin/";
const STOCKHOLM_EN_HOME_PATH = "/en/stockholm/";

export function isEnglishBerlinSharedHeroHeader(headerId: HeaderVariantId): boolean {
  return headerId === "chrome-hdr-en-berlin-hero" || headerId === "chrome-hdr-en-berlin-small";
}

export function getEnglishBerlinHeroHeaderModel(pathname: string) {
  const chromeCtx = inferChromePathContext(pathname);

  const menuItems: HeroMenuItem[] = [
    {
      label: "ANDETAG Berlin",
      href: BERLIN_HOME_PATH,
      active: pathname === BERLIN_HOME_PATH,
      subMenu: [{ label: "ANDETAG Stockholm", href: STOCKHOLM_EN_HOME_PATH }],
    },
    {
      label: "Art",
      href: "/en/berlin/about-andetag/",
      active: pathname === "/en/berlin/about-andetag/",
      subMenu: [],
    },
    {
      label: "Music",
      href: "/en/berlin/music/",
      active: pathname === "/en/berlin/music/",
      subMenu: [],
    },
    {
      label: "Textile",
      href: "/en/berlin/optical-fibre-textile/",
      active: pathname === "/en/berlin/optical-fibre-textile/",
      subMenu: [],
    },
    {
      label: "About the Artists",
      href: "/en/berlin/about-the-artists-malin-gustaf-tadaa/",
      active: pathname === "/en/berlin/about-the-artists-malin-gustaf-tadaa/",
      subMenu: [],
    },
  ];

  const languageFlags: FlagItem[] = getLanguagesAvailableForDestination(chromeCtx.destination).map(
    (code) => ({
      code,
      href: resolveChromeNavigationHref(pathname, { language: code }),
      active: chromeCtx.language === code,
      label: CHROME_LANGUAGE_LABELS[code],
      flag: FLAG_BY_LANGUAGE[code],
    }),
  );

  return {
    logoHomeHref: "/en/berlin/",
    topLanguages: getChromeTopLanguageAlternates({
      canonicalPath: pathname,
      language: chromeCtx.language,
      destination: chromeCtx.destination,
    }),
    destinationOptions: [
      {
        label: "Stockholm",
        href: resolveChromeNavigationHref(pathname, { destination: "stockholm" }),
        active: chromeCtx.destination === "stockholm",
      },
      {
        label: "Berlin",
        href: resolveChromeNavigationHref(pathname, { destination: "berlin" }),
        active: chromeCtx.destination === "berlin",
      },
    ],
    menuItems,
    languageFlags,
    /**
     * Hero center headings from `site-html/en-berlin-en.html` (desktop ~215–219, mobile ~309–313),
     * with subtitle punctuation trimmed (no periods on the two lines).
     */
    centerCopy: {
      titleLines: ["ANDETAG is coming", "to Berlin"] as const,
      subtitleLines: ["The Breathing Museum", "Opening autumn 2026"] as const,
    },
  };
}
