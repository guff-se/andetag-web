import {
  CHROME_LANGUAGE_LABELS,
  getChromeTopLanguageAlternates,
  getLanguagesAvailableForDestination,
} from "./navigation";
import type { Language } from "./types";
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
  /** `null` when the top row is a non-link section heading. */
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

const MENU_DEFINITION: Array<{
  label: string;
  href?: string;
  matchPrefixes: string[];
  subMenu: HeroSubMenuItem[];
}> = [
  {
    label: "Besök",
    href: "/sv/stockholm/",
    matchPrefixes: [
      "/",
      "/sv/stockholm/",
      "/sv/stockholm/biljetter/",
      "/sv/stockholm/sasongskort/",
      "/sv/stockholm/presentkort/",
      "/sv/stockholm/oppettider/",
      "/sv/stockholm/hitta-hit/",
      "/sv/stockholm/tillganglighet/",
      "/sv/stockholm/fragor-svar/",
    ],
    subMenu: [
      { label: "ANDETAG", href: "/sv/stockholm/" },
      { label: "Biljetter", href: "/sv/stockholm/biljetter/" },
      { label: "Säsongskort", href: "/sv/stockholm/sasongskort/" },
      { label: "Presentkort", href: "/sv/stockholm/presentkort/" },
      { label: "Öppettider", href: "/sv/stockholm/oppettider/" },
      { label: "Tillgänglighet", href: "/sv/stockholm/tillganglighet/" },
      { label: "Hitta till oss", href: "/sv/stockholm/hitta-hit/" },
      { label: "Vanliga frågor", href: "/sv/stockholm/fragor-svar/" },
    ],
  },
  {
    label: "Upplevelsen",
    href: "/sv/stockholm/vilken-typ-av-upplevelse/",
    matchPrefixes: [
      "/sv/stockholm/vilken-typ-av-upplevelse/",
      "/sv/stockholm/dejt/",
      "/sv/stockholm/art-yoga/",
      "/sv/stockholm/npf-stockholm/",
    ],
    subMenu: [
      { label: "Hur är ANDETAG?", href: "/sv/stockholm/vilken-typ-av-upplevelse/" },
      { label: "Art Yoga", href: "/sv/stockholm/art-yoga/" },
      { label: "Dejt på ANDETAG", href: "/sv/stockholm/dejt/" },
      { label: "NPF-besökare", href: "/sv/stockholm/npf-stockholm/" },
    ],
  },
  {
    label: "Grupper",
    href: "/sv/stockholm/gruppbokning/",
    matchPrefixes: ["/sv/stockholm/gruppbokning/", "/sv/stockholm/foretagsevent/"],
    subMenu: [
      { label: "Gruppbokningar", href: "/sv/stockholm/gruppbokning/" },
      { label: "Företagsevent", href: "/sv/stockholm/foretagsevent/" },
    ],
  },
  {
    label: "Om",
    href: "/sv/stockholm/om-andetag/",
    matchPrefixes: [
      "/sv/stockholm/om-andetag/",
      "/sv/stockholm/optisk-fibertextil/",
      "/sv/stockholm/musik/",
      "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/",
    ],
    subMenu: [
      { label: "Om ANDETAG", href: "/sv/stockholm/om-andetag/" },
      { label: "Textilen", href: "/sv/stockholm/optisk-fibertextil/" },
      { label: "Musiken", href: "/sv/stockholm/musik/" },
      { label: "Om konstnärerna", href: "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/" },
    ],
  },
];

function pathMatches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }
    if (prefix === "/sv/stockholm/") {
      return pathname === "/sv/stockholm/";
    }
    return pathname.startsWith(prefix);
  });
}

export function getSwedishHeroHeaderModel(pathname: string) {
  const chromeCtx = inferChromePathContext(pathname);

  const menuItems: HeroMenuItem[] = MENU_DEFINITION.map((item) => ({
    label: item.label,
    href: item.href ?? null,
    active: pathMatches(pathname, item.matchPrefixes),
    subMenu: item.subMenu,
  }));

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
    logoHomeHref: "/sv/stockholm/",
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
    ticketItem: {
      label: "Biljetter",
      href: "/sv/stockholm/biljetter/",
      highlight: true,
    },
    languageFlags,
  };
}
