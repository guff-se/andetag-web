import { describe, expect, it } from "vitest";
import {
  decideEnglishHubRouting,
  decideRootRouting,
  entryTokenForContentPath,
  parseAcceptLanguagePrimaryTags,
  parseEntryCfCountry,
  parseEntryCookieValue,
  parseEntryToken,
  preferredLanguageLane,
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

describe("parseEntryCfCountry", () => {
  it("returns uppercased ISO code or null", () => {
    expect(parseEntryCfCountry({ country: "se" })).toBe("SE");
    expect(parseEntryCfCountry({ country: "DE" })).toBe("DE");
    expect(parseEntryCfCountry(undefined)).toBeNull();
    expect(parseEntryCfCountry({ country: "" })).toBeNull();
    expect(parseEntryCfCountry({ country: "T1" })).toBeNull();
  });
});

describe("preferredLanguageLane", () => {
  it("returns sv or de only when that is the top-q primary", () => {
    expect(preferredLanguageLane("sv-SE,en;q=0.8")).toBe("sv");
    expect(preferredLanguageLane("de,en;q=0.8")).toBe("de");
    expect(preferredLanguageLane("en,sv;q=0.8")).toBeNull();
    expect(preferredLanguageLane("fr,en;q=0.8")).toBeNull();
    expect(preferredLanguageLane("sv;q=0.8,en")).toBeNull();
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

  it("sends verified bots to English Stockholm with a permanent redirect (SEO-0020)", () => {
    const d = decideRootRouting({
      ...base,
      userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      acceptLanguage: "sv",
    });
    expect(d).toEqual({
      type: "redirect",
      locationPath: "/en/stockholm/",
      permanent: true,
    });
  });

  it("uses cf.botManagement.verifiedBot when true (permanent redirect, SEO-0020)", () => {
    const d = decideRootRouting({
      ...base,
      userAgent: "Mozilla/5.0",
      acceptLanguage: "sv",
      cf: { botManagement: { verifiedBot: true } },
    });
    expect(d).toEqual({
      type: "redirect",
      locationPath: "/en/stockholm/",
      permanent: true,
    });
  });

  it("with no cookie and no Accept-Language, sends humans to English hub when geo unknown", () => {
    const d = decideRootRouting({ ...base, acceptLanguage: null });
    expect(d).toEqual({ type: "redirect", locationPath: "/en/" });
  });

  it("with no cookie, no Accept-Language, SE geo sends to English Stockholm with cookie", () => {
    const d = decideRootRouting({
      ...base,
      acceptLanguage: null,
      cf: { country: "SE" },
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/en/stockholm/");
      expect(d.setCookie).toContain("andetag_entry=v1:en-s");
    }
  });

  it("with no cookie, French browser, DE geo sends to English Berlin with cookie", () => {
    const d = decideRootRouting({
      ...base,
      acceptLanguage: "fr,en;q=0.8",
      cf: { country: "DE" },
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/en/berlin/");
      expect(d.setCookie).toContain("andetag_entry=v1:en-b");
    }
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
    acceptLanguage: "en-GB,en;q=0.9" as string | null,
    cookieHeader: null as string | null,
    userAgent: "Mozilla/5.0",
    cf: undefined as { country?: string; botManagement?: { verifiedBot?: boolean } } | undefined,
  };

  it("serves asset to verified bots so /en/ stays indexable (SEO-0020)", () => {
    expect(
      decideEnglishHubRouting({
        ...base,
        userAgent: "Googlebot",
      }),
    ).toEqual({ type: "serve_asset" });
  });

  it("redirects en-s cookie to Stockholm", () => {
    expect(
      decideEnglishHubRouting({
        ...base,
        cookieHeader: "andetag_entry=v1%3Aen-s",
      }),
    ).toEqual({ type: "redirect", locationPath: "/en/stockholm/" });
  });

  it("serves asset for humans without routing cookie when geo not SE or DE", () => {
    expect(decideEnglishHubRouting(base)).toEqual({ type: "serve_asset" });
  });

  it("redirects Swedish browser to Swedish Stockholm with cookie", () => {
    const d = decideEnglishHubRouting({
      ...base,
      acceptLanguage: "sv-SE,en;q=0.8",
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/sv/stockholm/");
      expect(d.setCookie).toContain("andetag_entry=v1:sv");
    }
  });

  it("redirects German browser to German Berlin with cookie", () => {
    const d = decideEnglishHubRouting({
      ...base,
      acceptLanguage: "de-DE,en;q=0.8",
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/de/berlin/");
      expect(d.setCookie).toContain("andetag_entry=v1:de");
    }
  });

  it("redirects English-only SE geo to English Stockholm with cookie", () => {
    const d = decideEnglishHubRouting({
      ...base,
      acceptLanguage: "en-US,en;q=0.9",
      cf: { country: "SE" },
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/en/stockholm/");
      expect(d.setCookie).toContain("andetag_entry=v1:en-s");
    }
  });

  it("redirects English-only DE geo to English Berlin with cookie", () => {
    const d = decideEnglishHubRouting({
      ...base,
      acceptLanguage: "en-GB",
      cf: { country: "DE" },
    });
    expect(d.type).toBe("redirect");
    if (d.type === "redirect") {
      expect(d.locationPath).toBe("/en/berlin/");
      expect(d.setCookie).toContain("andetag_entry=v1:en-b");
    }
  });
});
