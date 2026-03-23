import { describe, expect, it } from "vitest";
import { getBookingEmbedContactHtml } from "./booking-embed-contact";

describe("getBookingEmbedContactHtml", () => {
  it("includes info@andetag.museum mailto for each language", () => {
    for (const lang of ["sv", "en", "de"] as const) {
      const html = getBookingEmbedContactHtml(lang);
      expect(html).toContain("mailto:info@andetag.museum");
      expect(html).toContain("info@andetag.museum");
    }
  });
});
