import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  computeArtYogaOccurrenceSeriesIso,
  computeNextArtYogaOccurrenceIso,
} from "./art-yoga-next-occurrence";

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

describe("computeArtYogaOccurrenceSeriesIso", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns four consecutive Tuesdays when still before first session end", () => {
    vi.setSystemTime(new Date("2026-04-14T12:00:00.000Z"));
    const series = computeArtYogaOccurrenceSeriesIso(4);
    expect(series).toHaveLength(4);
    const days = series.map((s) => s.startDate.slice(0, 10));
    expect(days).toEqual([
      "2026-04-14",
      "2026-04-21",
      "2026-04-28",
      "2026-05-05",
    ]);
    for (const { startDate, endDate } of series) {
      expect(startDate).toMatch(/^2026-\d{2}-\d{2}T17:00:00\+0[12]:00$/);
      expect(endDate).toMatch(/^2026-\d{2}-\d{2}T18:00:00\+0[12]:00$/);
    }
  });

  it("first slot matches next single occurrence after session end", () => {
    vi.setSystemTime(new Date("2026-04-14T19:00:00.000Z"));
    const series = computeArtYogaOccurrenceSeriesIso(4);
    expect(series[0]?.startDate).toBe(computeNextArtYogaOccurrenceIso().startDate);
    expect(series.map((s) => s.startDate.slice(0, 10))).toEqual([
      "2026-04-21",
      "2026-04-28",
      "2026-05-05",
      "2026-05-12",
    ]);
  });
});
