import { describe, expect, it } from "vitest";
import { getNavigationVariant } from "./navigation";
import { getSwedishHeroHeaderModel } from "./hero-sv";
import { getEnglishStockholmHeroHeaderModel } from "./hero-en-stockholm";
import { getEnglishBerlinHeroHeaderModel } from "./hero-en-berlin";
import { getGermanBerlinHeroHeaderModel } from "./hero-de-berlin";

type LinkPair = { label: string; href: string };

function variantLinks(items: ReadonlyArray<{ label: string; href: string; children?: ReadonlyArray<LinkPair>; cta?: boolean }>): LinkPair[] {
  const out: LinkPair[] = [];
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      for (const child of item.children) out.push({ label: child.label, href: child.href });
    } else {
      out.push({ label: item.label, href: item.href });
    }
  }
  return out;
}

function heroLinks(menuItems: ReadonlyArray<{ label: string; href: string | null; subMenu: ReadonlyArray<LinkPair> }>): LinkPair[] {
  const out: LinkPair[] = [];
  for (const item of menuItems) {
    if (item.subMenu.length > 0) {
      for (const sub of item.subMenu) out.push({ label: sub.label, href: sub.href });
    } else if (item.href) {
      out.push({ label: item.label, href: item.href });
    }
  }
  return out;
}

const sortByHref = (a: LinkPair, b: LinkPair) => a.href.localeCompare(b.href) || a.label.localeCompare(b.label);

describe("nav parity: navigation.ts ↔ hero MENU_DEFINITION", () => {
  it("sv-main matches the Swedish Stockholm hero header", () => {
    const nav = getNavigationVariant({
      language: "sv",
      destination: "stockholm",
      headerVariantId: "chrome-hdr-sv-stockholm-hero",
    });
    const hero = getSwedishHeroHeaderModel("/sv/stockholm/");
    // Drop the CTA top-level (e.g. "Biljetter") from nav — hero exposes it separately as ticketItem.
    const navItems = nav.items.filter((i) => !i.cta);
    expect(variantLinks(navItems).sort(sortByHref)).toEqual(heroLinks(hero.menuItems).sort(sortByHref));
  });

  it("en-main matches the English Stockholm hero header", () => {
    const nav = getNavigationVariant({
      language: "en",
      destination: "stockholm",
      headerVariantId: "chrome-hdr-en-stockholm-hero",
    });
    const hero = getEnglishStockholmHeroHeaderModel("/en/stockholm/");
    const navItems = nav.items.filter((i) => !i.cta);
    expect(variantLinks(navItems).sort(sortByHref)).toEqual(heroLinks(hero.menuItems).sort(sortByHref));
  });

  it("en-main-berlin matches the English Berlin hero header", () => {
    const nav = getNavigationVariant({
      language: "en",
      destination: "berlin",
      headerVariantId: "chrome-hdr-en-berlin-hero",
    });
    const hero = getEnglishBerlinHeroHeaderModel("/en/berlin/");
    const navItems = nav.items.filter((i) => !i.cta);
    expect(variantLinks(navItems).sort(sortByHref)).toEqual(heroLinks(hero.menuItems).sort(sortByHref));
  });

  it("de-main matches the German Berlin hero header", () => {
    const nav = getNavigationVariant({
      language: "de",
      destination: "berlin",
      headerVariantId: "chrome-hdr-de-berlin-hero",
    });
    const hero = getGermanBerlinHeroHeaderModel("/de/berlin/");
    const navItems = nav.items.filter((i) => !i.cta);
    expect(variantLinks(navItems).sort(sortByHref)).toEqual(heroLinks(hero.menuItems).sort(sortByHref));
  });
});
