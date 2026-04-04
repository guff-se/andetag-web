import { describe, expect, it } from "vitest";
import { buildSchemaJsonLd } from "./schema-org";

describe("buildSchemaJsonLd", () => {
  const base = {
    pageTitle: "T",
    pageDescription: "D",
    language: "en" as const,
    canonicalPath: "/en/stockholm/tickets/",
  };

  it("uses Museum for Stockholm destination", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/en/stockholm/tickets/",
      destination: "stockholm",
    });
    const types = doc["@graph"].map((n) => (n as { "@type"?: string | string[] })["@type"]);
    const flat = types.flatMap((t) => (Array.isArray(t) ? t : t ? [t] : []));
    expect(flat).toContain("Museum");
    expect(flat).not.toContain("Place");
  });

  it("uses Place (not Museum) for Berlin pre-opening", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/de/berlin/",
      destination: "berlin",
      canonicalPath: "/de/berlin/",
      language: "de",
    });
    const types = doc["@graph"].map((n) => (n as { "@type"?: string | string[] })["@type"]);
    const flat = types.flatMap((t) => (Array.isArray(t) ? t : t ? [t] : []));
    expect(flat).toContain("Place");
    expect(flat).not.toContain("Museum");
  });

  it("emits minimal graph for privacy shells", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/sv/stockholm/privacy/",
      destination: "stockholm",
      canonicalPath: "/sv/stockholm/privacy/",
      language: "sv",
    });
    const types = doc["@graph"].map((n) => (n as { "@type"?: string | string[] })["@type"]);
    const flat = types.flatMap((t) => (Array.isArray(t) ? t : t ? [t] : []));
    expect(flat).toContain("WebPage");
    expect(flat).not.toContain("Museum");
    expect(flat).not.toContain("Place");
  });

  it("produces parseable JSON-LD", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/en/stockholm/",
      destination: "stockholm",
      canonicalPath: "/en/stockholm/",
    });
    expect(() => JSON.stringify(doc)).not.toThrow();
    expect(doc["@context"]).toBe("https://schema.org");
  });
});
