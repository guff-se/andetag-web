import type {
  Destination,
  Language,
  NavigationVariant,
  SelectorOption,
  ViewportBucket,
} from "./types";
import { HEADER_VARIANTS, getResolvedHeaderVariantId } from "./variants";

const DESTINATION_LABELS: Record<Destination, string> = {
  stockholm: "Stockholm",
  berlin: "Berlin",
};

const LANGUAGE_LABELS: Record<Language, string> = {
  sv: "Svenska",
  en: "English",
  de: "Deutsch",
};

const DESTINATION_DEFAULT_LANGUAGE: Record<Destination, Language> = {
  stockholm: "sv",
  berlin: "en",
};

const DESTINATION_LANGUAGE_SUPPORT: Record<Destination, Language[]> = {
  stockholm: ["sv", "en"],
  berlin: ["en", "de"],
};

const DESTINATION_HOME_PATHS: Record<Destination, Record<Language, string | null>> = {
  stockholm: {
    sv: "/",
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
        href: "/stockholm/biljetter/",
        children: [
          { label: "Biljetter", href: "/stockholm/biljetter/" },
          { label: "Sasongskort", href: "/stockholm/sasongskort/" },
          { label: "Presentkort", href: "/stockholm/presentkort/" },
          { label: "Oppettider", href: "/stockholm/oppettider/" },
          { label: "Hitta till oss", href: "/stockholm/hitta-hit/" },
          { label: "Tillganglighet", href: "/stockholm/tillganglighet/" },
          { label: "Vanliga fragor", href: "/stockholm/fragor-svar/" },
        ],
      },
      {
        label: "Upplevelsen",
        href: "/stockholm/dejt/",
        children: [
          { label: "Dejt pa ANDETAG", href: "/stockholm/dejt/" },
          { label: "Art Yoga", href: "/stockholm/art-yoga/" },
          { label: "Musiken", href: "/musik/" },
        ],
      },
      {
        label: "Grupper",
        href: "/stockholm/foretagsevent/",
        children: [{ label: "Foretagsevent", href: "/stockholm/foretagsevent/" }],
      },
      {
        label: "Om ANDETAG",
        href: "/om-andetag/",
        children: [
          { label: "Textilen", href: "/textilen/" },
          { label: "Om konstnarerna", href: "/om-konstnarerna/" },
          { label: "ANDETAG Berlin", href: "/de/berlin/" },
        ],
      },
      { label: "Biljetter", href: "/stockholm/biljetter/", cta: true },
    ],
  },
  "en-main": {
    id: "en-main",
    language: "en",
    destination: "stockholm",
    items: [
      {
        label: "Visit",
        href: "/en/stockholm/tickets/",
        children: [
          { label: "Tickets", href: "/en/stockholm/tickets/" },
          { label: "Season Pass", href: "/en/stockholm/season-pass/" },
          { label: "Gift Cards", href: "/en/stockholm/gift-cards/" },
          { label: "Opening Hours", href: "/en/stockholm/opening-hours/" },
          { label: "How to Find Us", href: "/en/stockholm/how-to-find-us/" },
          { label: "Accessibility", href: "/en/stockholm/accessibility/" },
          { label: "FAQ", href: "/en/stockholm/faq/" },
        ],
      },
      {
        label: "The Experience",
        href: "/en/stockholm/romantic-date/",
        children: [
          { label: "Romantic Date", href: "/en/stockholm/romantic-date/" },
          { label: "Art Yoga", href: "/en/stockholm/art-yoga/" },
          { label: "The Music", href: "/en/music/" },
        ],
      },
      {
        label: "Groups",
        href: "/en/stockholm/corporate-events/",
        children: [{ label: "Corporate Events", href: "/en/stockholm/corporate-events/" }],
      },
      {
        label: "About ANDETAG",
        href: "/en/about-andetag/",
        children: [
          { label: "The Textile", href: "/en/optical-fibre-textile/" },
          { label: "About the Artists", href: "/en/about-the-artists-malin-gustaf-tadaa/" },
          { label: "ANDETAG Berlin", href: "/en/berlin/" },
        ],
      },
      { label: "Tickets", href: "/en/stockholm/tickets/", cta: true },
    ],
  },
  "en-brand": {
    id: "en-brand",
    language: "en",
    destination: "shared",
    items: [
      { label: "About ANDETAG", href: "/en/about-andetag/" },
      { label: "The Artists", href: "/en/about-the-artists-malin-gustaf-tadaa/" },
      { label: "The Music", href: "/en/music/" },
      { label: "The Textile", href: "/en/optical-fibre-textile/" },
      {
        label: "Locations",
        href: "/en/",
        children: [
          { label: "ANDETAG Stockholm", href: "/en/" },
          { label: "ANDETAG Berlin", href: "/en/berlin/" },
        ],
      },
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
        children: [{ label: "ANDETAG Stockholm", href: "/en/" }],
      },
      { label: "Kunst", href: "/de/kunst/" },
      { label: "Musik", href: "/de/musik/" },
      { label: "Textil", href: "/de/textil/" },
      { label: "Kunstler", href: "/de/kunstler/" },
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
  headerVariantId:
    | "header-192"
    | "header-918"
    | "header-4344"
    | "header-2223"
    | "header-3305"
    | "header-4287"
    | "header-4136";
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

export function getLanguageSelectorOptions(input: {
  language: Language;
  destination: Destination;
}): SelectorOption<Language>[] {
  const supportedLanguages = DESTINATION_LANGUAGE_SUPPORT[input.destination];

  return supportedLanguages.map((language) => ({
    value: language,
    label: LANGUAGE_LABELS[language],
    href: DESTINATION_HOME_PATHS[input.destination][language] ?? "/",
    active: language === input.language,
  }));
}

export function getDestinationSelectorOptions(input: {
  language: Language;
  destination: Destination;
}): SelectorOption<Destination>[] {
  return (Object.keys(DESTINATION_LABELS) as Destination[]).map((destination) => {
    const currentLanguageSupported = DESTINATION_LANGUAGE_SUPPORT[destination].includes(
      input.language,
    );
    const destinationLanguage = currentLanguageSupported
      ? input.language
      : DESTINATION_DEFAULT_LANGUAGE[destination];

    return {
      value: destination,
      label: DESTINATION_LABELS[destination],
      href: DESTINATION_HOME_PATHS[destination][destinationLanguage] ?? "/",
      active: destination === input.destination,
    };
  });
}
