import { describe, expect, it } from "vitest";
import {
  BERLIN_SOCIAL_FACEBOOK_HREF,
  BERLIN_SOCIAL_INSTAGRAM_HREF,
  EN_BERLIN_STOCKHOLM_FOOTER_PATH,
} from "./footer-en-berlin";
import {
  DE_BERLIN_FOOTER_COL2_PATHS,
  DE_BERLIN_FOOTER_PATHS,
  DE_BERLIN_HOME_PATH,
  DE_BERLIN_FOOTER_NAV_PATHS,
  getGermanBerlinFooterModel,
} from "./footer-de-berlin";

describe("german berlin footer model", () => {
  it("uses two columns: Berlin + Stockholm (/en/stockholm/), then story links", () => {
    const model = getGermanBerlinFooterModel();
    expect(model.locationNavAriaLabel).toBe("Seiten ANDETAG Berlin");
    expect(model.locationLinkColumns[0]).toEqual([
      { href: DE_BERLIN_HOME_PATH, label: "ANDETAG Berlin" },
      { href: EN_BERLIN_STOCKHOLM_FOOTER_PATH, label: "ANDETAG Stockholm" },
    ]);
    expect(model.locationLinkColumns[1].map((l) => l.href)).toEqual([...DE_BERLIN_FOOTER_COL2_PATHS]);
    const flatNav = [...model.locationLinkColumns[0], ...model.locationLinkColumns[1]];
    expect(flatNav.map((l) => l.href)).toEqual([...DE_BERLIN_FOOTER_NAV_PATHS]);
    expect(DE_BERLIN_FOOTER_PATHS).toContain("/de/berlin/privacy/");
    expect(model.privacyLink).toEqual({ label: "Datenschutz", href: "/de/berlin/privacy/" });
  });

  it("uses local root-relative internal URLs", () => {
    const model = getGermanBerlinFooterModel();
    const internalLinks = [...model.locationLinkColumns[0], ...model.locationLinkColumns[1], model.privacyLink];

    internalLinks.forEach((link) => {
      expect(link.href.startsWith("/")).toBe(true);
      expect(link.href.includes("://")).toBe(false);
    });
  });

  it("uses andetag.berlin Instagram and Facebook", () => {
    const model = getGermanBerlinFooterModel();
    expect(model.socialLinks.find((l) => l.icon === "instagram")?.href).toBe(BERLIN_SOCIAL_INSTAGRAM_HREF);
    expect(model.socialLinks.find((l) => l.icon === "facebook")?.href).toBe(BERLIN_SOCIAL_FACEBOOK_HREF);
  });
});
