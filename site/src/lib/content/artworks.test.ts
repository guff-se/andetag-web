import { describe, expect, it } from "vitest";
import {
  ANDETAG_GEM_TOTAL,
  ANDETAG_ORIGINAL_TOTAL,
  ARTWORKS,
  getCatalogueTotals,
} from "./artworks";

describe("artworks catalogue", () => {
  it("every artwork has a unique id", () => {
    const ids = ARTWORKS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every original has a number in 1..50 and no two share it", () => {
    const numbers = ARTWORKS.filter((a) => a.series === "original").map((a) => a.number);
    for (const n of numbers) {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(ANDETAG_ORIGINAL_TOTAL);
    }
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("every gem has an edition and the available count never exceeds the size", () => {
    for (const gem of ARTWORKS.filter((a) => a.series === "gem")) {
      expect(gem.edition).toBeDefined();
      const edition = gem.edition!;
      expect([6, 10]).toContain(edition.size);
      expect(edition.available).toBeGreaterThanOrEqual(0);
      expect(edition.available).toBeLessThanOrEqual(edition.size);
    }
  });

  it("only originals carry a number; only gems carry an edition", () => {
    for (const a of ARTWORKS) {
      if (a.series === "original") {
        expect(a.number).toBeDefined();
        expect(a.edition).toBeUndefined();
      } else {
        expect(a.edition).toBeDefined();
        expect(a.number).toBeUndefined();
      }
    }
  });

  it("every artwork has at least one image with valid sources", () => {
    for (const a of ARTWORKS) {
      expect(a.images.length).toBeGreaterThanOrEqual(1);
      for (const img of a.images) {
        expect(img.src).toMatch(/^\/wp-content\/uploads\//);
        expect(img.webp640).toMatch(/^\/wp-content\/uploads\/.*-640w\.webp$/);
        expect(img.webp960).toMatch(/^\/wp-content\/uploads\/.*-960w\.webp$/);
        expect(img.alt.sv.length).toBeGreaterThan(0);
        expect(img.alt.en.length).toBeGreaterThan(0);
      }
    }
  });

  it("every artwork has positive dimensions and a sensible year", () => {
    const currentYear = new Date().getFullYear();
    for (const a of ARTWORKS) {
      expect(a.dimensionsCm.w).toBeGreaterThan(0);
      expect(a.dimensionsCm.h).toBeGreaterThan(0);
      expect(a.year).toBeGreaterThanOrEqual(2020);
      expect(a.year).toBeLessThanOrEqual(currentYear + 1);
    }
  });

  it("every artwork has a location label in both locales", () => {
    for (const a of ARTWORKS) {
      expect(a.location.label.sv.length).toBeGreaterThan(0);
      expect(a.location.label.en.length).toBeGreaterThan(0);
      expect(a.location.lat).toBeGreaterThanOrEqual(-90);
      expect(a.location.lat).toBeLessThanOrEqual(90);
      expect(a.location.lon).toBeGreaterThanOrEqual(-180);
      expect(a.location.lon).toBeLessThanOrEqual(180);
    }
  });

  it("every for-sale artwork either has a price or signals price-on-request via an absent priceSek", () => {
    for (const a of ARTWORKS) {
      if (a.priceSek !== undefined) {
        expect(a.priceSek).toBeGreaterThan(0);
        expect(a.status).toBe("for-sale");
      }
    }
  });

  it("totals match the declared series sizes", () => {
    expect(ANDETAG_ORIGINAL_TOTAL).toBe(50);
    expect(ANDETAG_GEM_TOTAL).toBe(3);
    const totals = getCatalogueTotals(ARTWORKS);
    expect(totals.originals.listed).toBeLessThanOrEqual(ANDETAG_ORIGINAL_TOTAL);
    expect(totals.gems.listed).toBeLessThanOrEqual(ANDETAG_GEM_TOTAL);
    expect(totals.gems.totalUnits).toBeGreaterThanOrEqual(totals.gems.soldUnits);
  });
});
