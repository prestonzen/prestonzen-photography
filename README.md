# Preston Zen Photography

A React and Vite portfolio for Preston Zen, a photographer based in Higashiosaka, Japan. Live at [photography.prestonzen.com](https://photography.prestonzen.com).

The site is a neutral showcase of the work (kimono portraits, people, places) with background and contact details. It has no pricing or booking flow.

## Local development

- Node.js 24 (`.nvmrc`)
- `npm ci`
- `npm run dev`
- `npm run build` builds to `dist/`, then `scripts/check-build.mjs` fails the build if any photo, `og.jpg` or the favicon is missing.

## Content

- `src/site/content.js`: name, bio, facts, links, and the three series.
- `src/site/photos.js`: one entry per photograph (`slug`, `series`, `title`, `place`, `alt`, size, placeholder colour).
- `public/images/`: each photo as `<slug>-640.webp` and `<slug>-1200.webp`, re-encoded with all metadata (EXIF and GPS) stripped.
- `public/og.jpg`: 1200×630 social preview image.

Each photograph has a shareable link, for example `https://photography.prestonzen.com/#red-railing`.

To add a photo, export the two WebP sizes with metadata removed, add an entry to `photos.js` with factual alt text, and run `npm run build`.

## Deployment

Cloudflare Pages (project `prestonzen-photography`, Kaizen Apps account) is connected to this repository. Every push to `main` builds with `npm run build` and deploys `dist/` to production. Other branches get preview URLs.

GitHub Actions (`.github/workflows/ci.yml`) runs the same build on pushes and pull requests, so a missing image fails CI rather than deploying as an HTML fallback.

## Content notes

The portfolio reflects Preston's self-reported experience. It does not claim independent reviews, press, awards or client endorsements.

## Contact

[contact@prestonzen.com](mailto:contact@prestonzen.com)
