/**
 * Single source of truth for Stockholm corporate-event pricing and FAQ.
 * Used by: ForetagseventSv/En (page bodies), schema-org.ts (FAQPage JSON-LD,
 * Offer node).
 *
 * Update prices here when they change; run `npm test` and `npm run build`
 * to propagate.
 */
import type { FaqItem } from "./stockholm-faq";

export const STOCKHOLM_CORPORATE_PRICING = {
  /** Maximum guests in a single exclusive booking. */
  exclusiveCapacity: 60,
  /** Per-person rate during regular opening hours (SEK). Matches regular ticket. */
  groupPerPersonSek: 240,
  /**
   * Starting hourly rate when the museum is reserved exclusively for one
   * group (SEK). Final price depends on time of day and day of week — copy
   * everywhere this number renders should say "from {price}", not a flat rate.
   */
  exclusiveHourlySek: 5000,
} as const;

export const STOCKHOLM_CORPORATE_FAQ_SV: readonly FaqItem[] = [
  {
    title: "Hur många personer rymmer ett företagsevent på ANDETAG?",
    bodyHtml:
      "<p>En exklusiv bokning rymmer upp till 60 personer. Under ordinarie öppettider tar vi emot mindre grupper med övriga besökare närvarande i lokalen.</p>",
  },
  {
    title: "Vad kostar ett företagsevent på ANDETAG?",
    bodyHtml:
      "<p>Under öppettider: 240 kr per person. Exklusiv bokning: från 5 000 kr per timme för hela museet, oavsett gruppstorlek upp till 60 personer. Slutpriset beror på tid på dygnet och veckodag.</p>",
  },
  {
    title: "Hur lång tid tar ett besök?",
    bodyHtml:
      "<p>Från en timme och uppåt. Vi anpassar längden efter er &mdash; från en kort paus mitt i en konferens till ett event på tre eller fyra timmar med välkomst, mat och samtal omkring upplevelsen.</p>",
  },
  {
    title: "Hur långt i förväg behöver vi boka?",
    bodyHtml:
      "<p>Det beror på tillgänglighet. Hör av er så tidigt ni kan, så hittar vi en tid som fungerar.</p>",
  },
  {
    title: "Kan ni servera mat och dryck?",
    bodyHtml:
      "<p>Ja. Hör av er om mat och dryck så löser vi det.</p>",
  },
  {
    title: "Passar ANDETAG för en kickoff eller konferensaktivitet?",
    bodyHtml:
      "<p>Ja. ANDETAG fungerar som inledning, avslutning eller paus mitt i en arbetsdag, kickoff eller konferens. Det är en gemensam upplevelse utan tempo, inte ett traditionellt event.</p>",
  },
  {
    title: "Hur tar vi oss hit?",
    bodyHtml:
      "<p>ANDETAG ligger på Kungsgatan 39 i centrala Stockholm, tre minuter från Hötorgets tunnelbana. Se <a href=\"/sv/stockholm/hitta-hit/\">hitta hit</a> för adress och vägbeskrivning.</p>",
  },
];

export const STOCKHOLM_CORPORATE_FAQ_EN: readonly FaqItem[] = [
  {
    title: "How many people can attend a corporate event at ANDETAG?",
    bodyHtml:
      "<p>An exclusive booking holds up to 60 people. During regular opening hours we welcome smaller groups, with other visitors present in the space.</p>",
  },
  {
    title: "What does a corporate event at ANDETAG cost?",
    bodyHtml:
      "<p>During opening hours: 240 SEK per person. Exclusive booking: from 5,000 SEK per hour for the entire museum, for groups of up to 60 people. The final rate depends on time of day and day of week.</p>",
  },
  {
    title: "How long does a visit take?",
    bodyHtml:
      "<p>From one hour and up. We tailor the length to you &mdash; from a short pause inside a conference to a three- or four-hour event with welcome, food and conversation around the experience.</p>",
  },
  {
    title: "How far in advance do we need to book?",
    bodyHtml:
      "<p>It depends on availability. Get in touch as early as you can, and we will find a time that works.</p>",
  },
  {
    title: "Can you serve food and drink?",
    bodyHtml:
      "<p>Yes. Get in touch about food and drink, and we will arrange it.</p>",
  },
  {
    title: "Does ANDETAG work for a kickoff or conference activity?",
    bodyHtml:
      "<p>Yes. ANDETAG works as an opening, a closing, or a pause in the middle of a working day, kickoff or conference. It is a shared experience without pace, not a traditional event.</p>",
  },
  {
    title: "How do we get there?",
    bodyHtml:
      "<p>ANDETAG is at Kungsgatan 39 in central Stockholm, three minutes from Hötorget metro. See <a href=\"/en/stockholm/how-to-find-us/\">how to find us</a> for the address and directions.</p>",
  },
];
