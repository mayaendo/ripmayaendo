// Separa una imagen de un par (zapatos) en izquierda/derecha por la columna vacía central.
// Uso: node scripts/split-pair.mjs <entrada.png> <salida-izq.png> <salida-der.png>
import sharp from 'sharp';
const [, , input, outL, outR] = process.argv;
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const colEmpty = (x) => { for (let y = 0; y < h; y++) if (data[(y * w + x) * 4 + 3] > 10) return false; return true; };
let best = -1, bestDist = Infinity;
for (let x = Math.floor(w * 0.3); x < w * 0.7; x++) if (colEmpty(x) && Math.abs(x - w / 2) < bestDist) { best = x; bestDist = Math.abs(x - w / 2); }
if (best < 0) throw new Error('No hay columna vacía para separar');
await sharp(input).extract({ left: 0, top: 0, width: best, height: h }).trim({ threshold: 0 }).toFile(outL);
await sharp(input).extract({ left: best, top: 0, width: w - best, height: h }).trim({ threshold: 0 }).toFile(outR);
console.log('separado en x =', best);
