# Preston Zen Photography

A mobile-first React and Vite portfolio for portrait sessions in Osaka.

## Local development

- Node.js 24
- `npm ci`
- `npm run dev`
- `npm run build`

The gallery data lives in `src/site/photos.js`. Store optimized, metadata-stripped public JPEGs in `public/images/` and use factual alt text.

## Deployment

The live Cloudflare Pages project uses Direct Upload. Build with `npm run build` and upload the generated `dist/` directory. This project is not configured for Git-connected builds.

A GitHub Actions workflow could deploy the build through Wrangler Direct Upload if a scoped Cloudflare API token is stored as a GitHub Actions secret. No workflow or token is configured here.

## Content notes

The portfolio reflects Preston's self-reported experience and session details. It does not claim independent reviews, press, awards, or client endorsements.

## Contact

[contact@prestonzen.com](mailto:contact@prestonzen.com)
