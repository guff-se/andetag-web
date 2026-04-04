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

const BERLIN_HOME_PATH = "/de/berlin/";
const STOCKHOLM_SV_HOME_PATH = "/sv/stockholm/";

export function isGermanBerlinSharedHeroHeader(headerId: HeaderVariantId): boolean {
  return headerId === "chrome-hdr-de-berlin-hero" || headerId === "chrome-hdr-de-berlin-small";
}

/**
 * Primary nav matches `navigation.ts` **`de-main`** (rebuilt **`/de/berlin/...`** paths).
 * Hero center lines from **`site-html/de-berlin.html`** header (~217–220, ~315–318).
 */
export function getGermanBerlinHeroHeaderModel(pathname: string) {
  const chromeCtx = inferChromePathContext(pathname);

  const menuItems: HeroMenuItem[] = [
    {
      label: "ANDETAG Berlin",
      href: BERLIN_HOME_PATH,
      active: pathname === BERLIN_HOME_PATH,
      subMenu: [{ label: "ANDETAG Stockholm", href: STOCKHOLM_SV_HOME_PATH }],
    },
    {
      label: "Kunst",
      href: "/de/berlin/ueber-andetag/",
      active: pathname === "/de/berlin/ueber-andetag/",
      subMenu: [],
    },
    {
      label: "Musik",
      href: "/de/berlin/musik-von-andetag/",
      active: pathname === "/de/berlin/musik-von-andetag/",
      subMenu: [],
    },
    {
      label: "Textil",
      href: "/de/berlin/optische-fasertextil/",
      active: pathname === "/de/berlin/optische-fasertextil/",
      subMenu: [],
    },
    {
      label: "Die Künstler",
      href: "/de/berlin/die-kuenstler-malin-gustaf-tadaa/",
      active: pathname === "/de/berlin/die-kuenstler-malin-gustaf-tadaa/",
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
    logoHomeHref: "/de/berlin/",
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
    centerCopy: {
      titleLines: ["ANDETAG kommt", "nach Berlin"] as const,
      subtitleLines: ["Das Atemmuseum", "Eröffnung Herbst 2026"] as const,
    },
  };
}
