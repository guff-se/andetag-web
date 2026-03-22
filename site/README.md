# ANDETAG Site Workspace

Astro implementation workspace for the rebuilt ANDETAG site.

## Project Structure

```text
/
├── public/
│   ├── fonts/
│   └── wp-content/
├── scripts/
│   └── sync-fonts.mjs
├── src/
│   ├── lib/fonts/sources.json
│   ├── pages/
│   └── styles/
└── package.json
```

## Commands

Run all commands from `site/`.

| Command              | Action |
| :------------------- | :----- |
| `npm install`        | Install dependencies |
| `npm run dev`        | Start local dev server at `localhost:4321` |
| `npm run build`      | Build production site to `./dist/` |
| `npm run preview`    | Preview build locally |
| `npm run test`       | Run Vitest suite |
| `npm run fonts:sync` | Download configured webfonts and regenerate local `@font-face` CSS |

## Local Font Workflow

The rebuilt site must self-host fonts. Do not link remote Google or WordPress font URLs directly in runtime templates.

1. Add or update font sources in `src/lib/fonts/sources.json`.
2. Run `npm run fonts:sync`.
3. Confirm generated files:
   - `public/fonts/<family-id>/*.woff2`
   - `src/styles/fonts.css`
4. Use generated local family names (`<FamilyName>Local`) in styles.

Current config downloads `Jost` navigation weights (`500`, `700`) with `latin-ext` priority.
