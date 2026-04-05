import { describe, expect, it } from "vitest";
import {
  HEADER_SMALL_LCP_PRELOAD_WEBP,
  HEADER_SMALL_SV_ASSETS,
  HERO_SV_ASSETS,
  STOCKHOLM_BOOK_HERO_COVER,
} from "./assets";

describe("layout asset paths", () => {
  it("keeps Swedish hero assets root-relative and local", () => {
    expect(HERO_SV_ASSETS.poster).toBe("/wp-content/uploads/2024/11/stockholm-hero-poster-1920w.jpg");
    expect(HERO_SV_ASSETS.posterPreload).toBe("/wp-content/uploads/2024/11/stockholm-hero-poster-960w.webp");
    expect(HERO_SV_ASSETS.video).toBe("/wp-content/uploads/2024/12/stockholm-hero-desktop.mp4");
    expect(HERO_SV_ASSETS.videoMobile).toBe("/wp-content/uploads/2024/12/stockholm-hero-mobile.mp4");

    Object.values(HERO_SV_ASSETS).forEach((path) => {
      expect(path.startsWith("/")).toBe(true);
      expect(path.includes("://")).toBe(false);
      expect(path.startsWith("/wp-content/")).toBe(true);
    });
  });

  it("keeps Stockholm book hero cover paths root-relative and under uploads", () => {
    expect(STOCKHOLM_BOOK_HERO_COVER.jpeg960).toBe(
      "/wp-content/uploads/2024/11/Andetag-21-399-scaled-hero-960w.jpg",
    );
    Object.values(STOCKHOLM_BOOK_HERO_COVER).forEach((path) => {
      expect(path.startsWith("/wp-content/")).toBe(true);
      expect(path.includes("://")).toBe(false);
    });
  });

  it("keeps Swedish small-header assets root-relative and local", () => {
    expect(HEADER_SMALL_LCP_PRELOAD_WEBP).toBe(
      "/wp-content/uploads/2025/10/Mobile-BG.00_00_00_00.Still002-header-mobile-960w.webp",
    );
    expect(HEADER_SMALL_SV_ASSETS.mobile.webp960).toBe(HEADER_SMALL_LCP_PRELOAD_WEBP);

    Object.values(HEADER_SMALL_SV_ASSETS.mobile).forEach((path) => {
      expect(path.startsWith("/")).toBe(true);
      expect(path.includes("://")).toBe(false);
      expect(path.startsWith("/wp-content/")).toBe(true);
    });
  });
});
