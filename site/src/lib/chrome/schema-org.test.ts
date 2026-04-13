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

  it("includes aggregateRating and review on Stockholm pages", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/en/stockholm/tickets/",
      destination: "stockholm",
    });
    const venue = doc["@graph"].find(
      (n) => Array.isArray((n as Record<string, unknown>)["@type"]) &&
        ((n as Record<string, unknown>)["@type"] as string[]).includes("Museum"),
    ) as Record<string, unknown> | undefined;
    expect(venue).toBeDefined();
    const rating = venue!.aggregateRating as Record<string, unknown>;
    expect(rating).toBeDefined();
    expect(rating["@type"]).toBe("AggregateRating");
    expect(Number(rating.ratingValue)).toBeGreaterThanOrEqual(1);
    expect(Number(rating.reviewCount)).toBeGreaterThan(0);
    const reviews = venue!.review as unknown[];
    expect(reviews).toBeDefined();
    expect(reviews.length).toBeGreaterThanOrEqual(1);
    const first = reviews[0] as Record<string, unknown>;
    expect(first["@type"]).toBe("Review");
    expect(first.reviewBody).toBeTruthy();
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

  it("includes offers on the Stockholm Museum node", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/en/stockholm/tickets/",
      destination: "stockholm",
    });
    const venue = doc["@graph"].find(
      (n) =>
        Array.isArray((n as Record<string, unknown>)["@type"]) &&
        ((n as Record<string, unknown>)["@type"] as string[]).includes("Museum"),
    ) as Record<string, unknown> | undefined;
    expect(venue).toBeDefined();
    const offers = venue!.offers as Record<string, unknown>[];
    expect(offers.length).toBeGreaterThanOrEqual(4);
    const regular = offers.find((o) => o.name === "Regular ticket");
    expect(regular).toBeDefined();
    expect(regular!.price).toBe("240");
    expect(regular!.priceCurrency).toBe("SEK");
  });

  it("includes Art Yoga recurring Event with Schedule", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/en/stockholm/",
      destination: "stockholm",
      canonicalPath: "/en/stockholm/",
    });
    const event = doc["@graph"].find(
      (n) => (n as Record<string, unknown>)["@type"] === "Event",
    ) as Record<string, unknown> | undefined;
    expect(event).toBeDefined();
    expect(event!.name).toBe("Art Yoga at ANDETAG");
    expect(event!.duration).toBe("PT1H");
    const schedule = event!.eventSchedule as Record<string, unknown>;
    expect(schedule["@type"]).toBe("Schedule");
    expect(schedule.repeatFrequency).toBe("P1W");
    expect(schedule.byDay).toBe("https://schema.org/Tuesday");
    expect(schedule.startTime).toBe("17:00:00");
    expect(schedule.scheduleTimezone).toBe("Europe/Stockholm");
    const performer = event!.performer as Record<string, unknown>;
    expect(performer.name).toBe("Fabian Macklin");
  });

  it("uses Swedish names when language is sv", () => {
    const doc = buildSchemaJsonLd({
      ...base,
      pageUrl: "https://www.andetag.museum/sv/stockholm/",
      destination: "stockholm",
      canonicalPath: "/sv/stockholm/",
      language: "sv",
    });
    const event = doc["@graph"].find(
      (n) => (n as Record<string, unknown>)["@type"] === "Event",
    ) as Record<string, unknown>;
    expect(event.name).toBe("Art Yoga på ANDETAG");
    const venue = doc["@graph"].find(
      (n) =>
        Array.isArray((n as Record<string, unknown>)["@type"]) &&
        ((n as Record<string, unknown>)["@type"] as string[]).includes("Museum"),
    ) as Record<string, unknown>;
    const offers = venue.offers as Record<string, unknown>[];
    expect(offers.find((o) => o.name === "Ordinarie biljett")).toBeDefined();
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
