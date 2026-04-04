import { describe, expect, it } from "vitest";
import { getEnglishBerlinHeroHeaderModel } from "./hero-en-berlin";

describe("english berlin hero header model", () => {
  it("includes center hero copy from en-berlin-en.html", () => {
    const model = getEnglishBerlinHeroHeaderModel("/en/berlin/");
    expect(model.centerCopy).toEqual({
      titleLines: ["ANDETAG is coming", "to Berlin"],
      subtitleLines: ["The Breathing Museum", "Opening autumn 2026"],
    });
  });

  it("does not add a hero ticket slot (no trailing berlin link)", () => {
    const model = getEnglishBerlinHeroHeaderModel("/en/berlin/");
    expect("ticketItem" in model).toBe(false);
  });
});
