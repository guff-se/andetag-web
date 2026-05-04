type SupportedLanguage = "sv" | "en" | "de";

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

type ConsentModeValue = "granted" | "denied";

type ConsentModeUpdate = {
  analytics_storage: ConsentModeValue;
  ad_storage: ConsentModeValue;
  ad_user_data: ConsentModeValue;
  ad_personalization: ConsentModeValue;
};

const DEFAULT_LANGUAGE: SupportedLanguage = "sv";

type CookieConsentConfig = {
  revision?: number;
  language: {
    default: SupportedLanguage;
    translations: Record<SupportedLanguage, unknown>;
  };
  disablePageInteraction: boolean;
  autoShow: boolean;
  mode: "opt-in";
  categories: {
    necessary: { enabled: true; readOnly: true };
    analytics: { enabled: false; readOnly: false };
    marketing: { enabled: false; readOnly: false };
  };
  cookie: {
    name: "cc_cookie";
    domain: string;
    path: "/";
    sameSite: "Lax";
    secure: boolean;
    expiresAfterDays: number;
  };
  guiOptions: {
    consentModal: {
      layout: "box";
      position: "bottom right";
      equalWeightButtons: false;
      flipButtons: false;
    };
    preferencesModal: {
      layout: "box";
      equalWeightButtons: false;
      flipButtons: false;
    };
  };
  onFirstConsent: (param: { cookie: { categories: string[] } }) => void;
  onConsent: (param: { cookie: { categories: string[] } }) => void;
  onChange: (param: { cookie: { categories: string[] } }) => void;
};

declare global {
  interface Window {
    dataLayer?: object[];
    gtag?: (...args: unknown[]) => void;
    CookieConsent?: {
      acceptedCategory: (category: "analytics" | "marketing") => boolean;
    };
  }
}

function getDomainForConsentCookie(hostname: string): string {
  return hostname === "localhost" ? hostname : ".andetag.museum";
}

function getCategoryConsent(): ConsentState {
  return {
    analytics: Boolean(window.CookieConsent?.acceptedCategory("analytics")),
    marketing: Boolean(window.CookieConsent?.acceptedCategory("marketing")),
  };
}

/**
 * Use the `cookie.categories` array from vanilla-cookieconsent callbacks. In
 * `onFirstConsent` / `onConsent`, `acceptedCategory()` is not reliable yet; it
 * still reads the pre-update state, which produced all-denied consent updates.
 */
export function consentStateFromAcceptedCategories(
  categories: readonly string[],
): ConsentState {
  return {
    analytics: categories.includes("analytics"),
    marketing: categories.includes("marketing"),
  };
}

function pushConsentUpdate(acceptedCategories?: readonly string[]): void {
  if (typeof window.gtag !== "function") return;
  const consent = acceptedCategories
    ? consentStateFromAcceptedCategories(acceptedCategories)
    : getCategoryConsent();
  window.gtag("consent", "update", buildConsentModeUpdate(consent));
}

export function resolveCookieConsentLanguage(language: string | null | undefined): SupportedLanguage {
  if (language === "en" || language === "de" || language === "sv") return language;
  return DEFAULT_LANGUAGE;
}

export function buildConsentModeUpdate(consent: ConsentState): ConsentModeUpdate {
  return {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  };
}

/** Coarse bucket for first-consent analytics (no PII). */
export type CmpFirstConsentTier = "all" | "necessary_only" | "partial";

/**
 * Map CookieConsent `cookie.categories` to a single reporting tier.
 * `all` = both optional categories; `necessary_only` = neither; `partial` = one of the two.
 */
export function consentTierFromCategories(categories: readonly string[]): CmpFirstConsentTier {
  const analytics = categories.includes("analytics");
  const marketing = categories.includes("marketing");
  if (analytics && marketing) return "all";
  if (!analytics && !marketing) return "necessary_only";
  return "partial";
}

/**
 * Pushes a one-time measurement payload when the user saves consent for the first time.
 * GTM should map `event: "cmp_first_consent"` to GA4 (or another store) with a tag that
 * does not require `analytics_storage`, so "necessary only" visitors are still counted.
 */
function pushCmpFirstConsentDataLayer(categories: readonly string[]): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: object[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({
    event: "cmp_first_consent",
    cmp_tier: consentTierFromCategories(categories),
  });
}

export function createCookieConsentConfig(language: SupportedLanguage): CookieConsentConfig {
  return {
    revision: 2,
    language: {
      default: language,
      translations: {
        sv: {
          consentModal: {
            title: "Vi använder cookies",
            description:
              "Vi använder cookies för att webbplatsen ska fungera och för anonym statistik när du tillåter det.",
            acceptAllBtn: "Acceptera alla",
            acceptNecessaryBtn: "Endast nödvändiga",
            showPreferencesBtn: "Välj cookies",
          },
          preferencesModal: {
            title: "Cookieinställningar",
            acceptAllBtn: "Acceptera alla",
            acceptNecessaryBtn: "Endast nödvändiga",
            savePreferencesBtn: "Spara val",
            closeIconLabel: "Stäng",
            sections: [
              {
                title: "Varför cookies?",
                description:
                  "Nödvändiga cookies krävs för grundfunktioner. Du kan också tillåta analys och marknadsföring.",
              },
              {
                title: "Nödvändiga",
                description:
                  "Krävs för att sidan ska fungera, till exempel språkval och sparade samtyckesinställningar.",
                linkedCategory: "necessary",
              },
              {
                title: "Analys",
                description: "Hjälper oss att förstå hur webbplatsen används.",
                linkedCategory: "analytics",
                cookieTable: {
                  headers: { name: "Namn", domain: "Domän", desc: "Beskrivning" },
                  body: [
                    { name: "_ga / _ga_*", domain: "www.andetag.museum", desc: "Google Analytics" },
                    { name: "vuid", domain: ".vimeo.com", desc: "Vimeo analytics i inbäddad video" },
                    { name: "s7", domain: ".spotify.com", desc: "Spotify analytics i inbäddad spelare" },
                  ],
                },
              },
              {
                title: "Marknadsföring",
                description: "Används för annonsering och konverteringsmätning.",
                linkedCategory: "marketing",
                cookieTable: {
                  headers: { name: "Namn", domain: "Domän", desc: "Beskrivning" },
                  body: [
                    { name: "_gcl_au / _gcl_ls", domain: "www.andetag.museum", desc: "Google Ads" },
                    { name: "Meta Pixel", domain: "www.andetag.museum", desc: "Event via GTM" },
                  ],
                },
              },
            ],
          },
        },
        en: {
          consentModal: {
            title: "We use cookies",
            description:
              "Cookies keep the site working. With your permission, we also use analytics cookies.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Only necessary",
            showPreferencesBtn: "Cookie settings",
          },
          preferencesModal: {
            title: "Cookie settings",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Only necessary",
            savePreferencesBtn: "Save settings",
            closeIconLabel: "Close",
            sections: [
              {
                title: "Why cookies?",
                description:
                  "Necessary cookies are required for core functionality. You can also allow analytics and marketing cookies.",
              },
              {
                title: "Necessary",
                description:
                  "Required for the website to work, for example language and saved consent preferences.",
                linkedCategory: "necessary",
              },
              {
                title: "Analytics",
                description: "Helps us understand how the site is used.",
                linkedCategory: "analytics",
                cookieTable: {
                  headers: { name: "Name", domain: "Domain", desc: "Description" },
                  body: [
                    { name: "_ga / _ga_*", domain: "www.andetag.museum", desc: "Google Analytics" },
                    { name: "vuid", domain: ".vimeo.com", desc: "Vimeo analytics in embedded video" },
                    { name: "s7", domain: ".spotify.com", desc: "Spotify analytics in embedded player" },
                  ],
                },
              },
              {
                title: "Marketing",
                description: "Used for advertising and conversion measurement.",
                linkedCategory: "marketing",
                cookieTable: {
                  headers: { name: "Name", domain: "Domain", desc: "Description" },
                  body: [
                    { name: "_gcl_au / _gcl_ls", domain: "www.andetag.museum", desc: "Google Ads" },
                    { name: "Meta Pixel", domain: "www.andetag.museum", desc: "Event via GTM" },
                  ],
                },
              },
            ],
          },
        },
        de: {
          consentModal: {
            title: "Wir verwenden Cookies",
            description:
              "Cookies halten die Website funktionsfähig. Mit deiner Zustimmung nutzen wir auch Analyse-Cookies.",
            acceptAllBtn: "Alle akzeptieren",
            acceptNecessaryBtn: "Nur notwendige",
            showPreferencesBtn: "Cookie-Einstellungen",
          },
          preferencesModal: {
            title: "Cookie-Einstellungen",
            acceptAllBtn: "Alle akzeptieren",
            acceptNecessaryBtn: "Nur notwendige",
            savePreferencesBtn: "Auswahl speichern",
            closeIconLabel: "Schließen",
            sections: [
              {
                title: "Warum Cookies?",
                description:
                  "Notwendige Cookies sind für Grundfunktionen erforderlich. Analyse und Marketing kannst du optional erlauben.",
              },
              {
                title: "Notwendig",
                description:
                  "Erforderlich für die Website-Funktion, zum Beispiel Sprache und gespeicherte Einwilligung.",
                linkedCategory: "necessary",
              },
              {
                title: "Analyse",
                description: "Hilft uns zu verstehen, wie die Website genutzt wird.",
                linkedCategory: "analytics",
                cookieTable: {
                  headers: { name: "Name", domain: "Domain", desc: "Beschreibung" },
                  body: [
                    { name: "_ga / _ga_*", domain: "www.andetag.museum", desc: "Google Analytics" },
                    { name: "vuid", domain: ".vimeo.com", desc: "Vimeo-Analyse im eingebetteten Video" },
                    { name: "s7", domain: ".spotify.com", desc: "Spotify-Analyse im eingebetteten Player" },
                  ],
                },
              },
              {
                title: "Marketing",
                description: "Wird für Werbung und Conversion-Messung verwendet.",
                linkedCategory: "marketing",
                cookieTable: {
                  headers: { name: "Name", domain: "Domain", desc: "Beschreibung" },
                  body: [
                    { name: "_gcl_au / _gcl_ls", domain: "www.andetag.museum", desc: "Google Ads" },
                    { name: "Meta Pixel", domain: "www.andetag.museum", desc: "Event über GTM" },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    disablePageInteraction: false,
    autoShow: true,
    mode: "opt-in",
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        enabled: false,
        readOnly: false,
      },
      marketing: {
        enabled: false,
        readOnly: false,
      },
    },
    cookie: {
      name: "cc_cookie",
      domain: getDomainForConsentCookie(window.location.hostname),
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
      expiresAfterDays: 182,
    },
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "box",
        equalWeightButtons: false,
        flipButtons: false,
      },
    },
    onFirstConsent: ({ cookie }) => {
      pushConsentUpdate(cookie.categories);
      pushCmpFirstConsentDataLayer(cookie.categories);
    },
    onConsent: ({ cookie }) => {
      pushConsentUpdate(cookie.categories);
    },
    onChange: ({ cookie }) => {
      pushConsentUpdate(cookie.categories);
    },
  };
}
