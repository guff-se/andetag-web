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

export const CHROME_LANGUAGE_LABELS: Record<Language, string> = {
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

/** Languages with a real home (and chrome) for this destination; excludes impossible pairs (e.g. German Stockholm). */
export function getLanguagesAvailableForDestination(destination: Destination): Language[] {
  return (["sv", "en", "de"] as const).filter(
    (lang) => DESTINATION_HOME_PATHS[destination][lang] != null,
  );
}

export function getChromeTopLanguageAlternates(input: {
  canonicalPath: string;
  language: Language;
  destination: Destination;
}): Array<{ label: string; href: string }> {
  return getLanguagesAvailableForDestination(input.destination)
    .filter((lang) => lang !== input.language)
    .map((lang) => ({
      label: CHROME_LANGUAGE_LABELS[lang],
      href: resolveChromeNavigationHref(input.canonicalPath, { language: lang }),
    }));
}

const NAVIGATION_VARIANTS: Record<NavigationVariant["id"], NavigationVariant> = {
  "sv-main": {
    id: "sv-main",
    language: "sv",
    destination: "stockholm",
    items: [
      {
        label: "Besök",
        children: [
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
        children: [
          { label: "Hur är ANDETAG?", href: "/sv/stockholm/vilken-typ-av-upplevelse/" },
          { label: "Art Yoga", href: "/sv/stockholm/art-yoga/" },
          { label: "Dejt på ANDETAG", href: "/sv/stockholm/dejt/" },
          { label: "NPF-besökare", href: "/sv/stockholm/npf-stockholm/" },
        ],
      },
      {
        label: "Grupper",
        children: [
          { label: "Gruppbokningar", href: "/sv/stockholm/gruppbokning/" },
          { label: "Företagsevent", href: "/sv/stockholm/foretagsevent/" },
        ],
      },
      {
        label: "Om",
        children: [
          { label: "Om ANDETAG", href: "/sv/stockholm/om-andetag/" },
          { label: "Textilen", href: "/sv/stockholm/optisk-fibertextil/" },
          { label: "Musiken", href: "/sv/stockholm/musik/" },
          { label: "Om konstnärerna", href: "/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/" },
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
        children: [
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
        children: [
          { label: "What is it", href: "/en/stockholm/what-kind-of-experience/" },
          { label: "Art Yoga", href: "/en/stockholm/art-yoga/" },
          { label: "Romantic date", href: "/en/stockholm/date/" },
          { label: "NPF visitors", href: "/en/stockholm/npf-visitors/" },
        ],
      },
      {
        label: "Groups",
        children: [
          { label: "Group bookings", href: "/en/stockholm/group-bookings/" },
          { label: "Events", href: "/en/stockholm/corporate-events/" },
        ],
      },
      {
        label: "About",
        children: [
          { label: "About ANDETAG", href: "/en/stockholm/about-andetag/" },
          { label: "The Textile", href: "/en/stockholm/optical-fibre-textile/" },
          { label: "The Music", href: "/en/stockholm/music/" },
          { label: "The Artists", href: "/en/stockholm/about-the-artists-malin-gustaf-tadaa/" },
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
  return getLanguagesAvailableForDestination(input.destination).map((language) => ({
    value: language,
    label: CHROME_LANGUAGE_LABELS[language],
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
