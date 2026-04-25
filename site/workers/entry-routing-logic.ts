/**
 * Pure helpers for `/` and `/en/` entry routing (`docs/url-migration-policy.md`).
 * Covered by Vitest; Worker delegates to these for decisions.
 */

export const ENTRY_COOKIE = "andetag_entry";
export const ENTRY_COOKIE_MAX_AGE = 15_552_000; // 180 days

const ENTRY_PREFIX = "v1:";

export type EntryToken = "sv" | "de" | "en-s" | "en-b";

export type RootRoutingDecision =
  | { type: "redirect"; locationPath: string; setCookie?: string; permanent?: boolean }
  | { type: "unexpected" };

export type EnglishHubDecision =
  | { type: "redirect"; locationPath: string; setCookie?: string; permanent?: boolean }
  | { type: "serve_asset" };

/** Cloudflare `request.cf` fields used for entry routing (see Workers `IncomingRequestCfProperties`). */
export type EntryRequestCf =
  | {
      country?: string | null;
      botManagement?: { verifiedBot?: boolean };
    }
  | undefined;

/** ISO 3166-1 alpha-2 from Cloudflare `cf.country`, uppercased, or `null` if missing or non-standard. */
export function parseEntryCfCountry(cf: EntryRequestCf): string | null {
  const raw = cf?.country;
  if (typeof raw !== "string" || raw.length !== 2) return null;
  const c = raw.toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return null;
  return c;
}

/** Primary language subtags sorted by descending q (0..1). */
export function parseAcceptLanguagePrimaryTags(header: string | null): string[] {
  if (header == null) return [];
  const trimmed = header.trim();
  if (!trimmed) return [];

  const ranges: { tag: string; q: number }[] = [];
  for (const part of trimmed.split(",")) {
    const piece = part.trim();
    if (!piece) continue;
    const [langPart, ...params] = piece.split(";").map((s) => s.trim());
    if (!langPart || langPart === "*") continue;
    const primary = langPart.split("-")[0]?.toLowerCase();
    if (!primary) continue;
    let q = 1;
    for (const p of params) {
      const m = /^q\s*=\s*([\d.]+)/i.exec(p);
      if (m) {
        const n = Number(m[1]);
        if (!Number.isNaN(n)) q = Math.min(1, Math.max(0, n));
      }
    }
    ranges.push({ tag: primary, q });
  }

  ranges.sort((a, b) => b.q - a.q);
  return ranges.map((r) => r.tag);
}

export function parseEntryCookieValue(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ENTRY_COOKIE && rest.length) {
      try {
        return decodeURIComponent(rest.join("=").trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function parseEntryToken(raw: string | null): EntryToken | null {
  if (!raw || !raw.startsWith(ENTRY_PREFIX)) return null;
  const token = raw.slice(ENTRY_PREFIX.length);
  if (token === "sv" || token === "de" || token === "en-s" || token === "en-b") {
    return token;
  }
  return null;
}

/**
 * Verified-bot style traffic: Cloudflare Bot Management when present, else
 * conservative User-Agent allowlist (search + common social preview crawlers).
 */
export function isEntryVerifiedBot(
  userAgent: string | null,
  cf: EntryRequestCf,
): boolean {
  if (cf?.botManagement?.verifiedBot === true) return true;
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return (
    ua.includes("googlebot") ||
    ua.includes("bingbot") ||
    ua.includes("duckduckbot") ||
    ua.includes("yandexbot") ||
    ua.includes("applebot") ||
    ua.includes("baiduspider") ||
    ua.includes("facebookexternalhit") ||
    ua.includes("twitterbot") ||
    ua.includes("linkedinbot") ||
    ua.includes("slackbot")
  );
}

export function entrySetCookieHeader(token: EntryToken): string {
  return `${ENTRY_COOKIE}=${ENTRY_PREFIX}${token}; Path=/; Max-Age=${ENTRY_COOKIE_MAX_AGE}; Secure; HttpOnly; SameSite=Lax`;
}

/**
 * Swedish or German **browser lane** from `Accept-Language`: only the **highest-q**
 * primary counts (first after q-sort). If that primary is not `sv` or `de`, return
 * `null` so geo or the English hub can apply, even when `sv`/`de` appears lower in the list.
 */
export function preferredLanguageLane(acceptLanguage: string | null): "sv" | "de" | null {
  const primaries = parseAcceptLanguagePrimaryTags(acceptLanguage);
  const top = primaries[0];
  if (top === "sv") return "sv";
  if (top === "de") return "de";
  return null;
}

/** `locationPath` is path + search (e.g. `/sv/stockholm/?x=1`). */
export function decideRootRouting(input: {
  pathname: string;
  search: string;
  acceptLanguage: string | null;
  cookieHeader: string | null;
  userAgent: string | null;
  cf: EntryRequestCf;
}): RootRoutingDecision {
  const q = input.search;
  const suffix = (path: string) => path + q;

  if (input.pathname !== "/" && input.pathname !== "") {
    return { type: "unexpected" };
  }

  if (isEntryVerifiedBot(input.userAgent, input.cf)) {
    return { type: "redirect", locationPath: suffix("/en/stockholm/"), permanent: true };
  }

  const token = parseEntryToken(parseEntryCookieValue(input.cookieHeader));
  if (token) {
    switch (token) {
      case "sv":
        return { type: "redirect", locationPath: suffix("/sv/stockholm/") };
      case "de":
        return { type: "redirect", locationPath: suffix("/de/berlin/") };
      case "en-s":
        return { type: "redirect", locationPath: suffix("/en/stockholm/") };
      case "en-b":
        return { type: "redirect", locationPath: suffix("/en/berlin/") };
      default: {
        const _never: never = token;
        return _never;
      }
    }
  }

  const lane = preferredLanguageLane(input.acceptLanguage);
  if (lane === "sv") {
    return {
      type: "redirect",
      locationPath: suffix("/sv/stockholm/"),
      setCookie: entrySetCookieHeader("sv"),
    };
  }
  if (lane === "de") {
    return {
      type: "redirect",
      locationPath: suffix("/de/berlin/"),
      setCookie: entrySetCookieHeader("de"),
    };
  }

  const country = parseEntryCfCountry(input.cf);
  if (country === "SE") {
    return {
      type: "redirect",
      locationPath: suffix("/en/stockholm/"),
      setCookie: entrySetCookieHeader("en-s"),
    };
  }
  if (country === "DE") {
    return {
      type: "redirect",
      locationPath: suffix("/en/berlin/"),
      setCookie: entrySetCookieHeader("en-b"),
    };
  }

  return { type: "redirect", locationPath: suffix("/en/") };
}

export function decideEnglishHubRouting(input: {
  pathname: string;
  search: string;
  acceptLanguage: string | null;
  cookieHeader: string | null;
  userAgent: string | null;
  cf: EntryRequestCf;
}): EnglishHubDecision {
  const q = input.search;
  const suffix = (path: string) => path + q;

  if (input.pathname !== "/en" && input.pathname !== "/en/") {
    return { type: "serve_asset" };
  }

  if (isEntryVerifiedBot(input.userAgent, input.cf)) {
    return { type: "serve_asset" };
  }

  const token = parseEntryToken(parseEntryCookieValue(input.cookieHeader));
  if (token === "en-s" || token === "sv") {
    return { type: "redirect", locationPath: suffix("/en/stockholm/") };
  }
  if (token === "en-b" || token === "de") {
    return { type: "redirect", locationPath: suffix("/en/berlin/") };
  }

  const lane = preferredLanguageLane(input.acceptLanguage);
  if (lane === "sv") {
    return {
      type: "redirect",
      locationPath: suffix("/sv/stockholm/"),
      setCookie: entrySetCookieHeader("sv"),
    };
  }
  if (lane === "de") {
    return {
      type: "redirect",
      locationPath: suffix("/de/berlin/"),
      setCookie: entrySetCookieHeader("de"),
    };
  }

  const country = parseEntryCfCountry(input.cf);
  if (country === "SE") {
    return {
      type: "redirect",
      locationPath: suffix("/en/stockholm/"),
      setCookie: entrySetCookieHeader("en-s"),
    };
  }
  if (country === "DE") {
    return {
      type: "redirect",
      locationPath: suffix("/en/berlin/"),
      setCookie: entrySetCookieHeader("en-b"),
    };
  }

  return { type: "serve_asset" };
}

/** Refresh or set `andetag_entry` when the visitor receives a document under a language lane (`docs/url-migration-policy.md` **When to set or refresh**). */
export function entryTokenForContentPath(pathname: string): EntryToken | null {
  if (pathname.startsWith("/sv/")) return "sv";
  if (pathname.startsWith("/de/berlin/")) return "de";
  if (pathname.startsWith("/en/stockholm/")) return "en-s";
  if (pathname.startsWith("/en/berlin/")) return "en-b";
  return null;
}
