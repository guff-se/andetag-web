---
name: events
description: Use when adding, updating, or removing an event on the ANDETAG Astro site (site/). Triggers include "add a concert on 2026-05-12", "give this concert its own page", "add a new recurring workshop with its own page", "change a recurring program's description", "remove the workshop block from the Stockholm home page", "update the Understory booking link for the upcoming performance", and any edit that touches event copy, booking CTAs, event dates, or Event JSON-LD. New URLs (recurring or single-date event) use `skills/page/SKILL.md` first—Art Yoga is the current recurring-with-page example.
---

## Purpose

Keep event content on the Stockholm pages accurate, locale-paired, and schema-consistent. Covers these shapes of event:

1. **Recurring events with their own page** — A program that repeats on a schedule, has a canonical `sv`/`en` page pair, shared metadata in `stockholm-offers.ts`, optional occurrence helpers for “next instance” and JSON-LD, and `Event` nodes in the venue graph. *Art Yoga is the only such recurring event in the codebase today*; it is the **reference implementation**, not a special case in the abstract workflow.
2. **One-off (single-date) events** — May exist **only** as a block on the Stockholm home, **only** as a dedicated `sv`/`en` page pair, or **both** (e.g. home teaser that links to a detail page). A single concert or workshop is not required to be home-only: **if the user asks for a dedicated page**, add it with **`skills/page/SKILL.md` first** (new URLs), **then** wire copy, CTA, images, and optional one-off `Event` JSON-LD (`startDate` / `endDate` — no `eventSchedule` unless it is truly recurring).

**Relationship to the page skill:** `skills/page/SKILL.md` owns **new canonical URLs** (registries, `[...slug].astro` wiring, shell meta, nav, minimal body pair). It deliberately does *not* author event semantics. For **any** new event that needs its own page — **recurring or one-off** — **run the page skill first** (add the page pair and shells), **then** return here. For recurring programs, add/extend the offer object, JSON-LD, occurrence math, and bodies. For one-off pages, add bodies (and shared content in `stockholm-offers.ts` or local constants, per existing patterns) plus optional schema. This skill may reference the page skill’s “Add a new page pair” workflow by path and file list; it does not duplicate that checklist.

This skill is **not** for:

- **Routing, hreflang pair rows, or page-shell-only work** in isolation—use `skills/page/SKILL.md`. After the page exists, use *this* skill for event data and booking wiring.
- Ticket prices, opening hours, or other operational facts that are not event-specific (see `skills/operational-facts/SKILL.md`). Event pages often consume `stockholm-offers.ts` alongside other offer rows.
- Image derivative generation for an event hero (follow `docs/responsive-image-workflow.md` directly).
- Berlin events — Berlin is pre-launch and has no event data model; escalate if asked.

## When to use

- Adding a **one-off event block** (concert, workshop, temporary experience) to the Stockholm home pages, **or** a **one-off with its own page** (page skill first, then this skill — see §D).
- Adding or editing a **recurring event with its own page**: metadata, schedule, booking URL, performer, JSON-LD window, or body copy. (New URLs: page skill first, then this skill.)
- **Editing a one-off** — Always **check where it is surfaced**: dedicated page body (`site/src/components/page-bodies/`), home block, `stockholm-offers.ts` (if the event is centralized there), and `schema-org.ts` (if it has `Event` JSON-LD). Update **every** location that still applies so copy and links stay in sync; do not assume “home only.”
- Removing a past or cancelled one-off event (home block, detail page, schema — see §E).
- Changing how many future occurrences a recurring in-page program emits in JSON-LD (see **Art Yoga** and `ART_YOGA_SCHEMA_WEEKS` as the concrete pattern).

For a **wholly new canonical URL** — whether for a **recurring** program or a **one-off** event page — use `skills/page/SKILL.md` to create the pair and shells, **then** use this skill for offers (if any), schema, and event bodies.

## Files touched

Read before editing. All paths relative to repo root. **Art Yoga** is named throughout as the *live* example; a second recurring program would add parallel files or extend shared modules as appropriate.

| Area | File | Notes |
|------|------|------|
| Offer + event metadata | `site/src/lib/content/stockholm-offers.ts` | e.g. `STOCKHOLM_ART_YOGA_EVENT` (language-aware name + description, `performer`, `pathSv`/`pathEn`, `bookingUrl`, `schedule` with `repeatFrequency`, `byDay`, `startTime`, `endTime`, `scheduleTimezone`, `durationIso`) and ticket/pass prices. Single source of truth — do not hardcode prices or event names in page bodies. **New recurring event:** add a parallel exported object and keep one source for names, dates, and offers. |
| Occurrence helper (per recurring program) | e.g. `site/src/lib/chrome/art-yoga-next-occurrence.ts` | Exports `computeNextArtYogaOccurrenceIso(now)` and `computeArtYogaOccurrenceSeriesIso(count, now)`. **Art Yoga** uses a 42-day window, Tuesday 17:00–18:00 `Europe/Stockholm` (DST-aware). A new program needs its own module (or a shared generic helper) with tests. |
| Occurrence tests | e.g. `site/src/lib/chrome/art-yoga-next-occurrence.test.ts` | Update when cadence or window rules change. |
| Event page bodies | e.g. `ArtYogaSv.astro`, `ArtYogaEn.astro` | `sv + en` parity. Uses `ContentSection`, `HeroSection`, `BookingEmbed` (or CTA to Understory). **New recurring page:** add `*Sv.astro` / `*En.astro` per page skill, then fill using offer imports. |
| One-off: home block | `site/src/components/page-bodies/StockholmHomeSv.astro`, `StockholmHomeEn.astro` | Pattern: local `const eventBookingHref`, `const eventMarkdown = [...]`, `<div class="page-stockholm-home__<slug>">` with `ContentSection` + `ButtonGroup`. Both files in one task. |
| One-off: dedicated page | e.g. custom `*Sv.astro` / `*En.astro` under `page-bodies/` | If the one-off has its own URL, page bodies are wired via `[...slug].astro` per **page skill**. Edit those bodies when the event is not (or not only) on the home. |
| Block styles | `site/src/styles/components.css` (or home CSS module) | Named class per block; mirror existing home event sections. |
| Responsive image constants | `site/src/lib/content/stockholm-body-responsive-images.ts` | `BodyPictureSources` for event heroes (e.g. `artYogaHeroCover`). Derivatives per `docs/responsive-image-workflow.md`. |
| Booking embed | `site/src/components/embeds/BookingEmbed.astro` | Reuse Stockholm `companyId`. Event booking links use real Understory experience URLs. |
| Event JSON-LD | `site/src/lib/chrome/schema-org.ts` | e.g. `artYogaEventNodes(language)` and `ART_YOGA_SCHEMA_WEEKS` for scheduled `Event` nodes with `eventSchedule`, `performer`, `offers`. New recurring program: add a parallel emitter and wire it into `buildStockholmVenueSchema`. |
| Schema tests | `site/src/lib/chrome/schema-org.test.ts` | Assert counts, `@id` shape, `eventSchedule`, `performer.name`, `offers.validFrom` as appropriate. |
| URL policy (rename only) | `site/public/_redirects`, `docs/url-matrix.csv` | Renames/removals of event pages: follow `skills/page/SKILL.md`. |

## Locale parity rules

- **Stockholm events are `sv + en`.** Every edit lands in both languages in the same task.
- **Swedish vs English date/time prose.** Swedish: `YYYY-MM-DD`, 24-hour time with period separator (`kl. 17.00`), weekday lowercase. English: 24-hour `17:00` with capitalised weekday. Human-readable in body; ISO in schema.
- **Timezone** is always `Europe/Stockholm` for Stockholm events. Do not use UTC in copy or JSON-LD for these.
- **No German Stockholm events.** Do not add `De` variants.
- **No Berlin events.** Berlin is pre-launch; escalate if asked.

## Workflow

### A. New recurring event with a dedicated page (generic)

The user wants a repeating program (weekly drop-in, monthly session, etc.) with its own `sv`/`en` URLs—not only a home block.

1. **`skills/page/SKILL.md` first** — Add the Swedish + English page pair, shell meta, `pageBodies` map entries, registries, navigation, and minimal `*Sv.astro` / `*En.astro` bodies (can mirror `ArtYogaSv.astro` / `ArtYogaEn.astro` structure). Do not fabricate titles or descriptions; align with `docs/Tone of Voice.md` and `docs/Andetag SEO Manual.md`.
2. **This skill — data and semantics** — In `stockholm-offers.ts`, add an exported object for the program (name/description both locales, `pathSv`/`pathEn`, `bookingUrl`, `schedule`, performer, offer linkage). Wire page bodies to import from that object, not hardcoded strings.
3. **Occurrence logic** — If you need “next date” or a series for JSON-LD, add a dedicated helper module (and tests) following the **Art Yoga** file pair; parameterise day, time, and window instead of copy-pasting only Art Yoga.
4. **JSON-LD** — Add or extend `schema-org.ts` so `Event` nodes match the schedule and offers; add/update `schema-org.test.ts`.
5. **Images** — If the page needs a hero, use `stockholm-body-responsive-images.ts` and the responsive-image workflow.
6. Verification: §Verification. Spot-check built HTML for both locales under `dist/…/<slug>/`.

**Concrete reference:** *Art Yoga* end-to-end (`STOCKHOLM_ART_YOGA_EVENT`, `art-yoga-next-occurrence.ts`, `ArtYoga*.astro`, `artYogaEventNodes`).

### B. Update an existing recurring in-page program (name, description, booking URL, performer, price)

Example implementation: **Art Yoga**.

1. Open `site/src/lib/content/stockholm-offers.ts`. Edit the relevant fields on the program’s offer object. Keep `nameSv` / `nameEn` and `descriptionSv` / `descriptionEn` parallel. `bookingUrl` must be the real Understory experience URL (from the user; do not guess).
2. Ensure changes flow to: page bodies that import the object; the corresponding `*EventNodes` (or equivalent) in `schema-org.ts`.
3. If the schedule changes (day, time, duration), update the offer’s `schedule`, the occurrence helper, and tests—**Art Yoga** hardcodes Tuesday 17:00–18:00 in `art-yoga-next-occurrence.ts` until refactored.
4. Verification: §Verification. Spot-check JSON-LD in built pages for that program (e.g. `dist/sv/stockholm/art-yoga/` for Art Yoga).

### C. Change the number of future occurrences in JSON-LD for a recurring in-page program

Example: **Art Yoga** uses `ART_YOGA_SCHEMA_WEEKS`.

1. Edit the constant and/or emitter in `site/src/lib/chrome/schema-org.ts`.
2. Update count assertions in `site/src/lib/chrome/schema-org.test.ts`.
3. Verification: §Verification.

### D. Add a one-off (single-date) event

**Choose the right path.** If the user wants **only** a home block, use **D1**. If they want **a dedicated `sv`/`en` page** (with or without a home teaser), use **`skills/page/SKILL.md` first** — that is **D2** — then wire content here.

#### D1. One-off: home block only

Example: a concert on 2026-05-12, Understory booking, Hanno Rödger performing, free drop-in.

1. **Get Understory URL from the user.** Never invent an experience ID. Confirm date/time, performer, price, booking URL before editing.
2. **Responsive image** (if the event has a hero portrait): follow `docs/responsive-image-workflow.md` to commit the master and generate `-640w.webp`, `-960w.webp`, `-960w.jpg` derivatives under `site/public/wp-content/uploads/…`. Export a `BodyPictureSources` constant in `site/src/lib/content/stockholm-body-responsive-images.ts` (e.g. `const concertHeroCover: BodyPictureSources = { … }`).
3. **Block skeleton in both home files** (`StockholmHomeSv.astro` **and** `StockholmHomeEn.astro`) — insert where the user wants relative to other home sections (e.g. an existing recurring block). Pattern (see git `96ca090` for shape):
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
   Mirror the English version with English paragraphs, heading (e.g. `"Concert – Tuesday 12 May, 19:00"`), and CTA label.
4. **CSS:** add rules for `.page-stockholm-home__<slug>` in `site/src/styles/components.css` (or the relevant home CSS file). Match spacing from neighbouring event blocks.
5. **JSON-LD (optional for one-offs).** If Rich Results are desired, add a function in `site/src/lib/chrome/schema-org.ts` returning a single `Event` node (`startDate` / `endDate`, not `eventSchedule` unless it is truly recurring). **Only if the user explicitly asks**; otherwise skip and note in the PR.
6. **Copy** — `docs/Tone of Voice.md`. Prices and facts: `stockholm-offers.ts` if there is a price row, else user-confirmed inline.
7. Verification: §Verification.

#### D2. One-off: dedicated page (user asked for a URL)

Use when the user wants a **full page** for a single date (concert, special evening, one-night workshop) — not only a strip on the home.

1. **`skills/page/SKILL.md`** — Add the `sv`/`en` pair, registries, `pageBodies`, nav (if the page should appear in nav), and minimal `*Sv.astro` / `*En.astro` bodies.
2. **This skill** — Fill the two page bodies: hero (if any), `ContentSection`, `BookingEmbed` and/or primary CTA to the real Understory experience URL, date/time in both locales. Reuse patterns from *Art Yoga* for layout, but use **single** `startDate` / `endDate` in any JSON-LD (no `eventSchedule` for a one-night event).
3. **Optional home teaser** — If the one-off should also appear on the home, add a **short block** in `StockholmHomeSv.astro` / `StockholmHomeEn.astro` that links to the new canonical path (or repeat key facts — avoid contradicting the detail page).
4. **JSON-LD** — Optional; if added, one `Event` with fixed `startDate` / `endDate` (see D1 step 5). Often preferable on the **event’s own page** rather than only on the venue graph; follow project patterns in `schema-org.ts`.
5. Verification: §Verification. Spot-check `dist/…` for both locales of the new path.

### E. Update a one-off (copy, date, booking, or removal)

**Before any edit:** find every place the one-off is represented — search `StockholmHomeSv.astro` / `StockholmHomeEn.astro`, `site/src/components/page-bodies/` for a matching body component, `stockholm-offers.ts`, and `schema-org.ts` for a dedicated `Event` node. Update or remove in **all** applicable locations.

**Remove (ended / cancelled):**

1. Remove home-block `const` pairs and the `<div class="page-stockholm-home__<slug>">` from **both** home files **if** the event appeared there.
2. If the one-off has **dedicated pages**, follow **`skills/page/SKILL.md`** to remove the pair (redirect, drop registries, delete bodies) or archive per product direction — do not leave orphan routes.
3. Drop unused `BodyPictureSources` from `stockholm-body-responsive-images.ts` if nothing else references them. Image files on disk are optional cleanup.
4. Remove CSS for a removed home block slug.
5. If the event had JSON-LD, remove the emitter and tests.
6. Verification: §Verification.

### F. Skipping or cancelling a single occurrence of a recurring program

No general skip mechanism exists today. **Art Yoga** assumes every valid weekday slot occurs. **Escalate** to Gustaf if one date must be excluded (e.g. holiday); do not add ad-hoc skip logic without a product decision. The same bar applies to any future occurrence helper with similar assumptions.

## Verification

Run from `site/`.

```bash
npm test          # includes occurrence + schema-org Event tests
npm run build     # static build; confirms pages render and JSON-LD parses
```

Pass means:

- `npm test` exits 0.
- `npm run build` exits 0 and the page count matches the project’s current expectation.
- If you changed schema occurrence counts, tests match.
- If you changed schedule cadence, occurrence test expectations match.

Spot-check:

- For recurring in-page programs: built `dist/…` HTML for each locale (e.g. Art Yoga: `art-yoga`), booking URL and copy.
- For one-off home blocks: `dist/sv/stockholm/index.html` and `dist/en/stockholm/index.html`.
- For one-off **dedicated** event pages: built `dist/sv/stockholm/<slug>/` and `dist/en/stockholm/<en-slug>/` (or as paired in `page-shell-registry.ts`).
- If schema changed, inspect `<script type="application/ld+json">` for `Event` fields.

## When to escalate

Stop and ask before proceeding if:

- The user asks to **skip a single occurrence** of a recurring program where the code assumes every slot is valid (true for **Art Yoga** today).
- The user asks for a **Berlin event** (no scaffold).
- A **one-off with JSON-LD** lacks reliable `startDate` / `endDate` / performer / price.
- The **booking URL** does not match the expected Understory pattern — confirm before wiring.
- The change would ship a **single-locale** Stockholm event without explicit approval.
- You need a **new URL** and have not yet applied **`skills/page/SKILL.md`** for the page pair (do the page skill first, then this one).

## Examples

### Example 1: move Art Yoga from Tuesdays to Thursdays (recurring in-page program)

*Art Yoga* is a concrete instance of §B.

The user says: *"Art Yoga is moving to Thursdays, same 17:00–18:00 slot."*

1. Edit `STOCKHOLM_ART_YOGA_EVENT.schedule.byDay` in `stockholm-offers.ts` from Tuesday to Thursday.
2. Edit `site/src/lib/chrome/art-yoga-next-occurrence.ts` to target Thursday (weekday index).
3. Update `site/src/lib/chrome/art-yoga-next-occurrence.test.ts` expectations.
4. Update prose in `ArtYogaSv.astro` and `ArtYogaEn.astro` (e.g. "Tisdagar" → "Torsdagar" / "Tuesdays" → "Thursdays"), including any heading that names the weekday.
5. `npm test && npm run build`. Confirm `Event` nodes in JSON-LD use Thursdays.

### Example 2: add a Saturday concert block on the home pages (one-off)

The user says: *"Add a concert block on the Stockholm home: Saturday 17 May 2026 at 19:00, performer Anna Hjelm, booking URL https://andetag.understory.io/experience/abc123, free drop-in, one short paragraph each language."*

1. Get copy in Swedish and English from the user (do not silent machine-translate).
2. Add image derivatives and export `concertAnnaHjelmCover: BodyPictureSources` if a hero is needed.
3. Insert blocks in `StockholmHomeSv.astro` and `StockholmHomeEn.astro` with the one-off pattern; add CSS.
4. Skip JSON-LD unless requested.
5. `npm test && npm run build`. Spot-check `dist/` home pages.

### Example 3: add a new recurring program with its own page (generic path)

The user says: *"We’re launching a monthly meditation circle; it needs pages under `/sv/stockholm/<sv-slug>/` and `/en/stockholm/<en-slug>/` with Understory booking."*

1. Complete **`skills/page/SKILL.md`** — new pair, registries, shells, `pageBodies`, nav, minimal bodies.
2. **This skill** — add the offer object, occurrence helper if the schedule is algorithmic, JSON-LD + tests, then fill the two page bodies and any hero images. Use *Art Yoga*’s file layout and imports as a template, not a name to reuse.

### Example 4: one-off event with its own page (user asked)

The user says: *"The May 17 concert should have its own page at `/sv/stockholm/.../` and `/en/stockholm/.../`, not just a blurb on the home."*

1. Run **`skills/page/SKILL.md`** to add the `sv`/`en` pair and body shells; decide with the user whether a **home teaser** still appears (linking to the new URLs).
2. **This skill** — fill the page bodies (copy, CTA, Understory URL, hero if any), optional JSON-LD with `startDate` / `endDate`.
3. If a home block for the same event already exists, **align or replace** it with a short teaser that points at the new pages (see §D2 step 3).
4. `npm test && npm run build`. Spot-check `dist/` for both locales and, if used, the home.
