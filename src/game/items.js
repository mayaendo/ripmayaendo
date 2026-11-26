// Catálogo de prendas del dress-up.
// Todas las ilustraciones comparten el lienzo del maniquí (1086x1448) para alinearse.
// Cada item: { id, name, layer, src }  — src apunta a /public/game/...
// Las capas se dibujan en el orden de LAYERS (de atrás hacia adelante).

export const BASE = { name: 'Maniquí', src: '/game/body.png', width: 1086, height: 1448 };

export const LAYERS = ['bottom', 'top', 'shoes', 'accessory', 'hair'];

export const ITEMS = [
  // { id: 'top-01', name: 'Polo negro', layer: 'top', src: '/game/top-01.png' },
];
