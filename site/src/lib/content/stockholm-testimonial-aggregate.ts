/**
 * Locale-specific Tripadvisor summary for the Stockholm testimonial band.
 * Numbers come from `stockholm-reviews.ts` (single source of truth).
 */
import {
  STOCKHOLM_RATING,
  STOCKHOLM_TRAVELLERS_CHOICE,
  STOCKHOLM_TRIPADVISOR_URL,
  stockholmTripadvisorRatingCommaDecimal,
} from "./stockholm-reviews";

export const stockholmTripadvisorReviewsUrl = STOCKHOLM_TRIPADVISOR_URL;

/**
 * Travellers' Choice 2026 badge content per locale. Stockholm only — do not import
 * from Berlin pages (the award is for ANDETAG Stockholm specifically).
 */
export const stockholmTravellersChoiceBadgeSv = {
  imageSrc: STOCKHOLM_TRAVELLERS_CHOICE.badgeSrc,
  imageAlt: `Tripadvisor Travellers' Choice ${STOCKHOLM_TRAVELLERS_CHOICE.year}, utmärkelse tilldelad ANDETAG`,
  eyebrow: "Tripadvisor",
  headline: "Travellers' Choice",
  year: String(STOCKHOLM_TRAVELLERS_CHOICE.year),
  linkHref: STOCKHOLM_TRIPADVISOR_URL,
  linkAriaLabel: `Travellers' Choice ${STOCKHOLM_TRAVELLERS_CHOICE.year}, läs omdömen på Tripadvisor`,
} as const;

export const stockholmTravellersChoiceBadgeEn = {
  imageSrc: STOCKHOLM_TRAVELLERS_CHOICE.badgeSrc,
  imageAlt: `Tripadvisor Travellers' Choice ${STOCKHOLM_TRAVELLERS_CHOICE.year} award given to ANDETAG`,
  eyebrow: "Tripadvisor",
  headline: "Travellers' Choice",
  year: String(STOCKHOLM_TRAVELLERS_CHOICE.year),
  linkHref: STOCKHOLM_TRIPADVISOR_URL,
  linkAriaLabel: `Travellers' Choice ${STOCKHOLM_TRAVELLERS_CHOICE.year}, read reviews on Tripadvisor`,
} as const;

export const stockholmTestimonialAggregateSv = {
  score: stockholmTripadvisorRatingCommaDecimal(),
  scoreCaption: `av ${STOCKHOLM_RATING.bestRating}`,
  meta: `${STOCKHOLM_RATING.reviewCount} recensioner`,
  linkHref: stockholmTripadvisorReviewsUrl,
  linkAriaLabel: `${STOCKHOLM_RATING.reviewCount} recensioner på Tripadvisor`,
  regionAriaLabel: "Sammanfattning av omdömen",
} as const;

export const stockholmTestimonialAggregateEn = {
  score: STOCKHOLM_RATING.ratingValue,
  scoreCaption: `out of ${STOCKHOLM_RATING.bestRating}`,
  meta: `${STOCKHOLM_RATING.reviewCount} reviews`,
  linkHref: stockholmTripadvisorReviewsUrl,
  linkAriaLabel: `${STOCKHOLM_RATING.reviewCount} reviews on Tripadvisor`,
  regionAriaLabel: "Review summary",
} as const;

export const stockholmTestimonialAggregateDe = {
  score: stockholmTripadvisorRatingCommaDecimal(),
  scoreCaption: `von ${STOCKHOLM_RATING.bestRating}`,
  meta: `${STOCKHOLM_RATING.reviewCount} Bewertungen`,
  linkHref: stockholmTripadvisorReviewsUrl,
  linkAriaLabel: `${STOCKHOLM_RATING.reviewCount} Bewertungen auf Tripadvisor`,
  regionAriaLabel: "Zusammenfassung der Bewertungen",
} as const;
