import { describe, expect, it } from "vitest";
import { PAGE_SHELL_PATHS } from "./page-shell-registry";
import { PAGE_CUSTOM_BODY_PATHS } from "../page-registry/page-body-registry";

describe("build output structure", () => {
  it("every shell path (except /en/) has a matching body", () => {
    const missing: string[] = [];
    for (const path of PAGE_SHELL_PATHS) {
      if (path === "/en/") continue;
      if (!PAGE_CUSTOM_BODY_PATHS.has(path)) {
        missing.push(path);
      }
    }
    expect(missing, `Shell paths without bodies: ${missing.join(", ")}`).toEqual([]);
  });

  it("no orphan bodies exist without shells", () => {
    const shellSet = new Set(PAGE_SHELL_PATHS);
    const orphans: string[] = [];
    for (const path of PAGE_CUSTOM_BODY_PATHS) {
      if (!shellSet.has(path)) {
        orphans.push(path);
      }
    }
    expect(orphans, `Body paths without shells: ${orphans.join(", ")}`).toEqual([]);
  });
});
