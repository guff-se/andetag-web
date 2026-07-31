# ANDETAG – Tone of Voice Manual

## Purpose

This document defines the tone of voice of ANDETAG. It is intended for ad agencies and collaborators who will write new copy across paid ads, website, social media, PR, and partnerships. The goal is consistency: every word should feel like it comes from the same breath.

## Core Essence

**ANDETAG speaks slowly in a fast world.**

The voice is calm, grounded, and precise. It invites rather than convinces. It never shouts. It never rushes. It trusts the reader.

At its core, ANDETAG is about:

- Breath
- Presence
- Connection
- Stillness without passivity
- Depth without mysticism

The tone mirrors the experience itself: soft, intentional, and quietly powerful.

## Personality in One Sentence

Human, poetic, and restrained. Never salesy. Never vague.

## Key Tone Characteristics

### 1. Calm and Grounded

ANDETAG never uses urgency, hype, or pressure. There is no countdown language, no "don't miss out", no exaggerated claims.

The calm is confident, not shy.

**Avoid:**
Fast pacing, exclamation marks, promotional clichés.

**Aim for:**
Short sentences. Air between words. Space for the reader to breathe.

### 2. Poetic, but Concrete

The language is poetic, but always anchored in something physical: breath, body, light, fabric, rhythm.

Metaphors are allowed. Abstractions without grounding are not.

**Avoid:**
Over-spiritual language, vague transcendence, cosmic buzzwords.

**Aim for:**
Sensory precision. What does it feel like in the body?

### 3. Invitational, Not Instructional

ANDETAG does not tell people what to feel or who they are. It offers an invitation.

No self-help tone. No promises of transformation. The experience speaks for itself.

**Avoid:**
"You will feel…", "This will change you…"

**Aim for:**
"You are invited…", "A place to…"

### 4. Intelligent, Not Esoteric

The work is deep, but the language is clear. We trust the audience's intelligence and curiosity.

Technology, craft, and process can be mentioned plainly, without mystification.

**Avoid:**
New-age vocabulary, pseudo-science, ritual language without context.

**Aim for:**
Clarity. Respect. Quiet confidence.

### 5. Human and Sincere

ANDETAG speaks as a human presence, not as a brand voice trying to sound human.

First person plural ("we") is used sparingly and thoughtfully. Often, neutral descriptions are stronger.

**Avoid:**
Brand slogans. Marketing frameworks disguised as poetry.

**Aim for:**
Honest statements that stand on their own.

## Rhythm and Structure

- Prefer short paragraphs
- Use line breaks intentionally
- Silence is part of the voice
- One idea per sentence when possible

Reading ANDETAG copy should feel like slowing down.

## Punctuation

**In prose, dashes are prohibited under all circumstances.** This covers the em dash (U+2014, `—`) and the en dash (U+2013, `–`), and it applies to every sentence a reader meets: page copy, FAQ answers, headings, metadata, alt text, link labels, and documentation prose. Use a comma, a colon, or parentheses instead. A dash used as a parenthetical or a dramatic pause is always wrong here.

### The one exception: intervals

**A dash is correct when it means "to" between two values.** This is the ordinary typographic job of the en dash and is not a stylistic flourish:

- Times: `12.00 – 20.00`, `17:00–18:00`
- Days: `Tuesday–Saturday`, `Mon–Fri`
- Numbers and ages: `8–17 years`, `240–190 SEK`
- Reference ranges in code comments: `§L1–L6`, `~231–239`

Prefer the en dash for intervals. Spacing may follow whatever the surrounding block already does: the opening-hours pages use `12.00 – 20.00` with spaces, and that is fine.

The test is simple: if removing the dash and writing "to" still reads correctly, it is an interval and the dash stays. If you would have to write "which is" or "and" or start a new clause, it is prose and the dash must go.

### Verification

```bash
cd site && npm run lint:copy     # also fails on prose dashes, and allows intervals
```

The linter classifies each dash by what flanks it, so intervals pass and prose dashes fail. The only blanket exception is `stockholm-reviews.ts`, which holds verbatim TripAdvisor review text, quoted exactly as visitors wrote it (one review contains `stillness—feeling`). Any other verbatim quotation gets a `uk-copy-lint-ignore-next-line` comment on the line above.

## Spelling: British English

**All English copy on the site uses British (UK) English.** This is normative, not a preference. It applies to page copy, headings, FAQ answers, alt text, titles, meta descriptions, Open Graph text, JSON-LD description strings, and the prose in this repository's own documentation.

British English suits ANDETAG: the museum is European, the English pages serve visitors arriving from across Europe and beyond, and the register is calm and considered rather than transatlantic-breezy. It also removes a real ambiguity, since the site previously mixed both.

### Spelling rules

| Rule | Use | Not |
|------|-----|-----|
| **Oxford `-ize`**, not `-ise` | organize, recognize, synchronize, visualize, optimize, prioritize, finalize, summarize, normalize, localize, standardize, capitalize, emphasize | organise, recognise, synchronise, … |
| **Oxford `-ization`**, not `-isation` | organization, synchronization, optimization, localization, visualization | organisation, synchronisation, … |
| `-yse`, not `-yze` | analyse, analysis, paralyse, catalyse | analyze, paralyze |
| `-our`, not `-or` | colour, behaviour, favour, honour, labour, neighbour, flavour | color, behavior, favor, … |
| `-re`, not `-er` | centre, centred, metre, metres, fibre, fibres, theatre, litre | center, centered, meter, fiber, … |
| `-ogue`, not `-og` | catalogue, dialogue, analogue | catalog, dialog, analog |
| `-ce` for nouns, `-se` for verbs | a licence / to license; a practice / to practise; defence, offence, pretence | license (noun), practise (noun), defense, offense |
| Double the `l` | travelled, cancelled, labelled, modelling, marvellous, jewellery, counsellor, fuelled, signalling | traveled, canceled, labeled, modeling, … |
| Single `l` in these | fulfil, fulfilment, skilful, enrol, enrolment, instalment, distil | fulfill, fulfillment, skillful, enrollment, … |
| `programme` for schedules and events; `program` only for computer code | a day activity programme, the evening programme; *but* the LEDs are programmed, Gustaf programs the algorithms | program (event sense) |
| `-ae`/`-oe` retained | aesthetic, encyclopaedia, manoeuvre, archaeology, paediatric | esthetic, encyclopedia, maneuver, … |
| `towards`, not `toward` | towards Stureplan, pointing towards the artwork | toward |
| Other singles | grey, tyre, kerb, storey (of a building), judgement, ageing, ambience, moustache, sulphur, mould, cosy, aluminium, autumn (not fall) | gray, tire, curb, story (floor), judgment, aging, … |

#### The `-ize` rule in detail

The house style is **Oxford spelling**: British English with `-ize` rather than `-ise`. This is the Oxford English Dictionary's own convention and the style used by academic and museum publishing, so it is fully British, not a concession to American English. It is also the etymologically motivated choice, since these verbs come from the Greek `-izein`.

`-ize` is not a blanket rule, and this is where it goes wrong if applied mechanically. Three groups keep `s`:

1. **The `-yse` group** always keeps `s`, because it comes from Greek `-lusis`, not `-izein`: **analyse**, *analysed*, *analysis*, **paralyse**, **catalyse**, **dialyse**, **electrolyse**, **hydrolyse**. Writing *analyze* is an error under this rule, not an alternative.
2. **Verbs that were never `-izein`** keep `s` regardless: **advertise, advise, arise, chastise, circumcise, comprise, compromise, despise, devise, disguise, enterprise, excise, exercise, expertise, franchise, improvise, incise, merchandise, premise, promise, revise, rise, supervise, surmise, surprise, televise**. There is no *advertize*.
3. **Nouns that merely end in `-sis` or `-ise`** are not verbs in this family at all: *emphasis*, *basis*, *crisis*, *analysis*, *expertise*.

So: **synchronize** and **organize**, but **analyse** and **advertise**. When unsure whether a verb belongs to the `-izein` family, check whether a matching `-ization` noun exists naturally (*organization*, *synchronization* → `-ize`; there is no *advertization* → `-ise`).

Note that this rule is about `z` versus `s` only. Every other row in the table above is ordinary British spelling and is unaffected: it is still `colour`, `centre`, `fibre`, `catalogue`, `programme`, `towards`.

### Vocabulary

Choose the British word where a clear pair exists. The ones that actually come up on this site:

| Use | Not |
|-----|-----|
| lift | elevator |
| toilet, accessible toilet | restroom, bathroom |
| metro (Stockholm's tunnelbana is officially the *Stockholm metro*) | subway |
| pushchair / stroller (write both) | stroller alone |
| ground floor | first floor (US sense) |
| car park | parking lot |
| autumn | fall |
| queue | line |
| booking | reservation (for a ticket or a table) |

**Pushchair is the one deliberate exception to picking a single word.** Swedish speakers routinely say *stroller* for *barnvagn*, so visitor-facing copy writes the pair, "pushchair / stroller", to remove any ambiguity. Use the pair on first mention and then a pronoun ("you can lock yours at the bike parking") rather than repeating both words in one short answer. A bare *stroller* is still wrong.

### What this rule does **not** touch

British spelling governs prose written for readers. It never governs machine-facing strings, because renaming those breaks the site:

- **Code identifiers** — variable, function, prop, and CSS class names (`randomize`, `normalize()`, `serialize`, `mediaSizes`, `align-center`). Rename only as a deliberate refactor, never as part of a copy pass.
- **CSS properties and values** — `color`, `background-color`, `text-align: center`, `grayscale`, `scroll-behavior`. These are language keywords.
- **Third-party API keys and vocabularies** — Google Consent Mode (`ad_personalization`), schema.org types and properties (`Organization`, `organizer`, `parentOrganization`, `OfferCatalog`). These are contracts with external systems.
- **URLs, file paths, and filenames.** Existing paths stay put; a spelling change to a live URL is a redirect decision, not a copy edit. (`/en/stockholm/optical-fibre-textile/` was already British, which is why the body copy was the thing out of step.)
- **Vendored third-party content** — `skills/design/system-prompt.md` and `skills/design/procedures/` mirror an upstream repository and must stay verbatim.
- **`docs/archive/`** and **`archive/`** — closed records, not live copy.
- **Existing `CHANGELOG.md` entries** — a dated record of what was done and what the copy used to say. Write new entries in British English, but do not rewrite old ones, and quote prior copy exactly when an entry describes a change to it.
- **Verbatim quotations.** TripAdvisor review text in `stockholm-reviews.ts`, and the review quotes embedded in `DejtEn.astro` / `DejtSv.astro`, are quoted exactly as visitors wrote them, American spellings included. Never silently "correct" a quotation.
- **Swedish and German copy**, which have their own conventions.

### Verification

```bash
cd site && npm run lint:copy     # fails on US spellings in site/src and site/public
```

The check covers `site/src` plus the text files in `site/public` (`llms.txt`, `robots.txt`), which are English copy that AI assistants read. It reads source, not rendered prose, so it deliberately skips words that collide with code: `color`, `center`, `behavior`, `catalog`, `dialog`, `program`, `normalize`, `serialize`, `personalization`. A clean run is therefore necessary but not sufficient, so still read the copy. Words that are also correct Swedish (`fibre`/`fiber`, `metre`/`meter`) are only checked in English-only files.

For a verbatim visitor quote that must keep its original spelling, add a `uk-copy-lint-ignore-next-line` comment above the line. Documentation prose is not covered by the linter: review it by eye against the tables above.

The dash rule in §Punctuation has its own separate grep and is not part of `lint:copy`.

## Language Nuance: Swedish, English, German

The Swedish tone is slightly more restrained, inward, and minimal. The name *Andetag* speaks for itself: it means *breath*, so the language can stay close to the experience without explanation.

The English tone is a touch more explanatory, but never louder.

The German tone sits between the two. German allows for precision and compound expression, and has a natural affinity for the philosophical register ANDETAG inhabits. The tone should feel considered and still: not stiff, not overly warm. Think quiet clarity, not formality.

No language should feel translated. Each should feel native and considered in its own right.

## Explaining the Name in Non-Swedish Languages

In Swedish, *andetag* literally means *a breath*. The name is immediately understood and felt — no English-style bridge phrase is needed or desirable.

In **English and German**, the name requires a bridge. Readers who encounter "ANDETAG" for the first time will not know what it means. Copy in those languages should naturally weave in a clarifying phrase early: not as a dictionary definition, but as part of the invitation.

**Key phrases by language:**

| Language | Clarifying phrase | Usage context |
|----------|-------------------|---------------|
| Swedish | *(none — name is self-explanatory)* | Do **not** use *andande konstmuseum* or literal “breathing museum” in titles or meta descriptions |
| English | *breathing museum* | Titles, meta descriptions, first mention in copy |
| German | *Atemmuseum* / *Museum des Atmens* | Titles, meta descriptions, first mention in copy |

These phrases (English and German only) serve two purposes:

1. **Comprehension**: they tell the reader what ANDETAG is, since the Swedish name alone does not (for non-Swedish readers).
2. **Discoverability**: they align with how people actually search (e.g. "breathing museum Stockholm").

**How to use them:**

- Include the clarifying phrase once, early and naturally. It should feel like context, not a label.
- After the first mention, let "Andetag" stand on its own.
- Never use the clarifying phrase as a replacement for the name. The name is always ANDETAG.

**Good examples:**

- "Andetag: a breathing museum in Stockholm."
- "Andetag ist ein Atemmuseum in Stockholm: ein Ort der Stille, des Lichts und des gemeinsamen Atems."

**Avoid:**

- "Andetag (which means breath in Swedish) is a museum…": too clinical.
- Using "breathing museum" or "Atemmuseum" repeatedly throughout a text: once is enough.
- Translating *breathing museum* into Swedish (*andande konstmuseum*) in titles or meta descriptions.

## Words We Like

Breath, stillness, calm, peace, rhythm, presence, connection, softness, inner, woven, light, guide, place, moment, listening, slow.

## Words We Avoid

Mind-blowing, magical (when used casually), healing, transformative, life-changing, revolutionary, spiritual, must-see, unforgettable.

## Material Terminology (Factual)

When copy describes how the artworks are made, use this as the default factual wording:

- **Custom-woven and hand-stitched optical fibre textiles**.
- Do not describe the artworks as hand-woven.

## Example Copy – Short (Ads / Headlines)

**Swedish**

- "En plats att andas."
- "Ljus, textil och musik i långsam takt."
- "Ett gemensamt andetag, mitt i staden."

**English**

- "A place to breathe."
- "Light, textile and music. In a slower rhythm."
- "A shared breath, in the middle of the city."

**German**

- "Ein Ort zum Atmen."
- "Licht, Textil und Musik. In einem langsameren Rhythmus."
- "Ein gemeinsamer Atemzug, mitten in der Stadt."

## Example Copy – Medium (Website / Social)

**Swedish**

> Andetag är en omslutande konstupplevelse där ljus, textil och musik rör sig i takt med ett gemensamt andetag. En stillsam plats för närvaro, mitt i stadens tempo.

**English**

> Andetag is an immersive art experience where light, textile and music move in sync with a shared breath. A quiet space for presence, inside the pace of the city.

**German**

> Andetag ist ein Atemmuseum: eine umfassende Kunsterfahrung, in der Licht, Textil und Musik sich im Rhythmus eines gemeinsamen Atemzugs bewegen. Ein stiller Ort für Gegenwärtigkeit, inmitten des städtischen Tempos.

## Example Copy – Longer (Editorial / PR)

**Swedish**

> Andetag är en visuell manifestation av ett djupt mänskligt andetag. Genom vävd optisk fiber, levande ljus och originalmusik skapas en upplevelse som bjuder in till långsamhet och lyssnande. Alla verk andas tillsammans, synkroniserade över hela världen. Ett globalt andetag, att kliva in i.

**English**

> Andetag is a visual manifestation of a deep human breath. Through woven optical fibre, living light and original music, the experience invites slowness and attention. All works breathe together, synchronised across the world. A global breath you can step into.

**German**

> Andetag ist die visuelle Gestalt eines tiefen menschlichen Atemzugs. Durch gewebte Glasfaser, lebendiges Licht und Originalmusik entsteht eine Erfahrung, die zur Langsamkeit und zum Zuhören einlädt. Alle Werke atmen gemeinsam, synchronisiert über die ganze Welt. Ein globaler Atemzug, in den man eintreten kann.

## Final Guideline for Agencies

Before finalising any copy, ask:

- Does this feel calm?
- Does it respect the reader?
- Does it leave space?
- Would this still work if spoken slowly out loud?

If the text feels like it is trying to convince, it is not ANDETAG.

If it feels like an invitation, it probably is.
