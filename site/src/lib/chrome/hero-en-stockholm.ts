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
      { label: "ANDETAG", href: "/en/stockholm/" },
      { label: "Tickets", href: "/en/stockholm/tickets/" },
      { label: "Season pass", href: "/en/stockholm/season-pass/" },
      { label: "Gift cards", href: "/en/stockholm/giftcard/" },
      { label: "Opening hours", href: "/en/stockholm/opening-hours/" },
      { label: "Accessibility", href: "/en/stockholm/accessibility/" },
      { label: "How to find us", href: "/en/stockholm/how-to-find-us/" },
      { label: "FAQ", href: "/en/stockholm/faq/" },
    ],
  },
  {
    label: "The Experience",
    href: "/en/stockholm/what-kind-of-experience/",
    matchPrefixes: [
      "/en/stockholm/what-kind-of-experience/",
      "/en/stockholm/date/",
      "/en/stockholm/neurodivergent-art/",
      "/en/stockholm/indoor-activity-stockholm/",
      "/en/stockholm/museum-stockholm/",
      "/en/stockholm/event-stockholm/",
      "/en/stockholm/things-to-do-stockholm/",
      "/en/stockholm/exhibition-stockholm/",
      "/en/stockholm/art-yoga/",
      "/en/stockholm/visitor-reviews/",
    ],
    subMenu: [
      { label: "What is it", href: "/en/stockholm/what-kind-of-experience/" },
      { label: "Art Yoga", href: "/en/stockholm/art-yoga/" },
      { label: "Romantic date", href: "/en/stockholm/date/" },
      { label: "NPF visitors", href: "/en/stockholm/neurodivergent-art/" },
    ],
  },
  {
    label: "Groups",
    href: "/en/stockholm/group-bookings/",
    matchPrefixes: ["/en/stockholm/group-bookings/", "/en/stockholm/corporate-events/"],
    subMenu: [
      { label: "Group bookings", href: "/en/stockholm/group-bookings/" },
      { label: "Events", href: "/en/stockholm/corporate-events/" },
    ],
  },
  {
    label: "About",
    href: "/en/stockholm/about-andetag/",
    matchPrefixes: [
      "/en/stockholm/about-andetag/",
      "/en/stockholm/optical-fibre-textile/",
      "/en/stockholm/about-the-artists-malin-gustaf-tadaa/",
      "/en/stockholm/music/",
    ],
    subMenu: [
      { label: "About ANDETAG", href: "/en/stockholm/about-andetag/" },
      { label: "The Textile", href: "/en/stockholm/optical-fibre-textile/" },
      { label: "The Music", href: "/en/stockholm/music/" },
      { label: "The Artists", href: "/en/stockholm/about-the-artists-malin-gustaf-tadaa/" },
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
    logoHomeHref: pathname === "/en/" ? "/en/" : "/en/stockholm/",
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
      label: "Tickets",
      href: "/en/stockholm/tickets/",
      highlight: true,
    },
    languageFlags,
  };
}
