import { BASE, LAYERS, ITEMS } from './items.js';

// Qué prenda está puesta en cada capa (o null).
const state = Object.fromEntries(LAYERS.map((l) => [l, null]));

const SITE_URL = 'https://rip-mayaendo.com';

// Miniatura liviana del clóset (generada por scripts/optimize-images.mjs).
const thumbSrc = (it) => (it.thumb ?? it.parts[0].src).replace('/game/items/', '/game/thumbs/');

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
  preloadWornImages();

  // Retrato de velorio: la muñeca vestida queda enmarcada con lazo de luto y placa.
  const title = document.querySelector('.title');
  const titleText = title?.textContent;
  const setPortrait = (on) => {
    if (title) title.textContent = on ? 'adiós' : titleText;
    root.classList.toggle('is-portrait', on);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  root.querySelector('[data-farewell]').addEventListener('click', () => setPortrait(true));
  root.querySelector('[data-back]').addEventListener('click', () => setPortrait(false));

  // En celular abre el menú nativo para compartir (WhatsApp, Instagram, etc.).
  // En computadora (o si el menú no existe) copia el link; el botón muestra "link copiado ✓".
  const share = root.querySelector('[data-share]');
  const isPhone = matchMedia('(pointer: coarse)').matches;
  share.addEventListener('click', async () => {
    if (isPhone && navigator.share) {
      try {
        await navigator.share({ title: document.title, url: SITE_URL });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // la persona cerró el menú
      }
    }
    const ok = await copyText(SITE_URL);
    const label = share.textContent;
    if (!ok) {
      // Respaldo si el navegador no deja copiar: mostrar el link seleccionado para copiarlo a mano.
      share.textContent = SITE_URL.replace('https://', '');
      getSelection().selectAllChildren(share);
      setTimeout(() => (share.textContent = label), 6000);
      return;
    }
    share.textContent = 'link copiado ✓';
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
          <img src="${thumbSrc(it)}" alt="" width="64" height="64" decoding="async">
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
  return `<img class="game__part" src="${p.src}" style="${style}" alt="" decoding="async">`;
}

// Si una parte tiene `with: { [idDeOtraPrenda]: {...} }`, ese calce reemplaza al normal
// cuando esa otra prenda está puesta (p. ej. la correa sobre el pantalón de cuero).
export function resolvePart(p, wornIds) {
  const id = p.with && Object.keys(p.with).find((k) => wornIds.includes(k));
  return id ? { ...p, ...p.with[id] } : p;
}

// Descarga en segundo plano las prendas, para que al hacer clic aparezcan al instante.
function preloadWornImages() {
  const run = () => ITEMS.flatMap((i) => i.parts).forEach((p) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = p.src;
  });
  if (document.readyState === 'complete') setTimeout(run, 0);
  else addEventListener('load', run, { once: true });
}

function renderStage(el) {
  const base = `<img class="game__layer" src="${BASE.src}" alt="${BASE.name}" fetchpriority="high">
    <span class="game__signature" aria-hidden="true">maya endo</span>`;
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
