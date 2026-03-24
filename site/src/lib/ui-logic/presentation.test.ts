import { describe, expect, it } from "vitest";
import {
  getHeadingTag,
  getLinkClassName,
  WORDMARK_CLASS,
  WORDMARK_LETTER_SPACING_EM,
} from "./presentation";

describe("component presentation helpers", () => {
  it("maps approved link variants to stable class names", () => {
    expect(getLinkClassName("content")).toBe("link-content");
    expect(getLinkClassName("nav")).toBe("link-nav");
    expect(getLinkClassName("footer")).toBe("link-footer");
    expect(getLinkClassName("cta-primary")).toBe("link-cta-primary");
    expect(getLinkClassName("cta-secondary")).toBe("link-cta-secondary");
    expect(getLinkClassName("cta-outline")).toBe("link-cta-outline");
  });

  it("returns allowed heading tag", () => {
    expect(getHeadingTag("h1", "h2")).toBe("h1");
    expect(getHeadingTag("h2", "h3")).toBe("h2");
  });

  it("falls back to default heading when missing or invalid", () => {
    expect(getHeadingTag(undefined, "h2")).toBe("h2");
    expect(getHeadingTag("h4", "h3")).toBe("h3");
  });

  it("keeps the ANDETAG wordmark token stable", () => {
    expect(WORDMARK_CLASS).toBe("brand-wordmark");
    expect(WORDMARK_LETTER_SPACING_EM).toBe(0.3);
  });
});
