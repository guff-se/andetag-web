import { describe, expect, it } from "vitest";
import {
  defaultOgImageAbsoluteUrl,
  languageToOgLocale,
  languageToHreflangAttribute,
  ogLocaleAlternates,
} from "./seo";

describe("seo helpers", () => {
  it("maps languages to hreflang attribute values", () => {
    expect(languageToHreflangAttribute("sv")).toBe("sv-SE");
    expect(languageToHreflangAttribute("en")).toBe("en");
    expect(languageToHreflangAttribute("de")).toBe("de-DE");
  });

  it("maps languages to Open Graph locale tags", () => {
    expect(languageToOgLocale("sv")).toBe("sv_SE");
    expect(languageToOgLocale("en")).toBe("en_US");
    expect(languageToOgLocale("de")).toBe("de_DE");
  });

  it("lists og:locale:alternate only for hreflang siblings", () => {
    expect(
      ogLocaleAlternates("sv", {
        sv: "/sv/stockholm/biljetter/",
        en: "/en/stockholm/tickets/",
        de: null,
      }),
    ).toEqual(["en_US"]);
    expect(
      ogLocaleAlternates("en", {
        sv: "/sv/stockholm/",
        en: "/en/",
        de: null,
      }),
    ).toEqual(["sv_SE"]);
    expect(
      ogLocaleAlternates("de", {
        sv: null,
        en: "/en/berlin/",
        de: "/de/berlin/",
      }),
    ).toEqual(["en_US"]);
  });

  it("emits absolute default og:image for hero poster path", () => {
    expect(defaultOgImageAbsoluteUrl()).toBe(
      "https://www.andetag.museum/wp-content/uploads/2024/11/stockholm-hero-poster-1920w.jpg",
    );
  });
});
