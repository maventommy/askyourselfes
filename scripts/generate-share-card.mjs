#!/usr/bin/env node
/**
 * generate-share-card.mjs
 * Renders a branded "Ask Yourselves" social share card from a
 * before/after portrait pair.
 *
 * Usage:
 *   node scripts/generate-share-card.mjs --before you-today.jpg --after you-aged.jpg --out card.jpg [--size 1200x630]
 *
 * Rendering strategy (first available wins):
 *   1. @napi-rs/canvas  (best: draws everything, outputs JPEG)
 *   2. sharp            (composites the portraits under an SVG overlay, outputs JPEG)
 *   3. plain SVG        (no raster dependency: writes an .svg next to --out)
 *
 * Brand: ink #0d0c0a, cream #f4ede0, gold #c4a878.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_SIZE = { width: 1200, height: 630 };
const INK = '#0d0c0a', CREAM = '#f4ede0', GOLD = '#c4a878', MUTED = '#cbbfa8';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--before') args.before = argv[++i];
    else if (a === '--after') args.after = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--size') args.size = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Ask Yourselves share-card generator

  node scripts/generate-share-card.mjs --before <img> --after <img> --out <file.jpg> [--size <width>x<height>]

  --before   portrait of the user today
  --after    age-progressed portrait
  --out      output path (.jpg recommended)
  --size     card dimensions, e.g. 1080x1080 (default: 1200x630)`);
}

function parseSize(size) {
  if (!size) return DEFAULT_SIZE;
  const match = /^(\d+)x(\d+)$/i.exec(size);
  if (!match || Number(match[1]) < 1 || Number(match[2]) < 1) {
    throw new Error(`Invalid --size value "${size}". Use WIDTHxHEIGHT, for example 1200x630.`);
  }
  return { width: Number(match[1]), height: Number(match[2]) };
}

async function tryImport(name) {
  try { return await import(name); } catch { return null; }
}

const TAGLINE = 'Talk to your future self. Hindsight, in advance.';
const WORDMARK = 'Ask Yourselves';

/* ---------- path 1: @napi-rs/canvas ---------- */
async function renderCanvas(mod, { before, after, out, width: W, height: H }) {
  const { createCanvas, loadImage, GlobalFonts } = mod;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  // portraits, side by side, cover-cropped into each half
  const half = W / 2;
  const [imgA, imgB] = await Promise.all([loadImage(before), loadImage(after)]);
  drawCover(ctx, imgA, 0, 0, half, H);
  drawCover(ctx, imgB, half, 0, half, H);

  // thin gold divider
  ctx.fillStyle = GOLD;
  ctx.fillRect(half - 1, 0, 2, H);

  // labels
  ctx.font = '600 22px sans-serif';
  ctx.fillStyle = CREAM;
  ctx.textBaseline = 'top';
  label(ctx, 'YOU TODAY', 40, 36);
  label(ctx, 'YOU, YEARS ON', half + 40, 36);

  // bottom gradient bar
  const gradH = 260;
  const grad = ctx.createLinearGradient(0, H - gradH, 0, H);
  grad.addColorStop(0, 'rgba(13,12,10,0)');
  grad.addColorStop(0.5, 'rgba(13,12,10,0.82)');
  grad.addColorStop(1, INK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - gradH, W, gradH);

  // wordmark + tagline
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';
  ctx.fillStyle = CREAM;
  ctx.font = '64px Georgia, "Times New Roman", serif';
  ctx.fillText(WORDMARK, W / 2, H - 96);
  ctx.fillStyle = GOLD;
  ctx.font = '26px sans-serif';
  ctx.fillText(TAGLINE, W / 2, H - 52);

  const buf = canvas.toBuffer('image/jpeg', 0.9);
  await writeFile(out, buf);
  return out;
}

function drawCover(ctx, img, dx, dy, dw, dh) {
  const ir = img.width / img.height, dr = dw / dh;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ir > dr) { sw = img.height * dr; sx = (img.width - sw) / 2; }
  else { sh = img.width / dr; sy = (img.height - sh) * 0.28; }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function label(ctx, text, x, y) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 12;
  ctx.fillText(spaced(text), x, y);
  ctx.restore();
}
const spaced = (s) => s.split('').join('â€Š');

/* ---------- path 2: sharp ---------- */
async function renderSharp(sharp, { before, after, out, width: W, height: H }) {
  const half = Math.round(W / 2);
  const a = await sharp.default(before).resize(half, H, { fit: 'cover', position: 'top' }).toBuffer();
  const b = await sharp.default(after).resize(W - half, H, { fit: 'cover', position: 'top' }).toBuffer();
  const overlay = Buffer.from(svgOverlay(W, H));
  const base = sharp.default({ create: { width: W, height: H, channels: 3, background: INK } });
  await base
    .composite([
      { input: a, left: 0, top: 0 },
      { input: b, left: half, top: 0 },
      { input: overlay, left: 0, top: 0 },
    ])
    .jpeg({ quality: 88 })
    .toFile(out);
  return out;
}

/* ---------- path 3: SVG only ---------- */
function svgOverlay(W, H) {
  const half = W / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.58" stop-color="#0d0c0a" stop-opacity="0"/>
        <stop offset="0.8" stop-color="#0d0c0a" stop-opacity="0.82"/>
        <stop offset="1" stop-color="#0d0c0a" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect x="${half - 1}" y="0" width="2" height="${H}" fill="${GOLD}"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#fade)"/>
    <text x="40" y="58" fill="${CREAM}" font-family="Arial,sans-serif" font-size="22" font-weight="600" letter-spacing="4">YOU TODAY</text>
    <text x="${half + 40}" y="58" fill="${CREAM}" font-family="Arial,sans-serif" font-size="22" font-weight="600" letter-spacing="4">YOU, YEARS ON</text>
    <text x="${W / 2}" y="${H - 92}" fill="${CREAM}" font-family="Georgia,serif" font-size="64" text-anchor="middle">${WORDMARK}</text>
    <text x="${W / 2}" y="${H - 50}" fill="${GOLD}" font-family="Arial,sans-serif" font-size="26" text-anchor="middle">${TAGLINE}</text>
  </svg>`;
}

async function renderSvgFallback({ out, width: W, height: H }) {
  const svgPath = out.replace(/\.(jpe?g|png)$/i, '') + '.svg';
  const full = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${INK}"/>
    ${svgOverlay(W, H).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}
  </svg>`;
  await writeFile(svgPath, full);
  console.warn(`No raster library found. Wrote vector card to ${svgPath}.`);
  console.warn('For a JPEG, install one of:  npm i @napi-rs/canvas   or   npm i sharp');
  return svgPath;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.before || !args.after || !args.out) { usage(); process.exit(args.help ? 0 : 1); }
  let size;
  try { size = parseSize(args.size); } catch (error) { console.error(error.message); process.exit(1); }
  for (const [option, file] of [['--before', args.before], ['--after', args.after]]) {
    if (!existsSync(file)) {
      console.error(`File passed to ${option} does not exist: ${file}`);
      process.exit(1);
    }
  }
  const renderArgs = { ...args, ...size };

  const canvasMod = await tryImport('@napi-rs/canvas');
  if (canvasMod) { console.log('Rendering with @napi-rs/canvas...'); return void console.log('Wrote', await renderCanvas(canvasMod, renderArgs)); }

  const sharpMod = await tryImport('sharp');
  if (sharpMod) { console.log('Rendering with sharp...'); return void console.log('Wrote', await renderSharp(sharpMod, renderArgs)); }

  console.log('Rendering SVG fallback...');
  console.log('Wrote', await renderSvgFallback(renderArgs));
}

main().catch((e) => { console.error(e); process.exit(1); });
