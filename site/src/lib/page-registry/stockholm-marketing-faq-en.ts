import { WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML } from "./stockholm-what-is-andetag-faq-copy";

/**
 * FAQ accordion for English Stockholm home (`/en/stockholm/`) and SEO landings.
 * `titleHtml` uses `brand-wordmark` for ANDETAG.
 * First answer body: `WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML` (shared with FAQ page).
 */
export const stockholmMarketingFaqEn = [
  {
    title: "What is ANDETAG?",
    titleHtml: 'What is <span class="brand-wordmark">ANDETAG</span>?',
    bodyHtml: WHAT_IS_ANDETAG_FAQ_EN_BODY_HTML,
  },
  {
    title: "Is ANDETAG suitable for children?",
    titleHtml:
      'Is <span class="brand-wordmark">ANDETAG</span> suitable for children?',
    bodyHtml:
      "<p>Yes, we&#8217;ve had many kids visit us an belive that all ages can find a calmer rhythm at <span class=\"brand-wordmark\">ANDETAG.</span></p><p>Please note that there is no space for strollers inside the venue. You can lock your stroller at the bike parking on Sveavägen.</p>",
  },
  {
    title: "Can I buy tickets on-site?",
    body: "Yes, you can pay at the door as long as there is space available.",
  },
  {
    title: "Can I cancel or reschedule my ticket?",
    bodyHtml:
      "<p>You can cancel your visit up until your scheduled time. Refunds are issued as a gift card, which can be used to book a new time.</p><p>A cancellation link is included in your confirmation email.</p>",
  },
  {
    title: "What happens if I miss my scheduled time?",
    body: "If you are less than 30 minutes late, you are warmly welcome. After that, we may be able to accommodate you if space allows.",
  },
  {
    title: "Is the experience accessible?",
    bodyHtml:
      "<p>There are elevators to both street level and the subway. The exhibition is wheelchair accessible, but unfortunately, we do not have a fully equipped wheelchair-accessible restroom.</p><p>Some parts of the exhibition are dark, but navigation is relatively straightforward. Guide dogs are welcome.</p><p>There is no hearing loop available, but the music can be accessed online if you&#8217;d like to play it on your own device.</p><p>Caregivers or assistants are admitted free of charge.</p>",
  },
] as const;
