# ANDETAG SEO & GEO MANUAL

Version: February 2026
Audience: Senior SEO and GEO specialist
Scope: andetag.museum (Stockholm open, Berlin pre-opening)

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

The brand Andetag (Swedish for “a breath”) is used globally. For English markets, the primary discoverability phrase is **breathing museum**—how visitors recall and search for the experience. This prepares for expansion: when launching in Germany, parallel SEO will target “Atem museum”, “atmendes Museum”, etc., all tying back to the Andetag brand.

English-specific rules:

* **breathing museum** is a primary keyword for all English index and hub pages.
* It must appear in the page title and meta description of `/en/` and `/en/stockholm/`.
* Frame the concept naturally: “a museum with breathing light art”, “breathing art museum”.
* Do not replace “Andetag” with “breathing museum” in branding; use it for discoverability and recall.

---

## 2. Keyword Constraints (FROM GSC DATA)

Signals to respect. Not keywords to stuff.

Swedish signals:

* andetag
* andetag museum
* andetag utställning
* andetag konst
* andetag stockholm
* konstupplevelse
* konstupplevelse stockholm
* textilkonst stockholm

Location and finding:

* andetag hötorget
* andetag kungsgatan
* andetag adress
* var ligger andetag
* hitta till andetag

Visit intent:

* biljetter andetag
* öppettider andetag
* när är andetag öppet
* hur lång tid tar andetag

NPF / neurodivergent audience (Swedish):

* npf-vänlig museum stockholm
* npf-vänlig utställning
* sensoriskt vänlig museum
* autismvänlig stockholm
* lugn utställning stockholm
* låg stimulus
* lugn miljö

NPF / neurodivergent audience (English):

* neurodivergent friendly museum stockholm
* sensory friendly museum stockholm
* autism friendly stockholm
* low stimulation museum
* quiet museum stockholm
* low demand

English signals:

* **breathing museum** (primary for international discoverability)
* breathing art museum
* breathing light art
* breathing art
* andetag museum
* andetag stockholm
* andetag art museum
* andetag exhibition

Location and tourism:

* andetag hötorget
* andetag stockholm location
* where is andetag
* andetag address

Visit intent:

* andetag tickets
* andetag opening hours
* andetag opening times

Cross-language GEO critical (answerable verbatim somewhere on site):

* Andetag museum Stockholm
* Andetag Hötorget
* Andetag tickets
* Andetag opening hours
* Where is Andetag
* Breathing museum Stockholm
* Breathing art museum

Explicit non-targets:

* immersive experience stockholm (generic)
* interactive museum stockholm
* entertainment stockholm

Future localization (parallel strategy when launching):

* Germany: Atem museum, atmendes Museum, Atem Kunst, etc.

---

3. URL & Location Architecture (POLYLANG COMPATIBLE)

3.1 Language prefix (LOCKED)

Every locale uses an explicit language segment in the path (symmetric IA):

* **Swedish:** **`/sv/...`**
* **English:** **`/en/...`**
* **German:** **`/de/...`**

Normative redirect, cookie, and entry behavior for **`/`** and **`/en/`** is in **`docs/url-migration-policy.md`**.

3.2 Stockholm URL pattern (LOCKED)

Swedish Stockholm **home:** **`/sv/stockholm/`**

Swedish Stockholm **subpages:** **`/sv/stockholm/<slug>/`**

English Stockholm **hub:** **`/en/stockholm/`**

English Stockholm **subpages:** **`/en/stockholm/<slug>/`**

Legacy unprefixed Swedish URLs from the old site (**`/`**, **`/stockholm/...`**, **`/musik/`**, **`/om-andetag/`**, and similar) are **not** canonical. They **`301`** to the matching **`/sv/...`** URL. See **`docs/url-matrix.csv`** and **`site/public/_redirects`**.

One domain only. No language subdomains.

3.3 Entry routing (LOCKED)

**`/`** is not the Swedish home document in the target production model: it is an **edge router** (Worker) with **`Accept-Language`**, **`andetag_entry`**, and verified-bot rules. Canonical Swedish home for indexation and hreflang is **`/sv/stockholm/`**.

Details: **`docs/url-migration-policy.md`** (sections on **`/`**, **`/en/`**, cookie, crawlers).

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

Museum schema (Stockholm) required properties:

* name
* description (use canonical description; for English pages, include "breathing museum" or "breathing light art museum" in the description)
* address (Kungsgatan 39, Stockholm)
* openingHoursSpecification (stable)
* isAccessibleForFree = false
* sameAs (Google Business Profile, Tripadvisor)

Optional:

* aggregateRating (include when stable and maintained)

---

## 7. Factual Anchor Pages (CRITICAL FOR GEO)

These pages are optimized for AI citation.
Tone: calm, neutral, exact.

Opening hours:

* Explicit weekly schedule
* Open year-round
* Last updated date

How to find us:

* Canonical address: Kungsgatan 39
* Subway route (Hötorget) as secondary
* Walking instructions

Accessibility:

* Physical access
* Sensory considerations
* Seating and rest
* NPF pages (**`/sv/stockholm/npf-stockholm/`**, **`/en/stockholm/neurodivergent-friendly-stockholm/`**) expand pre-visit information for neurodivergent visitors

---

## 8. Experiential Pages (BRAND SAFE)

* Tone of voice remains primary.
* Never hide facts inside poetic text.
* Experiential pages must link to factual anchors.

---

## 9. GEO Optimization (AI RECOMMENDABILITY)

Recommendation triggers to support (appear once, verbatim, somewhere on site):

* A calm alternative to busy museums in Stockholm
* A quiet, beautiful experience in central Stockholm
* A unique, intimate date experience
* A breathing museum in Stockholm
* The breathing light art museum in central Stockholm
* A breathing art experience
* A neurodivergent-friendly museum in Stockholm
* A sensory-friendly, low-stimulation museum for visitors with autism or ADHD

Optional: llms.txt

* Place at /llms.txt
* Include canonical description
* Include location hub URLs
* Include factual anchor URLs

No marketing language.

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

### 12.1 Global pages (all locations)

English root (Stockholm landing)

* EN: /en/
* Keywords: **breathing museum** (primary—must appear in title and meta description), breathing art museum, Andetag Stockholm, breathing light art

About Andetag

* SV: /sv/om-andetag/
* EN: /en/about-andetag/
* DE: /de/ueber-andetag/
* Keywords: Andetag project, breathing museum concept, breathing art, concept, art, stillness

About the artists

* SV: /sv/om-konstnarerna-malin-gustaf-tadaa/
* EN: /en/about-the-artists-malin-gustaf-tadaa/
* DE: /de/die-kuenstler-malin-gustaf-tadaa/
* Keywords: artists, creators, practice, collaboration

The music from Andetag

* SV: /sv/musik/
* EN: /en/music/
* DE: /de/musik-von-andetag/
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
* EN: /en/stockholm/neurodivergent-friendly-stockholm/
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

* SV: /sv/optisk-fibertextil/
* EN: /en/optical-fibre-textile/
* DE: /de/optische-fasertextil/
* Keywords: weaving, textile, optical fibre, fabric, breathing light art

### 12.3 Location hub pages (Berlin)

Berlin is currently in Phase 1 (pre-opening): lead capture only, no tickets or visitor subpages.

Location hub

* DE: /de/berlin/
* EN: /en/berlin/
* Keywords: Andetag Berlin, breathing museum Berlin, breathing light art Berlin

Note: Berlin shares the global pages (About, Artists, Music, Textile) listed in section 12.1. German translations are linked from the Berlin menu; English versions are the same global English pages.

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
  * Music -> /sv/musik/

* Groups and companies -> /sv/stockholm/gruppbokning/

  * Company events -> /sv/stockholm/foretagsevent/

* About -> /sv/om-andetag/

  * About the artists -> /sv/om-konstnarerna-malin-gustaf-tadaa/
  * Press -> /sv/stockholm/press/

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

Normative rules live in **`docs/url-migration-policy.md`** and **`docs/phase-4-routing-reopen.md`**.

Summary:

* **`/`** is an **entry router** at the edge (not the Swedish home document). Canonical Swedish home is **`/sv/stockholm/`**.
* **`/en/`** is the **English hub** when the visitor is in the English lane without a committed Stockholm or Berlin preference.
* Legacy Swedish paths without **`/sv/`** **`301`** to **`/sv/...`** per the URL matrix and **`site/public/_redirects`**.

When Berlin opens and campaigns split by market, align ad landing URLs with the canonical location hubs (**`/sv/stockholm/`**, **`/en/stockholm/`**, **`/de/berlin/`**, **`/en/berlin/`**) and update this manual if examples change.
