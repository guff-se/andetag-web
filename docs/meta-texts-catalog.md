# Meta texts catalog (titles and descriptions)

This file lists every **HTML document title** and **meta description** wired through `[SiteLayout.astro](../site/src/layouts/SiteLayout.astro)` (also used for `og:title`, `og:description`, `twitter:title`, `twitter:description`, and JSON-LD where applicable).

## How to use this file

1. Edit **Title** and **Description** under each canonical path below. Do not change the canonical path in each section heading (level-3 heading, path in backticks), so a later sync can match rows to `page-shell-meta.json` keys.
2. When you are done, ask the maintainer or agent to **apply this catalog** to the codebase. That means updating `[page-shell-meta.json](../site/src/data/page-shell-meta.json)` (field `pages` → matching keys) and, if you changed the 404 block, `[404.astro](../site/src/pages/404.astro)`.
3. **Do not** run `[extract-page-shell-meta.mjs](../site/scripts/extract-page-shell-meta.mjs)` expecting it to preserve hand-tuned copy across all routes. That script re-reads `site-html/` snapshots; use it only when you intentionally refresh from HTML sources.

## Scope


| Source                                                          | What it controls                                                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `[page-shell-meta.json](../site/src/data/page-shell-meta.json)` | All shell routes below (via `getPageShellRoute` in `[[...slug].astro](../site/src/pages/[...slug].astro)`) |
| `[404.astro](../site/src/pages/404.astro)`                      | 404 page only (`noindex`)                                                                                  |


Other head tags not listed here: `og:site_name` is the constant `ANDETAG` in `[seo.ts](../site/src/lib/chrome/seo.ts)`. `[site.webmanifest](../site/public/site.webmanifest)` uses short `name` / `short_name` only (no per-page descriptions).

---

## Shell routes (`[page-shell-meta.json](../site/src/data/page-shell-meta.json)`)

### `/de/berlin/`

**Title:** ANDETAG Berlin | Das Atemmuseum | Stille, Licht und gemeinsamer Atem | ANDETAG Stockholm

**Description:** ANDETAG eröffnet bald in Berlin, ein stilles Atemmuseum, in dem Licht, Textil und Musik sich im Rhythmus eines gemeinsamen Atemzugs bewegen.

---

### `/de/berlin/die-kuenstler-malin-gustaf-tadaa/`

**Title:** Malin & Gustaf Tadaa | Die Künstler hinter ANDETAG | ANDETAG Stockholm

**Description:** Malin und Gustaf Tadaa sind das Künstlerpaar hinter dem Atemmuseum ANDETAG. Ihre gemeinsame Praxis bewegt sich zwischen Licht, Textil, Code und Interaktion.

---

### `/de/berlin/musik-von-andetag/`

**Title:** Musik von ANDETAG | Originalmusik zum Hören und Atmen | ANDETAG Stockholm

**Description:** Zwölf Stücke. Gut eine Stunde zusammenhängendes Hören. Die Originalmusik von ANDETAG, komponiert für Stille und Gegenwärtigkeit, von Gustaf Tadaa und Povel Olsson.

---

### `/de/berlin/optische-fasertextil/`

**Title:** Die Textilkunst von ANDETAG | Optische Faser, Licht und Gewebe | ANDETAG Stockholm

**Description:** Jedes ANDETAG-Werk beginnt mit einem Gewebe. Optische Faser, Baumwolle und Licht werden zu einer Textilkunst verwoben, die langsam leuchtet und sich nie wiederholt.

---

### `/de/berlin/privacy/`

**Title:** Datenschutz | ANDETAG Berlin

**Description:** This Privacy Policy, hereinafter referred to as the ”Policy,” pertains to the processing, collection, utilization, retention, and dissemination of personal data by Tadaa Art AB (”we,” ”us,” or ”our”) in the course of operations conducted through our website, ticketing systems, and associated digital or physical platforms. This Policy is instituted in accordance with the General […]

---

### `/de/berlin/ueber-andetag/`

**Title:** ANDETAG – Das Kunstwerk | Ein gemeinsamer Atemzug als Kunst | ANDETAG Stockholm

**Description:** ANDETAG: ein fortlaufendes Kunstprojekt, in dem Licht, Textil und Musik sich im Rhythmus eines gemeinsamen menschlichen Atemzugs bewegen. Nie abgeschlossen, immer in Bewegung.

---

### `/en/`

**Title:** ANDETAG | The Breathing Museum

**Description:** ANDETAG is the breathing museum: a calm, light-based art experience. Choose Stockholm or Berlin to plan your visit.

---

### `/en/berlin/`

**Title:** ANDETAG Berlin | The Breathing Museum Opens Autumn 2026 | ANDETAG Stockholm

**Description:** ANDETAG, the breathing museum, is coming to Berlin in autumn 2026. A calm, light-based art experience built for stillness and presence. Sign up to be the first to know.

---

### `/en/berlin/about-andetag/`

**Title:** About ANDETAG | A Breathing Art Project by Malin & Gustaf Tadaa | ANDETAG Stockholm

**Description:** ANDETAG is an ongoing art project by Malin and Gustaf Tadaa, built around a shared human breath and unfolding through light, textile, sound, and space.

---

### `/en/berlin/about-the-artists-malin-gustaf-tadaa/`

**Title:** Malin & Gustaf Tadaa | Artists Working with Light, Textile, and Technology in Stockholm | ANDETAG | ANDETAG Stockholm

**Description:** Malin and Gustaf Tadaa are a Stockholm-based artist duo working with light, textile, and technology in participatory and spatial art installations. They are the artists behind Andetag.

---

### `/en/berlin/music/`

**Title:** The Music | ANDETAG Stockholm

**Description:** The original music from ANDETAG. Twelve tracks in a slower rhythm. A shared breath to listen to, beyond the exhibition. By Gustaf Tadaa and Povel Olsson.

---

### `/en/berlin/optical-fibre-textile/`

**Title:** The Textile Behind the Art | ANDETAG Stockholm

**Description:** About the weaving, materials, and craft behind ANDETAG. A deeper look at optical fiber textile and the textile that carries light and breath.

---

### `/en/berlin/privacy/`

**Title:** Privacy Policy | ANDETAG Berlin

**Description:** This Privacy Policy, hereinafter referred to as the ”Policy,” pertains to the processing, collection, utilization, retention, and dissemination of personal data by Tadaa Art AB (”we,” ”us,” or ”our”) in the course of operations conducted through our website, ticketing systems, and associated digital or physical platforms. This Policy is instituted in accordance with the General […]

---

### `/en/stockholm/`

**Title:** ANDETAG | The Breathing Museum in Stockholm

**Description:** ANDETAG is a breathing museum in Stockholm: a calm, art experience where light, breath, and music meet. Visit the breathing art museum near Hötorget.

---

### `/en/stockholm/about-andetag/`

**Title:** About ANDETAG | A Breathing Art Project by Malin & Gustaf Tadaa | ANDETAG Stockholm

**Description:** ANDETAG is an ongoing art project by Malin and Gustaf Tadaa, built around a shared human breath and unfolding through light, textile, sound, and space.

---

### `/en/stockholm/about-the-artists-malin-gustaf-tadaa/`

**Title:** Malin & Gustaf Tadaa | Artists Working with Light, Textile, and Technology in Stockholm | ANDETAG | ANDETAG Stockholm

**Description:** Malin and Gustaf Tadaa are a Stockholm-based artist duo working with light, textile, and technology in participatory and spatial art installations. They are the artists behind Andetag.

---

### `/en/stockholm/accessibility/`

**Title:** Accessibility at ANDETAG Stockholm | ANDETAG Stockholm

**Description:** Accessibility information for ANDETAG in Stockholm. Wheelchair-accessible exhibition, elevators from street and metro, free entry for caregivers. Groups welcome.

---

### `/en/stockholm/art-yoga/`

**Title:** Art Yoga in Stockholm | Slow yoga at ANDETAG | ANDETAG Stockholm

**Description:** Art Yoga is a slow yoga class in ANDETAG's enveloping art space in central Stockholm. A place to move, breathe, and settle, once a week.

---

### `/en/stockholm/corporate-events/`

**Title:** Corporate events in Stockholm | ANDETAG Stockholm

**Description:** Calm corporate events in Stockholm. A shared experience of light, woven textile and music at ANDETAG. Suitable for kickoffs, team building and conference breaks.

---

### `/en/stockholm/date/`

**Title:** Date in Stockholm | A Quiet Place to Be Together | ANDETAG Stockholm

**Description:** A still, immersive art experience in central Stockholm. A calm date where you can be close, be quiet, and share an hour together. Suitable for first dates and couples.

---

### `/en/stockholm/event-stockholm/`

**Title:** ANDETAG | Event in Stockholm: a quiet pause | ANDETAG Stockholm

**Description:** What happens in Stockholm when you want calm? ANDETAG, the breathing museum, is a still event in central Stockholm: light, textile, and breath at Hötorget. Book your visit.

---

### `/en/stockholm/exhibition-stockholm/`

**Title:** ANDETAG | A calm art exhibition in Stockholm | ANDETAG Stockholm

**Description:** A calm art exhibition in Stockholm at Hötorget. Light-based textile art and music at the breathing museum. Open year-round in central Stockholm.

---

### `/en/stockholm/faq/`

**Title:** Frequently Asked Questions about ANDETAG Stockholm | (FAQ)​ | ANDETAG Stockholm

**Description:** Answers to frequently asked questions about ANDETAG in Stockholm. Practical information about your visit, tickets, accessibility, children, groups, and how the experience works.

---

### `/en/stockholm/giftcard/`

**Title:** Give ANDETAG as a gift in Stockholm | Gift cards & tickets | ANDETAG Stockholm

**Description:** Give ANDETAG A gift does not have to be an object.It can be a moment. ANDETAG is an immersive art experience where light, textile and music move in rhythm with a shared breath. A quiet place inside the city. A pause from pace and input. To give ANDETAG is to invite someone into presence.To step […]

---

### `/en/stockholm/group-bookings/`

**Title:** Group bookings in Stockholm | ANDETAG Stockholm

**Description:** Group bookings in Stockholm for groups and private parties. A calm experience of light, woven textile and music at ANDETAG, in the heart of the city.

---

### `/en/stockholm/how-to-find-us/`

**Title:** How to Find ANDETAG Stockholm | Hötorget Metro Station | ANDETAG Stockholm

**Description:** ANDETAG is located in the central entrance of Hötorget metro station in Stockholm. Easy to reach, right beneath the city’s rhythm.

---

### `/en/stockholm/indoor-activity-stockholm/`

**Title:** ANDETAG | A calm indoor activity in Stockholm | ANDETAG Stockholm

**Description:** Indoor activity in Stockholm. ANDETAG, the breathing museum, is a calm experience for presence. Light, textile, and music in one breath. Ideal in any weather.

---

### `/en/stockholm/museum-stockholm/`

**Title:** ANDETAG | A calm museum in Stockholm | ANDETAG Stockholm

**Description:** A calm art museum in Stockholm near Hötorget. ANDETAG: light-based art, presence, and breath. Evening hours in central Stockholm.

---

### `/en/stockholm/music/`

**Title:** The Music | ANDETAG Stockholm

**Description:** The original music from ANDETAG. Twelve tracks in a slower rhythm. A shared breath to listen to, beyond the exhibition. By Gustaf Tadaa and Povel Olsson.

---

### `/en/stockholm/neurodivergent-art/`

**Title:** Neurodiversity-friendly visit at ANDETAG Stockholm | Calm, low-stimulus exhibition | ANDETAG Stockholm

**Description:** Visitor information for autistic, ADHD, and sensory-sensitive guests. ANDETAG in Stockholm: predictable light, small groups, quiet music at Hötorget.

---

### `/en/stockholm/opening-hours/`

**Title:** Opening Hours | ANDETAG Stockholm

**Description:** Opening hours for ANDETAG in Stockholm. An immersive art experience with fixed start times and limited capacity.

---

### `/en/stockholm/optical-fibre-textile/`

**Title:** The Textile Behind the Art | ANDETAG Stockholm

**Description:** About the weaving, materials, and craft behind ANDETAG. A deeper look at optical fiber textile and the textile that carries light and breath.

---

### `/en/stockholm/privacy/`

**Title:** Privacy Policy | ANDETAG Stockholm

**Description:** This Privacy Policy, hereinafter referred to as the ”Policy,” pertains to the processing, collection, utilization, retention, and dissemination of personal data by Tadaa Art AB (”we,” ”us,” or ”our”) in the course of operations conducted through our website, ticketing systems, and associated digital or physical platforms. This Policy is instituted in accordance with the General […]

---

### `/en/stockholm/season-pass/`

**Title:** Season Pass ANDETAG Stockholm | Unlimited Access to the Experience | ANDETAG Stockholm

**Description:** The ANDETAG season pass in Stockholm gives you unlimited access over time. A calm art experience to return to, whenever you need a pause.

---

### `/en/stockholm/things-to-do-stockholm/`

**Title:** ANDETAG | Something calm to do in Stockholm | ANDETAG Stockholm

**Description:** Things to do in Stockholm today? ANDETAG, the breathing museum, is a calm art experience in central Stockholm. Light, breath, and presence. Open year-round at Hötorget.

---

### `/en/stockholm/tickets/`

**Title:** Tickets | ANDETAG Stockholm

**Description:** Book tickets to ANDETAG in Stockholm. A calm art experience with timed entry and limited availability.

---

### `/en/stockholm/visitor-reviews/`

**Title:** Visitor Reviews of ANDETAG | Art Experience in Stockholm | ANDETAG Stockholm

**Description:** Read visitor reviews of ANDETAG in Stockholm. Selected Tripadvisor comments about the art experience, combining light, textile and music.

---

### `/en/stockholm/what-kind-of-experience/`

**Title:** What kind of experience is ANDETAG? A breathing museum experience | ANDETAG Stockholm

**Description:** ANDETAG is a calm, immersive art experience shaped by stillness, presence, and a shared breathing rhythm. A clear description of what to expect before you visit.

---

### `/sv/stockholm/`

**Title:** ANDETAG | En stillsam konstupplevelse i Stockholm

**Description:** Andetag är ett stillsamt konstmuseum i centrala Stockholm. En omslutande upplevelse av ljus, textil och musik, skapad för närvaro, vila och ett gemensamt andetag.

---

### `/sv/stockholm/aktivitet-inomhus-stockholm/`

**Title:** ANDETAG | En lugn aktivitet inomhus i Stockholm

**Description:** Inomhusaktivitet i Stockholm. ANDETAG - en stillsam aktivitet för närvaro. Ljus, textil och musik i ett gemensamt andetag. Perfekt vid dåligt väder.

---

### `/sv/stockholm/art-yoga/`

**Title:** Art Yoga i Stockholm | Yoga i konstmiljö på ANDETAG | ANDETAG Stockholm

**Description:** Art Yoga är en långsam yogaklass i Andetags omslutande konstmiljö i centrala Stockholm. En plats att röra sig, andas och landa, en gång i veckan.

---

### `/sv/stockholm/att-gora-stockholm/`

**Title:** ANDETAG | Något lugnt att göra i Stockholm

**Description:** Att göra i Stockholm idag? ANDETAG – en stillsam konstupplevelse i centrala Stockholm. Ljus, andning och närvaro. Öppet året runt vid Hötorget.

---

### `/sv/stockholm/besokaromdomen/`

**Title:** Besökaromdömen om ANDETAG | Konstupplevelse i Stockholm | ANDETAG Stockholm

**Description:** Läs vad besökare säger om ANDETAG i Stockholm. Omdömen från Tripadvisor om upplevelsen av ljus, textil, musik och stillhet mitt i staden.

---

### `/sv/stockholm/biljetter/`

**Title:** Biljetter | ANDETAG Stockholm

**Description:** Boka biljetter till ANDETAG i Stockholm. En stillsam konstupplevelse där ljus, textil och musik rör sig i långsam takt.

---

### `/sv/stockholm/dejt/`

**Title:** Dejt i Stockholm | En lugn plats att vara tillsammans | ANDETAG Stockholm

**Description:** En stillsam konstupplevelse mitt i Stockholm. En lugn dejt där ni kan sitta nära, vara tysta och dela en stund tillsammans. Passar både första dejten och etablerade par.

---

### `/sv/stockholm/event-stockholm/`

**Title:** ANDETAG | Event i Stockholm: stillsam paus | ANDETAG Stockholm

**Description:** Vad händer i Stockholm när du vill pausa? ANDETAG är ett stillsamt event i Stockholm: ljus, textil och andning vid Hötorget. Boka ditt besök.

---

### `/sv/stockholm/foretagsevent/`

**Title:** Företagsevent i Stockholm | ANDETAG Stockholm

**Description:** Stillsamma företagsevent i Stockholm. En gemensam upplevelse av ljus, textil och musik på ANDETAG. För kickoff, teambuilding och konferenspaus.

---

### `/sv/stockholm/fragor-svar/`

**Title:** Vanliga frågor om ANDETAG Stockholm | FAQ | ANDETAG Stockholm

**Description:** Svar på vanliga frågor om ANDETAG i Stockholm. Praktisk information om besöket, biljetter, tillgänglighet, barn, grupper och hur upplevelsen fungerar.

---

### `/sv/stockholm/gruppbokning/`

**Title:** Gruppbokning i Stockholm | ANDETAG Stockholm

**Description:** Gruppbokning i Stockholm för grupper och privata sällskap. En stillsam upplevelse av ljus, textil och musik på ANDETAG, mitt i staden.

---

### `/sv/stockholm/hitta-hit/`

**Title:** Hitta till ANDETAG Stockholm | Vid Hötorgets tunnelbana | ANDETAG Stockholm

**Description:** ANDETAG ligger i Hötorgets tunnelbanestation i centrala Stockholm. En stillsam plats precis under stadens tempo, lätt att nå med tunnelbana.

---

### `/sv/stockholm/museum-stockholm/`

**Title:** ANDETAG | En stillsamt museum i Stockholm​

**Description:** Ett stillsamt konstmuseum i Stockholm. ANDETAG vid Hötorget – ljusbaserad konst, närvaro och andning. Kvällsöppet museum i centrala Stockholm.

---

### `/sv/stockholm/musik/`

**Title:** Musiken | ANDETAG Stockholm

**Description:** Originalmusiken från ANDETAG. Tolv spår i långsam takt. Ett gemensamt andetag att lyssna till, även utanför utställningen. Av Gustaf Tadaa och Povel Olsson.

---

### `/sv/stockholm/npf-stockholm/`

**Title:** NPF-vänlig utställning Stockholm | Sensoriskt vänlig museum i lugn miljö vid Hötorget | ANDETAG Stockholm

**Description:** En NPF-vänlig och sensoriskt vänlig museum i Stockholm. ANDETAG – lugnt museum med låg stimulus, förutsägbart ljus och små grupper. Autismvänlig. Vid Hötorget.

---

### `/sv/stockholm/om-andetag/`

**Title:** Om ANDETAG | Ett konstprojekt format av ett gemensamt andetag | ANDETAG Stockholm

**Description:** ANDETAG är ett pågående konstprojekt av Malin och Gustaf Tadaa, byggt kring ett gemensamt mänskligt andetag och uttryckt genom ljus, textil, ljud och rum.

---

### `/sv/stockholm/om-konstnarerna-malin-gustaf-tadaa/`

**Title:** Malin & Gustaf Tadaa | Konstnärspar som arbetar med ljus, textil och teknologi | ANDETAG Stockholm

**Description:** Malin och Gustaf Tadaa är ett konstnärspar baserat i Stockholm som arbetar med ljus, textil och teknologi i deltagarbaserade och rumsliga konstverk. De står bakom Andetag och flera uppmärksammade utställningar.

---

### `/sv/stockholm/oppettider/`

**Title:** Öppettider ANDETAG Stockholm | ANDETAG Stockholm

**Description:** Se aktuella öppettider för ANDETAG i Stockholm. En stillsam konstupplevelse med fasta starttider och begränsat antal platser.

---

### `/sv/stockholm/optisk-fibertextil/`

**Title:** Textilen bakom konsten | ANDETAG Stockholm

**Description:** Om vävningen, materialen och hantverket bakom ANDETAG. En fördjupning i den optiska fibertextil som bär ljuset och andetaget.

---

### `/sv/stockholm/presentkort/`

**Title:** Ge bort ANDETAG i Stockholm | Presentkort & biljetter till konstupplevelse | ANDETAG Stockholm

**Description:** En gåva som inte ska behållas, utan upplevas. ANDETAG kan ges som presentkort eller biljett. En stund att andas i, mitt i Stockholm.

---

### `/sv/stockholm/privacy/`

**Title:** Integritetspolicy | ANDETAG Stockholm

**Description:** This Privacy Policy, hereinafter referred to as the ”Policy,” pertains to the processing, collection, utilization, retention, and dissemination of personal data by Tadaa Art AB (”we,” ”us,” or ”our”) in the course of operations conducted through our website, ticketing systems, and associated digital or physical platforms. This Policy is instituted in accordance with the General […]

---

### `/sv/stockholm/sasongskort/`

**Title:** Säsongskort ANDETAG Stockholm | Fri tillgång till upplevelsen | ANDETAG Stockholm

**Description:** Säsongskort till ANDETAG i Stockholm. Fri tillgång till den stillsamma konstupplevelsen under en längre period. En plats att återvända till, i din egen takt.

---

### `/sv/stockholm/tillganglighet/`

**Title:** Tillgänglighet på ANDETAG Stockholm | ANDETAG Stockholm

**Description:** Information om tillgänglighet på ANDETAG i Stockholm. Rullstolsanpassad utställning, hiss från tunnelbana och gatuplan, ledsagare fri entré. Grupper välkomna.

---

### `/sv/stockholm/utstallning-stockholm/`

**Title:** ANDETAG | En stillsam konstutställning i Stockholm

**Description:** En stillsam konstutställning i Stockholm. ANDETAG vid Hötorget – ljus- och textilkonst som andas. Öppna utställningar i centrala Stockholm.

---

### `/sv/stockholm/vilken-typ-av-upplevelse/`

**Title:** Vilken typ av upplevelse är ANDETAG? En stillsam konstupplevelse i ljus | ANDETAG Stockholm

**Description:** ANDETAG är en stillsam, ljusbaserad konstupplevelse byggd kring närvaro, andning och långsamhet. En ärlig beskrivning av vad du möter innan ditt besök.

---

## 404 page (`[404.astro](../site/src/pages/404.astro)`)

Swedish shell; `robots` is `noindex,follow` (not editable in this table without a code change).

### `/404/` (not a real URL; file is served as 404)

**Title:** Sidan hittades inte | ANDETAG

**Description:** Vi hittade inte sidan du sökte. Välj en av länkarna nedan eller gå till startsidan.