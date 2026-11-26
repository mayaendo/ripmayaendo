import { BASE, LAYERS, ITEMS } from './items.js';

// Qué prenda está puesta en cada capa (o null).
const state = Object.fromEntries(LAYERS.map((l) => [l, null]));

const SITE_URL = 'https://rip-mayaendo.com';

const pct = (v, total) => `${(v / total) * 100}%`;

export function mountGame(root) {
  root.innerHTML = `
    <div class="game__left">
      <div class="game__frame">
        <div class="game__stage" data-stage style="aspect-ratio: ${BASE.width} / ${BASE.height}"></div>
        <span class="game__ribbon" aria-hidden="true"></span>
      </div>
      <p class="game__plaque">maya endo</p>
      <div class="game__actions">
        <button class="game__back" data-back aria-label="seguir vistiendo">←</button>
        <button class="game__share" data-share>compartir la web</button>
      </div>
    </div>
    <div class="game__right">
      <div class="game__wardrobe" data-wardrobe></div>
      <button class="game__farewell" data-farewell>adiós</button>
    </div>
  `;
  const stage = root.querySelector('[data-stage]');
  const wardrobe = root.querySelector('[data-wardrobe]');
  renderWardrobe(wardrobe);
  renderStage(stage);

  // Retrato de velorio: la muñeca vestida queda enmarcada con lazo de luto y placa.
  const setPortrait = (on) => {
    root.classList.toggle('is-portrait', on);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  root.querySelector('[data-farewell]').addEventListener('click', () => setPortrait(true));
  root.querySelector('[data-back]').addEventListener('click', () => setPortrait(false));

  // Copia el link de la web al portapapeles; el botón muestra ✓ un momento.
  const share = root.querySelector('[data-share]');
  share.addEventListener('click', async () => {
    const ok = await copyText(SITE_URL);
    if (!ok) return window.prompt('', SITE_URL); // respaldo: el link queda seleccionado para copiar
    const label = share.textContent;
    share.textContent = '✓';
    setTimeout(() => (share.textContent = label), 1400);
  });

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

// Si una parte tiene `with: { [idDeOtraPrenda]: {...} }`, ese calce reemplaza al normal
// cuando esa otra prenda está puesta (p. ej. la correa sobre el pantalón de cuero).
export function resolvePart(p, wornIds) {
  const id = p.with && Object.keys(p.with).find((k) => wornIds.includes(k));
  return id ? { ...p, ...p.with[id] } : p;
}

function renderStage(el) {
  const base = `<img class="game__layer" src="${BASE.src}" alt="${BASE.name}">`;
  const wornIds = LAYERS.filter((l) => state[l]).map((l) => state[l].id);
  const worn = LAYERS.filter((l) => state[l]).flatMap((l) => state[l].parts.map((p) => partImg(resolvePart(p, wornIds))));
  el.innerHTML = base + worn.join('');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}
