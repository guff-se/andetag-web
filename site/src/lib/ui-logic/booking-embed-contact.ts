/**
 * Contact line below the Understory widget inside `BookingEmbed` (not site footer).
 * Mail target: §Decisions in `skills/operational-facts/SKILL.md`.
 */
import type { Language } from "../chrome/types";

const CONTACT_HTML: Record<Language, string> = {
  sv: '<p>Kontakta <a href="mailto:info@andetag.museum">info@andetag.museum</a> om du har några frågor.</p>',
  en: '<p>Contact <a href="mailto:info@andetag.museum">info@andetag.museum</a> if you have any questions.</p>',
  de: '<p>Bei Fragen erreichen Sie uns unter <a href="mailto:info@andetag.museum">info@andetag.museum</a>.</p>',
};

export function getBookingEmbedContactHtml(language: Language): string {
  return CONTACT_HTML[language];
}
