import type { Destination, Language } from "./types";
import { HERO_SV_ASSETS } from "./assets";
import { buildCanonicalUrl, CANONICAL_HOST, languageToHreflangAttribute } from "./seo";
import {
  STOCKHOLM_FEATURED_REVIEWS,
  STOCKHOLM_RATING,
} from "../content/stockholm-reviews";
import {
  STOCKHOLM_ART_YOGA_EVENT,
  STOCKHOLM_CURRENCY,
  STOCKHOLM_TICKETS,
} from "../content/stockholm-offers";
import { computeArtYogaOccurrenceSeriesIso } from "./art-yoga-next-occurrence";

/** Explicit dated Event nodes for Rich Results; refreshed each static build. */
const ART_YOGA_SCHEMA_WEEKS = 4;

/** Source: `site-html/en-stockholm-tickets.html` footer JSON-LD (`#andetag`). */
const STOCKHOLM_MUSEUM_SAME_AS = [
  "https://www.instagram.com/andetag.museum",
  "https://www.facebook.com/andetag.museum",
  "https://open.spotify.com/artist/3y4jmMvvoqfoYNIZxh30C9",
  "https://www.youtube.com/@andetag.museum",
  "https://maps.app.goo.gl/ocZXhrwofCo4djMm6",
  "https://www.tripadvisor.se/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html",
] as const;

/** Source: `site-html/stockholm-museum-stockholm.html` meta description. */
const STOCKHOLM_MUSEUM_DESCRIPTION_SV =
  "Ett stillsamt konstmuseum i Stockholm. ANDETAG vid Hötorget – ljusbaserad konst, närvaro och andning. Kvällsöppet museum i centrala Stockholm.";

/** Source: `site-html/en-stockholm-tickets.html` Museum `description` in footer JSON-LD. */
const STOCKHOLM_MUSEUM_DESCRIPTION_EN =
  "ANDETAG is a breathing museum and calm light-based art experience inside the Hötorget subway station in Stockholm. Visitors move through glowing textile installations synchronized with breath and sound, offering a mindful sensory journey.";

const ORG_SAME_AS = [
  "https://www.instagram.com/andetag.museum",
  "https://www.facebook.com/andetag.museum",
  "https://open.spotify.com/artist/3y4jmMvvoqfoYNIZxh30C9",
  "https://www.youtube.com/@andetag.museum",
] as const;

/** Source: `site-html/en-stockholm-tickets.html` footer JSON-LD. */
const STOCKHOLM_ADDRESS = {
  "@type": "PostalAddress" as const,
  streetAddress: "Kungsgatan 39",
  addressLocality: "Stockholm",
  postalCode: "111 56",
  addressCountry: "SE",
};

/** Source: `site-html/en-stockholm-tickets.html` footer JSON-LD. */
const STOCKHOLM_GEO = {
  "@type": "GeoCoordinates" as const,
  latitude: 59.3354879,
  longitude: 18.0640809,
};

/** Source: `site-html/en-stockholm-tickets.html` footer JSON-LD. */
const STOCKHOLM_OPENING_HOURS: object[] = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "12:00",
    closes: "20:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Sunday",
    opens: "12:00",
    closes: "17:00",
  },
];

function stockholmMuseumDescription(language: Language): string {
  if (language === "sv") return STOCKHOLM_MUSEUM_DESCRIPTION_SV;
  return STOCKHOLM_MUSEUM_DESCRIPTION_EN;
}

/** Canonical Stockholm hub URL for the active shell language. */
function stockholmMuseumPageUrl(language: Language): string {
  return buildCanonicalUrl(language === "sv" ? "/sv/stockholm/" : "/en/stockholm/");
}

function logoNode() {
  const logoPath = "/wp-content/uploads/2024/11/andetag-logo-white-shadow.png";
  const logoUrl = buildCanonicalUrl(logoPath);
  return {
    "@type": "ImageObject" as const,
    "@id": `${CANONICAL_HOST}/#logo`,
    url: logoUrl,
    contentUrl: logoUrl,
    caption: "ANDETAG logo",
  };
}

function heroImageNode() {
  const heroUrl = buildCanonicalUrl(HERO_SV_ASSETS.poster);
  return {
    "@type": "ImageObject" as const,
    "@id": `${CANONICAL_HOST}/#image-hero-stockholm`,
    url: heroUrl,
    contentUrl: heroUrl,
    caption: "ANDETAG Stockholm",
  };
}

export type SchemaPageContext = {
  /** Absolute URL matching `<link rel="canonical">`. */
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  language: Language;
  destination: Destination;
  /** Path with slashes, e.g. `/sv/stockholm/privacy/`. */
  canonicalPath: string;
};

/**
 * JSON-LD `@graph` for the current shell. Berlin pre-opening uses `Place` only (SEO manual §11).
 * Privacy routes use a minimal graph without venue entities.
 */
export function buildSchemaJsonLd(ctx: SchemaPageContext): { "@context": string; "@graph": object[] } {
  if (ctx.canonicalPath.includes("/privacy/")) {
    return buildPrivacySchema(ctx);
  }
  if (ctx.destination === "berlin") {
    return buildBerlinPlaceSchema(ctx);
  }
  return buildStockholmVenueSchema(ctx);
}

function buildPrivacySchema(ctx: SchemaPageContext): { "@context": string; "@graph": object[] } {
  const inLang = languageToHreflangAttribute(ctx.language);
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_HOST}/#website`,
      url: CANONICAL_HOST + "/",
      name: "ANDETAG",
      inLanguage: inLang,
      publisher: { "@id": `${CANONICAL_HOST}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${ctx.pageUrl}#webpage`,
      url: ctx.pageUrl,
      name: ctx.pageTitle,
      description: ctx.pageDescription,
      inLanguage: inLang,
      isPartOf: { "@id": `${CANONICAL_HOST}/#website` },
    },
    {
      "@type": "Organization",
      "@id": `${CANONICAL_HOST}/#organization`,
      name: "ANDETAG",
      url: CANONICAL_HOST + "/",
      logo: { "@id": `${CANONICAL_HOST}/#logo` },
      sameAs: [...ORG_SAME_AS],
    },
    logoNode(),
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

function buildBerlinPlaceSchema(ctx: SchemaPageContext): { "@context": string; "@graph": object[] } {
  const inLang = languageToHreflangAttribute(ctx.language);
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_HOST}/#website`,
      url: CANONICAL_HOST + "/",
      name: "ANDETAG",
      inLanguage: inLang,
      publisher: { "@id": `${CANONICAL_HOST}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${ctx.pageUrl}#webpage`,
      url: ctx.pageUrl,
      name: ctx.pageTitle,
      description: ctx.pageDescription,
      inLanguage: inLang,
      isPartOf: { "@id": `${CANONICAL_HOST}/#website` },
      about: { "@id": `${CANONICAL_HOST}/#place-berlin` },
    },
    {
      "@type": "Organization",
      "@id": `${CANONICAL_HOST}/#organization`,
      name: "ANDETAG",
      url: CANONICAL_HOST + "/",
      logo: { "@id": `${CANONICAL_HOST}/#logo` },
      sameAs: [...ORG_SAME_AS],
    },
    logoNode(),
    {
      "@type": "Place",
      "@id": `${CANONICAL_HOST}/#place-berlin`,
      name: "ANDETAG Berlin",
      description: ctx.pageDescription,
      url: `${CANONICAL_HOST}/de/berlin/`,
      sameAs: [...ORG_SAME_AS],
    },
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

function stockholmOffers(language: Language): object[] {
  const ticketsUrl = buildCanonicalUrl(
    language === "sv" ? "/sv/stockholm/biljetter/" : "/en/stockholm/tickets/",
  );
  return STOCKHOLM_TICKETS.flatMap((t) => {
    const name = language === "sv" ? t.nameSv : t.nameEn;
    const base: object = {
      "@type": "Offer",
      name,
      price: String(t.price),
      priceCurrency: STOCKHOLM_CURRENCY,
      url: ticketsUrl,
      availability: "https://schema.org/InStock",
    };
    if (t.daytimePrice == null) return [base];
    const daytimeName =
      language === "sv" ? `${name} (dagtid)` : `${name} (daytime)`;
    return [
      base,
      {
        "@type": "Offer",
        name: daytimeName,
        price: String(t.daytimePrice),
        priceCurrency: STOCKHOLM_CURRENCY,
        url: ticketsUrl,
        availability: "https://schema.org/InStock",
      },
    ];
  });
}

function artYogaEventNodes(language: Language): object[] {
  const ev = STOCKHOLM_ART_YOGA_EVENT;
  const name = language === "sv" ? ev.nameSv : ev.nameEn;
  const description = language === "sv" ? ev.descriptionSv : ev.descriptionEn;
  const url = buildCanonicalUrl(language === "sv" ? ev.pathSv : ev.pathEn);
  const yogaOffer = STOCKHOLM_TICKETS.find((t) => t.id === "art-yoga")!;
  const slots = computeArtYogaOccurrenceSeriesIso(ART_YOGA_SCHEMA_WEEKS);
  return slots.map(({ startDate, endDate }) => {
    const dayKey = startDate.slice(0, 10);
    return {
      "@type": "Event",
      "@id": `${CANONICAL_HOST}/#event-art-yoga-${dayKey}`,
      name,
      description,
      url,
      startDate,
      endDate,
      image: { "@id": `${CANONICAL_HOST}/#image-hero-stockholm` },
      duration: ev.durationIso,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      eventSchedule: {
        "@type": "Schedule",
        repeatFrequency: ev.schedule.repeatFrequency,
        byDay: ev.schedule.byDay,
        startTime: ev.schedule.startTime,
        endTime: ev.schedule.endTime,
        scheduleTimezone: ev.schedule.scheduleTimezone,
      },
      location: { "@id": `${CANONICAL_HOST}/#museum-stockholm` },
      organizer: { "@id": `${CANONICAL_HOST}/#organization` },
      performer: { "@type": "Person", name: ev.performer },
      offers: {
        "@type": "Offer",
        price: String(yogaOffer.price),
        priceCurrency: STOCKHOLM_CURRENCY,
        url,
        availability: "https://schema.org/InStock",
        validFrom: startDate,
      },
    };
  });
}

function buildStockholmVenueSchema(ctx: SchemaPageContext): { "@context": string; "@graph": object[] } {
  const inLang = languageToHreflangAttribute(ctx.language);
  const museumDescription = stockholmMuseumDescription(ctx.language);
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_HOST}/#website`,
      url: CANONICAL_HOST + "/",
      name: "ANDETAG",
      inLanguage: inLang,
      publisher: { "@id": `${CANONICAL_HOST}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${ctx.pageUrl}#webpage`,
      url: ctx.pageUrl,
      name: ctx.pageTitle,
      description: ctx.pageDescription,
      inLanguage: inLang,
      isPartOf: { "@id": `${CANONICAL_HOST}/#website` },
      about: { "@id": `${CANONICAL_HOST}/#museum-stockholm` },
      primaryImageOfPage: { "@id": `${CANONICAL_HOST}/#image-hero-stockholm` },
    },
    {
      "@type": "Organization",
      "@id": `${CANONICAL_HOST}/#organization`,
      name: "ANDETAG",
      url: CANONICAL_HOST + "/",
      logo: { "@id": `${CANONICAL_HOST}/#logo` },
      sameAs: [...ORG_SAME_AS],
    },
    heroImageNode(),
    {
      // Museum for semantics; LocalBusiness is required by Google's review-snippet list of valid
      // parent types for nested aggregateRating/review (Museum alone is not listed).
      "@type": ["Museum", "LocalBusiness"],
      "@id": `${CANONICAL_HOST}/#museum-stockholm`,
      name: "ANDETAG Stockholm",
      description: museumDescription,
      url: stockholmMuseumPageUrl(ctx.language),
      parentOrganization: { "@id": `${CANONICAL_HOST}/#organization` },
      image: { "@id": `${CANONICAL_HOST}/#image-hero-stockholm` },
      logo: { "@id": `${CANONICAL_HOST}/#logo` },
      email: "info@tadaa.se",
      sameAs: [...STOCKHOLM_MUSEUM_SAME_AS],
      isAccessibleForFree: false,
      address: STOCKHOLM_ADDRESS,
      geo: STOCKHOLM_GEO,
      openingHoursSpecification: STOCKHOLM_OPENING_HOURS,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: STOCKHOLM_RATING.ratingValue,
        reviewCount: STOCKHOLM_RATING.reviewCount,
        bestRating: STOCKHOLM_RATING.bestRating,
      },
      review: STOCKHOLM_FEATURED_REVIEWS.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        datePublished: r.datePublished,
        reviewBody: r.quote,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.ratingValue,
          bestRating: "5",
        },
      })),
      offers: stockholmOffers(ctx.language),
    },
    ...artYogaEventNodes(ctx.language),
    logoNode(),
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}
