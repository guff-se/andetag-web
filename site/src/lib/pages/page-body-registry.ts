/**
 * Canonical paths that render migrated main content in `[...slug].astro`.
 * All other shells keep the Phase 4 placeholder until migrated.
 */
export const PAGE_CUSTOM_BODY_PATHS: ReadonlySet<string> = new Set([
  "/sv/stockholm/gruppbokning/",
  "/sv/stockholm/foretagsevent/",
  "/sv/optisk-fibertextil/",
  "/sv/stockholm/art-yoga/",
  "/sv/stockholm/biljetter/",
  "/sv/stockholm/dejt/",
  "/sv/stockholm/fragor-svar/",
]);
