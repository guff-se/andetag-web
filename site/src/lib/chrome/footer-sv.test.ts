import { describe, expect, it } from "vitest";
import { getSwedishFooterModel } from "./footer-sv";
import {
  FOOTER_SV_EXPECTED_CONSENT_PREFERENCES_LABEL,
  FOOTER_SV_EXPECTED_GROUPED_SECTION_TITLES,
  FOOTER_SV_EXPECTED_PRIVACY_LABEL,
  FOOTER_SV_EXPECTED_SECTION_TITLES,
} from "./fixtures";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

describe("swedish footer model", () => {
  it("keeps source-backed sv column headings and key links", () => {
    const model = getSwedishFooterModel();

    expect(model.sections.map((section) => normalize(section.title))).toEqual(
      FOOTER_SV_EXPECTED_SECTION_TITLES,
    );
    expect(model.groupedSections.map((section) => normalize(section.title))).toEqual(
      FOOTER_SV_EXPECTED_GROUPED_SECTION_TITLES,
    );
    expect(model.privacyLink.label).toBe(FOOTER_SV_EXPECTED_PRIVACY_LABEL);
    expect(model.consentPreferencesLabel).toBe(FOOTER_SV_EXPECTED_CONSENT_PREFERENCES_LABEL);
    expect(model.copyright).toBe("© 2026 Tadaa Art AB");
  });

  it("uses local root-relative internal URLs", () => {
    const model = getSwedishFooterModel();
    const internalLinks = [
      ...model.sections.flatMap((section) => section.links),
      ...model.groupedSections.flatMap((section) => section.links),
      ...model.seoLinks,
      model.privacyLink,
    ];

    internalLinks.forEach((link) => {
      expect(link.href.startsWith("/")).toBe(true);
      expect(link.href.includes("://")).toBe(false);
    });
  });
});
