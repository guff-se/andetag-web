import { describe, expect, it } from "vitest";
import { createPageLayoutModel } from "./page-layout";

describe("page layout model", () => {
  it("builds navigation, selectors and seo hooks for a stockholm english page", () => {
    const model = createPageLayoutModel({
      language: "en",
      destination: "stockholm",
      headerVariantId: "header-3305",
      footerVariantId: "footer-3100",
      canonicalPath: "/en/stockholm/tickets/",
      hreflang: {
        sv: "/stockholm/biljetter/",
        en: "/en/stockholm/tickets/",
        de: null,
      },
    });

    expect(model.navigation.id).toBe("en-main");
    expect(model.destinationSelector.find((option) => option.value === "berlin")?.href).toBe(
      "/en/berlin/",
    );
    expect(model.canonicalUrl).toBe("https://www.andetag.museum/en/stockholm/tickets/");
    expect(model.hreflangLinks).toHaveLength(2);
  });

  it("resolves legacy header-4136 to a valid header variant", () => {
    const model = createPageLayoutModel({
      language: "en",
      destination: "berlin",
      headerVariantId: "header-4136",
      footerVariantId: "footer-3100",
      canonicalPath: "/en/berlin/",
      hreflang: {
        sv: null,
        en: "/en/berlin/",
        de: "/de/berlin/",
      },
    });

    expect(model.header.id).toBe("header-918");
    expect(model.navigation.id).toBe("en-main");
  });
});
