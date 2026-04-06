# Responsive Image Workflow

Mandatory procedure when adding a new photograph or large raster to the Astro site (hero, gallery tile, body figure, testimonial band, Berlin teaser, `og:image` targets, and similar). Do not rely on the full-resolution master alone in HTML.

## 1. Commit the master

Place the file on the same URL path the site will serve (for example `site/public/wp-content/uploads/.../original.jpg`). Keep provenance: encode from the real asset, do not substitute different imagery.

## 2. Generate three derivatives

Using ImageMagick, from the repo root or `site/public/`. Adjust `INPUT` and `BASE`:

```bash
BASE="${INPUT%.*}"
magick "$INPUT" -resize 640x -strip -define webp:method=6 -quality 82 "${BASE}-${SUFFIX}-640w.webp"
magick "$INPUT" -resize 960x -strip -define webp:method=6 -quality 82 "${BASE}-${SUFFIX}-960w.webp"
magick "$INPUT" -resize 960x -strip -quality 82 "${BASE}-${SUFFIX}-960w.jpg"
```

## 3. Choose `SUFFIX` by usage

| Role | `SUFFIX` | Markup / module |
|------|----------|-----------------|
| `GallerySection` tile | `gallery` | `site/src/lib/content/stockholm-marketing-gallery.ts`; `thumbWebp640` / `thumbWebp960`, `src` = `jpeg960`, `fullSrc` = master |
| Inline figure (intro, aside, Berlin teaser) | `body` or `aside` | `ResponsiveInlinePicture.astro`; paths in `site/src/lib/content/stockholm-body-responsive-images.ts` |
| `HeroSection` full-bleed cover | `hero` | `HeroCoverImage` object; `STOCKHOLM_BOOK_HERO_COVER` in `site/src/lib/chrome/assets.ts`, others in `stockholm-body-responsive-images.ts` |
| `TestimonialCarousel` background | `testimonial` | `BodyPictureSources` default or prop; `testimonialCarouselDefaultBg` in `stockholm-body-responsive-images.ts` |

## 4. Wire and verify

Use `sizes` and `<picture>` as in `docs/phase-3-component-usage.md`. Add or extend a Vitest check on new path constants. Run `npm test` and `npm run build` in `site/`.

## 5. Docs and changelog

Update `docs/performance-improvement-plan.md` if the workflow or scope changes. Add a `CHANGELOG.md` note for user-visible image behavior.

## Exceptions

Tiny assets (icons, logos under tens of KB, SVG) do not need derivatives. `1024x`-suffixed masters that are already display-sized may skip derivatives only if you document why in the same PR (for example verified file size and Lighthouse unchanged). Prefer processing anyway for format (WebP) wins.
