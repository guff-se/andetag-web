import type { Destination, Language } from "./types";
import { HERO_SV_ASSETS } from "./assets";
import { buildCanonicalUrl } from "./seo";

const ORIGIN = "https://www.andetag.museum";

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

function inLanguageAttribute(language: Language): string {
  switch (language) {
    case "sv":
      return "sv-SE";
    case "en":
      return "en";
    case "de":
      return "de-DE";
    default: {
      const _e: never = language;
      return _e;
    }
  }
}

function stockholmMuseumDescription(language: Language): string {
  if (language === "sv") return STOCKHOLM_MUSEUM_DESCRIPTION_SV;
  return STOCKHOLM_MUSEUM_DESCRIPTION_EN;
}

function logoNode() {
  const logoPath = "/wp-content/uploads/2024/11/andetag-logo-white-shadow.png";
  const logoUrl = buildCanonicalUrl(logoPath);
  return {
    "@type": "ImageObject" as const,
    "@id": `${ORIGIN}/#logo`,
    url: logoUrl,
    contentUrl: logoUrl,
    caption: "ANDETAG logo",
  };
}

function heroImageNode() {
  const heroUrl = buildCanonicalUrl(HERO_SV_ASSETS.poster);
  return {
    "@type": "ImageObject" as const,
    "@id": `${ORIGIN}/#image-hero-stockholm`,
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
  const inLang = inLanguageAttribute(ctx.language);
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: ORIGIN + "/",
      name: "ANDETAG",
      inLanguage: inLang,
      publisher: { "@id": `${ORIGIN}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${ctx.pageUrl}#webpage`,
      url: ctx.pageUrl,
      name: ctx.pageTitle,
      description: ctx.pageDescription,
      inLanguage: inLang,
      isPartOf: { "@id": `${ORIGIN}/#website` },
    },
    {
      "@type": "Organization",
      "@id": `${ORIGIN}/#organization`,
      name: "ANDETAG",
      url: ORIGIN + "/",
      logo: { "@id": `${ORIGIN}/#logo` },
      sameAs: [...ORG_SAME_AS],
    },
    logoNode(),
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

function buildBerlinPlaceSchema(ctx: SchemaPageContext): { "@context": string; "@graph": object[] } {
  const inLang = inLanguageAttribute(ctx.language);
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: ORIGIN + "/",
      name: "ANDETAG",
      inLanguage: inLang,
      publisher: { "@id": `${ORIGIN}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${ctx.pageUrl}#webpage`,
      url: ctx.pageUrl,
      name: ctx.pageTitle,
      description: ctx.pageDescription,
      inLanguage: inLang,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#place-berlin` },
    },
    {
      "@type": "Organization",
      "@id": `${ORIGIN}/#organization`,
      name: "ANDETAG",
      url: ORIGIN + "/",
      logo: { "@id": `${ORIGIN}/#logo` },
      sameAs: [...ORG_SAME_AS],
    },
    logoNode(),
    {
      "@type": "Place",
      "@id": `${ORIGIN}/#place-berlin`,
      name: "ANDETAG Berlin",
      description: ctx.pageDescription,
      url: `${ORIGIN}/de/berlin/`,
      sameAs: [...ORG_SAME_AS],
    },
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

function buildStockholmVenueSchema(ctx: SchemaPageContext): { "@context": string; "@graph": object[] } {
  const inLang = inLanguageAttribute(ctx.language);
  const museumDescription = stockholmMuseumDescription(ctx.language);
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: ORIGIN + "/",
      name: "ANDETAG",
      inLanguage: inLang,
      publisher: { "@id": `${ORIGIN}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${ctx.pageUrl}#webpage`,
      url: ctx.pageUrl,
      name: ctx.pageTitle,
      description: ctx.pageDescription,
      inLanguage: inLang,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#museum-stockholm` },
      primaryImageOfPage: { "@id": `${ORIGIN}/#image-hero-stockholm` },
    },
    {
      "@type": "Organization",
      "@id": `${ORIGIN}/#organization`,
      name: "ANDETAG",
      url: ORIGIN + "/",
      logo: { "@id": `${ORIGIN}/#logo` },
      sameAs: [...ORG_SAME_AS],
    },
    heroImageNode(),
    {
      "@type": ["Museum", "TouristAttraction"],
      "@id": `${ORIGIN}/#museum-stockholm`,
      name: "ANDETAG Stockholm",
      description: museumDescription,
      url: `${ORIGIN}/sv/stockholm/`,
      parentOrganization: { "@id": `${ORIGIN}/#organization` },
      image: { "@id": `${ORIGIN}/#image-hero-stockholm` },
      logo: { "@id": `${ORIGIN}/#logo` },
      email: "info@tadaa.se",
      sameAs: [...STOCKHOLM_MUSEUM_SAME_AS],
      isAccessibleForFree: false,
      address: STOCKHOLM_ADDRESS,
      geo: STOCKHOLM_GEO,
      openingHoursSpecification: STOCKHOLM_OPENING_HOURS,
    },
    logoNode(),
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}
