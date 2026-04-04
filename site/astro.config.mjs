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
        return true;
      },
    }),
  ],
});
