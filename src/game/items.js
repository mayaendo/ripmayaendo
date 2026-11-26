// Catálogo de prendas del dress-up.
// Las prendas son ilustraciones sueltas; cada "part" se posiciona sobre el lienzo
// del maniquí (1086x1448 px) con: cx (centro x), top (y superior), w (ancho)
// y opcionalmente h (alto; si falta, se respeta la proporción de la imagen).
// Las capas se dibujan en el orden de LAYERS (de atrás hacia adelante).
// Solo se puede llevar una prenda por capa.

export const BASE = { name: 'Muñeca', src: '/game/body.webp', width: 1086, height: 1448 };

// 'tank' = VVDs (van debajo); 'top' = camisas/blusas (van encima, se pueden combinar).
export const LAYERS = ['shoes', 'bottom', 'tank', 'top', 'belt', 'necklace'];

const I = '/game/items/';
const pair = (name, l, r) => [
  { src: `${I}shoes-${name}-l.webp`, ...l },
  { src: `${I}shoes-${name}-r.webp`, ...r },
];

export const ITEMS = [
  // VVDs
  { id: 'top-cream', layer: 'tank', name: 'Top crema', parts: [{ src: `${I}top-cream.webp`, cx: 543, top: 328, w: 222 }] },
  { id: 'top-pink', layer: 'tank', name: 'Top rosado', parts: [{ src: `${I}top-pink.webp`, cx: 543, top: 326, w: 222 }] },
  { id: 'top-doer', layer: 'tank', name: 'Top amarillo DOER', parts: [{ src: `${I}top-doer.webp`, cx: 543, top: 322, w: 232 }] },

  // Camisas y blusas
  { id: 'top-maroon', layer: 'top', name: 'Blusa guinda', parts: [{ src: `${I}top-maroon.webp`, cx: 543, top: 318, w: 330 }] },
  { id: 'shirt-orange', layer: 'top', name: 'Camisa naranja', thumb: `${I}shirt-orange.webp`, parts: [{ src: `${I}shirt-orange-worn.webp`, cx: 543, top: 288, w: 432 }] },

  // Pantalones
  { id: 'pants-leather', layer: 'bottom', name: 'Pantalón de cuero', parts: [{ src: `${I}pants-leather.webp`, cx: 543, top: 595, w: 440, h: 755 }] },
  { id: 'pants-pinstripe', layer: 'bottom', name: 'Pantalón a rayas', parts: [{ src: `${I}pants-pinstripe.webp`, cx: 543, top: 595, w: 345, h: 765 }] },
  { id: 'pants-pink', layer: 'bottom', name: 'Pantalón rosado', parts: [{ src: `${I}pants-pink.webp`, cx: 543, top: 595, w: 450, h: 745 }] },

  // Zapatos
  { id: 'shoes-sneakers', layer: 'shoes', name: 'Zapatillas', thumb: `${I}shoes-sneakers.webp`,
    parts: pair('sneakers', { cx: 424, top: 1311, w: 172 }, { cx: 664, top: 1311, w: 172 }) },
  { id: 'shoes-boots', layer: 'shoes', name: 'Zapatos negros', thumb: `${I}shoes-boots.webp`,
    parts: pair('boots', { cx: 428, top: 1268, w: 126 }, { cx: 658, top: 1268, w: 126 }) },
  { id: 'shoes-oxford', layer: 'shoes', name: 'Zapatos con costura amarilla', thumb: `${I}shoes-oxford.webp`,
    parts: pair('oxford', { cx: 428, top: 1283, w: 140 }, { cx: 660, top: 1283, w: 140 }) },

  // Accesorios
  { id: 'belt-studs', layer: 'belt', name: 'Correa con tachas', thumb: `${I}belt-studs.webp`, parts: [{ src: `${I}belt-studs-worn.webp`, cx: 543, top: 614, w: 236 }] },
  { id: 'necklace-spiral', layer: 'necklace', name: 'Collar espiral', parts: [{ src: `${I}necklace-spiral.webp`, cx: 545, top: 300, w: 110 }] },
  { id: 'choker', layer: 'necklace', name: 'Choker cobrizo', thumb: `${I}choker.webp`, parts: [{ src: `${I}choker-worn.webp`, cx: 543, top: 289, w: 86 }] },
];
