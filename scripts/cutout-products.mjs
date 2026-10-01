// Removes the white studio background from product photos and writes trimmed,
// transparent WebPs next to them. Flood-fills from the image border only, so
// white areas inside the label are kept.
//   node scripts/cutout-products.mjs
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "public/products";
const HARD = 238; // at or above: background
const SOFT = 215; // between SOFT and HARD: feathered edge

for (const file of readdirSync(dir).filter((f) => f.endsWith(".jpg"))) {
  const { data, info } = await sharp(join(dir, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const light = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);

  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);

  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    const l = light(p);
    if (l < SOFT) continue;
    seen[p] = 1;
    data[p * 4 + 3] = l >= HARD ? 0 : Math.round(255 * (1 - (l - SOFT) / (HARD - SOFT)));
    if (l < HARD) continue; // edge pixel: feather, but don't spread through it
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }

  const out = join(dir, file.replace(/\.jpg$/, ".webp"));
  const res = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 1 })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(out);
  console.log(out, `${res.width}x${res.height}`, `${Math.round(res.size / 1024)}KB`);
}
