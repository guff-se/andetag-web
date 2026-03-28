import type {
  Destination,
  HeaderVariantId,
  Language,
  LegacyHeaderAliasId,
  NavigationVariant,
  SelectorOption,
  ViewportBucket,
} from "./types";
import { HEADER_VARIANTS, getResolvedHeaderVariantId } from "./variants";
import { resolveChromeNavigationHref } from "../routes/chrome-navigation-resolve";

const DESTINATION_LABELS: Record<Destination, string> = {
  stockholm: "Stockholm",
  berlin: "Berlin",
};

const LANGUAGE_LABELS: Record<Language, string> = {
  sv: "Svenska",
  en: "English",
  de: "Deutsch",
};

const DESTINATION_HOME_PATHS: Record<Destination, Record<Language, string | null>> = {
  stockholm: {
    sv: "/sv/stockholm/",
    en: "/en/",
    de: null,
  },
  berlin: {
    sv: null,
    en: "/en/berlin/",
    de: "/de/berlin/",
  },
};

const NAVIGATION_VARIANTS: Record<NavigationVariant["id"], NavigationVariant> = {
  "sv-main": {
    id: "sv-main",
    language: "sv",
    destination: "stockholm",
    items: [
      {
        label: "Besok",
        href: "/sv/stockholm/biljetter/",
        children: [
          { label: "Biljetter", href: "/sv/stockholm/biljetter/" },
          { label: "Sasongskort", href: "/sv/stockholm/sasongskort/" },
          { label: "Presentkort", href: "/sv/stockholm/presentkort/" },
          { label: "Oppettider", href: "/sv/stockholm/oppettider/" },
          { label: "Hitta till oss", href: "/sv/stockholm/hitta-hit/" },
          { label: "Tillganglighet", href: "/sv/stockholm/tillganglighet/" },
          { label: "Vanliga fragor", href: "/sv/stockholm/fragor-svar/" },
        ],
      },
      {
        label: "Upplevelsen",
        href: "/sv/stockholm/dejt/",
        children: [
          { label: "Dejt pa ANDETAG", href: "/sv/stockholm/dejt/" },
          { label: "Art Yoga", href: "/sv/stockholm/art-yoga/" },
          { label: "Musiken", href: "/sv/stockholm/musik/" },
        ],
      },
      {
        label: "Grupper",
        href: "/sv/stockholm/foretagsevent/",
        children: [{ label: "Foretagsevent", href: "/sv/stockholm/foretagsevent/" }],
      },
      {
        label: "Om ANDETAG",
        href: "/sv/stockholm/om-andetag/",
        children: [
          { label: "Textilen", href: "/sv/stockholm/optisk-fibertextil/" },
          { label: "Om konstnarerna", href: "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/" },
          { label: "ANDETAG Berlin", href: "/de/berlin/" },
        ],
      },
      { label: "Biljetter", href: "/sv/stockholm/biljetter/", cta: true },
    ],
  },
  "en-main": {
    id: "en-main",
    language: "en",
    destination: "stockholm",
    items: [
      {
        label: "Visit",
        href: "/en/stockholm/",
        children: [
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
        children: [
          { label: "Romantic date", href: "/en/stockholm/date/" },
          { label: "NPF visitors", href: "/en/stockholm/npf-visitors/" },
          { label: "Art Yoga", href: "/en/stockholm/art-yoga/" },
          { label: "The Music", href: "/en/stockholm/music/" },
        ],
      },
      {
        label: "Groups",
        href: "/en/stockholm/group-bookings/",
        children: [
          { label: "Group bookings / private events", href: "/en/stockholm/group-bookings/" },
          { label: "Corporate events", href: "/en/stockholm/corporate-events/" },
        ],
      },
      {
        label: "About ANDETAG",
        href: "/en/stockholm/about-andetag/",
        children: [
          { label: "The Textile", href: "/en/stockholm/optical-fibre-textile/" },
          { label: "About the Artists", href: "/en/stockholm/about-the-artists-malin-gustaf-tadaa/" },
          { label: "ANDETAG Berlin", href: "/en/berlin/" },
        ],
      },
      { label: "Tickets", href: "/en/stockholm/tickets/", cta: true },
    ],
  },
  "en-main-berlin": {
    id: "en-main-berlin",
    language: "en",
    destination: "berlin",
    items: [
      {
        label: "About ANDETAG",
        href: "/en/berlin/about-andetag/",
        children: [
          { label: "About ANDETAG", href: "/en/berlin/about-andetag/" },
          { label: "About the Artists", href: "/en/berlin/about-the-artists-malin-gustaf-tadaa/" },
          { label: "The Music", href: "/en/berlin/music/" },
          { label: "The Textile", href: "/en/berlin/optical-fibre-textile/" },
          { label: "ANDETAG Stockholm", href: "/en/stockholm/" },
        ],
      },
      { label: "Berlin", href: "/en/berlin/", cta: true },
    ],
  },
  "de-main": {
    id: "de-main",
    language: "de",
    destination: "berlin",
    items: [
      {
        label: "ANDETAG Berlin",
        href: "/de/berlin/",
        children: [{ label: "ANDETAG Stockholm", href: "/sv/stockholm/" }],
      },
      { label: "Über ANDETAG", href: "/de/berlin/ueber-andetag/" },
      { label: "Die Künstler", href: "/de/berlin/die-kuenstler-malin-gustaf-tadaa/" },
      { label: "Musik", href: "/de/berlin/musik-von-andetag/" },
      { label: "Textil", href: "/de/berlin/optische-fasertextil/" },
      {
        label: "Anmelden",
        href: "/de/berlin/",
        cta: true,
      },
    ],
  },
};

type NavSelectionInput = {
  language: Language;
  destination: Destination;
  headerVariantId: HeaderVariantId | LegacyHeaderAliasId;
  viewport?: ViewportBucket;
};

export function getNavigationVariant(input: NavSelectionInput): NavigationVariant {
  const viewport = input.viewport ?? "desktop-tablet";
  const resolvedId = getResolvedHeaderVariantId(input.headerVariantId);
  const headerVariant = HEADER_VARIANTS[resolvedId];
  const variantId =
    viewport === "mobile" ? headerVariant.navVariantMobile : headerVariant.navVariantDesktop;

  return NAVIGATION_VARIANTS[variantId];
}

/** Home URL for the non-hero header brand link (same language and destination as the page). */
export function getBrandHomeHref(language: Language, destination: Destination): string {
  return DESTINATION_HOME_PATHS[destination][language] ?? "/sv/stockholm/";
}

export function getLanguageSelectorOptions(input: {
  language: Language;
  destination: Destination;
  canonicalPath: string;
}): SelectorOption<Language>[] {
  return (["sv", "en", "de"] as const).map((language) => ({
    value: language,
    label: LANGUAGE_LABELS[language],
    href: resolveChromeNavigationHref(input.canonicalPath, { language }),
    active: language === input.language,
  }));
}

export function getDestinationSelectorOptions(input: {
  language: Language;
  destination: Destination;
  canonicalPath: string;
}): SelectorOption<Destination>[] {
  return (Object.keys(DESTINATION_LABELS) as Destination[]).map((destination) => ({
    value: destination,
    label: DESTINATION_LABELS[destination],
    href: resolveChromeNavigationHref(input.canonicalPath, { destination }),
    active: destination === input.destination,
  }));
}
