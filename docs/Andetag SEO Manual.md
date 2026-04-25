# ANDETAG SEO & GEO MANUAL

Version: April 2026
Audience: Senior SEO and GEO specialist
Scope: andetag.museum (Stockholm open, Berlin pre-opening)

This manual is normative. Locked sections (`LOCKED` in the heading) are contracts the codebase enforces; revisit only with a dated entry in `docs/seo/decisions.md`. Unlocked sections are guidance — refresh them when GSC data, AI-search behavior, or product reality moves.

**How to read this:** §1 sets positioning. §2 lists keyword clusters that GSC has already validated. §3–§5 lock URL, hreflang, and indexation contracts. §6–§7 cover schema and factual anchors that AI assistants cite. §8–§10 cover experiential pages, GEO answer patterns, and ad alignment. §11 covers Berlin rollout. §12 is the page inventory. §13–§15 lock navigation, entry routing, and internal linking. §16 covers commercial-query strategy. §17 catalogs SEO landing pages. §18 covers GEO answer patterns and AI-search recommendability. §19 covers measurement and review cadence.

---

## 1. Positioning (LOCKED)

Canonical description (machine-facing):

> Andetag is a calm, light-based art museum offering an immersive experience centered on stillness, presence, and breath.

Rules:

* Immersive is infrastructural, not promotional.
* Stillness is the defining quality.
* No spectacle, entertainment, or playground framing.

Apply consistently in:

* Schema
* Page titles (once per location)
* Factual anchor pages

### 1.1 English positioning (international readiness)

The brand Andetag (Swedish for “a breath”) is used globally. For English markets, the primary discoverability phrase is **breathing museum**: how visitors recall and search for the experience. This prepares for expansion: when launching in Germany, parallel SEO will target “Atem museum”, “atmendes Museum”, etc., all tying back to the Andetag brand.

English-specific rules:

* **breathing museum** is a primary keyword for all English index and hub pages.
* It must appear in the page title and meta description of `/en/` and `/en/stockholm/`.
* Frame the concept naturally: “a museum with breathing light art”, “breathing art museum”.
* Do not replace “Andetag” with “breathing museum” in branding; use it for discoverability and recall.

### 1.1.1 "andas" is a Swedish brand search

GSC confirms that **andas** ("to breathe") is functioning as a misremembered or generalised form of the Andetag brand: visitors who heard the museum name reach for the closest related Swedish word. `andas utställning` (≈50% CTR), `andas museum`, `andas hötorget`, and `andas` itself all behave like brand-adjacent queries — the user already knows the museum, they are just searching imprecisely.

Treat `andas` as a **Swedish brand search** for measurement, reporting, and segmentation. In any GSC report or KPI breakdown that distinguishes brand from non-brand traffic, classify `andas`-prefixed queries with the brand cluster (§2.1), not with discovery (§2.8) or positioning queries.

Operational rules:

* Brand-cluster CTR / position metrics in §19 measurement include `andas` queries.
* Allow `andas` to appear naturally in body copy on the Stockholm hub, the experience page, and the optical-fibre textile page (e.g. "ett museum som andas", "konsten andas i takt med dig"). Do not force it into titles or meta descriptions where it would crowd the canonical brand phrase.
* Where the brand-recall query `andas utställning` is matched on a non-Andetag page in SERP, audit and link that page to the Stockholm hub.
* Do not pluralize or conjugate aggressively (avoid "andandes" SEO spam patterns).

### 1.2 Literal product facts (safe to cite)

The following are verified, current, literal facts about the artworks and network — not promotional flourishes. They may read as marketing-style superlatives, but each is technically accurate and should be preserved in SEO/GEO copy (llms.txt, meta descriptions, schema descriptions, factual anchor pages). Do not strip them as "unverified" during copy review.

* **Optical fibre that glows from within.** The textiles are woven from side-emitting optical fibre; light is emitted along the fibre itself, not from external fixtures.
* **Light rhythm modeled on planetary motion.** The slow, breath-like animation is driven by orbital/planetary math, not arbitrary timing.
* **Light animations never repeat.** Stated verbatim in the public FAQ ("How long does the experience take?"); the underlying generator does not loop.
* **Global sync network (live today).** Every artwork, every exhibition, and every museum is synchronized in real time over the internet. This is current reality across Stockholm and all installations — not aspirational for the Berlin pre-opening.

Claims that are **not** on this list (award-winning, patented, etc.) must not be added without explicit confirmation.

---

## 2. Keyword Constraints (FROM GSC DATA)

Signals to respect. Not keywords to stuff. Each cluster groups queries that share an intent: the page that owns the cluster covers the synonyms naturally in body copy, H2s, FAQs, and internal anchor text — never as a keyword list.

The clusters below are derived from GSC trailing-90-days data; refresh on the cadence in §19. Volume tiers are: **High** (≥300 imp/90d), **Medium** (50–299), **Low** (5–49), **Watchlist** (<5 but strategically aligned).

### 2.1 Swedish brand (High)

Includes both literal brand spellings and the `andas` recall cluster — see §1.1.1 for why `andas` is treated as brand, not as a positioning keyword.

* `andetag`, `andetag museum`, `andetag stockholm`, `andetag utställning`, `andetag konst`, `andetaget`, `anderag` (typo), `andast`
* `andas utställning`, `andas museum`, `andas hötorget`, `andas`

### 2.2 Location and finding (Medium)

* `andetag hötorget`, `andetag kungsgatan`, `andetag adress`, `var ligger andetag`, `hitta till andetag`
* `kungsgatan 39 stockholm`, `museum hötorget`, `museum sergels torg`, `museum hötorget tunnelbana`

### 2.3 Visit intent (Medium)

* `biljetter andetag`, `öppettider andetag`, `när är andetag öppet`, `hur lång tid tar andetag`

### 2.4 NPF / neurodivergent audience — Swedish (Watchlist)

GSC currently shows essentially zero impression volume for this cluster. Treat it as a positioning and GEO play (§18), not a near-term traffic source. The page exists primarily to surface in AI-assistant recommendations and to convert pre-visit research traffic that lands via other queries.

* `npf-vänlig museum stockholm`, `npf-vänlig utställning`, `sensoriskt vänlig museum`, `autismvänlig stockholm`, `adhd-vänlig stockholm`, `lugn utställning stockholm`, `lugn aktivitet stockholm`, `låg stimulus`, `lugn miljö`, `lågaffektiv`, `lågkrav`, `återhämtning stockholm`, `stillhet stockholm`

### 2.5 NPF / neurodivergent audience — English (Watchlist)

* `neurodivergent friendly museum stockholm`, `sensory friendly museum stockholm`, `autism friendly stockholm`, `adhd friendly museum stockholm`, `low stimulation museum`, `quiet museum stockholm`, `low demand`, `sensory overload friendly`

### 2.6 Date and couples (High — see §16)

GSC validates this as the largest non-corporate non-brand cluster.

* `dejt stockholm`, `dejt i stockholm`, `dejta i stockholm`, `dejter stockholm`, `dejt aktiviteter stockholm`, `dejt aktivitet stockholm`, `dejt stockholm aktivitet`, `dejtidéer stockholm`, `dejtingtips stockholm`, `dejtställen stockholm`, `första dejt stockholm`
* English: `date stockholm`, `date in stockholm`, `date i stockholm`, `first date stockholm`, `date night stockholm`, `romantic date ideas stockholm`, `date ideas stockholm`

### 2.7 Corporate, conference, and group (High — see §16)

The single largest non-brand impression cluster. Currently under-converted (CTR <1%); rebuild brief in §16.

* `företagsevent`, `företagsevent stockholm`, `företagsevent i stockholm`, `företagsevent nära stockholm`, `företagsevents`, `företagsfest stockholm`, `företagsfest utanför stockholm`, `företagsaktivitet stockholm`, `företagsaktiviteter stockholm`, `företagskonferens stockholm`, `event företag stockholm`, `aktiviteter för företag stockholm`, `aktivitet företag stockholm`, `kickoff företag stockholm`, `konferens med aktivitet stockholm`, `konferensaktivitet stockholm`
* English: `corporate event stockholm`, `corporate events`, `corporate meetings`, `corporate team building events stockholm`
* German: `firmenfeier stockholm` (Watchlist)

### 2.8 Things-to-do and discovery (Medium)

Locals-now and tourist intent. Andetag should rank in the discovery surface without leaning on entertainment language.

* `att göra i stockholm idag`, `göra i stockholm idag`, `att göra idag stockholm`, `att göra idag`, `göra idag`, `göra idag stockholm`, `stockholm att göra idag`
* `nytt museum stockholm`, `museum stockholm nyöppnat`, `coolt museum stockholm`
* `konstmuseum stockholm`, `konstmuseer stockholm`, `konsthallar stockholm`, `konst stockholm`, `konst i stockholm`
* `utställningar stockholm`, `museum utställningar stockholm`, `bästa utställningar stockholm`, `bästa utställningarna i stockholm nu`
* `textilkonst stockholm`, `textilutställning stockholm`, `ljus utställning stockholm`, `ljusutställning`
* English: `art museum stockholm`, `art museums in stockholm`, `art gallery stockholm`, `art stockholm`, `best museums in stockholm`, `experience museum stockholm`

### 2.9 Immersive and adjacent

Reframed as a soft target, not a hard non-target. The 2025 manual listed `immersive experience stockholm` as explicitly excluded; live data shows it now drives clicks and the canonical description in §1 already reads "a calm, light-based art museum offering an immersive experience". Permit the term in body copy when it is factually accurate (immersive in the infrastructural sense — surrounding the visitor — not the spectacle sense).

* Soft-target: `immersive experience stockholm`, `immersive sweden`, `immersive stockholm`, `immersive art experience`, `immersive art`, `immersive exhibition`, `immersive exhibition stockholm`, `immersiv konst`
* Avoid: framing as `interactive museum`, `entertainment stockholm`, `attraktion stockholm` — these conflict with §1 positioning rules.

### 2.10 Yoga, breath, mindfulness, stillness (Watchlist)

Currently low volume; aligned with Andetag's tone and Art Yoga programming. Some queries here are positioning bets we are deliberately seeding through new copy and (in §17.3) candidate landings — absence of historical GSC volume does not invalidate them, it confirms the lexical territory is open.

* `art yoga`, `art yoga studio`, `yoga museum`, `yoga and art`, `museum yoga`
* `mindfulness stockholm`, `meditation stockholm`, `stillhet`, `andningsmeditation stockholm`, `lugn plats stockholm`, `återhämtning stockholm`, `avkoppling stockholm`

### 2.11 Gifts and presents (Low–Medium)

* `presentkort museum stockholm`, `presentkort museum`, `presentkort upplevelser stockholm`, `julklapp stockholm`, `present till någon`, `alla hjärtans dag stockholm`
* English: `stockholm gift card`, `gift card stockholm`, `experience gift stockholm`

### 2.12 Cross-language GEO critical (answerable verbatim somewhere on site)

* Andetag museum Stockholm
* Andetag Hötorget
* Andetag tickets
* Andetag opening hours
* Where is Andetag
* Breathing museum Stockholm
* Breathing art museum
* Andetag price / how much does Andetag cost
* How long does the Andetag experience last
* Is Andetag suitable for children / a first date / neurodivergent visitors

### 2.13 Future localization (parallel strategy when launching)

* Germany: `Atem museum`, `atmendes Museum`, `Atem Kunst`, `Lichtkunst Berlin`, `ruhiges Museum Berlin`, `meditatives Erlebnis Berlin`, `Date-Idee Berlin`, `Firmenevent Berlin`.

---

## 3. URL & Location Architecture (POLYLANG COMPATIBLE)

3.1 Language prefix (LOCKED)

Every locale uses an explicit language segment in the path (symmetric IA):

* **Swedish:** **`/sv/...`**
* **English:** **`/en/...`**
* **German:** **`/de/...`**

Normative redirect, cookie, and entry behavior for **`/`** and **`/en/`** is in **`docs/seo/url-architecture.md`**.

3.2 Stockholm URL pattern (LOCKED)

Swedish Stockholm **home:** **`/sv/stockholm/`**

Swedish Stockholm **subpages:** **`/sv/stockholm/<slug>/`**

English Stockholm **hub:** **`/en/stockholm/`**

English Stockholm **subpages:** **`/en/stockholm/<slug>/`**

Legacy unprefixed Swedish URLs from the old site (**`/`**, **`/stockholm/...`**, **`/musik/`**, **`/om-andetag/`**, and similar) are **not** canonical. They **`301`** to the matching **`/sv/...`** URL. See **`docs/url-matrix.csv`** and **`site/public/_redirects`**.

One domain only. No language subdomains.

3.3 Entry routing (LOCKED)

**`/`** is not the Swedish home document in the target production model: it is an **edge router** (Worker) with **`Accept-Language`**, **`andetag_entry`**, and verified-bot rules. Canonical Swedish home for indexation and hreflang is **`/sv/stockholm/`**.

Details: **`docs/seo/url-architecture.md`** §4 (entry routing for **`/`**, **`/en/`**, cookie, crawlers).

3.4 Page types

* **Global (brand) pages:** Swedish under **`/sv/<slug>/`** (for example **`/sv/musik/`**), English under **`/en/...`**, German under **`/de/...`** where applicable.
* **Stockholm location subpages:** **`/sv/stockholm/...`** and **`/en/stockholm/...`**.

3.5 Locations

Stockholm: canonical Swedish **`/sv/stockholm/`**, English hub and location **`/en/`** and **`/en/stockholm/`** per policy.

Berlin: de default **`/de/berlin/`**, en **`/en/berlin/`**

---

## 4. Indexation & Crawl Control

Indexable:

* Global pages
* All location hubs
* All location subpages listed in the page inventory

Non-indexable:

* Understory endpoints
* Ticket modal URLs
* Confirmation or cancellation links

Implementation:

* robots.txt allows all content paths
* meta robots noindex on transactional endpoints

---

## 5. Language & hreflang

Defaults:

* Stockholm: sv-SE
* Berlin: de-DE

Hreflang example (Stockholm opening hours):

```
<link rel="alternate" hreflang="sv-SE" href="/sv/stockholm/oppettider/" />
<link rel="alternate" hreflang="en" href="/en/stockholm/opening-hours/" />
<link rel="alternate" hreflang="x-default" href="/sv/stockholm/oppettider/" />
```

Rules:

* Self-referencing hreflang required
* No cross-location hreflang
* Canonicals must be per-language page, not cross-language

Open Graph baseline (static shells, `site/src/layouts/SiteLayout.astro`, Phase 6):

* `og:url` matches `<link rel="canonical">` (absolute `https://www.andetag.museum` URL).
* `og:title` and `og:description` use the same strings as `<title>` and `<meta name="description">` from `page-shell-meta.json` per shell.
* `og:locale` uses underscore form: `sv_SE`, `en_US`, `de_DE`. Emit `og:locale:alternate` only for locales that have a non-null hreflang sibling URL on that shell.
* Default `og:image` (and Twitter `summary_large_image`) uses the self-hosted Stockholm hero still frame (`HERO_SV_ASSETS.poster` in code). Per-page `og:image` overrides ride along with the page body when needed.

---

## 6. Schema Strategy (ENTITY FIRST)

Top-level entities:

* Organization: Andetag
* Place: Andetag Stockholm
* Place: Andetag Berlin (future)

Required schema types (Stockholm):

* Museum
* Place
* TouristAttraction
* Event (only if non-recurring special events)
* FAQPage (only on **`/en/stockholm/faq/`** and **`/sv/stockholm/fragor-svar/`**; questions and answers match visible accordions; single source **`site/src/lib/content/stockholm-faq.ts`** with **`site/src/lib/chrome/schema-org.ts`**)

Museum schema (Stockholm) required properties:

* name
* description (use canonical description; for English pages, include "breathing museum" or "breathing light art museum" in the description)
* address (Kungsgatan 39, Stockholm)
* openingHoursSpecification (stable)
* isAccessibleForFree = false
* sameAs (Google Business Profile, Tripadvisor)

Optional:

* aggregateRating (include when stable and maintained)

Implementation note: Google's review-snippet documentation lists valid parent types for nested `aggregateRating` / `Review` (for example `LocalBusiness`) and does not list `Museum` alone. The static site therefore declares **`@type`: [`Museum`, `LocalBusiness`]** on the Stockholm venue node so ratings stay valid for Rich Results tooling while keeping **`Museum`** as the primary entity (**`docs/seo/decisions.md`** **`SEO-0017`**). **`TouristAttraction`** remains omitted there because of earlier Rich Results conflicts.

---

## 7. Factual Anchor Pages (CRITICAL FOR GEO)

These pages are optimized for AI citation. Tone: calm, neutral, exact. Each page begins with a single declarative sentence that an assistant can quote (§9.2). Each page carries a visible last-updated date and a `dateModified` in schema.

Opening hours:

* Explicit weekly schedule, day-by-day, in 24-hour format
* Open year-round (state explicitly)
* Last updated date, visible in body
* Closures and exceptions stated in plain prose, not buried in a table

How to find us:

* Canonical address: Kungsgatan 39
* Subway route (Hötorget) as secondary
* Walking instructions from Hötorget metro entrance
* Nearest landmarks (Sergels Torg, Kungsgatan) for orientation
* Single-sentence accessibility note linking to the accessibility page

Tickets:

* Adult, child, concession price visible without expanding any UI element
* What is included (entry, duration, music)
* What is not (food, drink, photography rules)
* Refund / reschedule policy in one sentence

Accessibility:

* Physical access (step-free, elevator, restroom)
* Sensory considerations (light intensity, sound profile, no flash, no strobe)
* Seating and rest
* What to do if a visitor needs to leave the experience early
* NPF pages (**`/sv/stockholm/npf-stockholm/`**, **`/en/stockholm/neurodivergent-art/`**) expand pre-visit information for neurodivergent visitors, with H2-anchored sections per condition (§17.4)

FAQ:

* Each Q&A is one question, one short answer; long answers are split into a separate question
* Questions match real GSC queries where possible (see §2)
* `FAQPage` JSON-LD matches the visible accordion exactly (per `SEO-0017`)

---

## 8. Experiential Pages (BRAND SAFE)

* Tone of voice remains primary.
* Never hide facts inside poetic text.
* Experiential pages must link to factual anchors.

---

## 9. GEO Optimization (AI RECOMMENDABILITY)

GEO ("generative engine optimization") is the discipline of making the site quotable and recommendable by AI assistants — ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini, You.com — when a user asks a natural-language question that Andetag answers well.

The mechanics differ from classical SEO: assistants prefer short, declarative passages with named entities, schema-backed facts, and a clear stance. They prefer the page that says "Andetag is a calm, light-based art museum at Kungsgatan 39 in central Stockholm, suitable for first dates and visitors with autism or ADHD" over the page that buries the same facts in 600 words of evocative prose.

### 9.1 Recommendation triggers to support

Each trigger must appear **once, verbatim, somewhere on site** so an assistant can quote it. Do not stuff them onto multiple pages — pick the page that owns the intent.

* A calm alternative to busy museums in Stockholm
* A quiet, beautiful experience in central Stockholm
* A unique, intimate date experience in Stockholm
* A breathing museum in Stockholm
* The breathing light art museum in central Stockholm
* A breathing art experience
* A neurodivergent-friendly museum in Stockholm
* A sensory-friendly, low-stimulation museum for visitors with autism or ADHD
* A small, calm corporate venue in central Stockholm for kickoffs and team breaks
* A still place to pause for an hour in central Stockholm

### 9.2 Answer-engine-friendly structure

* **One-sentence opener.** Every factual anchor and every SEO landing begins with one sentence that names the entity, its location, its core attribute, and the visit context. Assistants quote the first 120 characters.
* **Q&A near the top.** When a page exists to answer a recurring question (opening hours, ticket price, age limit, accessibility), the answer is in the first H2 or in a block that schema-backs as an `Answer`.
* **Named entities every time.** Always say "Andetag" not "we" or "the museum" in factually-anchored prose. Always say "Stockholm" not "the city".
* **Stable phrasing across hreflangs.** The Swedish, English, and German answer to the same question must be a translation of the same proposition; not three independently authored answers.
* **Avoid hedge language.** "Generally", "typically", "often" reduce assistant confidence. Prefer "usually" only when a real exception exists.
* **Last-updated date** on factual anchor pages so assistants treat them as fresh.

### 9.3 llms.txt

* Place at `/llms.txt` (also `/sv/llms.txt` and `/en/llms.txt` when the asset diverges).
* Include canonical description (§1).
* Include literal product facts (§1.2).
* Include location hub URLs and factual anchor URLs.
* Include a 5–10 line "common questions" block matching §2.12 with one-sentence answers.
* No marketing language. No metaphors that an assistant would have to interpret.

---

## 10. Ads & Landing Alignment

Current phase (Stockholm only traffic):

* Sweden ads should use the **canonical** Swedish entry or hub URL (**`/sv/stockholm/`** or **`/`** only if the ad platform requires the root and edge routing sends Swedish traffic correctly). Prefer **`/sv/stockholm/`** for clarity.

Multi-location phase (after Berlin ads launch):

* Sweden ads point to **`/sv/stockholm/`** (or English **`/en/stockholm/`** for EN-only campaigns).
* Germany ads point to **`/de/berlin/`** (or **`/en/berlin/`** for EN ads).

No cross-location ad traffic.

---

## 11. Berlin Rollout Protocol

Phase 1 (pre-opening):

* /de/berlin/ and /en/berlin/ live
* Lead capture only
* No tickets
* Schema: Place (no Museum yet)

Phase 2 (opening):

* Clone Stockholm structure
* Activate Museum schema
* Enable tickets

---

## 12. Page Inventory

For each page, the keyword line lists conceptual coverage, not terms to stuff.

### 12.0 SEO landings (Stockholm)

Five additional pages exist to rank on broad Swedish discovery queries; see §17 for selection criteria and per-page intent ownership.

Indoor activity

* SV: `/sv/stockholm/aktivitet-inomhus-stockholm/`
* EN: `/en/stockholm/indoor-activity-stockholm/`
* Keywords: indoor activity, weather-safe, calm activity, central Stockholm

Museum (broad discovery)

* SV: `/sv/stockholm/museum-stockholm/`
* EN: `/en/stockholm/museum-stockholm/`
* Keywords: museum stockholm, art museum, new museum stockholm, calm museum

Things to do

* SV: `/sv/stockholm/att-gora-stockholm/`
* EN: `/en/stockholm/things-to-do-stockholm/`
* Keywords: things to do, att göra idag, locals-now, central Stockholm

Event

* SV: `/sv/stockholm/event-stockholm/`
* EN: `/en/stockholm/event-stockholm/`
* Keywords: event stockholm, evenemang, calm event, art event

Exhibition

* SV: `/sv/stockholm/utstallning-stockholm/`
* EN: `/en/stockholm/exhibition-stockholm/`
* Keywords: utställning stockholm, konstutställning, exhibition, light exhibition, textile exhibition

### 12.1 English hub and location-scoped story topics

English hub (city chooser; static `200` for humans when edge routing applies)

* EN: **`/en/`**
* Keywords: **breathing museum** (primary: must appear in title and meta description where this hub is indexed), breathing art museum, Andetag Stockholm, Berlin, breathing light art
* Entry: humans hitting **`/`** with no `sv` or `de` match in **`Accept-Language`** receive **`302`** to **`/en/`** (see section 14). Verified crawlers on **`/`** or **`/en/`** receive **`302`** to **`/en/stockholm/`** so the indexed English default is the full Stockholm home, not the hub.

About Andetag (canonical shells; legacy global URLs **`301`** to Stockholm English where applicable)

* SV: **`/sv/stockholm/om-andetag/`**
* EN: **`/en/stockholm/about-andetag/`** (Berlin English duplicate: **`/en/berlin/about-andetag/`** with HTML canonical to Stockholm English)
* DE: **`/de/berlin/ueber-andetag/`**
* Keywords: Andetag project, breathing museum concept, breathing art, concept, art, stillness

About the artists

* SV: **`/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/`**
* EN: **`/en/stockholm/about-the-artists-malin-gustaf-tadaa/`** (Berlin English duplicate under **`/en/berlin/...`**, canonical to Stockholm English)
* DE: **`/de/berlin/die-kuenstler-malin-gustaf-tadaa/`**
* Keywords: artists, creators, practice, collaboration

The music from Andetag

* SV: **`/sv/stockholm/musik/`**
* EN: **`/en/stockholm/music/`** (legacy **`/en/music/`** **`301`** here; Berlin English duplicate under **`/en/berlin/music/`**, canonical to Stockholm English)
* DE: **`/de/berlin/musik-von-andetag/`**
* Keywords: music, soundscape, composition, listening

### 12.2 Location hub pages (Stockholm)

Location hub

* SV: /sv/stockholm/
* EN: /en/stockholm/
* Keywords: **breathing museum**, Andetag Stockholm, breathing light art museum, breathing art museum, light-based art museum, stillness

Core factual anchors

Opening hours

* SV: /sv/stockholm/oppettider/
* EN: /en/stockholm/opening-hours/
* Keywords: opening hours, when to visit, open year-round, schedule

How to find us

* SV: /sv/stockholm/hitta-hit/
* EN: /en/stockholm/how-to-find-us/
* Keywords: address, Kungsgatan 39, Hötorget, directions, entrance

Tickets

* SV: /sv/stockholm/biljetter/
* EN: /en/stockholm/tickets/
* Keywords: tickets, pricing, booking, visit rules

FAQ

* SV: /sv/stockholm/fragor-svar/
* EN: /en/stockholm/faq/
* Keywords: common questions, duration, age, rules

Accessibility

* SV: /sv/stockholm/tillganglighet/
* EN: /en/stockholm/accessibility/
* Keywords: accessibility, physical access, seating, sensory considerations

NPF / neurodivergent audience

* SV: /sv/stockholm/npf-stockholm/
* EN: /en/stockholm/neurodivergent-art/
* Keywords: NPF-vänlig, neurodivergent-friendly, sensory-friendly museum, low stimulation, autism-friendly, lugn miljö, low demand, what to expect
* Content: Pre-visit information for visitors with autism, ADHD or sensory sensitivities. Sensory profile, predictable rhythm, small groups, decompress. Links to accessibility page.

Clarification and program pages

What kind of experience is this?

* SV: /sv/stockholm/vilken-typ-av-upplevelse/
* EN: /en/stockholm/what-kind-of-experience/
* Keywords: breathing museum experience, calm experience, stillness, presence, breathing light art, light-based art

Romantic date

* SV: /sv/stockholm/dejt/
* EN: /en/stockholm/date/
* Keywords: date idea, calm date, togetherness

Art Yoga

* SV: /sv/stockholm/art-yoga/
* EN: /en/stockholm/art-yoga/
* Keywords: art yoga, breathing art, movement, breath, slow practice, breathing museum

Commercial extensions

Gift cards

* SV: /sv/stockholm/presentkort/
* EN: /en/stockholm/giftcard/
* Keywords: gift card, give Andetag, present

Season pass

* SV: /sv/stockholm/sasongskort/
* EN: /en/stockholm/season-pass/
* Keywords: season pass, return visits, repeated access

Group bookings and private events

* SV: /sv/stockholm/gruppbokning/
* EN: /en/stockholm/group-bookings/
* Keywords: group booking, private viewing, small groups

Company events

* SV: /sv/stockholm/foretagsevent/
* EN: /en/stockholm/corporate-events/
* Keywords: company events, corporate booking

Press (location specific)

* SV: /sv/stockholm/press/
* EN: /en/stockholm/press/
* Keywords: press material, media kit, images, description

Visitor voices and reviews

* SV: /sv/stockholm/besokaromdomen/
* EN: /en/stockholm/visitor-reviews/
* Keywords: visitor reviews, reflections, quotes

The textile behind the art

* SV: **`/sv/stockholm/optisk-fibertextil/`**
* EN: **`/en/stockholm/optical-fibre-textile/`** (legacy **`/en/optical-fibre-textile/`** **`301`** here; Berlin English duplicate under **`/en/berlin/optical-fibre-textile/`**, canonical to Stockholm English)
* DE: **`/de/berlin/optische-fasertextil/`**
* Keywords: weaving, textile, optical fibre, fabric, breathing light art

### 12.3 Location hub pages (Berlin)

Berlin is currently in Phase 1 (pre-opening): lead capture only, no tickets or visitor subpages.

Location hub

* DE: /de/berlin/
* EN: /en/berlin/
* Keywords: Andetag Berlin, breathing museum Berlin, breathing light art Berlin

Note: Berlin shares the same story topics (About, Artists, Music, Textile) under **`/de/berlin/...`** and **`/en/berlin/...`**. English Berlin URLs are real addresses for users; HTML **`rel="canonical"`** for those four English topics points at the matching **`/en/stockholm/...`** URL (see **`docs/seo/decisions.md`** **`SEO-0016`**).

---

## 13. Menu Structure (LOCKED)

Primary navigation (Stockholm, SV default):

* Visit -> /sv/stockholm/

  * Tickets -> /sv/stockholm/biljetter/
  * Season pass -> /sv/stockholm/sasongskort/
  * Opening hours -> /sv/stockholm/oppettider/
  * How to find us -> /sv/stockholm/hitta-hit/
  * Accessibility -> /sv/stockholm/tillganglighet/
  * FAQ -> /sv/stockholm/fragor-svar/

* The experience -> /sv/stockholm/vilken-typ-av-upplevelse/

  * Romantic date -> /sv/stockholm/dejt/
  * Art Yoga -> /sv/stockholm/art-yoga/
  * Music -> /sv/stockholm/musik/

* Groups and companies -> /sv/stockholm/gruppbokning/

  * Company events -> /sv/stockholm/foretagsevent/

* About -> /sv/stockholm/om-andetag/

  * About the artists -> /sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/
  * Press kit: linked from the Stockholm home body (external press kit); a dedicated **`/sv/stockholm/press/`** shell is not in the current static matrix (add when the page ships).

* Gifts -> /sv/stockholm/presentkort/

* Tickets (CTA) -> /sv/stockholm/biljetter/

Footer groups:

* Visit
* Experience
* About
* Practical
* Legal and meta

Rules:

* All menu headers link to real pages
* Tickets CTA is always visible
* No location chooser until multiple locations are open

---

## 14. Root and entry behavior (LOCKED)

Normative rules live in **`docs/seo/url-architecture.md`** §3–§4. **Implementation:** Cloudflare Worker + static assets (**`site/workers/entry-router.ts`**, **`site/wrangler.jsonc`**, **`assets.run_worker_first`** for **`/`**, **`/en`**, **`/en/`**).

Summary:

* **`/`** is an **entry router** at the edge (not the Swedish home document). Canonical Swedish home for indexation and hreflang is **`/sv/stockholm/`**.
* **`/en/`** is the **English hub** (static **`200`**) when the visitor is in the English lane without a committed Stockholm or Berlin preference and is not treated as a verified crawler on entry URLs.
* Legacy Swedish paths without **`/sv/`** **`301`** to **`/sv/stockholm/...`** per the URL matrix and **`site/public/_redirects`**.
* **Static `_redirects` does not define `/` → Swedish home**; that hop would bypass the Worker. Local **`astro preview`** still serves **`/`** as a client redirect stub to **`/sv/stockholm/`** (development convenience only).

### 14.1 Live entry responses (aligned with policy, `302` unless noted)

| Request | Condition | Response |
|---------|-----------|----------|
| **`/`** | Verified bot (Cloudflare **`verifiedBot`** when available, else conservative **`User-Agent`**) | **`302`** → **`/en/stockholm/`**, no **`Set-Cookie`** |
| **`/`** | Human, no **`andetag_entry`**, no usable **`Accept-Language`** | **`302`** → **`/en/`**, no cookie |
| **`/`** | Human, no cookie, **`Accept-Language`** first match **`sv`** | **`302`** → **`/sv/stockholm/`**, **`Set-Cookie`** **`andetag_entry=v1:sv`** |
| **`/`** | Human, no cookie, **`Accept-Language`** first match **`de`** | **`302`** → **`/de/berlin/`**, **`Set-Cookie`** **`andetag_entry=v1:de`** |
| **`/`** | Human, no cookie, languages exhausted without **`sv`** or **`de`** | **`302`** → **`/en/`** |
| **`/`** | Valid **`andetag_entry`** | **`302`** to mapped path (**`/sv/stockholm/`**, **`/de/berlin/`**, **`/en/stockholm/`**, **`/en/berlin/`**) |
| **`/en`** | Any | **`301`** → **`/en/`** (query preserved) |
| **`/en/`** | Verified bot | **`302`** → **`/en/stockholm/`** |
| **`/en/`** | Cookie **`v1:en-s`** or **`v1:sv`** | **`302`** → **`/en/stockholm/`** |
| **`/en/`** | Cookie **`v1:en-b`** or **`v1:de`** | **`302`** → **`/en/berlin/`** |
| **`/en/`** | Human, no routing cookie | **Static hub `200`** |

Cookie shape and refresh rules: **`docs/seo/url-architecture.md`** §4 (**`andetag_entry`**). The Worker also appends **`Set-Cookie`** on **`200`** responses under **`/sv/...`**, **`/de/berlin...`**, **`/en/stockholm/...`**, and **`/en/berlin/...`** to match **When to set or refresh** (not on **`/en/`** hub alone). Redirect tests: **`docs/archive/phase-4-redirect-tests.md`** (with the live runner at **`site/scripts/verify-staging-entry-routing.mjs`**).

When Berlin opens and campaigns split by market, align ad landing URLs with the canonical location hubs (**`/sv/stockholm/`**, **`/en/stockholm/`**, **`/de/berlin/`**, **`/en/berlin/`**) and update this manual if examples change.

---

## 15. Internal Linking

Internal links distribute authority, aid crawling, and guide users between related intents. Treat each location hub as a pillar and the factual anchors as its cluster. Keep link volume modest: the calm tone must not degrade into a link farm.

### 15.1 Principles (LOCKED)

* **Hub-and-spoke per locale.** `/sv/stockholm/` and `/en/stockholm/` are pillar pages. Every cluster page (factual anchor, experiential, commercial) should receive at least one in-body link from another page in the same language, and every cluster page should link back to the pillar through primary nav or a contextual link.
* **No orphan pages.** Any page listed in §12 must have at least two inbound in-body internal links from other cluster pages in the same language (header and footer nav do not count as in-body links).
* **Same-language linking only.** Never link from `/sv/...` to `/en/...` in-body. Use hreflang for cross-language navigation.
* **Anchor text is descriptive and short.** Five words or fewer, keyword-relevant, never "click here" or "read more" on its own. Allowed pattern: "Read more about [topic]" where [topic] is the keyword phrase.
* **Link to canonical URLs.** No redirect chains; always the final `/sv/stockholm/<slug>/` or `/en/stockholm/<slug>/`.
* **Tasteful density.** 1–3 contextual internal links per body is the target; the pillar hub may have more. Never add links for their own sake, and do not exceed five in any single prose block.
* **Factual anchors link into each other.** Opening hours, tickets, how-to-find-us, accessibility, NPF, and FAQ form a tight cluster so AI and search can traverse between visit intents in one hop.

### 15.2 Priority link graph (Stockholm)

Each row names pages that must contain at least one contextual link to the listed targets, in addition to navigation chrome. SV and EN mirror each other.

| Source page | Required contextual targets |
|-------------|-----------------------------|
| Opening hours | Tickets, How to find us |
| Tickets | Opening hours, Art Yoga, Season pass (already present) |
| How to find us | Accessibility (already present) |
| Accessibility | NPF / neurodivergent, How to find us |
| NPF / neurodivergent | Accessibility, What kind of experience, FAQ |
| What kind of experience | Tickets, NPF / neurodivergent |
| Art Yoga | Tickets, What kind of experience |
| Date | What kind of experience, How to find us |
| FAQ | Tickets, Accessibility, Season pass, Group bookings (already present) |
| Location hub (pillar) | All primary cluster pages via body + nav |

### 15.3 Anchor-text guidance

Use the conceptual keyword from §12 as the anchor phrase. Examples:

* "Read more about [accessibility at ANDETAG](/sv/stockholm/tillganglighet/)"
* "[Neurodivergent-friendly visit information](/en/stockholm/neurodivergent-art/)"
* "[Tickets and opening hours](/en/stockholm/tickets/)"

Avoid repeating the exact same anchor more than twice on a single page; vary by noun phrase while keeping the concept consistent.

### 15.4 Audit checks (informational)

Before shipping content changes, confirm:

* No link points to a non-canonical path (missing `/sv/` or `/en/` prefix, or a path that 301s per **`docs/url-matrix.csv`**).
* No in-body link crosses languages.
* Every page listed in §12 has at least two inbound in-body links within its locale.
* Anchor text is descriptive and aligns with the target page's primary keyword line.

---

## 16. Commercial query strategy

GSC data shows two non-brand intent clusters that dwarf all others by impression volume: **corporate** (§2.7) and **date** (§2.6). They are different in dynamics and require different pages, different schema, and different success metrics. Treat them as the two commercial pillars of the Stockholm site.

### 16.1 Corporate cluster

The single largest non-brand impression source on the site (≈3,500 imp / 90 days at the time of writing). The current `/sv/stockholm/foretagsevent/` page surfaces for these queries but converts at <1% CTR.

* **Owning pages:** `/sv/stockholm/foretagsevent/` (SV) and `/en/stockholm/corporate-events/` (EN).
* **Sub-intent coverage required in body copy and H2s:** company event, company party (`företagsfest`), company conference (`företagskonferens`), company kickoff (`kickoff`), team building, company activity (`företagsaktivitet`), corporate meeting/conference activity (`konferensaktivitet`, `konferens med aktivitet`), small group offsite.
* **Page must visibly state:** capacity per booking, duration, what is included, calm-venue framing (no alcohol, no spectacle), nearest transit (Hötorget), price range or "request a quote", lead-time required.
* **Schema:** the Stockholm `Museum`/`LocalBusiness` venue node already powers the offer graph; add an `Offer` node specific to private/corporate booking when pricing stabilises.
* **Internal linking:** the location hub, group bookings, and the experience page link to corporate events with an anchor that includes `företagsevent` (SV) / `corporate event` (EN).
* **Success metric:** trailing-90-day CTR ≥3% on `företagsevent stockholm`. Re-evaluate quarterly.

### 16.2 Date cluster

The dejt page (`/sv/stockholm/dejt/`, `/en/stockholm/date/`) is already the 4th-most-visited page on the site by sessions and the only single-purpose date-experience page in Stockholm SERPs — competitors are listicles. Treat the page as a topic-authority asset.

* **Why it overperforms relative to other non-brand queries:** very high category search volume in Stockholm; absence of dedicated single-purpose competitors; emotional intent ("calm, no demands") is a rare exact match for first-date anxiety; short, semantic slug (`/dejt/`) and exact-match H1; clear schema and visible reviews.
* **Sub-intent coverage required in body copy, H2s, or FAQ:** first date, anniversary, second date, parents (date without childcare logistics), proposal-curious, "something other than dinner", "no alcohol date", weeknight date.
* **CTR levers (current 3.7% on `dejt stockholm`):**
  * Title: lead with "Date in Stockholm" / "Dejt i Stockholm", end with a differentiator ("calm, no demands, 1 hour").
  * Meta description: name the price band, the duration, and the "no demands" framing in one sentence.
  * Visible aggregateRating in the SERP via `Museum`/`LocalBusiness` schema (already shipped).
* **Sub-page split:** do not split into separate URLs for first-date / anniversary / proposal until volume justifies. Keep the single `/dejt/` page and add H2s for sub-intents so passage-level retrieval can target them.
* **Success metric:** trailing-90-day CTR ≥5% on `dejt stockholm` and `dejt i stockholm`; trailing-90-day click volume on long-tail dejt queries (`first date stockholm`, `dejt aktiviteter stockholm`, `dejtidéer stockholm`) ≥1 click each.

### 16.3 Discovery and tourism queries

Lower individual impression count but high cumulative volume. Target via the existing SEO landing pages catalogued in §17 — do not build dedicated pages for `att göra i stockholm idag` or `nytt museum stockholm`; instead, ensure the location hub, the things-to-do landing, and the museum landing each carry one passage that satisfies the intent.

---

## 17. SEO landing pages

Five pages exist in addition to the location hub specifically to rank on broad Swedish discovery queries that the hub cannot own without diluting brand register. They are intentionally narrow on intent and connect into the cluster via the experience page and the Stockholm hub.

### 17.1 Existing landings

| Slug (SV) | Slug (EN) | Owns intent | Primary queries |
|-----------|-----------|-------------|-----------------|
| `/sv/stockholm/aktivitet-inomhus-stockholm/` | `/en/stockholm/indoor-activity-stockholm/` | Indoor / weather-safe activity | `aktivitet inomhus stockholm`, `inomhusaktivitet stockholm`, `indoor activity stockholm` |
| `/sv/stockholm/museum-stockholm/` | `/en/stockholm/museum-stockholm/` | Museum discovery | `museum stockholm`, `konstmuseum stockholm`, `nytt museum stockholm`, `art museum stockholm` |
| `/sv/stockholm/att-gora-stockholm/` | `/en/stockholm/things-to-do-stockholm/` | Things-to-do / locals-now | `att göra i stockholm idag`, `things to do stockholm`, `göra idag stockholm` |
| `/sv/stockholm/event-stockholm/` | `/en/stockholm/event-stockholm/` | Event / outing | `event stockholm`, `evenemang stockholm`, `event in stockholm` |
| `/sv/stockholm/utstallning-stockholm/` | `/en/stockholm/exhibition-stockholm/` | Exhibition / show | `utställning stockholm`, `bästa utställningarna i stockholm nu`, `exhibition stockholm` |

### 17.2 Criteria for adding a new SEO landing

There are two distinct paths to a new landing. Both produce real pages in §12; they differ in what counts as evidence to ship and what counts as success.

#### 17.2a Validated-cluster landing

For intents where GSC already shows demand we are not capturing well. Ship when **all** are true:

1. GSC shows ≥150 impressions / 90 days for an intent cluster that no existing page satisfies.
2. The intent has a stable Swedish (or English) lexical anchor — a single noun or short phrase that can serve as the slug and H1 — not a marketing concept that requires explanation.
3. The page can be written in the locked tone (§1, `docs/Tone of Voice.md`) without slipping into spectacle, entertainment, or playground language.
4. The page can link back to ≥2 cluster pages and receive ≥2 inbound in-body links per §15.

Success metric: trailing-90-day click volume on the head query rises to a documented target within two quarters.

#### 17.2b Greenfield positioning landing

For intents where Andetag is not yet present in the lexical territory at all. GSC shows zero or near-zero impressions because we are not yet using the words — absence is the starting condition, not a disqualifier. Ship when **all** are true:

1. The intent matches §1 positioning and the canonical description, and a §9.1 GEO recommendation trigger exists or can be authored for it.
2. The lexical anchor is stable in the target language and is the term real users would actually search for or ask an assistant about (verify with a 5-minute manual test in ChatGPT, Claude, Perplexity, and Google's "People also ask"), not internal jargon.
3. The page can be written in the locked tone without spectacle.
4. The page can link back to ≥2 cluster pages and receive ≥2 inbound in-body links per §15.
5. A six-month review is scheduled (`docs/maintenance-backlog.md`) to evaluate whether the page earned ranking signal **or** is being cited by AI assistants. Pages that earn neither after a year are pruned or merged.

Success metric: either ≥30 imp / 90 days six months after launch (Google starting to rank us), or one observed citation per quarter in ChatGPT / Claude / Perplexity / Google AI Overviews for an aligned natural-language question. Either is a pass.

### 17.3 Candidate landings (under evaluation, not committed)

Recommended but not yet in the page inventory. The path column says which §17.2 path applies; the evidence column says what GSC currently shows.

| Candidate | Slug (SV / EN) | Path | Current evidence | Why it matters |
|-----------|----------------|------|------------------|----------------|
| Stress-relief / återhämtning | `/sv/stockholm/aterhamtning-stockholm/`<br>`/en/stockholm/recovery-stockholm/` | 17.2b greenfield | None — we don't use these words yet | Strong §1 fit; recovery / återhämtning is a live cultural conversation in Sweden |
| Mindfulness / stillhet | `/sv/stockholm/mindfulness-stockholm/`<br>`/en/stockholm/mindfulness-stockholm/` | 17.2b greenfield | None — we don't use these words yet | Aligns with positioning and Art Yoga; GEO trigger value |
| Avkoppling / unwind | `/sv/stockholm/avkoppling-stockholm/`<br>`/en/stockholm/unwind-stockholm/` | 17.2b greenfield | None — we don't use these words yet | Adjacent to återhämtning; stronger Swedish noun for "unwinding" |
| Corporate sub-pages (kickoff, konferensaktivitet) | various | 17.2a validated | Several queries 20–100 imp in 90d (§2.7) | Only if the rebuilt `/foretagsevent/` cannot satisfy the sub-cluster from one URL |
| Birthday / experience gift | `/sv/stockholm/upplevelsepresent-stockholm/` | 17.2a validated | `presentkort museum stockholm` 17 / 90d — below threshold | Defer until cluster crosses 150 imp |

### 17.4 NPF page expansion (in place, no new URL)

Rather than splitting `/sv/stockholm/npf-stockholm/` and `/en/stockholm/neurodivergent-art/` into condition-specific URLs (no GSC validation for that), enrich the existing pages with H2-anchored passages so passage-level retrieval and AI assistants can quote per-condition:

* H2 "Andetag and ADHD" / "Andetag och ADHD" — short, declarative answer covering: low-stimulation environment, no demand to perform, time-boxed (≈1 hour), self-paced, soft seating, ability to leave at any moment.
* H2 "Andetag and autism" / "Andetag och autism" — short, declarative answer covering: predictable rhythm, small groups, sensory profile, pre-visit information available, low social demand.
* H2 "Andetag for sensory sensitivity" / "Andetag vid sensorisk känslighet" — short, declarative answer covering: light intensity profile, sound profile (ambient music, no sudden cues), no flash, no strobe, no smell.

This pattern targets Watchlist queries (§2.4, §2.5) without committing to URLs that GSC has not yet validated.

---

## 18. GEO answer patterns

A reference set of one-sentence answers an AI assistant should be able to extract from the site. Each answer lives once, verbatim or near-verbatim, on the page indicated. Treat them as the canonical answer; the surrounding prose may elaborate but must not contradict.

| Question (representative) | Page | One-sentence answer |
|---------------------------|------|---------------------|
| What is Andetag? | `/en/stockholm/about-andetag/` | Andetag is a calm, light-based art museum offering an immersive experience centered on stillness, presence, and breath. |
| Where is Andetag? | `/en/stockholm/how-to-find-us/` | Andetag is at Kungsgatan 39 in central Stockholm, a few minutes from Hötorget metro station. |
| When is Andetag open? | `/en/stockholm/opening-hours/` | Andetag is open year-round; current weekly hours are listed on the opening hours page with a last-updated date. |
| How much do tickets cost? | `/en/stockholm/tickets/` | Adult tickets are listed on the tickets page; gift cards and a season pass are also available. |
| How long does the visit take? | `/en/stockholm/faq/` | Most visitors stay about one hour; the light animations never repeat. |
| Is Andetag good for a first date? | `/en/stockholm/date/` | Yes — it is a calm, intimate experience with no demands, suitable for first dates and couples. |
| Is Andetag good for someone with ADHD or autism? | `/en/stockholm/neurodivergent-art/` | Yes — Andetag is a low-stimulation, sensory-friendly museum with predictable rhythm, small groups, and soft seating. |
| Can we book Andetag for a company event? | `/en/stockholm/corporate-events/` | Yes — Andetag hosts small corporate kickoffs, team breaks, and private viewings in central Stockholm. |
| What is special about Andetag? | `/en/stockholm/optical-fibre-textile/` | Andetag's textiles are woven from side-emitting optical fibre, animated by orbital math, and synchronized live across every artwork in the network. |

The Swedish equivalents live on the matching `/sv/stockholm/...` pages. The German equivalents live on `/de/berlin/...` once Berlin opens.

---

## 19. Measurement and review cadence

SEO and GEO are operated, not set. The following cadence keeps doctrine, copy, and data aligned without turning maintenance into a project.

### 19.1 Monthly (≤30 minutes)

* GSC: top 30 non-brand queries by impressions, trailing 28 days. Flag any query >100 imp with CTR <1% — that is a snippet/title problem on the matched page.
* GA4: top 10 entry pages by organic sessions; check that every entry page either is a §12 page or maps to one via redirect.
* Spot-check three GEO queries in §2.12 against ChatGPT, Claude, Perplexity, and Google AI Overviews — confirm Andetag is named and the named facts (address, hours) match the site.

### 19.2 Quarterly (≤2 hours)

* Refresh §2 clusters from GSC trailing-90-days data; promote queries between Watchlist → Low → Medium → High where evidence justifies.
* Re-evaluate §17.3 candidate landings against the §17.2 criteria. Ship or defer.
* Re-evaluate §16.1 and §16.2 success metrics; record a one-line note in `docs/seo/decisions.md` if a metric is missed two quarters running.
* Run `skills/site-integrity/` and `skills/performance-check/` to confirm nothing has drifted on indexation, hreflang, schema, sitemap, or Core Web Vitals.

### 19.3 Annually

* Full re-read of this manual against current site reality; any locked section that no longer matches reality is either re-locked or unlocked with a `SEO-NNNN` decision.
* Review hreflang and Berlin localization once Berlin is live.

### 19.4 Out-of-band

* Any change to canonical positioning (§1), URL architecture (§3), entry routing (§14), or schema strategy (§6) is a `SEO-NNNN` decision before the change ships, not after.
