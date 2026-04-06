import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const publicDir = join(process.cwd(), "public");
const requiredIconFiles = [
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "andetag-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest",
] as const;

describe("public identity icons", () => {
  it("ships required favicon, touch, and manifest assets", () => {
    for (const name of requiredIconFiles) {
      expect(existsSync(join(publicDir, name)), `missing site/public/${name}`).toBe(true);
    }
  });
});
