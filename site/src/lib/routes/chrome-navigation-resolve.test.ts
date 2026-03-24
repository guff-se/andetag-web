import { describe, expect, it } from "vitest";
import { resolveChromeNavigationHref } from "./chrome-navigation-resolve";

describe("resolveChromeNavigationHref (Phase 6 chrome)", () => {
  it("selecting Swedish from a Berlin path moves to Stockholm (same topic when mapped)", () => {
    expect(resolveChromeNavigationHref("/de/ueber-andetag/", { language: "sv" })).toBe(
      "/sv/om-andetag/",
    );
  });

  it("selecting Swedish from Berlin home without a Swedish peer goes to Stockholm home", () => {
    expect(resolveChromeNavigationHref("/de/berlin/", { language: "sv" })).toBe("/sv/stockholm/");
  });

  it("selecting German from a Stockholm path moves to Berlin (same topic when mapped)", () => {
    expect(resolveChromeNavigationHref("/sv/musik/", { language: "de" })).toBe(
      "/de/musik-von-andetag/",
    );
  });

  it("selecting Stockholm while language is German coerces to English Stockholm", () => {
    expect(resolveChromeNavigationHref("/de/berlin/", { destination: "stockholm" })).toBe(
      "/en/stockholm/",
    );
  });

  it("selecting Berlin while language is Swedish coerces to English Berlin", () => {
    expect(resolveChromeNavigationHref("/sv/stockholm/biljetter/", { destination: "berlin" })).toBe(
      "/en/berlin/",
    );
  });

  it("normalizes legacy /en/ hub input when resolving peers", () => {
    expect(resolveChromeNavigationHref("/en/", { language: "sv" })).toBe("/sv/stockholm/");
  });

  it("privacy stays on /privacy/ for each language selection", () => {
    expect(resolveChromeNavigationHref("/privacy/", { language: "de" })).toBe("/privacy/");
  });
});
