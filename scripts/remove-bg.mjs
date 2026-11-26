// Quita el fondo blanco de una ilustración (flood fill desde los bordes,
// así los blancos internos — ojos, brillos — se conservan).
// Uso: node scripts/remove-bg.mjs <entrada> <salida.png> [tolerancia=40]
import sharp from 'sharp';

const [, , input, output, tolArg] = process.argv;
if (!input || !output) {
  console.error('Uso: node scripts/remove-bg.mjs <entrada> <salida.png> [tolerancia]');
  process.exit(1);
}
const tol = Number(tolArg ?? 40);

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const isBg = (i) => {
  const o = i * 4;
  if (data[o + 3] < 10) return true; // ya transparente
  return 255 - data[o] <= tol && 255 - data[o + 1] <= tol && 255 - data[o + 2] <= tol;
};

const seen = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
while (stack.length) {
  const i = stack.pop();
  if (seen[i] || !isBg(i)) continue;
  seen[i] = 1;
  data[i * 4 + 3] = 0;
  const x = i % w, y = (i / w) | 0;
  if (x > 0) stack.push(i - 1);
  if (x < w - 1) stack.push(i + 1);
  if (y > 0) stack.push(i - w);
  if (y < h - 1) stack.push(i + w);
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 0 }).png().toFile(output);
console.log(`${output} — ${w}x${h}`);
