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
  const menuItems: HeroMenuItem[] = MENU_DEFINITION.map((item) => ({
    label: item.label,
    href: item.href,
    active: pathMatches(pathname, item.matchPrefixes),
    subMenu: item.subMenu,
  }));

  const languageFlags: FlagItem[] = [
    {
      code: "sv",
      href: "/sv/stockholm/",
      active: pathname.startsWith("/sv/"),
      label: "Svenska",
      flag: "🇸🇪",
    },
    { code: "en", href: "/en/", active: pathname.startsWith("/en/"), label: "English", flag: "🇬🇧" },
    { code: "de", href: "/de/berlin/", active: pathname.startsWith("/de/"), label: "Deutsch", flag: "🇩🇪" },
  ];

  return {
    topLanguages: [
      { label: "English", href: "/en/" },
      { label: "Deutsch", href: "/de/berlin/" },
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
