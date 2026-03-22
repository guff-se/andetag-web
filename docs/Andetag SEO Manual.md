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

3.1 Root language URLs (LOCKED)

Swedish root: /

English root: /en/

These roots act as the primary Stockholm landing pages while Stockholm is the only open location.

3.2 Location URL pattern (LOCKED)

Swedish location pages: /stockholm/slug/

English location pages: /en/stockholm/slug/

Rules:

City is always the first segment after the (optional) language.

One domain only. No language subdomains.

3.3 Language detection redirects (LOCKED)

The following URLs use browser language detection to redirect to the appropriate language landing page:

* / redirects to / (Swedish) or /en/ (English) based on detected language
* /en redirects to / or /en/ based on detected language
* /stockholm redirects to / or /en/ based on detected language
* /en/stockholm redirects to / or /en/ based on detected language

This ensures visitors land on the correct language version while maintaining clean, predictable URLs for direct access

Examples:

/stockholm/oppettider/

/en/stockholm/opening-hours/

/om-andetag/

/en/about-andetag/

3.4 Page types

There are two types of pages:

Global pages (brand level) under / and /en/

Location subpages (city level) under /stockholm/ and /en/stockholm/

3.5 Locations

Stockholm: sv default at /, en at /en/

Berlin: de default at /de/berlin/, en at /en/berlin/

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
<link rel="alternate" hreflang="sv-SE" href="/stockholm/oppettider/" />
<link rel="alternate" hreflang="en" href="/en/stockholm/opening-hours/" />
<link rel="alternate" hreflang="x-default" href="/stockholm/" />
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
* NPF pages (/stockholm/npf-stockholm/, /en/stockholm/neurodivergent-friendly-stockholm/) expand pre-visit information for neurodivergent visitors

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

* All Sweden ads point to /

Multi-location phase (after Berlin ads launch):

* Sweden ads point to /stockholm/
* Germany ads point to /de/berlin/ (or /en/berlin/ for EN ads)

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

* SV: /om-andetag/
* EN: /en/about-andetag/
* DE: /de/ueber-andetag/
* Keywords: Andetag project, breathing museum concept, breathing art, concept, art, stillness

About the artists

* SV: /om-konstnarerna-malin-gustaf-tadaa/
* EN: /en/about-the-artists-malin-gustaf-tadaa/
* DE: /de/die-kuenstler-malin-gustaf-tadaa/
* Keywords: artists, creators, practice, collaboration

The music from Andetag

* SV: /musik/
* EN: /en/music/
* DE: /de/musik-von-andetag/
* Keywords: music, soundscape, composition, listening

### 12.2 Location hub pages (Stockholm)

Location hub

* SV: /stockholm/
* EN: /en/stockholm/
* Keywords: **breathing museum**, Andetag Stockholm, breathing light art museum, breathing art museum, light-based art museum, stillness

Core factual anchors

Opening hours

* SV: /stockholm/oppettider/
* EN: /en/stockholm/opening-hours/
* Keywords: opening hours, when to visit, open year-round, schedule

How to find us

* SV: /stockholm/hitta-hit/
* EN: /en/stockholm/how-to-find-us/
* Keywords: address, Kungsgatan 39, Hötorget, directions, entrance

Tickets

* SV: /stockholm/biljetter/
* EN: /en/stockholm/tickets/
* Keywords: tickets, pricing, booking, visit rules

FAQ

* SV: /stockholm/fragor-svar/
* EN: /en/stockholm/faq/
* Keywords: common questions, duration, age, rules

Accessibility

* SV: /stockholm/tillganglighet/
* EN: /en/stockholm/accessibility/
* Keywords: accessibility, physical access, seating, sensory considerations

NPF / neurodivergent audience

* SV: /stockholm/npf-stockholm/
* EN: /en/stockholm/neurodivergent-friendly-stockholm/
* Keywords: NPF-vänlig, neurodivergent-friendly, sensory-friendly museum, low stimulation, autism-friendly, lugn miljö, low demand, what to expect
* Content: Pre-visit information for visitors with autism, ADHD or sensory sensitivities. Sensory profile, predictable rhythm, small groups, decompress. Links to accessibility page.

Clarification and program pages

What kind of experience is this?

* SV: /stockholm/vilken-typ-av-upplevelse/
* EN: /en/stockholm/what-kind-of-experience/
* Keywords: breathing museum experience, calm experience, stillness, presence, breathing light art, light-based art

Romantic date

* SV: /stockholm/dejt/
* EN: /en/stockholm/date/
* Keywords: date idea, calm date, togetherness

Art Yoga

* SV: /stockholm/art-yoga/
* EN: /en/stockholm/art-yoga/
* Keywords: art yoga, breathing art, movement, breath, slow practice, breathing museum

Commercial extensions

Gift cards

* SV: /stockholm/presentkort/
* EN: /en/stockholm/giftcard/
* Keywords: gift card, give Andetag, present

Season pass

* SV: /stockholm/sasongskort/
* EN: /en/stockholm/season-pass/
* Keywords: season pass, return visits, repeated access

Group bookings and private events

* SV: /stockholm/gruppbokning/
* EN: /en/stockholm/group-bookings/
* Keywords: group booking, private viewing, small groups

Company events

* SV: /stockholm/foretagsevent/
* EN: /en/stockholm/corporate-events/
* Keywords: company events, corporate booking

Press (location specific)

* SV: /stockholm/press/
* EN: /en/stockholm/press/
* Keywords: press material, media kit, images, description

Visitor voices and reviews

* SV: /stockholm/besokaromdomen/
* EN: /en/stockholm/visitor-reviews/
* Keywords: visitor reviews, reflections, quotes

The textile behind the art

* SV: /optisk-fibertextil/
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

* Visit -> /stockholm/

  * Tickets -> /stockholm/biljetter/
  * Season pass -> /stockholm/sasongskort/
  * Opening hours -> /stockholm/oppettider/
  * How to find us -> /stockholm/hitta-hit/
  * Accessibility -> /stockholm/tillganglighet/
  * FAQ -> /stockholm/fragor-svar/

* The experience -> /stockholm/vilken-typ-av-upplevelse/

  * Romantic date -> /stockholm/dejt/
  * Art Yoga -> /stockholm/art-yoga/
  * Music -> /musik/

* Groups and companies -> /stockholm/gruppbokning/

  * Company events -> /stockholm/foretagsevent/

* About -> /om-andetag/

  * About the artists -> /om-konstnarerna-malin-gustaf-tadaa/
  * Press -> /stockholm/press/

* Gifts -> /stockholm/presentkort/

* Tickets (CTA) -> /stockholm/biljetter/

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

## 14. Root Page Behavior (LOCKED)

Decision:

* **A selected**

Implementation:

* `/` and `/en/` serve as Stockholm-focused landing pages while Stockholm is the only open location.
* Browser language detection automatically redirects visitors from `/`, `/en`, `/stockholm`, and `/en/stockholm` to the appropriate language root (/ or /en/).
* All Sweden ads continue to point to `/` during this phase (language detection handles routing to correct language).

Transition rule:

* When Berlin opens and ads launch for multiple locations:

  * `/` and `/en/` transition into brand-level Andetag pages.
  * Sweden ads move to `/stockholm/` and `/en/stockholm/` (which should then become actual landing pages instead of detection redirects).
  * Germany ads point to `/de/berlin/` or `/en/berlin/`.

This transition should be executed without redirects initially, relying on internal linking and navigation updates.
