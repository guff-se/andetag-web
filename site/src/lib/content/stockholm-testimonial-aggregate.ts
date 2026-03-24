/**
 * Source-backed Tripadvisor summary for Stockholm testimonial band
 * (same figures as `BesokaromdomenSv` / `site-html/stockholm-besokaromdomen.html`).
 */
export const stockholmTripadvisorReviewsUrl =
  "https://www.tripadvisor.com/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html" as const;

export const stockholmTestimonialAggregateSv = {
  eyebrow: "Besökaromdömen",
  score: "4,9",
  scoreCaption: "av 5",
  /** Review count only; score and Tripadvisor appear in the score row and brand assets. */
  meta: "165 recensioner",
  linkHref: stockholmTripadvisorReviewsUrl,
  linkLabel: "Läs alla recensioner",
  linkAriaLabel: "Läs alla recensioner på Tripadvisor",
  regionAriaLabel: "Sammanfattning av omdömen",
} as const;
