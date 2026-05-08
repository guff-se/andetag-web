---
name: testimonials
description: Use when updating Stockholm TripAdvisor testimonials, ratings, review counts, or the TripAdvisor URL on the ANDETAG Astro site (site/). Triggers include "update the review count to 210", "bump the rating to 4.8", "swap out a featured review", "refresh TripAdvisor numbers from the live page", "add a new quote to the carousel", or "change the TripAdvisor link". Anchors the single source of truth in site/src/lib/content/stockholm-reviews.ts and documents every downstream consumer (schema-org JSON-LD, aggregate strip, home carousels, besökaromdömen page copy) plus the known drift hotspots that must be hand-synced.
---

## Purpose

Maintain Stockholm review content in a single place (`site/src/lib/content/stockholm-reviews.ts`) and propagate changes cleanly to every consumer. Track the **known drift sites** — SEO-landing `testimonialItems` arrays and `StockholmHomeSharedBody.astro` still hold literal quote strings instead of importing the catalog — so an agent cannot accidentally ship an inconsistent number or quote set.

This skill is **not** for:

- Editing TripAdvisor on the vendor side (the site consumes numbers manually; this skill only updates the committed values).
- Berlin reviews (no Berlin review data exists today; escalate).
- Testimonial carousel layout, background imagery, or component behaviour (see `skills/images/SKILL.md` for the background image; component is `site/src/components/content/TestimonialCarousel.astro`).

## When to use

- TripAdvisor **rating**, **reviewCount**, or **fiveStarReviewCount** changed.
- The **TripAdvisor URL** changed (vendor may alter geo id or attraction id).
- A **featured review** (`STOCKHOLM_FEATURED_REVIEWS` entry) should be added, replaced, removed, or reordered.
- The `last verified` date on `stockholm-reviews.ts` needs bumping after a periodic check even if numbers did not change.

## Files touched

Paths are relative to the repo root. All listed files sit under `site/`.

### Single source of truth

- **`site/src/lib/content/stockholm-reviews.ts`** — exports:
  - `STOCKHOLM_TRIPADVISOR_URL` (literal URL).
  - `STOCKHOLM_RATING` — `{ ratingValue, reviewCount, fiveStarReviewCount, bestRating }` (`ratingValue` and `bestRating` are strings; counts are numbers).
  - `stockholmTripadvisorRatingCommaDecimal()` — helper for sv/de UI (replaces `.` with `,`).
  - `type StockholmReview = { author, quote, datePublished, ratingValue: "5" }`.
  - `STOCKHOLM_FEATURED_REVIEWS: readonly StockholmReview[]` — currently 3 entries.
  - A `Last verified: YYYY-MM-DD` comment line at the top. Bump it every time.

### Centralised consumers (auto-propagate via import — no hand edit needed)

| Consumer | What it uses | File |
|----------|--------------|------|
| Stockholm JSON-LD `aggregateRating` + `review` array on the Museum node | `STOCKHOLM_RATING`, `STOCKHOLM_FEATURED_REVIEWS` | `site/src/lib/chrome/schema-org.ts` |
| Locale-specific aggregate strip copy (sv / en / de) | `STOCKHOLM_RATING`, `STOCKHOLM_TRIPADVISOR_URL`, `stockholmTripadvisorRatingCommaDecimal` | `site/src/lib/content/stockholm-testimonial-aggregate.ts` (exports `stockholmTestimonialAggregate{Sv,En,De}`) |
| Stockholm home (`/sv/stockholm/`, `/en/stockholm/`) TestimonialCarousel | `STOCKHOLM_FEATURED_REVIEWS.map(r => ({ quote: r.quote, author: r.author }))` | `site/src/components/page-bodies/StockholmHomeSv.astro`, `StockholmHomeEn.astro` |
| `besökaromdömen` page copy (totals, five-star count, average rating, TripAdvisor link) | `STOCKHOLM_RATING`, `STOCKHOLM_TRIPADVISOR_URL`, `stockholmTripadvisorRatingCommaDecimal` | `site/src/components/page-bodies/BesokaromdomenSv.astro`, `BesokaromdomenEn.astro` |

### Auto-propagating consumers (complete list)

All carousel surfaces now derive `testimonialItems` from `STOCKHOLM_FEATURED_REVIEWS` via `.map(r => ({ quote: r.quote, author: r.author }))`. No hand-sync is required when updating the catalog.

| File | How it consumes the catalog |
|------|-----------------------------|
| `site/src/components/page-bodies/StockholmHomeSv.astro` | `.map()` from import |
| `site/src/components/page-bodies/StockholmHomeEn.astro` | `.map()` from import |
| `site/src/components/page-bodies/StockholmSeoLandingSv.astro` | `.map()` from import |
| `site/src/components/page-bodies/StockholmSeoLandingEn.astro` | `.map()` from import |
| `site/src/components/page-bodies/StockholmHomeSharedBody.astro` | `.map()` from import |

After editing `STOCKHOLM_FEATURED_REVIEWS`, confirm no literal copies remain:

```bash
git grep -n 'const testimonialItems' -- 'site/src/components/page-bodies/'
```

Every match should be the `.map(r => …)` form. If any literal array appears, it is a new drift hotspot that must be collapsed before merging.

## Locale parity rules

- Stockholm is `sv + en + de` for the aggregate strip (`stockholmTestimonialAggregate{Sv,En,De}`), **but** review content itself is **English-only** in `STOCKHOLM_FEATURED_REVIEWS` — quotes are presented in the language the visitor originally wrote them (TripAdvisor policy). Do not translate quotes.
- The author name is rendered as provided; do not localise (for example, "Therese" stays "Therese" in every locale).
- The aggregate strip's `score` uses comma decimal for sv and de (`4,9`) and point decimal for en (`4.9`). Enforced automatically by `stockholmTripadvisorRatingCommaDecimal()`.
- `ratingValue` is a string in the catalog (`"4.9"`) — JSON-LD uses `Number()` conversions in tests only. Keep the string form in the source.
- `reviewCount` is a JSON **number** (not a string) — required by Google's rich-results validator per `docs/seo/decisions.md` `SEO-0017` and `docs/Andetag SEO Manual.md` §6.

## Workflow

### A. Bump the review count and rating (periodic refresh)

1. Open `https://www.tripadvisor.com/Attraction_Review-g189852-d32883203-Reviews-Andetag-Stockholm.html` (the URL in the catalog). Note: rating, total review count, five-star breakdown.
2. Edit `site/src/lib/content/stockholm-reviews.ts`:
   - `STOCKHOLM_RATING.ratingValue` → new string (e.g. `"4.8"`).
   - `STOCKHOLM_RATING.reviewCount` → new number.
   - `STOCKHOLM_RATING.fiveStarReviewCount` → new number.
   - Update the `Last verified: YYYY-MM-DD` comment.
3. No other file needs editing unless §C or §D also applies. Aggregate strip, besökaromdömen copy, and schema-org propagate automatically.
4. Verification: §Verification.

### B. Change the TripAdvisor URL (vendor changed the slug)

1. Edit `STOCKHOLM_TRIPADVISOR_URL` in `stockholm-reviews.ts`.
2. Update the source-URL comment line on `stockholm-reviews.ts` (the `Source:` line near the top) and `Last verified`.
3. Grep the repo for the old URL to confirm no stray literal references:

   ```bash
   git grep "tripadvisor.com/Attraction_Review-g189852-d32883203" -- 'site/'
   ```

   Every remaining hit must be inside `stockholm-reviews.ts` (the new value) or a documentation file that intentionally pins the old.
4. Verification: §Verification.

### C. Add, replace, or remove a featured review

1. Edit `STOCKHOLM_FEATURED_REVIEWS` in `stockholm-reviews.ts`. Keep the `as const` assertion and the `readonly` tuple shape. Each entry must provide `author`, `quote`, `datePublished` (ISO `YYYY-MM-DD`), `ratingValue: "5"`.
2. All carousel consumers auto-propagate via `.map()` — no hand-sync needed (see §Auto-propagating consumers). Schema-org `review` array also auto-updates.
3. Verification: §Verification. Spot-check that the new author name appears in `dist/sv/stockholm/index.html` and at least one SEO landing page.

### D. Reorder featured reviews

Same as §C — treat the whole array as a list edit. Order matters: all carousels render in array order and auto-propagate via `.map()`.

### G. Select featured reviews from the review approval pack

`docs/tripadvisor-review-approval-pack.csv` is the canonical source for curating featured reviews. It contains all TripAdvisor reviews exported for curation. Process it when refreshing `STOCKHOLM_FEATURED_REVIEWS`.

#### CSV fields

| Column | Use |
|--------|-----|
| `gid` | TripAdvisor review identifier (`taur:…`). Keep as a source reference comment when adding to the catalog. |
| `status` | `ready` = safe to feature. `needs_human_review` = skip until manually resolved. |
| `language` | ISO 639-1 code. Prefer `en` entries for the catalog (original-language policy). |
| `reviewer` | TripAdvisor username — use verbatim as `author`. |
| `dateText` | Original date string (e.g. `"May 4, 2026"`). Convert to ISO `YYYY-MM-DD` for `datePublished`. |
| `rating` | Verify `5.0 of 5 bubbles` before including. Only 5-star reviews belong in `STOCKHOLM_FEATURED_REVIEWS`. |
| `reviewText` | The reviewer's own words — use verbatim. Never truncate, paraphrase, or translate. |

#### Selection criteria for `STOCKHOLM_FEATURED_REVIEWS`

Only use `status = ready` entries. Select 3–6 English entries ranked by:

1. **Conversion signal.** Clear before/after arc (stress → calm, outside world → present), a specific sensory detail, or a concrete social-proof signal (repeat visit, brought friends, favourite place in Stockholm). Concise enough to read in two or three breaths without scrolling.
2. **SEO value.** Naturally contains one or more of: immersive art, meditation, breathing, mindfulness, relaxation, textile art, light installation, Stockholm, unique experience. Specificity beats density — a review that mentions the fabric, the breathing soundtrack, or the subway location is better than one that only says "amazing".
3. **Voice diversity.** Cover a spread of visitor profiles: tourist, local, couple, solo. Avoid two entries from the same reviewer.
4. **Freshness.** Prefer reviews from the last 12 months where quality is equal.

**Never** truncate or edit a quote. Never add a review that is not in the CSV or not verifiable on the live TripAdvisor page. Never use `needs_human_review` entries.

#### Important: the CSV is a curated subset, not a full export

`tripadvisor-review-approval-pack.csv` contains only reviews that have been pre-filtered as relevant for testimonial use. It does **not** represent all reviews on TripAdvisor. Do **not** derive `reviewCount` or `fiveStarReviewCount` from the row count in the CSV. Always get aggregate figures from the live TripAdvisor page or confirm with Gustaf.

#### Workflow

1. Open `docs/tripadvisor-review-approval-pack.csv`. Filter to `status = ready, language = en, rating = 5.0 of 5 bubbles`.
2. Score candidates against the criteria above. Draft a shortlist of 5–8.
3. For the **home slider**, present the shortlist to Gustaf before committing — the slider is high-visibility and benefits from a human read.
4. Implement the agreed set via §C (add/replace featured reviews), including drift-hotspot sync.
5. Update `Last verified` and bump `STOCKHOLM_RATING` per §A using figures confirmed from the live TripAdvisor page or by Gustaf — never from the CSV row count.

#### Tone note

Some visitor quotes contain em dashes (—). Site copy policy prohibits em dashes in brand-authored text, but verbatim visitor quotes are exempt because they are attributed third-party words. If a proposed quote contains an em dash and an equally strong alternative does not, prefer the alternative.

### E. Change the review display component (background image, carousel behaviour)

Out of scope for this skill. Background image belongs to `skills/images/SKILL.md` (`testimonialCarouselDefaultBg`). Carousel behaviour is a component-level change (`site/src/components/content/TestimonialCarousel.astro`).

### F. Bump the Tripadvisor Travellers' Choice award year (annual)

Tripadvisor announces a new Travellers' Choice list each spring. When the museum is awarded for a new year (or removed from the list), update in lockstep:

1. **Source of truth** — `site/src/lib/content/stockholm-reviews.ts`:
   - `STOCKHOLM_TRAVELLERS_CHOICE.year` → new number.
   - `STOCKHOLM_TRAVELLERS_CHOICE.awardName` → `"Tripadvisor Travellers' Choice <year>"`.
   - `STOCKHOLM_TRAVELLERS_CHOICE.badgeSrc` → if Tripadvisor ships a new SVG, save it to `site/public/assets/tripadvisor/tripadvisor-travellers-choice-<year>.svg` and point here.
   - Bump `Last verified`.
2. **Schema-org test** — `site/src/lib/chrome/schema-org.test.ts` pins the award string. Update the assertion (`expect(venue!.award).toBe("Tripadvisor Travellers' Choice <year>")`).
3. **Besökaromdömen / visitor-reviews bullet** — both `BesokaromdomenSv.astro` and `BesokaromdomenEn.astro` reference `STOCKHOLM_TRAVELLERS_CHOICE.year` in the overview list, so they auto-update. Confirm with `git grep STOCKHOLM_TRAVELLERS_CHOICE`.
4. **Pages that render the badge** (auto-propagate via `stockholmTravellersChoiceBadge{Sv,En}`): `StockholmHomeSv/En.astro`, `StockholmSeoLandingSv/En.astro`. Berlin pages do **not** import the badge — keep it that way unless Berlin is also awarded.
5. If the museum is **not** re-awarded for a given year:
   - Remove the `awardBadge={…}` prop from each Stockholm carousel call site (4 pages).
   - Drop the `award` field from the Museum node in `schema-org.ts` and the matching test assertion.
   - Drop the new bullet in both `besokaromdomen`/`visitor-reviews` bodies.
   - Keep `STOCKHOLM_TRAVELLERS_CHOICE` exported (commented-out historical record) so the next year's bump is mechanical.
6. Verification: §Verification, plus `grep -lr 'tripadvisor-travellers-choice' dist/` should match every Stockholm carousel page (currently 14: Stockholm home pair + 6 SEO landing pairs); Berlin pages must be absent.

## Verification

Run from `site/`.

```bash
npm test          # 29 files, 134 tests at time of writing
npm run build     # 65 pages
```

Pass means both exit 0. The schema-org test on `aggregateRating` (`schema-org.test.ts` §"includes aggregateRating and review on Stockholm pages") uses loose bounds and should stay green without test edits.

Post-build spot checks (from repo root):

```bash
# Rating string propagated
git grep -n '"4.9"\|"4,9"' site/dist/ | head

# Review count propagated
grep -h 'reviewCount' site/dist/sv/stockholm/index.html | head

# TripAdvisor link unchanged (or updated) across all consumers
git grep -n "tripadvisor.com/Attraction_Review" site/dist/ | head -20

# Every quote from the catalog appears in at least one built page
for q in $(node -e 'const r = require("./site/src/lib/content/stockholm-reviews.ts"); console.log(r.STOCKHOLM_FEATURED_REVIEWS.map(x => x.author).join(" "));') ; do grep -l "$q" site/dist/**/index.html >/dev/null || echo "MISSING $q"; done
```

Drift guard after §C or §D:

```bash
# Confirm no literal testimonialItems array remains (every match should be the .map form).
git grep -n 'const testimonialItems' -- 'site/src/components/page-bodies/'
```

## When to escalate

Stop and ask before proceeding if:

- The user asks to translate a review quote. TripAdvisor policy (and this skill) requires preserving the original language of the reviewer's text.
- The user asks to add a Berlin review. No Berlin data or Berlin JSON-LD `aggregateRating` exists; this is pre-launch work.
- The requested rating or review count **decreases** the delta from TripAdvisor source materially (for example, rating jumps from `4.9` → `4.1` without a corresponding review-count surge that could explain the shift). Confirm with the user before committing — it is usually a fat-finger error on our side.
- The user asks to remove the TripAdvisor link entirely (touches `docs/seo/decisions.md` `SEO-0012` — review rendering integration decision, not a content change).
- A new quote the user provides does not appear to come from the TripAdvisor page. JSON-LD `Review` nodes on the Museum page assert that these are real external reviews; fabricating them creates a Google Rich Results violation.

## Examples

### Example 1: TripAdvisor shows 210 reviews and rating 4.8 today

Action:

1. Edit `site/src/lib/content/stockholm-reviews.ts`:
   - `ratingValue: "4.9"` → `"4.8"`.
   - `reviewCount: 193` → `210`.
   - `fiveStarReviewCount: 179` → whatever the vendor shows (e.g. `192`).
   - `Last verified: 2026-04-13` → today's date.
2. `npm test && npm run build` from `site/`.
3. Spot check: grep `dist/sv/stockholm/index.html` for `4,8` and `210 recensioner`. Grep `dist/en/stockholm/besokaromdomen/index.html` for `4.8` and `210 reviews`. Grep JSON-LD in `dist/en/stockholm/tickets/index.html` for `"ratingValue":"4.8"` and `"reviewCount":210` (number, not string).

### Example 2: Add a new featured review from "Astrid"

Action:

1. Verify the new review exists on the TripAdvisor page.
2. Append to `STOCKHOLM_FEATURED_REVIEWS` in `stockholm-reviews.ts`:

   ```ts
   {
     author: "Astrid",
     quote: "…exact quote as written on TripAdvisor…",
     datePublished: "2026-04-21",
     ratingValue: "5",
   },
   ```

3. Sync both SEO-landing `testimonialItems` arrays (`StockholmSeoLandingSv.astro`, `StockholmSeoLandingEn.astro`) and `StockholmHomeSharedBody.astro`. Insert the same entry at the same index; keep field order.
4. `npm test && npm run build`. Grep `dist/` for `Astrid` to confirm the name appears on the Stockholm home, besökaromdömen (via schema-org review array), and the SEO landings.

### Example 3: TripAdvisor moved the attraction to a new URL

Action:

1. Edit `STOCKHOLM_TRIPADVISOR_URL` to the new URL.
2. Update the `Source:` comment line and `Last verified` in `stockholm-reviews.ts`.
3. `git grep "tripadvisor.com/Attraction_Review-g189852-d32883203"` must return only the updated new URL plus any `docs/` references that intentionally pin the old.
4. `npm test && npm run build`. Check `dist/sv/stockholm/besokaromdomen/index.html` for the new link.
