import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { PAGE_CUSTOM_BODY_PATHS } from "./page-body-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slugPath = join(__dirname, "../../pages/[...slug].astro");

describe("page body registry", () => {
  it("stays aligned with pageBodies map in [...slug].astro", () => {
    const slugSource = readFileSync(slugPath, "utf8");
    for (const path of PAGE_CUSTOM_BODY_PATHS) {
      expect(slugSource).toContain(`"${path}"`);
    }
  });
});
