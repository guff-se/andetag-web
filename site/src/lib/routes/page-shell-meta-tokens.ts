/**
 * Token interpolation for `page-shell-meta.json` titles and descriptions.
 *
 * Numbers in shell meta (ticket prices, corporate per-person and hourly rates,
 * exclusive-booking capacity) must come from the single sources in
 * `stockholm-offers.ts` and `stockholm-corporate.ts`. JSON descriptions hold
 * tokens like `{REGULAR_SEK}`; `getPageShellRoute()` resolves them at build
 * time so the meta description cannot drift from the offer graph.
 *
 * Locale-aware thousands separator: SV regular space (matches existing copy
 * "5 000 kr"), DE period, EN comma. Numbers under 1 000 pass through unchanged.
 */
import type { Language } from "../chrome/types";
import { STOCKHOLM_TICKETS } from "../content/stockholm-offers";
import { STOCKHOLM_CORPORATE_PRICING } from "../content/stockholm-corporate";

const REGULAR_TICKET = STOCKHOLM_TICKETS.find((t) => t.id === "regular");
if (!REGULAR_TICKET) {
  throw new Error(
    "page-shell-meta-tokens: STOCKHOLM_TICKETS missing 'regular' tier; cannot resolve {REGULAR_SEK}.",
  );
}
if (REGULAR_TICKET.daytimePrice === undefined) {
  throw new Error(
    "page-shell-meta-tokens: regular ticket has no daytimePrice; cannot resolve {REGULAR_DAYTIME_SEK}.",
  );
}

const REGULAR_PRICE_SEK = REGULAR_TICKET.price;
const REGULAR_DAYTIME_PRICE_SEK = REGULAR_TICKET.daytimePrice;

function thousandsSeparator(language: Language): string {
  if (language === "sv") return " ";
  if (language === "de") return ".";
  return ",";
}

function formatThousands(n: number, language: Language): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator(language));
}

type TokenSpec = { token: string; value: number };

const TOKENS: ReadonlyArray<TokenSpec> = [
  { token: "{REGULAR_SEK}", value: REGULAR_PRICE_SEK },
  { token: "{REGULAR_DAYTIME_SEK}", value: REGULAR_DAYTIME_PRICE_SEK },
  { token: "{CORPORATE_PER_PERSON_SEK}", value: STOCKHOLM_CORPORATE_PRICING.groupPerPersonSek },
  { token: "{CORPORATE_HOURLY_SEK}", value: STOCKHOLM_CORPORATE_PRICING.exclusiveHourlySek },
  { token: "{CORPORATE_CAPACITY}", value: STOCKHOLM_CORPORATE_PRICING.exclusiveCapacity },
];

export const META_TOKEN_NAMES: ReadonlyArray<string> = TOKENS.map((t) => t.token);

/**
 * Replace every `{TOKEN}` in `text` with the language-formatted source value.
 * Pass-through for strings without tokens (no allocations beyond the input).
 */
export function resolveMetaTokens(text: string, language: Language): string {
  if (!text.includes("{")) return text;
  return TOKENS.reduce(
    (acc, { token, value }) => acc.split(token).join(formatThousands(value, language)),
    text,
  );
}
