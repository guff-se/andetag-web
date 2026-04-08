import { describe, expect, it } from "vitest";
import {
  buildConsentModeUpdate,
  resolveCookieConsentLanguage,
} from "./cookie-consent-config";

describe("cookie consent language resolution", () => {
  it("uses supported language codes directly", () => {
    expect(resolveCookieConsentLanguage("sv")).toBe("sv");
    expect(resolveCookieConsentLanguage("en")).toBe("en");
    expect(resolveCookieConsentLanguage("de")).toBe("de");
  });

  it("falls back to swedish when language is unknown", () => {
    expect(resolveCookieConsentLanguage("fr")).toBe("sv");
    expect(resolveCookieConsentLanguage("")).toBe("sv");
  });
});

describe("consent mode mapping", () => {
  it("grants only required storages per category", () => {
    expect(buildConsentModeUpdate({ analytics: true, marketing: false })).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    expect(buildConsentModeUpdate({ analytics: false, marketing: true })).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });
});
