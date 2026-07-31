/**
 * Single source of truth for Stockholm TripAdvisor review data.
 * Used by: schema-org.ts (JSON-LD), TestimonialCarousel (visual), besökaromdömen pages.
 *
 * Update numbers here when TripAdvisor data changes; run `npm test` and `npm run build`
 * to propagate. See Phase 9 skill P9-14 for the maintenance workflow.
 *
 * Source: https://www.tripadvisor.com/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html
 * Last verified: 2026-05-08
 */

export const STOCKHOLM_TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html" as const;

export const STOCKHOLM_RATING = {
  ratingValue: "4.9",
  /** Total reviews on Tripadvisor (aggregateRating reviewCount). */
  reviewCount: 197,
  /** Subset rated five stars (on-page stats only; not used in JSON-LD). */
  fiveStarReviewCount: 183,
  bestRating: "5",
} as const;

/**
 * Tripadvisor Travellers' Choice award given to ANDETAG Stockholm.
 * Used by the testimonial carousel badge and the Museum node `award` field in JSON-LD.
 * Stockholm only: Berlin has no award (escalate before adding).
 */
export const STOCKHOLM_TRAVELLERS_CHOICE = {
  year: 2026,
  /** Canonical award name in JSON-LD (`Place.award`). */
  awardName: "Tripadvisor Travellers' Choice 2026",
  /** Self-hosted SVG badge (Tripadvisor owl with laurel wreath). */
  badgeSrc: "/assets/tripadvisor/tripadvisor-travellers-choice-2026.svg",
  badgeWidth: 139,
  badgeHeight: 139,
} as const;

/** Comma decimal for Swedish/German UI (Tripadvisor-style). */
export function stockholmTripadvisorRatingCommaDecimal(): string {
  return STOCKHOLM_RATING.ratingValue.replace(".", ",");
}

export type StockholmReview = {
  author: string;
  quote: string;
  /** ISO date string (YYYY-MM-DD). */
  datePublished: string;
  ratingValue: "5";
};

/**
 * Featured reviews shown in the testimonial carousel and emitted as JSON-LD Review nodes.
 * Keep in sync with besökaromdömen page content.
 */
export const STOCKHOLM_FEATURED_REVIEWS: readonly StockholmReview[] = [
  {
    // taur:1046062736
    author: "maijak2026",
    quote:
      "A breathing room in the heart of the city! Beautiful immersive sound, music and light experience. A space to connect to each other but also to yourself and your own breath.",
    datePublished: "2026-01-14",
    ratingValue: "5",
  },
  {
    // taur:999934844
    author: "PetterWallberg",
    quote:
      "This experience completely shifted my day. I stepped in from the chaos of the subway and left in stillness—feeling grounded, grateful, and present. It’s hard to put into words, but something subtle and powerful happens here. A must.",
    datePublished: "2025-03-26",
    ratingValue: "5",
  },
  {
    // taur:1048628312
    author: "Traveler566865",
    quote:
      "Take your time in here and just follow the sounds and the visuals. It is so deeply relaxing and beautiful, like a spa for the brain and then some.",
    datePublished: "2026-02-08",
    ratingValue: "5",
  },
  {
    // taur:1028923793
    author: "J4366RQmichelleg",
    quote:
      "Such a beautiful immersive experience. Really took me out of my mind and out of the city into a deep visceral place. I’d recommend this to anybody wanted to do something different and come back to their body and breathe through art.",
    datePublished: "2025-09-05",
    ratingValue: "5",
  },
  {
    // taur:1039320693
    author: "565patrikg",
    quote:
      "A brilliant and unique visualization of the core of the human condition. Makes you awe over what it is to be human. Must see when in Stockholm!",
    datePublished: "2025-11-17",
    ratingValue: "5",
  },
] as const;
