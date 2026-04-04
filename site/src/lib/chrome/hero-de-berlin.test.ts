import { describe, expect, it } from "vitest";
import { getGermanBerlinHeroHeaderModel } from "./hero-de-berlin";

describe("german berlin hero header model", () => {
  it("includes center hero copy from de-berlin.html", () => {
    const model = getGermanBerlinHeroHeaderModel("/de/berlin/");
    expect(model.centerCopy).toEqual({
      titleLines: ["ANDETAG kommt", "nach Berlin"],
      subtitleLines: ["Das Atemmuseum", "Eröffnung Herbst 2026"],
    });
  });

  it("does not add a hero ticket slot", () => {
    const model = getGermanBerlinHeroHeaderModel("/de/berlin/");
    expect("ticketItem" in model).toBe(false);
  });
});
