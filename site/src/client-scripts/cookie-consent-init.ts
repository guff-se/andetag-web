import "vanilla-cookieconsent/dist/cookieconsent.css";
import "../styles/cookie-consent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import {
  createCookieConsentConfig,
  resolveCookieConsentLanguage,
} from "../lib/chrome/cookie-consent-config";

const language = resolveCookieConsentLanguage(document.documentElement.lang);

CookieConsent.run(createCookieConsentConfig(language));

document.addEventListener("click", (event) => {
  const trigger = (event.target as HTMLElement | null)?.closest("[data-consent-preferences]");
  if (!trigger) return;
  event.preventDefault();
  CookieConsent.showPreferences();
});
