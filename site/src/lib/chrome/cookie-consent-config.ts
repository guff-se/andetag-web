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
      position: "bottom left";
      equalWeightButtons: false;
      flipButtons: false;
    };
    preferencesModal: {
      layout: "box";
      equalWeightButtons: false;
      flipButtons: false;
    };
  };
  onFirstConsent: () => void;
  onConsent: () => void;
  onChange: () => void;
};

declare global {
  interface Window {
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

function pushConsentUpdate(): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", buildConsentModeUpdate(getCategoryConsent()));
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

export function createCookieConsentConfig(language: SupportedLanguage): CookieConsentConfig {
  return {
    language: {
      default: language,
      translations: {
        sv: {
          consentModal: {
            title: "Vi anvander cookies",
            description:
              "Vi anvander cookies for att webbplatsen ska fungera och for anonym statistik/annonsering nar du tillater det.",
            acceptAllBtn: "Acceptera alla",
            acceptNecessaryBtn: "Endast nodvandiga",
            showPreferencesBtn: "Valj cookies",
          },
          preferencesModal: {
            title: "Cookieinstallningar",
            acceptAllBtn: "Acceptera alla",
            acceptNecessaryBtn: "Endast nodvandiga",
            savePreferencesBtn: "Spara val",
            closeIconLabel: "Stang",
            sections: [
              {
                title: "Varfor cookies?",
                description:
                  "Nodvandiga cookies kravs for grundfunktioner. Du kan ocksa tillata analys och marknadsforing.",
              },
              {
                title: "Nodvandiga",
                description:
                  "Kravs for att sidan ska fungera, till exempel sprakval och sparade samtyckesinstallningar.",
                linkedCategory: "necessary",
              },
              {
                title: "Analys",
                description: "Hjalper oss att forsta hur webbplatsen anvands.",
                linkedCategory: "analytics",
                cookieTable: {
                  headers: { name: "Namn", domain: "Domän", desc: "Beskrivning" },
                  body: [
                    { name: "_ga / _ga_*", domain: "www.andetag.museum", desc: "Google Analytics" },
                    { name: "vuid", domain: ".vimeo.com", desc: "Vimeo analytics i inbaddad video" },
                    { name: "s7", domain: ".spotify.com", desc: "Spotify analytics i inbaddad spelare" },
                  ],
                },
              },
              {
                title: "Marknadsforing",
                description: "Anvands for annonsering och konverteringsmatning.",
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
              "Cookies keep the site working. With your permission, we also use analytics and marketing cookies.",
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
              "Cookies halten die Website funktionsfahig. Mit deiner Zustimmung nutzen wir auch Analyse- und Marketing-Cookies.",
            acceptAllBtn: "Alle akzeptieren",
            acceptNecessaryBtn: "Nur notwendige",
            showPreferencesBtn: "Cookie-Einstellungen",
          },
          preferencesModal: {
            title: "Cookie-Einstellungen",
            acceptAllBtn: "Alle akzeptieren",
            acceptNecessaryBtn: "Nur notwendige",
            savePreferencesBtn: "Auswahl speichern",
            closeIconLabel: "Schliessen",
            sections: [
              {
                title: "Warum Cookies?",
                description:
                  "Notwendige Cookies sind fur Grundfunktionen erforderlich. Analyse und Marketing kannst du optional erlauben.",
              },
              {
                title: "Notwendig",
                description:
                  "Erforderlich fur die Website-Funktion, zum Beispiel Sprache und gespeicherte Einwilligung.",
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
                description: "Wird fur Werbung und Conversion-Messung verwendet.",
                linkedCategory: "marketing",
                cookieTable: {
                  headers: { name: "Name", domain: "Domain", desc: "Beschreibung" },
                  body: [
                    { name: "_gcl_au / _gcl_ls", domain: "www.andetag.museum", desc: "Google Ads" },
                    { name: "Meta Pixel", domain: "www.andetag.museum", desc: "Event uber GTM" },
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
        position: "bottom left",
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "box",
        equalWeightButtons: false,
        flipButtons: false,
      },
    },
    onFirstConsent: pushConsentUpdate,
    onConsent: pushConsentUpdate,
    onChange: pushConsentUpdate,
  };
}
