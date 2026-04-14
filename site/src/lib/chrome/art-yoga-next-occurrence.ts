/**
 * Art Yoga sessions: Tuesdays 17:00–18:00 in Europe/Stockholm.
 * Used for schema.org Event `startDate` / `endDate` (Google Rich Results).
 */

const STOCKHOLM_TZ = "Europe/Stockholm";

function weekdayShort(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: STOCKHOLM_TZ }).format(d);
}

function civilDateInStockholm(d: Date): string {
  return new Intl.DateTimeFormat("sv-CA", {
    timeZone: STOCKHOLM_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function hourInStockholm(d: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: STOCKHOLM_TZ,
    hour: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Up to `occurrenceCount` upcoming Tuesday sessions (17:00–18:00) that are not
 * fully over yet (`end` after `now`), within the next ~42 days of wall-clock search.
 */
export function computeArtYogaOccurrenceSeriesIso(
  occurrenceCount: number,
  now: Date = new Date(),
): { startDate: string; endDate: string }[] {
  const slots: { startDate: string; endDate: string; startMs: number }[] = [];

  for (let days = 0; days < 42; days++) {
    const probe = new Date(now.getTime() + days * 86400000);
    if (weekdayShort(probe) !== "Tue") continue;
    const dateStr = civilDateInStockholm(probe);
    for (const offset of ["+02:00", "+01:00"]) {
      const startIso = `${dateStr}T17:00:00${offset}`;
      const start = new Date(startIso);
      if (Number.isNaN(start.getTime())) continue;
      if (weekdayShort(start) !== "Tue" || hourInStockholm(start) !== "17") continue;
      const endIso = `${dateStr}T18:00:00${offset}`;
      const end = new Date(endIso);
      if (Number.isNaN(end.getTime()) || end.getTime() <= start.getTime()) continue;
      if (now.getTime() > end.getTime()) continue;
      slots.push({ startDate: startIso, endDate: endIso, startMs: start.getTime() });
      break;
    }
  }

  slots.sort((a, b) => a.startMs - b.startMs);
  const dedup: { startDate: string; endDate: string; startMs: number }[] = [];
  const seen = new Set<string>();
  for (const s of slots) {
    if (seen.has(s.startDate)) continue;
    seen.add(s.startDate);
    dedup.push(s);
  }

  return dedup.slice(0, occurrenceCount).map(({ startDate, endDate }) => ({ startDate, endDate }));
}

/** Next single session (same as first entry of a 1-week series). */
export function computeNextArtYogaOccurrenceIso(now: Date = new Date()): {
  startDate: string;
  endDate: string;
} {
  const series = computeArtYogaOccurrenceSeriesIso(1, now);
  if (!series[0]) {
    throw new Error("computeNextArtYogaOccurrenceIso: no valid Tuesday in window");
  }
  return series[0];
}
