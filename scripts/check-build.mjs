// Fails the build if any photograph referenced in src/site/photos.js is
// missing from dist/. Cloudflare Pages falls back to index.html for unknown
// paths, so a missing image would otherwise deploy "successfully" as HTML.
import { existsSync, statSync } from 'node:fs';
import { photos } from '../src/site/photos.js';

const required = ['og.jpg', 'favicon.svg', ...photos.flatMap(({ slug }) => [`images/${slug}-640.webp`, `images/${slug}-1200.webp`])];
const missing = required.filter((file) => !existsSync(`dist/${file}`) || statSync(`dist/${file}`).size === 0);

if (missing.length) {
  console.error(`Missing from dist/:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-build: ${required.length} files present.`);
