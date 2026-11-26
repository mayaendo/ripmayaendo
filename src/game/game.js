import { BASE, LAYERS, ITEMS } from './items.js';

// Estado: qué item está puesto en cada capa (o null).
const state = Object.fromEntries(LAYERS.map((l) => [l, null]));

export function mountGame(root) {
  root.innerHTML = `
    <div class="game__stage" data-stage style="aspect-ratio: ${BASE.width} / ${BASE.height}"></div>
    <div class="game__wardrobe" data-wardrobe></div>
  `;
  renderStage(root.querySelector('[data-stage]'));
  renderWardrobe(root.querySelector('[data-wardrobe]'), root);
}

function renderWardrobe(el, root) {
  if (!ITEMS.length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = ITEMS.map(
    (it) => `<button class="game__item" data-id="${it.id}"><img src="${it.src}" alt="${it.name}"></button>`
  ).join('');
  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (!btn) return;
    const item = ITEMS.find((i) => i.id === btn.dataset.id);
    state[item.layer] = state[item.layer]?.id === item.id ? null : item;
    renderStage(root.querySelector('[data-stage]'));
  });
}

function renderStage(el) {
  const base = `<img class="game__layer" src="${BASE.src}" alt="${BASE.name}">`;
  el.innerHTML = base + LAYERS.filter((l) => state[l])
    .map((l) => `<img class="game__layer" src="${state[l].src}" alt="">`)
    .join('');
}
