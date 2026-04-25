---
name: operational-facts
description: Use when updating operational facts on the ANDETAG Astro site (site/). Triggers include "change the Stockholm opening hours", "update ticket prices", "the weekday daytime window is moving to 11-16", "change the public contact email", "update the street address", or any edit that touches hours, prices, the daytime window, contact info, address, or geo coordinates and must propagate to page copy, JSON-LD schema, and downstream consumers without drift.
---

## Purpose

Maintain a consistent, single-truth set of operational facts for the Stockholm venue so that page copy, JSON-LD schema, footer, and booking surfaces never drift. Some facts already have a single source (prices, season pass, daytime window text, Art Yoga metadata, address, geo); some do **not** (opening hours, contact email) — for those, this skill lists every file that must be edited together.

This skill is **not** for:

- Changing the structure of a page or its URL (see `skills/page/SKILL.md`).
- FAQ or testimonial content (see `skills/faq/SKILL.md`, `skills/testimonials/SKILL.md`).
- Event details other than Art Yoga metadata stored in `stockholm-offers.ts` (see `skills/events/SKILL.md`).
- Berlin operational facts — Berlin is pre-launch; escalate.

## When to use

- **Ticket or pass prices** change (regular, student/senior, youth, Art Yoga, season pass, daytime-price variants).
- **Daytime window text or hours** change (the "weekdays 12.00–17.00" band).
- **Opening hours** change (weekday schedule, adding or removing a day, holiday-specific overrides).
- **Public contact email** changes (today `info@andetag.museum`).
- **Address**, **geo coordinates**, or **phone** change for the Stockholm venue.

## Files touched

Paths are relative to the repo root.

### Centralised (single source of truth)

| Fact | Single source | Consumers (auto-propagate via import) |
|------|---------------|---------------------------------------|
| Ticket prices, ticket category names, daytime-price variants | `site/src/lib/content/stockholm-offers.ts` → `STOCKHOLM_TICKETS` | `BiljetterSv/En.astro`, `StockholmHomeSharedBody.astro`, `StockholmHomeSv/En.astro`, `StockholmSeoLandingSv/En.astro`, `NpfStockholmSv/En.astro`, `schema-org.ts` (`stockholmOffers()`) |
| Season pass price and duration | `stockholm-offers.ts` → `STOCKHOLM_SEASON_PASS` | `SasongskortSv/En.astro`, home pages |
| Daytime window text | `stockholm-offers.ts` → `STOCKHOLM_DAYTIME_WINDOW` (`descriptionSv`, `descriptionEn`) | `BiljetterSv/En.astro`, home pages, SEO landings, NPF pages |
| Art Yoga metadata (name, description, performer, booking URL, cadence, duration) | `stockholm-offers.ts` → `STOCKHOLM_ART_YOGA_EVENT` | `ArtYogaSv/En.astro`, `schema-org.ts` (`artYogaEventNodes()`) |
| Currency | `stockholm-offers.ts` → `STOCKHOLM_CURRENCY` (`"SEK"`) | `schema-org.ts` offer and event nodes |
| Address | `site/src/lib/chrome/schema-org.ts` → `STOCKHOLM_ADDRESS` | `schema-org.ts` (Museum node). Page bodies currently render address as prose; verify match. |
| Geo coordinates | `site/src/lib/chrome/schema-org.ts` → `STOCKHOLM_GEO` | `schema-org.ts` (Museum `geo`) |

### Not centralised (edit every listed file in the same task)

| Fact | All locations that must change together |
|------|-----------------------------------------|
| **Opening hours** | (1) `site/src/components/page-bodies/OppettiderSv.astro` — prose list (`Måndag: Stängt`, `Tisdag–Lördag: 12.00–20.00`, `Söndag: 12.00–17.00`). (2) `site/src/components/page-bodies/OppettiderEn.astro` — English equivalent. (3) `site/src/lib/chrome/schema-org.ts` → `STOCKHOLM_OPENING_HOURS` array (two `OpeningHoursSpecification` entries: Tue–Sat 12–20, Sun 12–17; Monday omitted = closed). Any other page body that references hours in copy (home, SEO landings). |
| **Public contact email** | (1) `site/src/lib/ui-logic/booking-embed-contact.ts` → `CONTACT_HTML` (sv/en/de) and `getBookingEmbedContactHtml()`. (2) `site/src/lib/chrome/schema-org.ts` Museum node `email` field (search `info@andetag.museum`). (3) Every page body that renders a `mailto:` link or shows the address in prose, including: `StockholmHomeSharedBody.astro`, `StockholmHomeSv.astro`, `StockholmSeoLandingSv/En.astro`, `GruppbokningSv/En.astro`, `ForetagseventSv/En.astro`, `NpfStockholmSv/En.astro`, `TillganglighetSv.astro` (and any new body bodies added since). **Use grep** (see §Verification) to find every occurrence before editing. |
| **Phone** | Not defined anywhere yet. If introducing a phone number, centralise it in `stockholm-offers.ts` or `schema-org.ts` and consume from there, do not hardcode in page bodies. |

If you find yourself touching more than one of the non-centralised facts often, note a maintenance-backlog item in `docs/maintenance-backlog.md` (already tracks `M-0001` opening hours and `M-0002` contact email centralisation).

## Locale parity rules

- Stockholm is `sv + en`. Hours, prices, daytime window text, and any prose-rendered address or email appear in both languages. Edit both in the same task.
- Prices are numeric and locale-agnostic — the value in `stockholm-offers.ts` flows to both locales. Ticket category names (`nameSv`, `nameEn`) must be updated together.
- Opening-hour **schema** (`STOCKHOLM_OPENING_HOURS`) is language-agnostic (uses ISO day codes `Tuesday`, `Saturday`, etc.). Only the prose on `OppettiderSv/En` is locale-specific.
- The daytime window `descriptionSv` / `descriptionEn` must stay consistent (same time range, same weekday scope) — only the surrounding words differ per language.
- `Europe/Stockholm` is the only timezone. Do not convert to UTC in prose or schema.

## Workflow

### A. Change a ticket price

1. Edit the relevant row(s) in `STOCKHOLM_TICKETS` in `site/src/lib/content/stockholm-offers.ts`. For a daytime-pricing variant, update `daytimePrice` on the same row.
2. Prices propagate automatically to every consumer (home pages, SEO landings, NPF, tickets page, season pass, JSON-LD `stockholmOffers()`). No other files need editing.
3. Update `site/src/lib/chrome/schema-org.test.ts` expectations: the "includes offers on the Stockholm Museum node" test pins the regular ticket price (e.g. `"240"`) and offer count; update the numeric value and any `toBeGreaterThanOrEqual` bound if you added or removed categories.
4. Verification: §Verification.

### B. Change the season pass price or duration

1. Edit `STOCKHOLM_SEASON_PASS` in `stockholm-offers.ts`.
2. No schema test currently pins this value, but spot-check the season pass pages (`SasongskortSv/En`) render the new number.
3. Verification: §Verification.

### C. Change the daytime window text or hours

1. Edit `STOCKHOLM_DAYTIME_WINDOW.descriptionSv` and `descriptionEn` in `stockholm-offers.ts`. Keep the two descriptions expressing the same fact in the respective language (weekdays, HH.MM–HH.MM format).
2. If the window hours themselves change (e.g. 12.00–17.00 → 11.00–16.00), also verify that the daytime-price variant rows in `STOCKHOLM_TICKETS` still make sense, and that copy mentioning the window elsewhere (home page intros, SEO landings) still reads correctly after propagation.
3. Verification: §Verification.

### D. Change Art Yoga metadata

See `skills/events/SKILL.md` §A. This skill does not duplicate that workflow.

### E. Change opening hours

Non-centralised — every location must change together.

1. Edit **`site/src/components/page-bodies/OppettiderSv.astro`** (prose list). Use period separators in Swedish (`12.00–20.00`). Closed days say `Stängt`.
2. Edit **`site/src/components/page-bodies/OppettiderEn.astro`** (English equivalent). Typical format: `Tuesday–Saturday: 12.00–20.00`. Closed days say `Closed`.
3. Edit **`STOCKHOLM_OPENING_HOURS`** in `site/src/lib/chrome/schema-org.ts`. Each `OpeningHoursSpecification` takes `dayOfWeek` (array of `"Tuesday"`, `"Saturday"`, etc.), `opens`, `closes` (HH:MM:SS). **A day that is not listed is implicitly closed.** To mark Monday closed, omit it from the array (current pattern).
4. Grep the repo for any other hour references that may have been inlined into page copy or CSS (see §Verification). Update them. If the repeated references are growing, raise maintenance-backlog item `M-0001` for centralisation.
5. Verification: §Verification. Spot-check `dist/sv/stockholm/oppettider/index.html`, `dist/en/stockholm/opening-hours/index.html`, and any `dist/.../index.html` that embeds the Museum JSON-LD (home, all SEO landings).

### F. Change the public contact email

Non-centralised — every `mailto:` and every prose occurrence must change together.

1. **Grep first**: `git grep "info@andetag.museum" -- 'site/'` to list every file touching the email. Expect ~13 page bodies, `booking-embed-contact.ts`, and `schema-org.ts`.
2. Update **`site/src/lib/ui-logic/booking-embed-contact.ts`** — `CONTACT_HTML` for each locale (`sv`, `en`, `de`).
3. Update the **Museum node `email`** in `site/src/lib/chrome/schema-org.ts` (search for the literal string; single occurrence).
4. Update every page body returned by grep. Check both prose lines and `href="mailto:…"` links.
5. If the change is also a policy change (migrating away from `info@andetag.museum` entirely), update §Decisions below ("Public contact inbox") with the new decision and date.
6. Consider raising maintenance-backlog item `M-0002` (centralisation) if not already open.
7. Verification: §Verification. `git grep "<old-email>"` must return empty across `site/` after the change.

### G. Change the venue address or geo coordinates

1. Edit `STOCKHOLM_ADDRESS` and/or `STOCKHOLM_GEO` in `site/src/lib/chrome/schema-org.ts`.
2. Check page bodies that render the address as prose (typically `HittaHitSv/En.astro` and the footer). Update both sv and en copy to match the new address.
3. Check schema tests for any pinned values on address or geo and update.
4. If the address change implies a different legal entity or operator, escalate before touching JSON-LD.
5. Verification: §Verification.

## Verification

Run from `site/`.

```bash
npm test          # 29 files, 134 tests at time of writing
npm run build     # 65 pages
```

Pass means both exit 0. If offers or Art Yoga counts changed, update `site/src/lib/chrome/schema-org.test.ts` expectations.

Spot-check after build:

```bash
# From repo root
git grep "240" site/src/ site/dist/                # price string propagation (adjust number)
git grep "12.00" site/dist/                         # hours propagation
git grep "info@andetag.museum" site/               # contact email; should match expected consumer set
grep "openingHoursSpecification" site/dist/ | head # schema hours present
```

For opening-hour changes, diff the built `dist/sv/stockholm/oppettider/index.html` and the Museum JSON-LD embedded on the home page; both must reflect the new hours.

## When to escalate

Stop and ask before proceeding if:

- The user changes a price but does not provide a currency (assume `SEK` unless told otherwise — ask if unsure).
- The user asks to introduce a **new** operational fact (phone number, secondary address) — decide the single source up front.
- The user requests a **holiday hours override** (single-day exception). The current schema has no mechanism for date-bounded `OpeningHoursSpecification`; treat this as a design question and escalate.
- The user changes the email to a non-`andetag.museum` address, which contradicts the policy recorded in §Decisions below ("Public contact inbox").
- The user requests a price change that would break the daytime-price relationship (e.g. daytime higher than regular).

## Examples

### Example 1: raise the regular ticket price to 260

Action:

1. In `site/src/lib/content/stockholm-offers.ts`, set the regular ticket `price: 260`. If a `daytimePrice` exists on that row, confirm with the user whether it should also rise.
2. In `site/src/lib/chrome/schema-org.test.ts`, update the expected `"240"` to `"260"` (and the offer-count lower bound if needed).
3. `npm test && npm run build` from `site/`. Grep `dist/` for `"240"` to confirm no stale strings; grep for `"260"` to confirm propagation across home, tickets, SEO landings, NPF pages, and JSON-LD.

### Example 2: move Sunday opening from 12.00 to 11.00

Action:

1. Edit `OppettiderSv.astro`: `Söndag: 11.00–17.00`.
2. Edit `OppettiderEn.astro`: `Sunday: 11.00–17.00`.
3. In `schema-org.ts`, find the `STOCKHOLM_OPENING_HOURS` entry with `dayOfWeek: ["Sunday"]` and set `opens: "11:00:00"`.
4. `npm test && npm run build`. Spot-check built dist HTML.
5. Consider adding an opening-hours assertion in `schema-org.test.ts` as a future-proofing follow-up (there is no test today).

### Example 3: change contact email to `hello@andetag.museum`

Action:

1. `git grep "info@andetag.museum" -- 'site/'`. Review the result list.
2. Update `booking-embed-contact.ts` (`CONTACT_HTML` for sv, en, de).
3. Update `schema-org.ts` Museum node `email`.
4. Update every page body in the grep result (sv + en pairs together). Preserve prose wording around the email.
5. Update §Decisions below ("Public contact inbox") with the new email and a dated decision line.
6. `git grep "info@andetag.museum" -- 'site/'` must return empty.
7. `npm test && npm run build`.

## Decisions

Durable operational decisions that survive Phase 9 archive. Each row stays in force until explicitly overturned by a new dated entry.

### Public contact inbox

- **Decision:** Public contact email is `mailto:info@andetag.museum` (canonical ANDETAG domain). It propagates to: `BookingEmbed` `.booking-embed-contact` (`booking-embed-contact.ts`, sv/en/de), Stockholm home and SEO landings, FAQ accordions, group and corporate CTAs, NPF and accessibility copy, English FAQ, JSON-LD `email` (`schema-org.ts`), press footer line. Visible addresses use `mailto:` links.
- **History:** Adopted 2026-03-23 (replacing legacy WP `mailto:info@tadaa.se`). Extended beyond booking-adjacent copy 2026-04-16. Carries from `EX-0010` in the legacy `docs/migration-exceptions.md`.
- **Rationale:** Align public inbox with the ANDETAG domain.
- **Approval:** Gustaf.
- **Override:** Update this row with a new date line and the new address; then re-run §F.
