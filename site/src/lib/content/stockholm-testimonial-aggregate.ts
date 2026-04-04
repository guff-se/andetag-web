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

/** Same figures as Swedish aggregate; English labels for `/en/stockholm/` home band. */
export const stockholmTestimonialAggregateEn = {
  eyebrow: "Visitor reviews",
  score: "4.9",
  scoreCaption: "out of 5",
  meta: "165 reviews",
  linkHref: stockholmTripadvisorReviewsUrl,
  linkLabel: "Read all reviews",
  linkAriaLabel: "Read all reviews on Tripadvisor",
  regionAriaLabel: "Review summary",
} as const;

/** German labels for Berlin home visitor band (figures match Stockholm Tripadvisor summary). */
export const stockholmTestimonialAggregateDe = {
  eyebrow: "Besucherbewertungen",
  score: "4,9",
  scoreCaption: "von 5",
  meta: "165 Bewertungen",
  linkHref: stockholmTripadvisorReviewsUrl,
  linkLabel: "Alle Bewertungen lesen",
  linkAriaLabel: "Alle Bewertungen auf Tripadvisor lesen",
  regionAriaLabel: "Zusammenfassung der Bewertungen",
} as const;
