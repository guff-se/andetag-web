import { describe, expect, it } from "vitest";
import { getSwedishFooterModel } from "./footer-sv";

describe("swedish footer model", () => {
  it("keeps source-backed sv column headings and key links", () => {
    const model = getSwedishFooterModel();

    expect(model.sections.map((section) => section.title)).toEqual(["Besök ANDETAG", "Upplevelsen"]);
    expect(model.groupedSections.map((section) => section.title)).toEqual(["Grupper & företag", "Om"]);
    expect(model.privacyLink.label).toBe("Integritetspolicy");
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
