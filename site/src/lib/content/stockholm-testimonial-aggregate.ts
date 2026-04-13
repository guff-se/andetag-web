/**
 * Locale-specific Tripadvisor summary for the Stockholm testimonial band.
 * Numbers come from `stockholm-reviews.ts` (single source of truth).
 */
import { STOCKHOLM_RATING, STOCKHOLM_TRIPADVISOR_URL } from "./stockholm-reviews";

export const stockholmTripadvisorReviewsUrl = STOCKHOLM_TRIPADVISOR_URL;

export const stockholmTestimonialAggregateSv = {
  eyebrow: "Besökaromdömen",
  score: "4,9",
  scoreCaption: "av 5",
  meta: `${STOCKHOLM_RATING.reviewCount} recensioner`,
  linkHref: stockholmTripadvisorReviewsUrl,
  linkLabel: "Läs alla recensioner",
  linkAriaLabel: "Läs alla recensioner på Tripadvisor",
  regionAriaLabel: "Sammanfattning av omdömen",
} as const;

export const stockholmTestimonialAggregateEn = {
  eyebrow: "Visitor reviews",
  score: STOCKHOLM_RATING.ratingValue,
  scoreCaption: "out of 5",
  meta: `${STOCKHOLM_RATING.reviewCount} reviews`,
  linkHref: stockholmTripadvisorReviewsUrl,
  linkLabel: "Read all reviews",
  linkAriaLabel: "Read all reviews on Tripadvisor",
  regionAriaLabel: "Review summary",
} as const;

export const stockholmTestimonialAggregateDe = {
  eyebrow: "Besucherbewertungen",
  score: "4,9",
  scoreCaption: "von 5",
  meta: `${STOCKHOLM_RATING.reviewCount} Bewertungen`,
  linkHref: stockholmTripadvisorReviewsUrl,
  linkLabel: "Alle Bewertungen lesen",
  linkAriaLabel: "Alle Bewertungen auf Tripadvisor lesen",
  regionAriaLabel: "Zusammenfassung der Bewertungen",
} as const;
