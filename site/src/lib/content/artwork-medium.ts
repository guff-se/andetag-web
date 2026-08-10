/**
 * Construction line shared by the whole artworks catalogue. Originals and gems are
 * woven and assembled the same way, so the medium is one string rather than a
 * per-artwork field in `artworks.ts`.
 *
 * Consumers: the artwork modal (`client-scripts/artworks-modal.ts`) and the
 * per-artwork pages (`ArtworkPageSv.astro`, `ArtworkPageEn.astro`). Kept in its own
 * module so the client bundle does not have to pull in the full catalogue.
 *
 * The schema.org `artMedium` short form lives in `lib/chrome/schema-org.ts`.
 */

/** Label for the medium row. Swedish says "Material"; English uses the museum term. */
export const ARTWORK_MEDIUM_LABEL: { readonly sv: string; readonly en: string } = {
  sv: "Material",
  en: "Medium",
};

export const ARTWORK_MEDIUM: { readonly sv: string; readonly en: string } = {
  sv: "Optisk fibertextil: bomullsvarp med optisk fiber, bomull, chenille och krympgarn i inslaget; polyesterfyllning; adresserbara RGB-lysdioder; mikrodator; träram",
  en: "Optical fibre fabric: cotton warp with optical fibre, cotton, chenille and shrinking yarn in weft; polyester fill; addressable RGB LEDs; microcomputer; wooden frame",
};
