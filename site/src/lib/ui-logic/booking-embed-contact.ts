/**
 * Contact line below the Understory widget inside `BookingEmbed` (not site footer).
 * Mail target: EX-0010 in `docs/migration-exceptions.md`.
 */
const CONTACT_HTML: Record<"sv" | "en" | "de", string> = {
  sv: '<p>Kontakta <a href="mailto:info@andetag.museum">info@andetag.museum</a> om du har några frågor.</p>',
  en: '<p>Contact <a href="mailto:info@andetag.museum">info@andetag.museum</a> if you have any questions.</p>',
  de: '<p>Bei Fragen erreichen Sie uns unter <a href="mailto:info@andetag.museum">info@andetag.museum</a>.</p>',
};

export function getBookingEmbedContactHtml(language: "sv" | "en" | "de"): string {
  return CONTACT_HTML[language];
}
