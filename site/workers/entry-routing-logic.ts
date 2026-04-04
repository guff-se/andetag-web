/**
 * Pure helpers for `/` and `/en/` entry routing (`docs/url-migration-policy.md`).
 * Covered by Vitest; Worker delegates to these for decisions.
 */

export const ENTRY_COOKIE = "andetag_entry";
export const ENTRY_COOKIE_MAX_AGE = 15_552_000; // 180 days

const ENTRY_PREFIX = "v1:";

export type EntryToken = "sv" | "de" | "en-s" | "en-b";

export type RootRoutingDecision =
  | { type: "redirect"; locationPath: string; setCookie?: string }
  | { type: "unexpected" };

export type EnglishHubDecision =
  | { type: "redirect"; locationPath: string }
  | { type: "serve_asset" };

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
      return decodeURIComponent(rest.join("=").trim());
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
  cf: { botManagement?: { verifiedBot?: boolean } } | undefined,
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

/** `locationPath` is path + search (e.g. `/sv/stockholm/?x=1`). */
export function decideRootRouting(input: {
  pathname: string;
  search: string;
  acceptLanguage: string | null;
  cookieHeader: string | null;
  userAgent: string | null;
  cf: { botManagement?: { verifiedBot?: boolean } } | undefined;
}): RootRoutingDecision {
  const q = input.search;
  const suffix = (path: string) => path + q;

  if (input.pathname !== "/" && input.pathname !== "") {
    return { type: "unexpected" };
  }

  if (isEntryVerifiedBot(input.userAgent, input.cf)) {
    return { type: "redirect", locationPath: suffix("/en/stockholm/") };
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

  const primaries = parseAcceptLanguagePrimaryTags(input.acceptLanguage);
  if (primaries.length === 0) {
    return { type: "redirect", locationPath: suffix("/en/") };
  }

  for (const p of primaries) {
    if (p === "sv") {
      return {
        type: "redirect",
        locationPath: suffix("/sv/stockholm/"),
        setCookie: entrySetCookieHeader("sv"),
      };
    }
    if (p === "de") {
      return {
        type: "redirect",
        locationPath: suffix("/de/berlin/"),
        setCookie: entrySetCookieHeader("de"),
      };
    }
  }

  return { type: "redirect", locationPath: suffix("/en/") };
}

export function decideEnglishHubRouting(input: {
  pathname: string;
  search: string;
  cookieHeader: string | null;
  userAgent: string | null;
  cf: { botManagement?: { verifiedBot?: boolean } } | undefined;
}): EnglishHubDecision {
  const q = input.search;
  const suffix = (path: string) => path + q;

  if (input.pathname !== "/en" && input.pathname !== "/en/") {
    return { type: "serve_asset" };
  }

  if (isEntryVerifiedBot(input.userAgent, input.cf)) {
    return { type: "redirect", locationPath: suffix("/en/stockholm/") };
  }

  const token = parseEntryToken(parseEntryCookieValue(input.cookieHeader));
  if (token === "en-s" || token === "sv") {
    return { type: "redirect", locationPath: suffix("/en/stockholm/") };
  }
  if (token === "en-b" || token === "de") {
    return { type: "redirect", locationPath: suffix("/en/berlin/") };
  }

  return { type: "serve_asset" };
}

/** Refresh or set `andetag_entry` when the visitor receives a document under a language lane (`docs/url-migration-policy.md` **When to set or refresh**). */
export function entryTokenForContentPath(pathname: string): EntryToken | null {
  if (pathname.startsWith("/sv/")) return "sv";
  if (pathname.startsWith("/de/berlin")) return "de";
  if (pathname.startsWith("/en/stockholm")) return "en-s";
  if (pathname.startsWith("/en/berlin")) return "en-b";
  return null;
}
