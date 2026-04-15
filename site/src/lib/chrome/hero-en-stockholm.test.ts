import { describe, expect, it } from "vitest";
import { getEnglishStockholmHeroHeaderModel } from "./hero-en-stockholm";

describe("english stockholm hero header model", () => {
  it("sends the English hub logo to /en/ and Stockholm chrome to /en/stockholm/", () => {
    expect(getEnglishStockholmHeroHeaderModel("/en/").logoHomeHref).toBe("/en/");
    expect(getEnglishStockholmHeroHeaderModel("/en/stockholm/tickets/").logoHomeHref).toBe("/en/stockholm/");
  });

  it("marks Visit active on the hub and ticket pages", () => {
    const hub = getEnglishStockholmHeroHeaderModel("/en/");
    expect(hub.menuItems[0]?.active).toBe(true);
    expect(hub.menuItems[0]?.href).toBe("/en/stockholm/");

    const tickets = getEnglishStockholmHeroHeaderModel("/en/stockholm/tickets/");
    expect(tickets.menuItems[0]?.active).toBe(true);
    expect(tickets.menuItems[0]?.label).toBe("Visit");
    expect(tickets.menuItems[0]?.href).toBe("/en/stockholm/");
  });

  it("lists only Stockholm-available languages in the flag strip", () => {
    const tickets = getEnglishStockholmHeroHeaderModel("/en/stockholm/tickets/");
    expect(tickets.languageFlags.map((f) => f.code)).toEqual(["sv", "en"]);
  });

  it("marks About active on English music shell", () => {
    const music = getEnglishStockholmHeroHeaderModel("/en/stockholm/music/");
    const about = music.menuItems.find((item) => item.label === "About");
    expect(about?.active).toBe(true);
  });

  it("marks The Experience active on NPF and SEO landing paths", () => {
    const npf = getEnglishStockholmHeroHeaderModel("/en/stockholm/neurodivergent-art/");
    expect(npf.menuItems.find((item) => item.label === "The Experience")?.active).toBe(true);

    const indoor = getEnglishStockholmHeroHeaderModel("/en/stockholm/indoor-activity-stockholm/");
    expect(indoor.menuItems.find((item) => item.label === "The Experience")?.active).toBe(true);
  });
});
