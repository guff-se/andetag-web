---
name: faq
description: Use when adding, editing, or removing FAQ entries on the ANDETAG Astro site (site/). Triggers include "add a Stockholm FAQ question", "update the Swedish FAQ answer about photography", "remove the English FAQ entry on age limits", or any change to the FAQ accordions on the Stockholm home page, the Stockholm SEO landings, or the dedicated FAQ pages at /sv/stockholm/fragor-svar/ and /en/stockholm/faq/.
---

## Purpose

Maintain the Stockholm FAQ content (Swedish + English) so that the full FAQ pages, the marketing accordions on home and SEO landings, and the `FAQPage` JSON-LD schema all stay in sync and locale-paired.

This skill is **not** for:

- Adding a whole new page or moving the FAQ to a new URL (see `skills/page/SKILL.md`).
- Operational facts like opening hours or ticket prices that appear in the FAQ answer copy — update them through `skills/operational-facts/SKILL.md`; the answers re-read the shared source.
- Testimonials, reviews, or `aggregateRating` (see `skills/testimonials/SKILL.md`).
- Berlin FAQ — no Berlin FAQ data files exist yet; Berlin is pre-launch. If the user asks for a Berlin FAQ entry, **escalate**.

## When to use

- The user wants to **add** a new Stockholm FAQ question and answer (both Swedish and English).
- The user wants to **edit** an existing answer (copy change, link change, clarification).
- The user wants to **remove** a question that no longer applies.
- The user wants to **reorder** questions within a column (LEFT / RIGHT split on the full FAQ pages).

## Files touched

Read before editing. All paths relative to repo root.

| Area | File | Notes |
|------|------|-------|
| FAQ single source of truth | `site/src/lib/content/stockholm-faq.ts` | Exports `FaqItem` type (`title`, optional `titleHtml`, `bodyHtml`), `STOCKHOLM_FAQ_EN_LEFT`, `STOCKHOLM_FAQ_EN_RIGHT`, `STOCKHOLM_FAQ_SV_LEFT`, `STOCKHOLM_FAQ_SV_RIGHT`, and combined arrays `STOCKHOLM_FAQ_EN` and `STOCKHOLM_FAQ_SV`. Combined arrays feed JSON-LD `FAQPage.mainEntity`. |
| Shared "What is ANDETAG?" copy | `site/src/lib/page-registry/stockholm-what-is-andetag-faq-copy.ts` | Exports `WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML` and `WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML`. Imported by `stockholm-faq.ts` **and** by the marketing FAQ files so the home and FAQ pages never drift. Edit here when the "What is ANDETAG?" answer changes; full FAQ pages append a "Read more…" link in the combined `bodyHtml`. |
| Home / SEO landing marketing FAQ | `site/src/lib/page-registry/stockholm-marketing-faq-sv.ts`, `stockholm-marketing-faq-en.ts` | Exports `stockholmMarketingFaqSv` and `stockholmMarketingFaqEn` (5 items each). Used by `StockholmHomeSv/En.astro` and `StockholmSeoLandingSv/En.astro`. Curated subset, not all questions from the full FAQ. Adjust when the user wants a question promoted to the home accordion. |
| Full FAQ page bodies | `site/src/components/page-bodies/FragorSvarSv.astro`, `FragorSvarEn.astro` | Render two `<AccordionSection>` instances (LEFT column + RIGHT column) consuming the data from `stockholm-faq.ts`. Usually no edits needed — the data file is the source. |
| Accordion component | `site/src/components/content/AccordionSection.astro` | Receives `items: AccordionItem[]`. Each item: `title`, optional `titleHtml`, and `bodyHtml` (or `body`). Do not edit the component to change content. |
| FAQPage JSON-LD | `site/src/lib/chrome/schema-org.ts` | `FAQ_PATHS` (near top of file) maps `/en/stockholm/faq/` → `STOCKHOLM_FAQ_EN` and `/sv/stockholm/fragor-svar/` → `STOCKHOLM_FAQ_SV`. `faqPageNode()` emits one `Question` per entry with plain-text `name` (from `title`) and HTML `text` (from `bodyHtml`). Touched only if adding a new FAQ page or a new locale. |
| Schema tests | `site/src/lib/chrome/schema-org.test.ts` | Asserts FAQPage is emitted on the two FAQ paths with the correct number of `mainEntity` rows and absent elsewhere. Adding or removing entries will change the expected count. |

## Locale parity rules

**Stockholm FAQ is `sv + en` and must stay paired.** Every add, edit, or remove must land in both languages in the same change.

- Questions do **not** need to be a 1:1 translation. Swedish has 15 items, English has 14; they cover the same visitor intent with locale-appropriate wording. Do not force parity by count — parity is about concept coverage, not row count.
- When adding a new question, add it to **both** `STOCKHOLM_FAQ_EN_*` (usually LEFT or RIGHT) **and** `STOCKHOLM_FAQ_SV_*`. Ask the user for both languages; do not machine-translate without confirmation.
- If the user only provides one language, ask for the other or propose a Swedish/English version grounded in `docs/Tone of Voice.md` and confirm before committing.
- **Berlin FAQ:** no data files exist. If the user asks for a Berlin FAQ entry, stop and escalate — creating the Berlin FAQ scaffold is a page-skill task (new pages + new data file + new schema wiring), not an FAQ-skill task.

## Workflow

### Add a new question

1. Decide column placement on the full FAQ page (`LEFT` or `RIGHT`). LEFT holds the most common visitor-intent questions; RIGHT holds more specific / logistical questions. Follow existing placement patterns.
2. In `site/src/lib/content/stockholm-faq.ts`, append one object to the chosen English array (`STOCKHOLM_FAQ_EN_LEFT` or `_RIGHT`). Shape:
   ```ts
   {
     title: "Plain text question (used verbatim in JSON-LD)",
     // titleHtml only if the title contains the ANDETAG wordmark; example:
     // titleHtml: 'What is <span class="brand-wordmark">ANDETAG</span>?',
     bodyHtml: "<p>Answer paragraph. <a href=\"/en/stockholm/tickets/\">Contextual link.</a></p>",
   }
   ```
   Copy follows `docs/Tone of Voice.md` — no em dash (U+2014) or en dash (U+2013) in answer prose; use commas, colons, or parentheses.
3. Repeat for the Swedish array (`STOCKHOLM_FAQ_SV_LEFT` or `_RIGHT`). Same Tone of Voice rules apply: no em dash, no en dash, commas or colons instead.
4. If the new question belongs on the home accordion too, append a summarised object to `stockholmMarketingFaqSv` **and** `stockholmMarketingFaqEn`. Keep the marketing list ≤ 6 items; if it's already full, do not grow it — ask the user which existing marketing question to replace.
5. **Internal links:** answers that reference other pages must link using canonical URLs (`/sv/stockholm/biljetter/`, `/en/stockholm/tickets/`, etc.), same-language, and anchor text keyword-aligned (`docs/Andetag SEO Manual.md` §15). Never link across languages.
6. Verification: §Verification. FAQPage tests assert exact mainEntity counts — update `schema-org.test.ts` expectations if the total per locale changed.

### Edit an existing answer

1. Locate the entry by its `title` in `stockholm-faq.ts`. If it's the "What is ANDETAG?" row, edit the **shared** copy at `site/src/lib/page-registry/stockholm-what-is-andetag-faq-copy.ts` instead so home and FAQ pages do not drift.
2. Update `bodyHtml` (or `title` / `titleHtml` if the question itself is changing). Edit the Swedish peer in the same change.
3. If the question is also on the marketing accordion, update `stockholmMarketingFaqSv` / `-en.ts` too so home and FAQ stay aligned.
4. Verification: §Verification.

### Remove a question

1. Remove the entry from the relevant `STOCKHOLM_FAQ_{LANG}_{LEFT|RIGHT}` array in `stockholm-faq.ts`.
2. Remove from the marketing list (`stockholm-marketing-faq-{sv|en}.ts`) if present.
3. If the answer body was the only place a specific internal link appeared, check whether other FAQ or page copy should carry that link instead (SEO Manual §15 hub-and-spoke rule).
4. Update the expected counts in `schema-org.test.ts` (the FAQ test cases pin the number of Questions emitted per locale).
5. Verification: §Verification.

### Reorder within a column

1. Reorder the objects in the relevant array in `stockholm-faq.ts`. Order drives both accordion display and `mainEntity` order in JSON-LD.
2. No other file changes needed (marketing lists are separate curated subsets).
3. Verification: §Verification.

## Verification

Run from `site/`.

```bash
npm test          # schema-org tests enforce FAQPage shape and mainEntity counts
npm run build     # static build; confirms AccordionSection renders updated items
```

Pass means:

- `npm test` exits 0.
- `npm run build` exits 0 and produces 65 pages (or the current expected count).
- If counts changed, update `site/src/lib/chrome/schema-org.test.ts` expectations in the same change.

Spot-check (recommended for content changes):

- Open `site/dist/en/stockholm/faq/index.html` and `site/dist/sv/stockholm/fragor-svar/index.html` after build; verify the new or edited text appears in the accordion markup.
- Grep the JSON-LD in the same HTML (`<script type="application/ld+json">`) for the new `Question.name` to confirm schema emission.

## When to escalate

Stop and ask the user before proceeding if:

- The user requests a **single-locale** Stockholm FAQ change without explicit intent to skip the pair.
- The user asks for a **Berlin** FAQ entry (no data scaffold exists; this is a page-skill task, not an FAQ-skill task).
- The new question implies a fact that is not documented elsewhere in the repo (opening hours, price, policy). Get the user to confirm or escalate to Gustaf rather than inventing.
- The edit would remove an internal link that forms part of the hub-and-spoke SEO cluster documented in `docs/Andetag SEO Manual.md` §15.

## Examples

### Example 1: add a question about photography

The user says: *"Add an FAQ entry to both Swedish and English: 'Is photography allowed?' Answer: yes, without flash, and without blocking other visitors. Put it on the full FAQ page, not the home accordion."*

Action:

1. Append one object to `STOCKHOLM_FAQ_EN_RIGHT` (logistical row) in `site/src/lib/content/stockholm-faq.ts`:
   ```ts
   {
     title: "Is photography allowed?",
     bodyHtml: "<p>Yes. Photos without flash are welcome. Please step aside so other visitors can continue at their own pace.</p>",
   }
   ```
2. Append the Swedish peer to `STOCKHOLM_FAQ_SV_RIGHT`:
   ```ts
   {
     title: "Får jag fotografera?",
     bodyHtml: "<p>Ja, foto utan blixt är välkommet. Tänk på att kliva åt sidan så andra besökare kan fortsätta i sin takt.</p>",
   }
   ```
3. Bump the expected `mainEntity` counts in `schema-org.test.ts` for both FAQ paths.
4. `npm test && npm run build` from `site/`. Verify the new entry appears in `dist/.../faq/index.html` and the FAQPage JSON-LD.

### Example 2: update the "What is ANDETAG?" answer (shared copy)

The user says: *"Change the English 'What is ANDETAG?' intro sentence to emphasise it's a sensory art museum, not an exhibition."*

Action:

1. Edit `WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML` in `site/src/lib/page-registry/stockholm-what-is-andetag-faq-copy.ts`. Edit the Swedish counterpart `WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML` in the same file.
2. Do not edit `stockholm-faq.ts` or the marketing FAQ files — they import the shared HTML.
3. `npm test && npm run build`. Spot-check the home accordion and both `/faq/` and `/fragor-svar/` dist HTML to confirm the change is visible everywhere the copy is consumed.
