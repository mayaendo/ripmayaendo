# rip-mayaendo.com

Micrositio de marketing de mayaendo (sitio principal: mayaendo.com). Página única: título "vísteme por última vez" + la muñeca del dress-up, fondo blanco.
- No agregar textos que la usuaria no haya dado.

## Stack
- Vite + JS vanilla (sin framework). `npm run dev` → http://localhost:5173, `npm run build` → `dist/` (estático, desplegable en cualquier hosting).
- Idioma del contenido: español.

## Estructura
- `index.html` — título + contenedor del juego.
- `src/style.css` — estilos; paleta en variables CSS de `:root`.
- `src/main.js` — entrada; monta el juego.
- `src/game/items.js` — catálogo de prendas y orden de capas (`LAYERS`).
- `src/game/game.js` — lógica del dress-up (estado por capa, clóset, escenario).
- `public/game/` — assets del juego. `body.png` es el maniquí (capa base fija, 1086x1448, pixel art).
- `scripts/remove-bg.mjs` — quita el fondo blanco de una ilustración: `node scripts/remove-bg.mjs <entrada> public/game/<id>.png`.

## Flujo para agregar prendas
Las prendas son ilustraciones sueltas (no del tamaño del maniquí); se ubican con coordenadas.
1. Limpiar y recortar: `node scripts/remove-bg.mjs <entrada> public/game/items/<id>.png`.
   Pares de zapatos: además `node scripts/split-pair.mjs <id>.png <id>-l.png <id>-r.png`.
2. Capas: 'tank' = VVDs (debajo), 'top' = camisas/blusas (encima); se combinan.
   Registrar en `ITEMS` (`src/game/items.js`) con capa y `parts: [{ src, cx, top, w, h? }]` en px del lienzo del maniquí.
   Referencias del maniquí: hombros y≈330, cintura y≈600, caderas x 411–676, muñeca izq. x≈345 y≈715, tobillos y≈1240, pies y≈1330–1410.
3. Revisar el calce: `node scripts/fit-sheet.mjs <salida.png> id1,id2+id3` genera una hoja con la muñeca vestida.
- Estilo pixel art: se renderiza con `image-rendering: pixelated`.

## Convenciones
- Mantenerlo simple y estático; nada de backend salvo que se pida.
- Mobile-first: el juego debe funcionar con el dedo.
