/**
 * Next Art Yoga session wall-clock in Europe/Stockholm (Tuesdays 17:00–18:00).
 * Used for schema.org Event `startDate` / `endDate` (Google Rich Results requires
 * `startDate` even when `eventSchedule` is present).
 */
export function computeNextArtYogaOccurrenceIso(now: Date = new Date()): {
  startDate: string;
  endDate: string;
} {
  const tz = "Europe/Stockholm";
  const weekdayShort = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(d);
  const civil = (d: Date) =>
    new Intl.DateTimeFormat("sv-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const hourInTz = (d: Date) =>
    new Intl.DateTimeFormat("sv-SE", { timeZone: tz, hour: "2-digit", hour12: false }).format(d);

  for (let days = 0; days < 28; days++) {
    const probe = new Date(now.getTime() + days * 86400000);
    if (weekdayShort(probe) !== "Tue") continue;
    const dateStr = civil(probe);
    for (const offset of ["+02:00", "+01:00"]) {
      const startIso = `${dateStr}T17:00:00${offset}`;
      const start = new Date(startIso);
      if (Number.isNaN(start.getTime())) continue;
      if (weekdayShort(start) !== "Tue" || hourInTz(start) !== "17") continue;
      const endIso = `${dateStr}T18:00:00${offset}`;
      const end = new Date(endIso);
      if (Number.isNaN(end.getTime()) || end.getTime() <= start.getTime()) continue;
      if (now.getTime() > end.getTime()) continue;
      return { startDate: startIso, endDate: endIso };
    }
  }
  throw new Error("computeNextArtYogaOccurrenceIso: no valid Tuesday in window");
}
