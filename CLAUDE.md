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
1. La ilustración debe tener el mismo lienzo y la misma pose que el maniquí (1086x1448) para que calce encima.
2. Pasarla por `scripts/remove-bg.mjs` → `public/game/`.
3. Registrarla en `ITEMS` (`src/game/items.js`) con su capa.
- Estilo pixel art: se renderiza con `image-rendering: pixelated`.

## Convenciones
- Mantenerlo simple y estático; nada de backend salvo que se pida.
- Mobile-first: el juego debe funcionar con el dedo.
