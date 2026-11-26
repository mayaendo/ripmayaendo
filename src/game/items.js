// Catálogo de prendas del dress-up.
// Las prendas son ilustraciones sueltas; cada "part" se posiciona sobre el lienzo
// del maniquí (1086x1448 px) con: cx (centro x), top (y superior), w (ancho)
// y opcionalmente h (alto; si falta, se respeta la proporción de la imagen).
// Las capas se dibujan en el orden de LAYERS (de atrás hacia adelante).
// Solo se puede llevar una prenda por capa.

export const BASE = { name: 'Muñeca', src: '/game/body.png', width: 1086, height: 1448 };

// 'tank' = VVDs (van debajo); 'top' = camisas/blusas (van encima, se pueden combinar).
export const LAYERS = ['bottom', 'shoes', 'tank', 'top', 'belt', 'necklace', 'bracelet'];

const I = '/game/items/';
const pair = (name, l, r) => [
  { src: `${I}shoes-${name}-l.png`, ...l },
  { src: `${I}shoes-${name}-r.png`, ...r },
];

export const ITEMS = [
  // VVDs
  { id: 'top-cream', layer: 'tank', name: 'Top crema', parts: [{ src: `${I}top-cream.png`, cx: 543, top: 328, w: 222 }] },
  { id: 'top-pink', layer: 'tank', name: 'Top rosado', parts: [{ src: `${I}top-pink.png`, cx: 543, top: 326, w: 222 }] },
  { id: 'top-doer', layer: 'tank', name: 'Top amarillo DOER', parts: [{ src: `${I}top-doer.png`, cx: 543, top: 322, w: 232 }] },

  // Camisas y blusas
  { id: 'top-maroon', layer: 'top', name: 'Blusa guinda', parts: [{ src: `${I}top-maroon.png`, cx: 543, top: 318, w: 330 }] },
  { id: 'shirt-orange', layer: 'top', name: 'Camisa naranja', parts: [{ src: `${I}shirt-orange.png`, cx: 543, top: 300, w: 380 }] },

  // Pantalones
  { id: 'pants-leather', layer: 'bottom', name: 'Pantalón de cuero', parts: [{ src: `${I}pants-leather.png`, cx: 543, top: 595, w: 440, h: 815 }] },
  { id: 'pants-pinstripe', layer: 'bottom', name: 'Pantalón a rayas', parts: [{ src: `${I}pants-pinstripe.png`, cx: 543, top: 595, w: 345, h: 765 }] },
  { id: 'pants-pink', layer: 'bottom', name: 'Pantalón rosado', parts: [{ src: `${I}pants-pink.png`, cx: 543, top: 595, w: 450, h: 800 }] },

  // Zapatos
  { id: 'shoes-sneakers', layer: 'shoes', name: 'Zapatillas', thumb: `${I}shoes-sneakers.png`,
    parts: pair('sneakers', { cx: 420, top: 1330, w: 140 }, { cx: 668, top: 1330, w: 140 }) },
  { id: 'shoes-boots', layer: 'shoes', name: 'Zapatos negros', thumb: `${I}shoes-boots.png`,
    parts: pair('boots', { cx: 428, top: 1285, w: 112 }, { cx: 658, top: 1285, w: 112 }) },
  { id: 'shoes-oxford', layer: 'shoes', name: 'Zapatos con costura amarilla', thumb: `${I}shoes-oxford.png`,
    parts: pair('oxford', { cx: 428, top: 1298, w: 125 }, { cx: 660, top: 1298, w: 125 }) },

  // Accesorios
  { id: 'belt-studs', layer: 'belt', name: 'Correa con tachas', parts: [{ src: `${I}belt-studs.png`, cx: 543, top: 585, w: 300 }] },
  { id: 'necklace-spiral', layer: 'necklace', name: 'Collar espiral', parts: [{ src: `${I}necklace-spiral.png`, cx: 545, top: 300, w: 110 }] },
  { id: 'bracelet', layer: 'bracelet', name: 'Pulsera', parts: [{ src: `${I}bracelet.png`, cx: 345, top: 700, w: 62 }] },
];
