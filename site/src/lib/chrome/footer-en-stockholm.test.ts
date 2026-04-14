import { describe, expect, it } from "vitest";
import { getEnglishStockholmFooterModel } from "./footer-en-stockholm";
import {
  FOOTER_EN_EXPECTED_CONSENT_PREFERENCES_LABEL,
  FOOTER_EN_EXPECTED_GROUPED_SECTION_TITLES,
  FOOTER_EN_EXPECTED_PRIVACY_LABEL,
  FOOTER_EN_EXPECTED_SECTION_TITLES,
} from "./fixtures";

describe("english stockholm footer model", () => {
  it("keeps matrix-backed column headings and privacy label", () => {
    const model = getEnglishStockholmFooterModel();

    expect(model.sections.map((section) => section.title)).toEqual(FOOTER_EN_EXPECTED_SECTION_TITLES);
    expect(model.groupedSections.map((section) => section.title)).toEqual(FOOTER_EN_EXPECTED_GROUPED_SECTION_TITLES);
    expect(model.privacyLink.label).toBe(FOOTER_EN_EXPECTED_PRIVACY_LABEL);
    expect(model.consentPreferencesLabel).toBe(FOOTER_EN_EXPECTED_CONSENT_PREFERENCES_LABEL);
    expect(model.copyright).toBe("© 2026 Tadaa Art AB");
    expect(model.seoLinks.map((l) => l.label)).toEqual([
      "Activity",
      "Museum",
      "Things to do",
      "Event",
      "Exhibition",
    ]);

    const experience = model.sections[1]?.links ?? [];
    expect(experience.find((l) => l.href === "/en/stockholm/npf-visitors/")?.label).toBe("NPF visitors");
    expect(model.seoLinks.map((l) => l.href)).toEqual([
      "/en/stockholm/indoor-activity-stockholm/",
      "/en/stockholm/museum-stockholm/",
      "/en/stockholm/things-to-do-stockholm/",
      "/en/stockholm/event-stockholm/",
      "/en/stockholm/exhibition-stockholm/",
    ]);
  });

  it("uses local root-relative internal URLs", () => {
    const model = getEnglishStockholmFooterModel();
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
