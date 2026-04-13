/**
 * Single source of truth for Stockholm ticket prices and event data.
 * Used by: schema-org.ts (JSON-LD offers + Event), BiljetterSv/En, SasongskortSv/En.
 *
 * Update prices here when they change; run `npm test` and `npm run build`
 * to propagate to all consumers.
 *
 * Source: site-html/stockholm-biljetter.html, site-html/en-stockholm-tickets.html
 * Last verified: 2026-04-12
 */

export const STOCKHOLM_CURRENCY = "SEK" as const;

export type TicketCategory = {
  id: string;
  nameSv: string;
  nameEn: string;
  /** Full price in SEK. */
  price: number;
  /** Discounted daytime price in SEK, if applicable. */
  daytimePrice?: number;
};

export const STOCKHOLM_TICKETS: readonly TicketCategory[] = [
  {
    id: "regular",
    nameSv: "Ordinarie biljett",
    nameEn: "Regular ticket",
    price: 240,
    daytimePrice: 190,
  },
  {
    id: "student-senior",
    nameSv: "Student/pensionär",
    nameEn: "Student/senior",
    price: 200,
    daytimePrice: 150,
  },
  {
    id: "youth",
    nameSv: "Ungdom (8\u201317 \u00e5r)",
    nameEn: "Youth (8\u201317 years)",
    price: 125,
  },
  {
    id: "art-yoga",
    nameSv: "Art Yoga",
    nameEn: "Art Yoga",
    price: 320,
  },
];

export const STOCKHOLM_SEASON_PASS = {
  nameSv: "Säsongskort",
  nameEn: "Season Pass",
  price: 950,
  durationMonths: 6,
} as const;

/** Daytime pricing applies weekdays 12:00–17:00. */
export const STOCKHOLM_DAYTIME_WINDOW = {
  descriptionSv: "vardagar 12.00\u201317.00",
  descriptionEn: "weekdays 12.00\u201317.00",
} as const;

/**
 * Art Yoga recurring event metadata for schema.org Event + Schedule.
 * Every Tuesday 17:00–18:00 at ANDETAG Stockholm.
 */
export const STOCKHOLM_ART_YOGA_EVENT = {
  nameSv: "Art Yoga p\u00e5 ANDETAG",
  nameEn: "Art Yoga at ANDETAG",
  descriptionSv:
    "En långsam yogaklass i Andetags omslutande konstmiljö i centrala Stockholm. Leds av yogaläraren Fabian Macklin.",
  descriptionEn:
    "A slow yoga class held inside ANDETAG\u2019s immersive art environment in central Stockholm. Guided by yoga teacher Fabian Macklin.",
  performer: "Fabian Macklin",
  pathSv: "/sv/stockholm/art-yoga/",
  pathEn: "/en/stockholm/art-yoga/",
  bookingUrl:
    "https://andetag.understory.io/experience/cc2f4ed4e1709b93a454a1e5abad6595",
  schedule: {
    repeatFrequency: "P1W",
    byDay: "https://schema.org/Tuesday",
    startTime: "17:00:00",
    endTime: "18:00:00",
    scheduleTimezone: "Europe/Stockholm",
  },
  durationIso: "PT1H",
} as const;
