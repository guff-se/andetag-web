---
name: events
description: Use when adding, updating, or removing an event on the ANDETAG Astro site (site/). Triggers include "add a concert on 2026-05-12", "change the Art Yoga description", "remove the workshop block from the Stockholm home page", "update the Understory booking link for the upcoming performance", and any edit that touches event copy, booking CTAs, event dates, or Event JSON-LD.
---

## Purpose

Keep event content on the Stockholm pages accurate, locale-paired, and schema-consistent. Covers two shapes of event: (a) the existing **recurring Art Yoga** event with its own page and dynamically computed JSON-LD, and (b) **one-off event blocks** rendered on the Stockholm home (and optionally SEO landings) with an Understory booking CTA.

This skill is **not** for:

- Creating a new **page** for an event that does not already have one (that's `skills/page/SKILL.md`; once the page exists, come back here to fill in the event copy and booking wiring).
- Ticket prices, opening hours, or other operational facts (see `skills/operational-facts/SKILL.md`). Event pages consume the same `stockholm-offers.ts` source.
- Image derivative generation for an event hero (follow `docs/responsive-image-workflow.md` directly).
- Berlin events — Berlin is pre-launch and has no event data model; escalate if asked.

## When to use

- Adding a **one-off event block** (concert, workshop, temporary experience) to the Stockholm home pages.
- Editing copy, date/time, performer name, or booking link for an existing event.
- Removing a past or cancelled one-off event.
- Adjusting Art Yoga metadata (name, description, performer, schedule window, booking URL, offer price).
- Changing the number of Art Yoga occurrences emitted in JSON-LD (`ART_YOGA_SCHEMA_WEEKS`).

Do **not** use this skill to create a wholly new URL for an event (e.g. `/sv/stockholm/konsert-2026-05-12/`). That's a page-skill task; return here once the shell and body files exist.

## Files touched

Read before editing. All paths relative to repo root.

| Area | File | Notes |
|------|------|-------|
| Offer + event metadata | `site/src/lib/content/stockholm-offers.ts` | Holds `STOCKHOLM_ART_YOGA_EVENT` (language-aware name + description, `performer`, `pathSv`/`pathEn`, `bookingUrl`, `schedule` with `repeatFrequency`, `byDay`, `startTime`, `endTime`, `scheduleTimezone`, `durationIso`) and all ticket/pass prices. Single source of truth — do not hardcode prices or event names in page bodies. |
| Art Yoga occurrence helper | `site/src/lib/chrome/art-yoga-next-occurrence.ts` | Exports `computeNextArtYogaOccurrenceIso(now)` and `computeArtYogaOccurrenceSeriesIso(count, now)`. Walks a 42-day window, emits Tuesday 17:00–18:00 `Europe/Stockholm` occurrences as `{ startDate, endDate }` ISO strings (DST-aware). Edit only if Art Yoga's cadence changes (e.g. Tuesdays → Thursdays). |
| Occurrence tests | `site/src/lib/chrome/art-yoga-next-occurrence.test.ts` | Exercises DST, Tuesday detection, the 42-day window, dedup. Update expectations if the cadence changes. |
| Event pages | `site/src/components/page-bodies/ArtYogaSv.astro`, `ArtYogaEn.astro` | The Art Yoga pair. `sv + en` parity required. Uses `ContentSection`, `HeroSection`, `BookingEmbed` (or a CTA button linking to the Understory experience). |
| One-off event blocks | `site/src/components/page-bodies/StockholmHomeSv.astro`, `StockholmHomeEn.astro` | Pattern for a one-off is: local `const eventBookingHref`, local `const eventMarkdown = [...]` HTML paragraphs, a `<div class="page-stockholm-home__<slug>">` wrapper containing `ContentSection` + `ButtonGroup`. Both files edited in the same task. |
| Block styles | `site/src/styles/components.css` (or the home page CSS module) | One-off event blocks commonly need a named class (`.page-stockholm-home__<slug>`) for spacing, column gaps, image aspect rules. Mirror existing event-block rules. |
| Responsive image constants | `site/src/lib/content/stockholm-body-responsive-images.ts` | Export a `BodyPictureSources` constant for any event hero or portrait (e.g. `artYogaHeroCover`). Derivatives are produced per `docs/responsive-image-workflow.md` (`640w.webp`, `960w.webp`, `960w.jpg`). |
| Booking embed | `site/src/components/embeds/BookingEmbed.astro` | Props: `companyId`, `language`, `fallbackText`, optional `heading`, `headingLevel`, `unframed`, `showContact`, `anchorId`, `unavailable`. Stockholm `companyId` is the existing Understory id in the file — reuse, don't invent. For event-specific booking, link out to the Understory experience URL (see pattern below). |
| Event JSON-LD | `site/src/lib/chrome/schema-org.ts` | `artYogaEventNodes(language)` emits `ART_YOGA_SCHEMA_WEEKS` dated `Event` nodes with `eventSchedule` (`P1W`, `byDay: Tuesday`, Europe/Stockholm), `performer`, `offers`. Injected by `buildStockholmVenueSchema`. Edit here when changing the number of occurrences, the performer, or the offer shape. |
| Schema tests | `site/src/lib/chrome/schema-org.test.ts` | Asserts the four Art Yoga `Event` nodes, their `@id` shape, `eventSchedule`, `performer.name`, `offers.validFrom`. Update if schema changes. |
| URL policy (rename only) | `site/public/_redirects`, `docs/url-matrix.csv` | Only if you rename or remove an event page — then follow `skills/page/SKILL.md`. |

## Locale parity rules

- **Stockholm events are `sv + en`.** Every edit lands in both languages in the same task.
- **Swedish vs English date/time prose.** Swedish uses `YYYY-MM-DD` civil dates and 24-hour time with period separator (`kl. 17.00`, weekday lowercase, e.g. `tisdag`). English uses the same 24-hour format written as `17:00` (`Tuesdays at 17:00`) with capitalised weekday. Dates in body copy are human-readable; ISO format is reserved for schema fields.
- **Timezone** is always `Europe/Stockholm`. Do not drop to UTC in copy or in JSON-LD.
- **No German Stockholm events.** Do not add `De` variants.
- **No Berlin events.** Berlin is pre-launch; escalate if asked.

## Workflow

### A. Update existing Art Yoga event (name, description, booking URL, performer, price)

1. Open `site/src/lib/content/stockholm-offers.ts`. Edit the relevant fields on `STOCKHOLM_ART_YOGA_EVENT`. Keep `nameSv` / `nameEn` and `descriptionSv` / `descriptionEn` parallel. `bookingUrl` must be the real Understory experience URL (get it from the user; do not guess).
2. Changes propagate automatically to:
   - `ArtYogaSv.astro` / `ArtYogaEn.astro` page bodies that import these fields.
   - `artYogaEventNodes()` in `schema-org.ts` (name, description, URL, performer, offer).
3. If the schedule window changes (day of week, time, duration), also edit `STOCKHOLM_ART_YOGA_EVENT.schedule` **and** the logic in `art-yoga-next-occurrence.ts` that hardcodes Tuesday 17:00–18:00. Update `art-yoga-next-occurrence.test.ts` expectations.
4. Verification: §Verification. Spot-check JSON-LD in the built `dist/sv/stockholm/art-yoga/index.html` and the Stockholm home HTML.

### B. Change the number of Art Yoga occurrences in JSON-LD

1. Edit `ART_YOGA_SCHEMA_WEEKS` in `site/src/lib/chrome/schema-org.ts`.
2. Update the count assertion in `site/src/lib/chrome/schema-org.test.ts` ("four Art Yoga Event nodes" → new count).
3. Verification: §Verification.

### C. Add a one-off event block to the Stockholm home

Example: a concert on 2026-05-12, Understory booking, Hanno Rödger performing, free drop-in.

1. **Get Understory URL from the user.** Never invent an experience ID. Confirm date/time, performer, price, booking URL before editing.
2. **Responsive image** (if the event has a hero portrait): follow `docs/responsive-image-workflow.md` to commit the master and generate `-640w.webp`, `-960w.webp`, `-960w.jpg` derivatives under `site/public/wp-content/uploads/…`. Export a `BodyPictureSources` constant in `site/src/lib/content/stockholm-body-responsive-images.ts` (e.g. `const concertHeroCover: BodyPictureSources = { … }`).
3. **Block skeleton in both home files** (`StockholmHomeSv.astro` **and** `StockholmHomeEn.astro`) — insert above or below Art Yoga per the user's placement preference. Pattern from prior one-off (see git `96ca090` for the shape):
   ```astro
   ---
   const concertBookingHref = "https://andetag.understory.io/experience/<id>";
   const concertMarkdown = [
     "<p>Swedish/English paragraph about the event…</p>",
     "<p>Second paragraph if needed…</p>",
   ];
   ---
   <div class="page-stockholm-home__concert">
     <ContentSection heading="Konsert – tisdag 12 maj kl. 19.00" markdown={concertMarkdown} />
     <ButtonGroup>
       <a class="button button--primary" href={concertBookingHref}>Boka plats</a>
     </ButtonGroup>
   </div>
   ```
   Mirror the English version with `"<p>English paragraph…</p>"`, English heading (`"Concert – Tuesday 12 May, 19:00"`), and English CTA label.
4. **CSS:** add rules for `.page-stockholm-home__concert` in `site/src/styles/components.css` (or the relevant home CSS file). Mirror spacing/column-gap patterns from existing event blocks (Art Yoga section) so the rhythm of the page stays consistent.
5. **JSON-LD (optional for one-offs).** If the event should appear in Rich Results, add a new function in `site/src/lib/chrome/schema-org.ts` that returns a single `Event` node (no `eventSchedule` — use `startDate` and `endDate` directly). Inject it into `buildStockholmVenueSchema`'s graph. Add a test in `schema-org.test.ts`. **Only do this if the user explicitly asks for schema coverage**; otherwise skip and note the omission in the PR body.
6. **Copy constraints.** Follow `docs/Tone of Voice.md` (calm, invitational, no urgency hype). Price and practical details must match the single source (`stockholm-offers.ts` if the event has a price row; otherwise inline after user confirmation).
7. Verification: §Verification.

### D. Remove a one-off event block (ended / cancelled)

1. Delete the `const eventBookingHref`, `const eventMarkdown`, and the `<div class="page-stockholm-home__<slug>">` block from **both** `StockholmHomeSv.astro` and `StockholmHomeEn.astro`.
2. Remove the `BodyPictureSources` export from `stockholm-body-responsive-images.ts` if the image is no longer used elsewhere. Leave the image file on disk; a dead reference breaks build, but an unused file does not (clean up separately via the maintenance backlog if wanted).
3. Remove `.page-stockholm-home__<slug>` CSS rules.
4. If the event had JSON-LD, remove the function and its wiring in `schema-org.ts` and the matching test in `schema-org.test.ts`.
5. Verification: §Verification.

### E. Skipping or cancelling a single Art Yoga occurrence

No mechanism exists today. `computeArtYogaOccurrenceSeriesIso` assumes every Tuesday is valid. **Escalate** to Gustaf if a specific Tuesday should be omitted (e.g. national holiday); do not add ad-hoc skip logic without a design decision.

## Verification

Run from `site/`.

```bash
npm test          # includes art-yoga-next-occurrence tests + schema-org Event-node tests
npm run build     # static build; confirms pages render and JSON-LD parses
```

Pass means:

- `npm test` exits 0.
- `npm run build` exits 0 and the page count matches current expectation (65 at time of writing).
- If you changed `ART_YOGA_SCHEMA_WEEKS`, the test count matches.
- If you changed the schedule cadence, `art-yoga-next-occurrence.test.ts` expectations match.

Spot-check:

- Grep `dist/sv/stockholm/art-yoga/index.html` and `dist/en/stockholm/art-yoga/index.html` for the updated booking URL and copy.
- For one-off events on the home, open `dist/sv/stockholm/index.html` and `dist/en/stockholm/index.html` and confirm the block renders with the right heading, copy, and CTA.
- If schema changed, grep the same HTML for the `<script type="application/ld+json">` block and verify `Event` `@id`, `startDate`, `endDate`, `performer.name`, `offers.validFrom`.

## When to escalate

Stop and ask before proceeding if:

- The user asks to **skip a single occurrence** of Art Yoga (no skip logic exists).
- The user asks for a **Berlin event** (no scaffold exists).
- The user requests a **one-off event with JSON-LD** but has not provided `startDate` / `endDate` / performer name / price with confidence.
- The user provides a **booking URL that does not match** the Understory domain pattern (`andetag.understory.io/experience/…`) — confirm before wiring.
- The change would introduce a **single-locale** event (sv-only or en-only) without explicit instruction to ship one locale.
- The change requires a **new event page** (new URL) — hand off to `skills/page/SKILL.md` first.

## Examples

### Example 1: move Art Yoga from Tuesdays to Thursdays

The user says: *"Art Yoga is moving to Thursdays, same 17:00–18:00 slot."*

Action:

1. Edit `STOCKHOLM_ART_YOGA_EVENT.schedule.byDay` in `stockholm-offers.ts` from Tuesday to Thursday.
2. Edit `site/src/lib/chrome/art-yoga-next-occurrence.ts` to target Thursday (currently hardcoded to Tuesday's weekday index).
3. Update `site/src/lib/chrome/art-yoga-next-occurrence.test.ts` expectations.
4. Update prose in `ArtYogaSv.astro` ("Tisdagar" → "Torsdagar") and `ArtYogaEn.astro` ("Tuesdays" → "Thursdays"), including the practical-info heading if it names the weekday.
5. `npm test && npm run build`. Confirm four `Event` nodes on the Stockholm home JSON-LD are on Thursdays.

### Example 2: add a Saturday concert block on the home pages

The user says: *"Add a concert block on the Stockholm home: Saturday 17 May 2026 at 19:00, performer Anna Hjelm, booking URL https://andetag.understory.io/experience/abc123, free drop-in, one short paragraph each language."*

Action:

1. Get copy from the user in both Swedish and English (do not machine-translate silently).
2. Add an image derivative set under `site/public/wp-content/uploads/2026/05/` per `docs/responsive-image-workflow.md`, export `concertAnnaHjelmCover: BodyPictureSources` from `stockholm-body-responsive-images.ts`.
3. Insert the block into `StockholmHomeSv.astro` and `StockholmHomeEn.astro` using the one-off pattern (Swedish heading `"Konsert – lördag 17 maj kl. 19.00"`, English `"Concert – Saturday 17 May, 19:00"`), with `ButtonGroup` CTA to the Understory URL and a hero image via `ResponsiveInlinePicture`.
4. Add `.page-stockholm-home__concert-anna-hjelm` CSS in `components.css`.
5. Skip JSON-LD unless the user requests schema coverage.
6. `npm test && npm run build`. Spot-check both home pages in `dist/`.
