import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.join(process.cwd(), 'public');
await mkdir(publicDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#071910"/>
  <circle cx="256" cy="256" r="148" fill="none" stroke="#c6e86b" stroke-width="28"/>
  <path d="M256 140v232M140 256h232" stroke="#c6e86b" stroke-width="28" stroke-linecap="round"/>
</svg>`;

await writeFile(path.join(publicDir, 'icon.svg'), svg);

async function png(size, file) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(publicDir, file));
}

await png(192, 'icon-192.png');
await png(512, 'icon-512.png');
await png(180, 'apple-touch-icon.png');
console.log('Wrote PWA icons to public/');
