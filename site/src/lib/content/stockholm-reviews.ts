/**
 * Single source of truth for Stockholm TripAdvisor review data.
 * Used by: schema-org.ts (JSON-LD), TestimonialCarousel (visual), besökaromdömen pages.
 *
 * Update numbers here when TripAdvisor data changes; run `npm test` and `npm run build`
 * to propagate. See Phase 9 skill P9-14 for the maintenance workflow.
 *
 * Source: https://www.tripadvisor.com/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html
 * Last verified: 2026-04-12
 */

export const STOCKHOLM_TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html" as const;

export const STOCKHOLM_RATING = {
  ratingValue: "4.9",
  reviewCount: 165,
  bestRating: "5",
} as const;

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
    author: "Edwin",
    quote:
      "The installation is incredibly immersive, with light, sound and textile art blending into a unique experience. It invites you to slow down, breathe and simply be present. Truly one of a kind.",
    datePublished: "2025-01-15",
    ratingValue: "5",
  },
  {
    author: "Therese",
    quote:
      "A calming and meditative experience that feels like a deep breath for the whole body. The movement of light and color creates a soothing atmosphere. You leave feeling grounded, rested and quietly moved.",
    datePublished: "2025-01-15",
    ratingValue: "5",
  },
  {
    author: "Gabrielle",
    quote:
      "The artwork is stunning, with intricate textures and glowing fibers that feel alive. The experience engages many senses at once, creating a rare sense of wonder. Beautiful, thoughtful and unforgettable.",
    datePublished: "2025-01-15",
    ratingValue: "5",
  },
] as const;
