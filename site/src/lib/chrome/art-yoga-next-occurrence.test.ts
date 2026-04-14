import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { computeNextArtYogaOccurrenceIso } from "./art-yoga-next-occurrence";

describe("computeNextArtYogaOccurrenceIso", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns same-day Tuesday 17:00–18:00 Stockholm when still before session end", () => {
    // 2026-04-14 is Tuesday; 12:00 UTC ≈ 14:00 Stockholm in April (CEST)
    vi.setSystemTime(new Date("2026-04-14T12:00:00.000Z"));
    const { startDate, endDate } = computeNextArtYogaOccurrenceIso();
    expect(startDate).toMatch(/^2026-04-14T17:00:00\+0[12]:00$/);
    expect(endDate).toMatch(/^2026-04-14T18:00:00\+0[12]:00$/);
    expect(new Date(endDate).getTime()).toBeGreaterThan(new Date(startDate).getTime());
  });

  it("skips to the following Tuesday after the current week session has ended", () => {
    vi.setSystemTime(new Date("2026-04-14T19:00:00.000Z"));
    const { startDate } = computeNextArtYogaOccurrenceIso();
    expect(startDate.startsWith("2026-04-21")).toBe(true);
  });
});
