# rip-mayaendo.com

Micrositio de marketing de mayaendo (sitio principal: mayaendo.com). Concepto: "R.I.P. mayaendo" + un minijuego dress-up.

## Stack
- Vite + JS vanilla (sin framework). `npm run dev` → http://localhost:5173, `npm run build` → `dist/` (estático, desplegable en cualquier hosting).
- Idioma del contenido: español.

## Estructura
- `index.html` — landing (hero + sección `#juego` + footer).
- `src/style.css` — estilos; paleta en variables CSS de `:root`.
- `src/main.js` — entrada; monta el juego.
- `src/game/items.js` — catálogo de prendas y orden de capas (`LAYERS`).
- `src/game/game.js` — lógica del dress-up (estado por capa, clóset, escenario).
- `public/game/` — assets del juego (PNGs con fondo transparente, mismo lienzo para todas las capas para que se alineen).

## Convenciones
- Mantenerlo simple y estático; nada de backend salvo que se pida.
- Mobile-first: el juego debe funcionar con el dedo.
