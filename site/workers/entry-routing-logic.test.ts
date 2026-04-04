import { describe, expect, it } from "vitest";
import {
  decideEnglishHubRouting,
  decideRootRouting,
  entryTokenForContentPath,
  parseAcceptLanguagePrimaryTags,
  parseEntryCookieValue,
  parseEntryToken,
} from "./entry-routing-logic";

describe("parseAcceptLanguagePrimaryTags", () => {
  it("returns empty for missing or empty header", () => {
    expect(parseAcceptLanguagePrimaryTags(null)).toEqual([]);
    expect(parseAcceptLanguagePrimaryTags("")).toEqual([]);
    expect(parseAcceptLanguagePrimaryTags("   ")).toEqual([]);
  });

  it("sorts by q and keeps primary subtag only", () => {
    expect(parseAcceptLanguagePrimaryTags("en;q=0.8, sv;q=0.9, de")).toEqual(["de", "sv", "en"]);
  });
});

describe("parseEntryCookieValue / parseEntryToken", () => {
  it("reads andetag_entry", () => {
    expect(parseEntryCookieValue("foo=1; andetag_entry=v1%3Asv; bar=2")).toBe("v1:sv");
    expect(parseEntryToken("v1:en-b")).toBe("en-b");
    expect(parseEntryToken("v2:sv")).toBeNull();
  });
});

describe("decideRootRouting", () => {
  const base = {
    pathname: "/",
    search: "",
    cookieHeader: null as string | null,
    userAgent: "Mozilla/5.0",
    cf: undefined,
  };

  it("sends verified bots to English Stockholm", () => {
    const d = decideRootRouting({
      ...base,
      userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      acceptLanguage: "sv",
    });
    expect(d).toEqual({ type: "redirect", locationPath: "/en/stockholm/" });
  });

  it("uses cf.botManagement.verifiedBot when true", () => {
    const d = decideRootRouting({
      ...base,
      userAgent: "Mozilla/5.0",
      acceptLanguage: "sv",
      cf: { botManagement: { verifiedBot: true } },
    });
    expect(d).toEqual({ type: "redirect", locationPath: "/en/stockholm/" });
  });

  it("with no cookie and no Accept-Language, sends humans to English hub", () => {
    const d = decideRootRouting({ ...base, acceptLanguage: null });
    expect(d).toEqual({ type: "redirect", locationPath: "/en/" });
  });

  it("maps cookie tokens", () => {
    expect(
      decideRootRouting({
        ...base,
        cookieHeader: "andetag_entry=v1%3Ade",
        acceptLanguage: "en",
      }),
    ).toEqual({ type: "redirect", locationPath: "/de/berlin/" });
  });

  it("sets cookie when Swedish is first acceptable language", () => {
    const d = decideRootRouting({
      ...base,
      acceptLanguage: "sv-SE,en;q=0.8",
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/sv/stockholm/");
      expect(d.setCookie).toContain("andetag_entry=v1:sv");
    }
  });

  it("preserves query string", () => {
    const d = decideRootRouting({
      ...base,
      pathname: "/",
      search: "?utm=x",
      acceptLanguage: null,
    });
    expect(d).toEqual({ type: "redirect", locationPath: "/en/?utm=x" });
  });
});

describe("entryTokenForContentPath", () => {
  it("maps lane prefixes", () => {
    expect(entryTokenForContentPath("/sv/stockholm/")).toBe("sv");
    expect(entryTokenForContentPath("/de/berlin/")).toBe("de");
    expect(entryTokenForContentPath("/en/stockholm/tickets/")).toBe("en-s");
    expect(entryTokenForContentPath("/en/berlin/")).toBe("en-b");
    expect(entryTokenForContentPath("/en/")).toBeNull();
    expect(entryTokenForContentPath("/fonts/foo.woff2")).toBeNull();
  });
});

describe("decideEnglishHubRouting", () => {
  const base = {
    pathname: "/en/" as const,
    search: "",
    cookieHeader: null as string | null,
    userAgent: "Mozilla/5.0",
    cf: undefined,
  };

  it("sends bots to English Stockholm", () => {
    expect(
      decideEnglishHubRouting({
        ...base,
        userAgent: "Googlebot",
      }),
    ).toEqual({ type: "redirect", locationPath: "/en/stockholm/" });
  });

  it("redirects en-s cookie to Stockholm", () => {
    expect(
      decideEnglishHubRouting({
        ...base,
        cookieHeader: "andetag_entry=v1%3Aen-s",
      }),
    ).toEqual({ type: "redirect", locationPath: "/en/stockholm/" });
  });

  it("serves asset for humans without routing cookie", () => {
    expect(decideEnglishHubRouting(base)).toEqual({ type: "serve_asset" });
  });
});
