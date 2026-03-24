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
  href: string;
  active: boolean;
  subMenu: HeroSubMenuItem[];
};

type FlagItem = {
  code: "sv" | "en" | "de";
  href: string;
  active: boolean;
  label: string;
  flag: string;
};

const MENU_DEFINITION: Array<{
  label: string;
  href: string;
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
      { label: "Biljetter", href: "/sv/stockholm/biljetter/" },
      { label: "Säsongskort", href: "/sv/stockholm/sasongskort/" },
      { label: "Presentkort", href: "/sv/stockholm/presentkort/" },
      { label: "Öppettider", href: "/sv/stockholm/oppettider/" },
      { label: "Hitta till oss", href: "/sv/stockholm/hitta-hit/" },
      { label: "Tillgänglighet", href: "/sv/stockholm/tillganglighet/" },
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
      "/sv/musik/",
    ],
    subMenu: [
      { label: "Dejt på ANDETAG", href: "/sv/stockholm/dejt/" },
      { label: "Art Yoga", href: "/sv/stockholm/art-yoga/" },
      { label: "Musiken", href: "/sv/musik/" },
    ],
  },
  {
    label: "Grupper",
    href: "/sv/stockholm/gruppbokning/",
    matchPrefixes: ["/sv/stockholm/gruppbokning/", "/sv/stockholm/foretagsevent/"],
    subMenu: [{ label: "Företagsevent", href: "/sv/stockholm/foretagsevent/" }],
  },
  {
    label: "Om ANDETAG",
    href: "/sv/om-andetag/",
    matchPrefixes: [
      "/sv/om-andetag/",
      "/sv/optisk-fibertextil/",
      "/sv/om-konstnarerna-malin-gustaf-tadaa/",
    ],
    subMenu: [
      { label: "Textilen", href: "/sv/optisk-fibertextil/" },
      { label: "Om konstnärerna", href: "/sv/om-konstnarerna-malin-gustaf-tadaa/" },
      { label: "ANDETAG Berlin", href: "/en/berlin/" },
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
    href: item.href,
    active: pathMatches(pathname, item.matchPrefixes),
    subMenu: item.subMenu,
  }));

  const languageFlags: FlagItem[] = [
    {
      code: "sv",
      href: resolveChromeNavigationHref(pathname, { language: "sv" }),
      active: chromeCtx.language === "sv",
      label: "Svenska",
      flag: "🇸🇪",
    },
    {
      code: "en",
      href: resolveChromeNavigationHref(pathname, { language: "en" }),
      active: chromeCtx.language === "en",
      label: "English",
      flag: "🇬🇧",
    },
    {
      code: "de",
      href: resolveChromeNavigationHref(pathname, { language: "de" }),
      active: chromeCtx.language === "de",
      label: "Deutsch",
      flag: "🇩🇪",
    },
  ];

  return {
    logoHomeHref: "/sv/stockholm/",
    topLanguages: [
      { label: "English", href: resolveChromeNavigationHref(pathname, { language: "en" }) },
      { label: "Deutsch", href: resolveChromeNavigationHref(pathname, { language: "de" }) },
    ],
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
