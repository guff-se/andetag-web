import { WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML } from "./stockholm-what-is-andetag-faq-copy";

/**
 * FAQ accordion bodies shared by Swedish SEO landing pages (legacy nested accordion,
 * same Q&A as `StockholmHomeSv.astro` home accordion).
 * First answer body: `WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML` (shared with FAQ page).
 */
export const stockholmMarketingFaqSv = [
  {
    title: "Vad är ANDETAG?",
    titleHtml: 'Vad är <span class="brand-wordmark">ANDETAG</span>?',
    bodyHtml: WHAT_IS_ANDETAG_FAQ_SV_BODY_HTML,
  },
  {
    title: "Passar ANDETAG för barn?",
    titleHtml: 'Passar <span class="brand-wordmark">ANDETAG</span> för barn?',
    bodyHtml:
      "<p>Ja, vi har haft många barn på besök och upplever att alla åldrar kan hitta ett lugnare tempo hos <span class=\"brand-wordmark\">ANDETAG</span>.</p><p>Det finns ingen plats för barnvagn inne hos oss, men en sådan kan låsas fast vid cykelställen på Sveavägen.</p>",
  },
  {
    title: "Kan jag boka biljetter på plats?",
    body: "Ja, du kan köpa biljett i dörren, i mån av plats.",
  },
  {
    title: "Kan jag avboka eller omboka min biljett?",
    bodyHtml:
      "<p>Du kan boka om ditt besök ända fram tills din bokning börjar.</p><p>Länk till avbokning finns i ditt bekräftelsemail.</p>",
  },
  {
    title: "Vad händer om jag missar min bokade tid?",
    body: "Är du mindre än 30 minuter sen är du hjärtligt välkommen. Utöver det så kan vi släppa in dig i mån av plats.",
  },
  {
    title: "Är upplevelsen tillgänglighetsanpassad?",
    bodyHtml:
      "<p>Hiss finns både till gatuplan och tunnelbana. Utställningen är rullstolsanpassad, men vi har tyvärr ingen fullgod rullstolstoalett.</p><p>Delar av utställningen är mörk, men relativt enkel att navigera. Ledarhundar är välkomna.</p><p>En ljudslinga existerar ej, men musiken finns tillgänglig på internet, om du vill spela på din egen enhet.</p><p>Ledsagare eller assistent har fri entré.</p>",
  },
] as const;
