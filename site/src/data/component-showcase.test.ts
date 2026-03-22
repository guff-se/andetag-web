import { describe, expect, it } from "vitest";
import { GALLERY_IMAGES } from "./component-showcase";

describe("component showcase data", () => {
  it("uses the same 8 source-backed gallery photos", () => {
    expect(GALLERY_IMAGES).toHaveLength(8);
    expect(GALLERY_IMAGES.map((image) => image.src)).toEqual([
      "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6074-scaled.jpg",
      "/wp-content/uploads/2024/11/Andetag-13-35-copy-2.jpg",
      "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-5983-scaled.jpg",
      "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-6038-scaled.jpg",
      "/wp-content/uploads/2024/11/Andetag-10-53-copy-2.jpg",
      "/wp-content/uploads/2025/01/ANDETAG-Tadaa-Photo-Johan-Eriksson-_-TERRAN-59311-scaled.jpg",
      "/wp-content/uploads/2024/11/Andetag-19-508-copy.jpg",
      "/wp-content/uploads/2024/11/Andetag-10-69-copy.jpg",
    ]);
  });
});
