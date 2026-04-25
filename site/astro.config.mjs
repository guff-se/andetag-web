// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://www.andetag.museum",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes("/404")) return false;
        // Root `index.html` is only a 301 to `/sv/stockholm/`; not canonical indexable HTML (see `docs/url-migration-policy.md`).
        const root = "https://www.andetag.museum";
        if (page === `${root}/` || page === root) return false;
        // Berlin English story shells canonicalize to Stockholm English (`SEO-0016`); exclude them so the sitemap
        // doesn't list a URL whose canonical lives elsewhere (see `docs/seo/decisions.md`).
        const berlinEnStoryShells = [
          `${root}/en/berlin/about-andetag/`,
          `${root}/en/berlin/about-the-artists-malin-gustaf-tadaa/`,
          `${root}/en/berlin/music/`,
          `${root}/en/berlin/optical-fibre-textile/`,
        ];
        if (berlinEnStoryShells.includes(page)) return false;
        return true;
      },
    }),
  ],
});
