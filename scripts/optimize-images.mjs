// Genera las imágenes livianas del juego a partir de los PNG originales en art/.
//   art/body.png          -> public/game/body.webp
//   art/items/<id>.png    -> public/game/items/<id>.webp   (prenda sobre la muñeca)
//                         -> public/game/thumbs/<id>.webp  (miniatura del clóset, 160 px)
// Uso: node scripts/optimize-images.mjs   (correr después de agregar o cambiar una ilustración)
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';

const out = (p) => (mkdirSync(p, { recursive: true }), p);
const webp = { quality: 88, alphaQuality: 90, effort: 6 };
let before = 0, after = 0;

async function convert(src, dest, resize) {
  let img = sharp(src);
  if (resize) img = img.resize(resize, resize, { fit: 'inside', withoutEnlargement: true });
  await img.webp(webp).toFile(dest);
  before += statSync(src).size;
  after += statSync(dest).size;
}

await convert('art/body.png', `${out('public/game')}/body.webp`);
for (const f of readdirSync('art/items').filter((f) => f.endsWith('.png') && !f.startsWith('._'))) {
  const id = f.replace(/\.png$/, '');
  await convert(`art/items/${f}`, `${out('public/game/items')}/${id}.webp`);
  await convert(`art/items/${f}`, `${out('public/game/thumbs')}/${id}.webp`, 160);
}
console.log(`PNG ${(before / 1024).toFixed(0)} KB -> WebP ${(after / 1024).toFixed(0)} KB`);
