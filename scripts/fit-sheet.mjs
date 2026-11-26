// Genera una hoja de prueba: la muñeca con cada prenda puesta (para ajustar posiciones).
// Uso: node scripts/fit-sheet.mjs <salida.png> [id1,id2,...]  (combos con '+': top-cream+pants-pink)
import sharp from 'sharp';
import { BASE, ITEMS, LAYERS } from '../src/game/items.js';

const [, , out, list] = process.argv;
const looks = (list ? list.split(',') : ITEMS.map((i) => i.id)).map((l) => l.split('+'));
const scale = 0.4;
const cw = Math.round(BASE.width * scale), ch = Math.round(BASE.height * scale);

async function render(ids) {
  const items = ids.map((id) => ITEMS.find((i) => i.id === id)).sort((a, b) => LAYERS.indexOf(a.layer) - LAYERS.indexOf(b.layer));
  const comps = [];
  for (const it of items) for (const p of it.parts) {
    const src = 'public' + p.src;
    const m = await sharp(src).metadata();
    const h = p.h ?? (p.w * m.height) / m.width;
    comps.push({ input: await sharp(src).resize(Math.round(p.w), Math.round(h), { kernel: 'nearest', fit: 'fill' }).toBuffer(), left: Math.round(p.cx - p.w / 2), top: Math.round(p.top) });
  }
  const img = await sharp('public' + BASE.src).composite(comps).png().toBuffer();
  return sharp(img).resize(cw, ch).toBuffer();
}

const cols = Math.min(looks.length, 5);
const rows = Math.ceil(looks.length / cols);
const tiles = await Promise.all(looks.map(render));
await sharp({ create: { width: cw * cols, height: ch * rows, channels: 4, background: '#fff' } })
  .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * cw, top: Math.floor(i / cols) * ch })))
  .png().toFile(out);
console.log(out);
