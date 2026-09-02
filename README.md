# Test de Estrés · HAR (Astro)

Landing con test de 11 preguntas, scoring y guardado en `localStorage`.

## Correr el proyecto

```bash
npm install
npm run dev      # desarrollo → http://localhost:4321
npm run build    # genera /dist listo para subir
npm run preview  # previsualizar el build
```

## Estructura

```
src/
├── config/quiz.js        ← TODO lo editable (preguntas, opciones, niveles, webhook)
├── scripts/quiz.js       ← lógica del test (no hace falta tocar)
├── styles/global.css     ← estilos
├── layouts/Layout.astro  ← <head> y estructura HTML
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   └── QuizForm.astro    ← markup del test + import del script
└── pages/index.astro     ← arma la página
```

## Qué editar (todo en `src/config/quiz.js`)

- **`QUESTIONS`** — las 11 preguntas (agregá o quitá, el resto se ajusta solo).
- **`OPTIONS`** — Nunca (0) · A veces (1) · Siempre (2).
- **`levelFor(score)`** — rangos de nivel. Hoy: 0–7 bajo · 8–15 moderado · 16–22 alto.
- **`LEVEL_COPY`** — el texto del resultado por nivel.
- **`WEBHOOK_URL`** — recibe el lead con `puntaje`, `nivel` y `respuestas`.
- **`REDIRECT_URL`** — redirección global post-envío (opcional).
- **`onResult({ score, nivel, lead })`** — acción por nivel. Devolvé `true` si redirigís.

## localStorage

Se guarda bajo la clave `har_test_estres`:

```json
{ "respuestas":[0,1,2,...], "puntaje":14, "nivel":"moderado",
  "nombre":"...", "email":"...", "telefono":"...", "actualizado":"..." }
```
