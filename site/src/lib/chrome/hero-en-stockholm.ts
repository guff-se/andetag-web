import type { HeaderVariantId } from "./types";
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
    label: "Visit",
    href: "/en/stockholm/",
    matchPrefixes: [
      "/en/",
      "/en/stockholm/",
      "/en/stockholm/tickets/",
      "/en/stockholm/season-pass/",
      "/en/stockholm/giftcard/",
      "/en/stockholm/opening-hours/",
      "/en/stockholm/how-to-find-us/",
      "/en/stockholm/accessibility/",
      "/en/stockholm/faq/",
    ],
    subMenu: [
      { label: "Tickets", href: "/en/stockholm/tickets/" },
      { label: "Season pass", href: "/en/stockholm/season-pass/" },
      { label: "Gift cards", href: "/en/stockholm/giftcard/" },
      { label: "Opening hours", href: "/en/stockholm/opening-hours/" },
      { label: "How to find us", href: "/en/stockholm/how-to-find-us/" },
      { label: "Accessibility", href: "/en/stockholm/accessibility/" },
      { label: "FAQ", href: "/en/stockholm/faq/" },
    ],
  },
  {
    label: "The Experience",
    href: "/en/stockholm/what-kind-of-experience/",
    matchPrefixes: [
      "/en/stockholm/what-kind-of-experience/",
      "/en/stockholm/date/",
      "/en/stockholm/npf-visitors/",
      "/en/stockholm/indoor-activity-stockholm/",
      "/en/stockholm/museum-stockholm/",
      "/en/stockholm/things-to-do-stockholm/",
      "/en/stockholm/exhibition-stockholm/",
      "/en/stockholm/art-yoga/",
      "/en/stockholm/visitor-reviews/",
      "/en/music/",
    ],
    subMenu: [
      { label: "Romantic date", href: "/en/stockholm/date/" },
      { label: "NPF visitors", href: "/en/stockholm/npf-visitors/" },
      { label: "Art Yoga", href: "/en/stockholm/art-yoga/" },
      { label: "The Music", href: "/en/music/" },
    ],
  },
  {
    label: "Groups",
    href: "/en/stockholm/group-bookings/",
    matchPrefixes: ["/en/stockholm/group-bookings/", "/en/stockholm/corporate-events/"],
    subMenu: [
      { label: "Group bookings / private events", href: "/en/stockholm/group-bookings/" },
      { label: "Corporate events", href: "/en/stockholm/corporate-events/" },
    ],
  },
  {
    label: "About ANDETAG",
    href: "/en/about-andetag/",
    matchPrefixes: [
      "/en/about-andetag/",
      "/en/optical-fibre-textile/",
      "/en/about-the-artists-malin-gustaf-tadaa/",
    ],
    subMenu: [
      { label: "The Textile", href: "/en/optical-fibre-textile/" },
      { label: "About the Artists", href: "/en/about-the-artists-malin-gustaf-tadaa/" },
      { label: "ANDETAG Berlin", href: "/en/berlin/" },
    ],
  },
];

function pathMatches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => {
    if (prefix === "/en/") {
      return pathname === "/en/";
    }
    if (prefix === "/en/stockholm/") {
      return pathname === "/en/stockholm/";
    }
    return pathname.startsWith(prefix);
  });
}

export function isEnglishStockholmSharedHeroHeader(headerId: HeaderVariantId): boolean {
  return headerId === "chrome-hdr-en-stockholm-hero" || headerId === "chrome-hdr-en-stockholm-small";
}

export function getEnglishStockholmHeroHeaderModel(pathname: string) {
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
    logoHomeHref: pathname === "/en/" ? "/en/" : "/en/stockholm/",
    topLanguages: [
      { label: "Svenska", href: resolveChromeNavigationHref(pathname, { language: "sv" }) },
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
      label: "Tickets",
      href: "/en/stockholm/tickets/",
      highlight: true,
    },
    languageFlags,
  };
}
