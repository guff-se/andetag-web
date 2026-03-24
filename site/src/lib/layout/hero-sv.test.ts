import { describe, expect, it } from "vitest";
import { getSwedishHeroHeaderModel } from "./hero-sv";

describe("swedish hero header model", () => {
  it("marks Besok active on home path", () => {
    const model = getSwedishHeroHeaderModel("/sv/stockholm/");
    const besok = model.menuItems.find((item) => item.label === "Besök");

    expect(besok?.active).toBe(true);
    expect(model.ticketItem.highlight).toBe(true);
    expect(model.logoHomeHref).toBe("/sv/stockholm/");
  });

  it("marks grouped page active for subgroup path", () => {
    const model = getSwedishHeroHeaderModel("/sv/stockholm/dejt/");
    const upplevelsen = model.menuItems.find((item) => item.label === "Upplevelsen");

    expect(upplevelsen?.active).toBe(true);
  });

  it("returns right-end language flag options with current swedish active", () => {
    const model = getSwedishHeroHeaderModel("/sv/stockholm/");

    expect(model.languageFlags[0]?.code).toBe("sv");
    expect(model.languageFlags[0]?.active).toBe(true);
    expect(model.languageFlags.map((flag) => flag.code)).toEqual(["sv", "en", "de"]);
  });

  it("keeps Swedish characters in labels", () => {
    const model = getSwedishHeroHeaderModel("/sv/stockholm/");

    expect(model.menuItems.map((item) => item.label)).toContain("Besök");
    expect(model.menuItems.flatMap((item) => item.subMenu.map((subItem) => subItem.label))).toContain("Öppettider");
    expect(model.menuItems.flatMap((item) => item.subMenu.map((subItem) => subItem.label))).toContain("Om konstnärerna");
  });
});
