import { describe, expect, it } from "vitest";
import {
  BERLIN_SOCIAL_FACEBOOK_HREF,
  BERLIN_SOCIAL_INSTAGRAM_HREF,
  EN_BERLIN_FOOTER_COL2_PATHS,
  EN_BERLIN_FOOTER_PATHS,
  EN_BERLIN_HOME_PATH,
  EN_BERLIN_STOCKHOLM_FOOTER_PATH,
  EN_BERLIN_FOOTER_NAV_PATHS,
  getEnglishBerlinFooterModel,
} from "./footer-en-berlin";

describe("english berlin footer model", () => {
  it("uses two columns: Berlin + Stockholm, then story links; privacy in bottom bar only", () => {
    const model = getEnglishBerlinFooterModel();
    expect(model.locationNavAriaLabel).toBe("Berlin pages");
    expect(model.columnHeadings).toEqual(["Visit ANDETAG", "Background"]);
    expect(model.locationLinkColumns[0]).toEqual([
      { href: EN_BERLIN_HOME_PATH, label: "ANDETAG Berlin" },
      { href: EN_BERLIN_STOCKHOLM_FOOTER_PATH, label: "ANDETAG Stockholm" },
    ]);
    expect(model.locationLinkColumns[1].map((l) => l.href)).toEqual([...EN_BERLIN_FOOTER_COL2_PATHS]);
    expect(model.locationLinkColumns[1][0]).toEqual({
      href: "/en/berlin/about-andetag/",
      label: "The artwork",
    });
    const flatNav = [...model.locationLinkColumns[0], ...model.locationLinkColumns[1]];
    expect(flatNav.map((l) => l.href)).toEqual([...EN_BERLIN_FOOTER_NAV_PATHS]);
    expect(EN_BERLIN_FOOTER_PATHS).toContain("/en/berlin/privacy/");
    expect(model.privacyLink).toEqual({ label: "Privacy policy", href: "/en/berlin/privacy/" });
    expect(model.consentPreferencesLabel).toBe("Consent Preferences");
    expect(model.copyright).toBe("© 2026 Tadaa Art AB");
  });

  it("uses local root-relative internal URLs", () => {
    const model = getEnglishBerlinFooterModel();
    const internalLinks = [...model.locationLinkColumns[0], ...model.locationLinkColumns[1], model.privacyLink];

    internalLinks.forEach((link) => {
      expect(link.href.startsWith("/")).toBe(true);
      expect(link.href.includes("://")).toBe(false);
    });
  });

  it("uses andetag.berlin Instagram and Facebook", () => {
    const model = getEnglishBerlinFooterModel();
    expect(model.socialLinks.find((l) => l.icon === "instagram")?.href).toBe(BERLIN_SOCIAL_INSTAGRAM_HREF);
    expect(model.socialLinks.find((l) => l.icon === "facebook")?.href).toBe(BERLIN_SOCIAL_FACEBOOK_HREF);
  });
});
