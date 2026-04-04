import { describe, expect, it } from "vitest";
import { isHeroCoverResponsive } from "./hero-cover-image";

describe("isHeroCoverResponsive", () => {
  it("returns true for responsive cover object", () => {
    const v = {
      jpeg960: "/x.jpg",
      webp640: "/a.webp",
      webp960: "/b.webp",
    };
    expect(isHeroCoverResponsive(v)).toBe(true);
  });

  it("returns false for string URL", () => {
    expect(isHeroCoverResponsive("/only.jpg")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isHeroCoverResponsive(undefined)).toBe(false);
  });
});
