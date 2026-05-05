/**
 * Collectors-facing FAQ for the artworks collection page (`/en/artworks/`
 * and `/sv/konstverk/`).
 *
 * Distinct from `stockholm-faq.ts`, which serves the visitor FAQ pages
 * (`/en/stockholm/faq/`, `/sv/stockholm/fragor-svar/`) and feeds `FAQPage`
 * JSON-LD. The artworks page is a `CollectionPage`; this accordion is UI for
 * acquisition / ownership questions only and is not emitted as schema.
 *
 * Source notes
 * - Hardware specs and durability copy: collectors guide PDF (Andetag,
 *   Documentation), §Service / §Care instructions / §Tech specifications.
 * - App copy mirrors the App section on the same page.
 * - Shipping policy and "app is included" confirmed by Gustaf, 2026-05-04.
 *
 * Tone of Voice (`docs/Tone of Voice.md`): no em dash (U+2014) or en dash
 * (U+2013) in answer prose; commas, colons, and periods only. UK English
 * (`fibre`); Oxford `-ize` for `synchronize` to match the existing page lead.
 */
import type { FaqItem } from "./stockholm-faq";

export const ARTWORKS_FAQ_EN: readonly FaqItem[] = [
  {
    title: "How does an Andetag artwork work?",
    bodyHtml:
      "<p>Each Andetag is a hand-woven optical fibre textile lit from within by addressable LEDs. The light follows a generative animation built from a recording of Malin Tadaa's own breath, slowly evolving in shape, intensity, and colour. Colour shifts are timed to conjunctions of the five visible planets, so the work changes character with one to five months between shifts. Connected to Wi-Fi, every Andetag breathes in time with every other one in the series.</p>",
  },
  {
    title: "Is the music app included?",
    bodyHtml:
      "<p>Yes. The Andetag app plays the music from the Stockholm exhibition, synchronized with your artwork. It is free to download for iPhone and Android. Music and breath sound can be adjusted or muted independently.</p>",
  },
  {
    title: "What is the warranty?",
    bodyHtml:
      "<p>One year on the electronics. Care is straightforward: avoid direct sunlight, and remove dust with a soft dry cloth or a can of compressed air.</p>",
  },
  {
    title: "How long will it last? Can it be serviced?",
    bodyHtml:
      "<p>Built from industry-standard, replaceable components rated for around ten years of continuous use. Servicing can be done by any digital art technician or LED specialist familiar with Arduino and addressable LED pixels. Spare parts are held in storage by the artist, and the same components are readily available from OEM suppliers worldwide.</p>",
  },
  {
    title: "How is it shipped?",
    bodyHtml:
      "<p>We ship worldwide. Shipping is quoted per piece and is not included in the artwork price. Each piece travels in a reusable flight case, ready for re-shipping or storage.</p>",
  },
  {
    title: "Does it need Wi-Fi?",
    bodyHtml:
      "<p>No. The artwork runs fully on its own without an internet connection. With Wi-Fi, it joins the global rhythm of every other Andetag in the world. Diptychs synchronize over Bluetooth in addition, so the two panels always breathe as one.</p>",
  },
  {
    title: "What does installation require?",
    bodyHtml:
      "<p>A standard 110 to 240V power outlet (a 5V USB charger is included) and two screws in the wall (not supplied). Each artwork hangs from two key holes on the back; a short Wi-Fi setup over your phone connects it to the global breath.</p>",
  },
];

export const ARTWORKS_FAQ_SV: readonly FaqItem[] = [
  {
    title: "Hur fungerar ett Andetag-konstverk?",
    bodyHtml:
      "<p>Varje Andetag är en handvävd optisk fibertextil som lyser inifrån med adresserbara LED-pixlar. Ljuset följer en generativ animation byggd kring en inspelning av Malin Tadaas egen andning, och förändras långsamt i form, intensitet och färg. Färgskiften styrs av konjunktioner mellan de fem synliga planeterna, så verket byter karaktär med en till fem månaders mellanrum. När det är uppkopplat andas varje Andetag i takt med alla andra i serien.</p>",
  },
  {
    title: "Är musikappen inkluderad?",
    bodyHtml:
      "<p>Ja. Andetag-appen spelar musiken från Stockholm-utställningen, synkroniserad med ditt verk. Den är gratis att ladda ner för iPhone och Android. Musik och andningsljud kan justeras eller stängas av var för sig.</p>",
  },
  {
    title: "Vilken garanti ingår?",
    bodyHtml:
      "<p>Ett års garanti på elektroniken. Skötseln är enkel: undvik direkt solljus och ta bort damm med en mjuk torr trasa eller en tryckluftsspray.</p>",
  },
  {
    title: "Hur länge håller verket? Kan det servas?",
    bodyHtml:
      "<p>Byggt med utbytbara standardkomponenter beräknade för ungefär tio års kontinuerlig drift. Service kan utföras av valfri digital konsttekniker eller LED-specialist som är van vid Arduino och adresserbara LED-pixlar. Reservdelar förvaras hos konstnären, och samma komponenter finns lätt tillgängliga från OEM-leverantörer världen över.</p>",
  },
  {
    title: "Hur fungerar frakten?",
    bodyHtml:
      "<p>Vi skickar världen över. Frakt offereras per verk och ingår inte i konstverkets pris. Varje verk levereras i en återanvändbar flightcase, redo för fortsatt transport eller förvaring.</p>",
  },
  {
    title: "Behöver verket wifi?",
    bodyHtml:
      "<p>Nej. Verket fungerar helt på egen hand utan internetuppkoppling. Med wifi ansluter det till den globala rytm som alla andra Andetag delar. Diptyker synkroniseras dessutom med varandra via Bluetooth, så de två panelerna alltid andas som en.</p>",
  },
  {
    title: "Vad krävs för att installera verket hemma?",
    bodyHtml:
      "<p>Ett vanligt 110 till 240V-eluttag (en 5V USB-laddare ingår) och två skruvar i väggen (medföljer ej). Varje verk hängs på två nyckelhål på baksidan; en kort wifi-konfiguration via telefonen kopplar in verket i den globala andningen.</p>",
  },
];
