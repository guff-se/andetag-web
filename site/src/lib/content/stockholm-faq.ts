/**
 * Single source of truth for Stockholm FAQ Q&A content.
 * Used by: FragorSvarEn.astro + FragorSvarSv.astro (page bodies), schema-org.ts (FAQPage JSON-LD).
 *
 * Column split preserves the existing two-accordion layout on /faq/ and /fragor-svar/.
 * The combined arrays (`STOCKHOLM_FAQ_EN`, `STOCKHOLM_FAQ_SV`) feed FAQPage.mainEntity.
 */
import {
  WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML,
  WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML,
} from "../page-registry/stockholm-what-is-andetag-faq-copy";

export type FaqItem = {
  /** Plain-text question - used verbatim as `Question.name` in JSON-LD. */
  title: string;
  /** Optional HTML title for the accordion (e.g. wraps ANDETAG in a brand span). */
  titleHtml?: string;
  /** HTML answer body. Google allows HTML in `Answer.text`. */
  bodyHtml: string;
};

export const STOCKHOLM_FAQ_EN_LEFT: readonly FaqItem[] = [
  {
    title: "What is ANDETAG?",
    titleHtml: 'What is <span class="brand-wordmark">ANDETAG</span>?',
    bodyHtml: `${WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML}<p><a href="/en/stockholm/what-kind-of-experience/">Read more about the experience.</a></p>`,
  },
  {
    title: "How long does the experience take?",
    bodyHtml:
      "<p>You move at your own pace. Many visitors stay around 50 minutes, some shorter, some for several hours.</p><p>The music for the exhibition is about <strong>1 hour and 15 minutes</strong> long and plays in a loop. The light animations, however, never repeat.</p>",
  },
  {
    title: "Do I need to book in advance?",
    bodyHtml:
      "<p>We recommend <a href=\"/en/stockholm/tickets/\">booking ahead</a> to get a time that suits you. Walk-in tickets are sometimes available if there is space.</p>",
  },
  {
    title: "Can I buy tickets on site?",
    bodyHtml:
      "<p>Yes, if there is availability for the current slot, you can purchase at the entrance.</p>",
  },
  {
    title: "What happens if I'm late?",
    bodyHtml:
      "<p>If you miss your scheduled start time, we&#8217;ll do our best to find a solution based on the flow of the day and space in the room. Don&#8217;t stress. We&#8217;ll work it out.</p>",
  },
  {
    title: "How early can I arrive?",
    bodyHtml:
      "<p>You are welcome to arrive a little before your time, as long as regular opening hours apply. Many people like to settle in for a moment first.</p>",
  },
  {
    title: "Is ANDETAG suitable for children?",
    titleHtml:
      'Is <span class="brand-wordmark">ANDETAG</span> suitable for children?',
    bodyHtml:
      "<p>Yes, many children have visited us. The experience is calm and some parts are dark, so younger children may prefer to stay close to an adult.</p><p>We ask that children, too, respect the quiet and stillness of the space.</p>",
  },
] as const;

export const STOCKHOLM_FAQ_EN_RIGHT: readonly FaqItem[] = [
  {
    title: "Can I bring a stroller?",
    bodyHtml:
      "<p>Not inside the venue. You can lock a stroller at the bike parking on Sveavägen.</p>",
  },
  {
    title: "Is the experience accessible?",
    bodyHtml:
      "<p>There are elevators from both the metro and street level. The exhibition is wheelchair accessible, but unfortunately we do not have a fully equipped wheelchair-accessible restroom.</p><p>Some parts of the exhibition are dark, but navigation is relatively straightforward. Guide dogs are welcome.</p><p>Caregivers or personal assistants are admitted free of charge.</p><p><a href=\"/en/stockholm/accessibility/\">Read more about accessibility</a>.</p>",
  },
  {
    title: "Is there a hearing loop?",
    bodyHtml:
      "<p>No, there is no hearing loop available. The music is available online if you would like to play it on your own device.</p><p><a href=\"/en/stockholm/accessibility/\">Read more about accessibility</a>.</p>",
  },
  {
    title: "Can we visit as a group?",
    bodyHtml:
      "<p>Yes. <span class=\"brand-wordmark\">ANDETAG</span> can be visited as a group, both as a <a href=\"/en/stockholm/group-bookings/\">private gathering</a> and as a corporate event.</p><p>For groups, school classes, day activity programs, or companies, we recommend booking in advance. This allows us to welcome you in a calm and considered way.</p><p>We offer a <a href=\"/en/stockholm/group-bookings/\">group discount </a>for group bookings.</p><p>For arrangements and bookings, please contact: <a href=\"mailto:info@andetag.museum\">info@andetag.museum</a></p>",
  },
  {
    title: "Do you offer a membership?",
    bodyHtml:
      "<p>Yes. The season pass gives unlimited access over time and has its own page with details. <a href=\"/en/stockholm/season-pass/\">Read more here.</a></p>",
  },
  {
    title: "Can I book for a company event or private group?",
    bodyHtml:
      "<p>Yes, there are options for <a href=\"/en/stockholm/corporate-events/\">corporate events</a> and private viewings. Separate pages include details and booking information. Contact <a href=\"mailto:info@andetag.museum\">info@andetag.museum</a> and we&#8217;ll help you out.</p>",
  },
  {
    title: "Can I take photos?",
    bodyHtml:
      "<p>Yes. We appreciate when visitors want to share their experience of <span class=\"brand-wordmark\">ANDETAG</span>.</p><p>You are welcome to take photos and short video clips, as long as it&#8217;s done with consideration for other visitors and the calm nature of the space.</p><p>If you plan to photograph or film with larger equipment, or for a specific project, please contact us in advance.</p>",
  },
] as const;

export const STOCKHOLM_FAQ_EN: readonly FaqItem[] = [
  ...STOCKHOLM_FAQ_EN_LEFT,
  ...STOCKHOLM_FAQ_EN_RIGHT,
] as const;

export const STOCKHOLM_FAQ_SV_LEFT: readonly FaqItem[] = [
  {
    title: "Vad är ANDETAG?",
    titleHtml: 'Vad är <span class="brand-wordmark">ANDETAG</span>?',
    bodyHtml: `${WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML}<p><a href="/sv/stockholm/vilken-typ-av-upplevelse/">Läs mer om upplevelsen.</a></p>`,
  },
  {
    title: "Hur lång tid tar upplevelsen?",
    bodyHtml:
      "<p>Du bestämmer tempot själv. Många stannar omkring 50 minuter, vissa kortare, vissa flera timmar. Musiken till utställningen är ca. 1 timme och 15 minuter, sedan börjar den om, men ljusanimationerna upprepar sig aldrig.</p>",
  },
  {
    title: "Måste jag boka i förväg?",
    bodyHtml:
      "<p>Vi rekommenderar att <a href=\"/sv/stockholm/biljetter/\">boka i förväg</a> för att få en tid som passar, men det går ofta att köpa på i entrén, i mån av plats.</p>",
  },
  {
    title: "Kan jag köpa biljetter på plats?",
    bodyHtml:
      "<p>Ja, om det finns plats kvar för den aktuella tiden kan du köpa i entrén.</p>",
  },
  {
    title: "Kan jag boka om eller avboka?",
    bodyHtml:
      "<p>Du kan avboka fram till din bokade tid. Återbetalning sker som presentkort som du kan använda för att boka en ny tid. Länk finns i ditt bekräftelsemejl.<br />Vid frågor kontakta <a href=\"mailto:info@andetag.museum\">info@andetag.museum</a> så löser vi det!</p>",
  },
  {
    title: "Hur tidigt kan jag komma?",
    bodyHtml:
      "<p>Du är välkommen att komma lite före din tid, så länge ordinarie öppettid råder. Det är ofta skönt att landa en stund innan.</p>",
  },
  {
    title: "Vad händer om jag blir sen?",
    bodyHtml:
      "<p>Oroa dig inte. Vi gör alltid vårt bästa för att alla skall få uppleva ANDETAG i sin egen takt.</p>",
  },
  {
    title: "Är ANDETAG lämpligt för barn?",
    titleHtml: 'Är <span class="brand-wordmark">ANDETAG</span> lämpligt för barn?',
    bodyHtml:
      "<p>Ja, många barn har besökt oss. Upplevelsen är stillsam och vissa delar är mörka, så yngre barn kan vilja sitta nära en vuxen.</p><p>Vi vill att även barn respekterar rummets lugn och tystnad.</p><p>Observera att vi inte har plats för barnvagnar inne i lokalen. Barnvagn kan låsas vid cykelparkeringen på Sveavägen.</p>",
  },
] as const;

export const STOCKHOLM_FAQ_SV_RIGHT: readonly FaqItem[] = [
  {
    title: "Kan jag ta med barnvagn?",
    bodyHtml:
      "<p>Tyvärr inte in i lokalen. Barnvagn kan låsas vid cykelparkeringen på Sveavägen.</p>",
  },
  {
    title: "Är upplevelsen tillgänglig?",
    bodyHtml:
      "<p>Det finns hiss från både tunnelbana och gatuplan. Utställningen är rullstolsanpassad, men vi har tyvärr inte en fullt utrustad rullstolsanpassad toalett.</p><p>Vissa delar är mörka, men navigeringen är relativt enkel. Ledhundar är välkomna.</p><p>Ledsagare eller personliga assistenter går in utan kostnad.</p><p><a href=\"/sv/stockholm/tillganglighet/\">Läs mer om tillgänglighet.</a></p>",
  },
  {
    title: "Finns det hörslinga?",
    bodyHtml:
      "<p>Nej, det finns ingen hörslinga i lokalen. Musiken finns online om du vill spela den via din egen enhet.</p><p><a href=\"/sv/stockholm/tillganglighet/\">Läs mer om tillgänglighet.</a></p>",
  },
  {
    title: "Kan jag komma i grupp?",
    bodyHtml:
      "<p>Ja. <span class=\"brand-wordmark\">ANDETAG</span> kan besökas i grupp, både som <a href=\"/sv/stockholm/gruppbokning/\">privat sällskap</a> och som företagsevent.</p><p>För grupper, skolklasser, daglig verksamhet eller företag rekommenderar vi att boka i förväg. Det gör att vi kan ta emot er på ett lugnt och samlat sätt.</p><p>Vi erbjuder <a href=\"/sv/stockholm/gruppbokning/\">grupprabatt</a> vid samlad bokning.</p><p>Kontakta oss för upplägg och bokning:<br /><a href=\"mailto:info@andetag.museum\"><strong>info@andetag.museum</strong></a></p>",
  },
  {
    title: "Finns det klippkort?",
    bodyHtml:
      "<p>Ja. Säsongskort ger fri tillgång under en längre period. <a href=\"/sv/stockholm/sasongskort/\">Läs mer här.</a></p>",
  },
  {
    title: "Kan jag boka för företag eller privat sällskap?",
    bodyHtml:
      "<p>Ja, det finns möjligheter för både <a href=\"/sv/stockholm/foretagsevent/\">företagsevent</a> och <a href=\"/sv/stockholm/gruppbokning/\">gruppbokningar</a> kontakta <a href=\"mailto:info@andetag.museum\">info@andetag.museum</a>, så hjälper vi dig.</p>",
  },
  {
    title: "Kan jag fotografera?",
    bodyHtml:
      "<p>Ja! Vi tycker om när besökare vill dela sin upplevelse av <span class=\"brand-wordmark\">ANDETAG</span>.</p><p>Det går bra att fotografera och ta korta videoklipp, så länge det sker med hänsyn till andra besökare och rummets stillsamhet.</p><p>Om du vill fotografera eller filma med större utrustning, eller för ett specifikt projekt, hör gärna av dig i förväg.</p>",
  },
] as const;

export const STOCKHOLM_FAQ_SV: readonly FaqItem[] = [
  ...STOCKHOLM_FAQ_SV_LEFT,
  ...STOCKHOLM_FAQ_SV_RIGHT,
] as const;
