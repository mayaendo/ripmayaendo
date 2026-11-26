import { BASE, LAYERS, ITEMS } from './items.js';

// Qué prenda está puesta en cada capa (o null).
const state = Object.fromEntries(LAYERS.map((l) => [l, null]));

const pct = (v, total) => `${(v / total) * 100}%`;

export function mountGame(root) {
  root.innerHTML = `
    <div class="game__stage" data-stage style="aspect-ratio: ${BASE.width} / ${BASE.height}"></div>
    <div class="game__wardrobe" data-wardrobe></div>
  `;
  const stage = root.querySelector('[data-stage]');
  const wardrobe = root.querySelector('[data-wardrobe]');
  renderWardrobe(wardrobe);
  renderStage(stage);

  wardrobe.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (!btn) return;
    const item = ITEMS.find((i) => i.id === btn.dataset.id);
    state[item.layer] = state[item.layer]?.id === item.id ? null : item;
    renderStage(stage);
    syncWardrobe(wardrobe);
  });
}

function renderWardrobe(el) {
  // Un grupo por capa, sin títulos: solo las prendas.
  el.innerHTML = LAYERS.map((layer) => {
    const items = ITEMS.filter((i) => i.layer === layer);
    if (!items.length) return '';
    return `<div class="game__group">${items
      .map(
        (it) => `<button class="game__item" data-id="${it.id}" aria-label="${it.name}" aria-pressed="false">
          <img src="${it.thumb ?? it.parts[0].src}" alt="">
        </button>`
      )
      .join('')}</div>`;
  }).join('');
}

function syncWardrobe(el) {
  el.querySelectorAll('[data-id]').forEach((btn) => {
    const item = ITEMS.find((i) => i.id === btn.dataset.id);
    btn.setAttribute('aria-pressed', String(state[item.layer]?.id === item.id));
  });
}

function partImg(p) {
  const style = [
    `left:${pct(p.cx - p.w / 2, BASE.width)}`,
    `top:${pct(p.top, BASE.height)}`,
    `width:${pct(p.w, BASE.width)}`,
    p.h ? `height:${pct(p.h, BASE.height)}` : '',
  ].join(';');
  return `<img class="game__part" src="${p.src}" style="${style}" alt="">`;
}

function renderStage(el) {
  const base = `<img class="game__layer" src="${BASE.src}" alt="${BASE.name}">`;
  const worn = LAYERS.filter((l) => state[l]).flatMap((l) => state[l].parts.map(partImg));
  el.innerHTML = base + worn.join('');
}
