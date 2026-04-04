import { describe, expect, it } from "vitest";
import { HEADER_SMALL_SV_ASSETS, HERO_SV_ASSETS } from "./assets";

describe("layout asset paths", () => {
  it("keeps Swedish hero assets root-relative and local", () => {
    expect(HERO_SV_ASSETS.poster).toBe("/wp-content/uploads/2024/11/Desktop.00_00_00_00.Still002.jpg");
    expect(HERO_SV_ASSETS.posterPreload).toBe("/wp-content/uploads/2024/11/stockholm-hero-poster-960w.webp");
    expect(HERO_SV_ASSETS.video).toBe("/wp-content/uploads/2024/12/stockholm-hero-desktop.mp4");
    expect(HERO_SV_ASSETS.videoMobile).toBe("/wp-content/uploads/2024/12/stockholm-hero-mobile.mp4");

    Object.values(HERO_SV_ASSETS).forEach((path) => {
      expect(path.startsWith("/")).toBe(true);
      expect(path.includes("://")).toBe(false);
      expect(path.startsWith("/wp-content/")).toBe(true);
    });
  });

  it("keeps Swedish small-header assets root-relative and local", () => {
    expect(HEADER_SMALL_SV_ASSETS.desktopBackground).toBe("/wp-content/uploads/2025/10/Desktop.00_00_00_00.Still002.jpg");
    expect(HEADER_SMALL_SV_ASSETS.mobileBackground).toBe("/wp-content/uploads/2025/10/Mobile-BG.00_00_00_00.Still002.jpg");

    Object.values(HEADER_SMALL_SV_ASSETS).forEach((path) => {
      expect(path.startsWith("/")).toBe(true);
      expect(path.includes("://")).toBe(false);
      expect(path.startsWith("/wp-content/")).toBe(true);
    });
  });
});
