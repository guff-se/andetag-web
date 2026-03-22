import { describe, expect, it } from "vitest";
import { getWrappedIndex } from "./testimonial-carousel";

describe("getWrappedIndex", () => {
  it("returns zero for empty collections", () => {
    expect(getWrappedIndex(3, 0)).toBe(0);
  });

  it("keeps in-range indexes unchanged", () => {
    expect(getWrappedIndex(1, 3)).toBe(1);
  });

  it("wraps positive overflow indexes", () => {
    expect(getWrappedIndex(3, 3)).toBe(0);
    expect(getWrappedIndex(4, 3)).toBe(1);
  });

  it("wraps negative indexes", () => {
    expect(getWrappedIndex(-1, 3)).toBe(2);
    expect(getWrappedIndex(-4, 3)).toBe(2);
  });
});
