// Builds app/favicon.ico (16/32/48 PNG-in-ICO) and app/apple-icon.png from app/icon.svg.
//   node scripts/make-icons.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("app/icon.svg");
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e); // width
  header.writeUInt8(s, e + 1); // height
  header.writeUInt8(0, e + 2); // palette
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync("app/favicon.ico", Buffer.concat([header, ...images]));

// iOS adds its own rounded mask, so the apple icon is a full-bleed square.
const apple = Buffer.from(svg.toString().replace('rx="8"', 'rx="0"'));
await sharp(apple, { density: 1024 }).resize(180, 180).png().toFile("app/apple-icon.png");
console.log("wrote app/favicon.ico and app/apple-icon.png");
