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
    href: "/",
    matchPrefixes: ["/", "/stockholm/biljetter/", "/stockholm/sasongskort/", "/stockholm/presentkort/", "/stockholm/oppettider/", "/stockholm/hitta-hit/", "/stockholm/tillganglighet/", "/stockholm/fragor-svar/"],
    subMenu: [
      { label: "Biljetter", href: "/stockholm/biljetter/" },
      { label: "Säsongskort", href: "/stockholm/sasongskort/" },
      { label: "Presentkort", href: "/stockholm/presentkort/" },
      { label: "Öppettider", href: "/stockholm/oppettider/" },
      { label: "Hitta till oss", href: "/stockholm/hitta-hit/" },
      { label: "Tillgänglighet", href: "/stockholm/tillganglighet/" },
      { label: "Vanliga frågor", href: "/stockholm/fragor-svar/" },
    ],
  },
  {
    label: "Upplevelsen",
    href: "/stockholm/vilken-typ-av-upplevelse/",
    matchPrefixes: ["/stockholm/vilken-typ-av-upplevelse/", "/stockholm/dejt/", "/stockholm/art-yoga/", "/musik/"],
    subMenu: [
      { label: "Dejt på ANDETAG", href: "/stockholm/dejt/" },
      { label: "Art Yoga", href: "/stockholm/art-yoga/" },
      { label: "Musiken", href: "/musik/" },
    ],
  },
  {
    label: "Grupper",
    href: "/stockholm/gruppbokning/",
    matchPrefixes: ["/stockholm/gruppbokning/", "/stockholm/foretagsevent/"],
    subMenu: [{ label: "Företagsevent", href: "/stockholm/foretagsevent/" }],
  },
  {
    label: "Om ANDETAG",
    href: "/om-andetag/",
    matchPrefixes: ["/om-andetag/", "/optisk-fibertextil/", "/om-konstnarerna-malin-gustaf-tadaa/"],
    subMenu: [
      { label: "Textilen", href: "/optisk-fibertextil/" },
      { label: "Om konstnärerna", href: "/om-konstnarerna-malin-gustaf-tadaa/" },
      { label: "ANDETAG Berlin", href: "/en/berlin/" },
    ],
  },
];

function pathMatches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
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
    { code: "sv", href: "/", active: pathname === "/", label: "Svenska", flag: "🇸🇪" },
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
      href: "/stockholm/biljetter/",
      highlight: true,
    },
    languageFlags,
  };
}
