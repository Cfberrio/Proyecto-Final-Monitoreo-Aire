# AirWatch BQ — Frontend

> Dashboard de calidad del aire para Barranquilla. **React 19 + Vite + Tailwind**, consumiendo la API FastAPI del backend (sensor Smart Citizen Kit + modelo XGBoost).

[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## Índice

1. [¿Qué es esto?](#qué-es-esto)
2. [Arquitectura](#arquitectura)
3. [Quick start](#quick-start)
4. [Requisitos](#requisitos)
5. [Configuración (`.env`)](#configuración-env)
6. [Cómo se conecta al backend](#cómo-se-conecta-al-backend)
7. [Comandos npm](#comandos-npm)
8. [Estructura del proyecto](#estructura-del-proyecto)
9. [Endpoints del backend que consume](#endpoints-del-backend-que-consume)
10. [Dependencias](#dependencias)
11. [Build de producción y despliegue](#build-de-producción-y-despliegue)
12. [Modo demo sin backend (MSW)](#modo-demo-sin-backend-msw)
13. [Tests](#tests)
14. [Troubleshooting](#troubleshooting)
15. [Documentación adicional](#documentación-adicional)

---

## ¿Qué es esto?

AirWatch BQ es una **SPA (Single Page Application)** que muestra:

- **Dashboard**: índice AQI en vivo + 6 métricas del sensor SCK (PM2.5, PM10, CO₂, temperatura, humedad, ruido) con gráficas históricas.
- **Predicciones**: pronóstico de AQI usando el modelo XGBoost del backend, con dos modos (auto = lectura del sensor, manual = inputs del usuario) y recomendaciones de salud según el nivel.

Ver [`docs/PRODUCT.md`](docs/PRODUCT.md) y [`docs/DESIGN.md`](docs/DESIGN.md) para el contexto de producto y diseño.

---

## Arquitectura

```
┌────────────────────┐    HTTP    ┌────────────────────┐    HTTP   ┌───────────────────┐
│  Smart Citizen Kit │  ───────►  │  Backend FastAPI   │ ◄───────  │  Frontend (React) │
│  (sensor físico)   │            │  + XGBoost model   │           │  Vite SPA         │
└────────────────────┘            └────────────────────┘           └───────────────────┘
                                          ▲
                                          │  /api/v1/* (proxy nginx en prod)
                                          │  /api/v1/* (proxy Vite en dev)
                                          ▼
                                  ┌────────────────────┐
                                  │  Browser           │
                                  │  http://:5173      │
                                  └────────────────────┘
```

**El frontend nunca habla directo al backend desde el navegador.** Siempre pasa por un proxy local (Vite en dev, nginx en Docker), así no necesitas configurar CORS y la URL del backend se cambia sin rebuildear el bundle.

---

## Quick start

Dos formas. **Elige UNA.**

### ⭐ Opción 1 — Docker (no instala nada en tu máquina)

```bash
docker compose up --build
```

Abre **http://localhost:5173**. El contenedor proxea `/api/*` al backend en `http://host.docker.internal:8000` (tu máquina). Si tu backend está en otro lado:

```bash
BACKEND_URL=https://airwatch-bq-backend.onrender.com docker compose up --build
```

### Opción 2 — Node nativo (dev con HMR)

```bash
npm ci          # instala TODAS las dependencias exactas según package-lock.json
npm run dev     # arranca Vite con hot reload en http://localhost:5173
```

Asegúrate de que el backend esté en `http://localhost:8000` (o ajusta el proxy en [`vite.config.js`](vite.config.js)).

---

## Requisitos

Solo necesitas **lo de la opción que vayas a usar**.

| Opción | Software | Versión mínima |
|---|---|---|
| **Docker** | [Docker Desktop](https://www.docker.com/products/docker-desktop) o Docker Engine | `20+` |
| **Docker** | Docker Compose v2 (incluido en Docker Desktop) | `2.20+` |
| **Node nativo** | [Node.js](https://nodejs.org/) (recomendado LTS) | `>= 20.0.0` |
| **Node nativo** | npm (viene con Node) | `>= 10.0.0` |

Comprobar versiones:

```bash
docker --version            # Docker version 24.x …
docker compose version      # Docker Compose version v2.x
node --version              # v20.x.x
npm --version               # 10.x.x
```

---

## Configuración (`.env`)

### Por qué `.env` está vacío en `.env.example`

`VITE_API_BASE_URL=` **se deja vacío a propósito**. Cuando está vacío, el cliente HTTP (axios) emite peticiones a rutas **relativas** (`/api/v1/...`), que son interceptadas por:

- el **proxy de Vite** (en dev → `http://localhost:8000`), o
- **nginx** dentro del contenedor (en Docker → `${BACKEND_URL}`).

Solo necesitas poner una URL absoluta cuando despliegas el frontend en estático (Vercel, Netlify, Render Static) y NO hay proxy intermedio.

### Crear tu archivo `.env`

```bash
cp .env.example .env
```

`.env` **no se sube al repositorio** (está en `.gitignore`). Si necesitas distribuir valores entre el equipo, edita `.env.example`.

### Variables disponibles

| Variable | Default | Para qué sirve |
|---|---|---|
| `VITE_API_BASE_URL` | _(vacío)_ | URL base del backend. **Vacío** = usa proxy Vite/nginx (recomendado). Si lo pones, debe ser URL completa: `https://airwatch-bq-backend.onrender.com`. |
| `VITE_POLLING_INTERVAL_MS` | `60000` | Cada cuánto refresca `/sensor/current` (ms). |
| `VITE_USE_MSW` | `false` | Si es `true`, **mockea TODOS los endpoints en el navegador** (demo offline). |
| `VITE_MSW_FAIL_RATE` | `0` | Con MSW activo, fracción 0–1 de peticiones que fallan al azar (útil para probar estados de error). |

> **Importante:** las variables `VITE_*` son **públicas** — Vite las incluye en el bundle del navegador. **Nunca pongas secretos ahí** (API keys, tokens). Si el backend requiere autenticación, los tokens deben venir del usuario en runtime, no de `.env`.

---

## Cómo se conecta al backend

El **frontend es agnóstico de dónde corre el backend**. Hay tres escenarios típicos:

### Escenario A — Backend local, frontend local (dev)

```
Browser → Vite (5173) → proxy /api → http://localhost:8000 (backend)
```

- `.env`: `VITE_API_BASE_URL=` (vacío)
- Comando: `npm run dev`
- Configurado en [`vite.config.js`](vite.config.js#L9-L14).

### Escenario B — Backend local, frontend en Docker

```
Browser → nginx (5173) → proxy /api → http://host.docker.internal:8000 (host)
```

- Comando: `docker compose up`
- `host.docker.internal` resuelve a tu máquina gracias a [`docker-compose.yml`](docker-compose.yml) (extra_hosts).

### Escenario C — Backend en Render / host externo

```
Browser → nginx (5173) → proxy /api → https://airwatch-bq-backend.onrender.com
```

- Comando: `BACKEND_URL=https://airwatch-bq-backend.onrender.com docker compose up`
- O exporta `BACKEND_URL` en un `.env` local (compose lo lee automáticamente).

### Escenario D — Frontend desplegado en estático (Vercel/Netlify)

No hay proxy intermedio. El bundle debe conocer la URL del backend en tiempo de build:

```bash
VITE_API_BASE_URL=https://airwatch-bq-backend.onrender.com npm run build
```

El backend debe permitir CORS desde el dominio del frontend.

---

## Comandos npm

```bash
npm run dev         # dev server con HMR en http://localhost:5173
npm run build       # build de producción → dist/
npm run preview     # sirve el build local para verificarlo
npm run lint        # eslint sobre todo el proyecto
npm test            # vitest (run único, 42 tests)
npm run test:watch  # vitest en modo watch
npm run test:ui     # vitest UI interactiva
```

---

## Estructura del proyecto

```
.
├── Dockerfile               # multi-stage build: node:20-alpine → nginx:1.27-alpine
├── docker-compose.yml       # un solo servicio: `docker compose up`
├── docker-entrypoint.sh     # envsubst de BACKEND_URL al arrancar el contenedor
├── nginx.conf.template      # SPA fallback + proxy /api → ${BACKEND_URL} + healthz
├── .dockerignore            # qué NO se copia al contexto de build
├── .gitignore               # incluye .env y todo lo regenerable
├── .env.example             # plantilla de configuración (copiar a .env)
├── eslint.config.js
├── index.html               # entry HTML que Vite procesa
├── package.json             # ⭐ fuente de verdad de dependencias
├── package-lock.json        # versiones exactas (reproducible)
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js           # bundler + dev server + proxy /api → :8000
├── public/                  # assets estáticos servidos tal cual
│   ├── favicon.svg
│   ├── icons.svg
│   └── mockServiceWorker.js # service worker de MSW
├── src/
│   ├── App.jsx
│   ├── main.jsx             # entry React (ReactDOM.createRoot)
│   ├── api/                 # cliente axios + funciones por recurso
│   │   ├── client.js
│   │   ├── predictions.js
│   │   └── sensor.js
│   ├── components/
│   │   ├── dashboard/       # AQIGauge, MetricCard, RangeSelector, SensorChart, SensorGrid, StaleSensorNotice
│   │   ├── layout/          # Layout, Navbar
│   │   ├── predictions/     # AutoPredictionStatus, ManualInputForm, ModelInfoPanel, PredictionResult
│   │   └── ui/              # AnimatedNumber, Badge, ErrorBanner, GlassCard, LoadingSpinner, SkeletonCard, SolidCard, StatusDot
│   ├── constants/           # SENSOR_CONFIG, AQI_LEVELS, recomendaciones de salud
│   ├── hooks/               # useApiStatus, usePrediction, useSensorCurrent, useSensorHistorical
│   ├── mocks/               # handlers MSW para modo offline
│   ├── pages/               # Dashboard, Predictions
│   ├── styles/              # tokens.css + Tailwind base
│   ├── test/                # setup + msw-server + test-utils
│   └── utils/               # aqi, deviceStatus, formatters, validators
└── docs/
    ├── PRODUCT.md           # contexto de producto
    └── DESIGN.md            # principios de diseño
```

---

## Endpoints del backend que consume

| Método | Path | Para qué |
|---|---|---|
| `GET`  | `/health` | Liveness del backend |
| `GET`  | `/api/v1/status` | Estado del sistema (backend + sensor + modelo) |
| `GET`  | `/api/v1/sensor/current` | Última lectura del SCK |
| `GET`  | `/api/v1/sensor/historical/{sensor_id}` | Serie de tiempo de un sensor |
| `GET`  | `/api/v1/sensor/sensors` | Lista de sensores disponibles |
| `POST` | `/api/v1/predictions/current` | Predicción usando la lectura en vivo |
| `POST` | `/api/v1/predictions/manual` | Predicción con valores manuales |
| `GET`  | `/api/v1/predictions/info` | Metadata del modelo XGBoost (features, importancia) |

> **Sensor caído:** si el SCK no ha publicado recientemente, `/predictions/current` devuelve **502**. La UI lo trata como estado informativo y propone la **predicción manual**.

---

## Dependencias

La **fuente de verdad** es [`package.json`](package.json) + [`package-lock.json`](package-lock.json). Estos comandos son los únicos que necesitas:

```bash
npm ci            # instalación reproducible bit a bit (usa package-lock.json)
npm install <x>   # agregar una nueva dependencia
npm outdated      # ver qué está desactualizado
```

### Runtime (van al bundle)

| Paquete | Para qué |
|---|---|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Navegación SPA (Dashboard ↔ Predicciones) |
| `@tanstack/react-query` | Server state, caché, polling automático |
| `axios` | Cliente HTTP |
| `recharts` | Gráficas de serie de tiempo |
| `framer-motion` | Animaciones declarativas |
| `lucide-react` | Íconos SVG |
| `date-fns` | Formateo de fechas en español |
| `clsx` | Combinador condicional de clases CSS |
| `@fontsource-variable/inter` | Tipografía Inter Variable, sin CDN |

### Desarrollo (no van al bundle)

| Paquete | Para qué |
|---|---|
| `vite`, `@vitejs/plugin-react` | Bundler + dev server con HMR |
| `tailwindcss`, `postcss`, `autoprefixer` | Estilos utilitarios |
| `vitest`, `@vitest/ui` | Test runner moderno (compatible con Vite) |
| `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` | Renderizar y simular interacción |
| `jsdom`, `whatwg-fetch` | DOM virtual + polyfill fetch para tests |
| `msw` | Mock Service Worker (demo offline + mocks en tests) |
| `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` | Linter + reglas React |

---

## Build de producción y despliegue

### Build local

```bash
npm ci
npm run build      # genera ./dist/
npm run preview    # sirve dist/ localmente para verificar
```

### Despliegue por plataforma

| Plataforma | Build command | Output | Notas |
|---|---|---|---|
| **Docker** | `docker compose up -d --build` | imagen `airwatch-bq-frontend:latest` | El proxy se configura en runtime via `BACKEND_URL`. |
| **Vercel** | `npm ci && npm run build` | `dist/` | Setear `VITE_API_BASE_URL` en env vars del proyecto antes del build. |
| **Netlify** | `npm ci && npm run build` | `dist/` | Igual que Vercel. |
| **Render Static** | `npm ci && npm run build` | `dist/` | Igual. Asegurarse de habilitar SPA rewrites (`/* → /index.html`). |

En despliegues sin Docker, **configura `VITE_API_BASE_URL` apuntando a la URL pública del backend antes del build**, ya que las variables `VITE_*` se inlinen en tiempo de build.

---

## Modo demo sin backend (MSW)

Para mostrar el frontend sin tener el backend corriendo:

```bash
VITE_USE_MSW=true npm run dev
```

MSW (Mock Service Worker) intercepta `/api/*` desde el service worker y devuelve datos sintéticos generados en [`src/mocks/generators.js`](src/mocks/generators.js).

Para simular fallos aleatorios (probar UI de error):

```bash
VITE_USE_MSW=true VITE_MSW_FAIL_RATE=0.3 npm run dev
```

---

## Tests

```bash
npm test           # 42 tests, vitest
npm run test:ui    # UI interactiva en http://localhost:51204/__vitest__/
```

Cubre:

- **Utils** (`aqi`, `deviceStatus`, `formatters`, `validators`) → tests unitarios puros.
- **Componentes** (`AQIGauge`, `MetricCard`, `ManualInputForm`) → render + interacción con Testing Library.
- **Páginas** (`Dashboard`, `Predictions`) → tests de integración con MSW interceptando llamadas.

Setup en [`src/test/setup.js`](src/test/setup.js).

---

## Troubleshooting

<details>
<summary><strong>El frontend carga pero todo dice "Error de conexión"</strong></summary>

El backend no está respondiendo en la URL configurada. Comprueba:

1. ¿Está corriendo el backend? `curl http://localhost:8000/health`
2. En Docker: ¿`BACKEND_URL` apunta a algo real desde dentro del contenedor?
   ```bash
   docker compose exec frontend sh -c 'wget -qO- $BACKEND_URL/health'
   ```
3. ¿El backend permite las rutas `/api/v1/*`? Algunas configs solo exponen `/`.
</details>

<details>
<summary><strong>Cambié <code>.env</code> y los cambios no se aplican</strong></summary>

Vite lee `.env` **una sola vez al arrancar**. Reinicia `npm run dev` después de tocarlo.

Si estás en Docker: como las `VITE_*` se inlinen en build, **necesitas rebuildear**:
```bash
docker compose up --build
```
</details>

<details>
<summary><strong>El sensor no actualiza / dice "datos antiguos"</strong></summary>

El SCK puede tardar minutos en publicar. La UI muestra un banner informativo y deja usable la predicción manual. No es un bug del frontend.
</details>

<details>
<summary><strong>"Cannot find module" después de pull</strong></summary>

Alguien agregó/quitó deps. Reinstala limpio:
```bash
rm -rf node_modules package-lock.json && npm install
```
(o `npm ci` si solo cambió `package-lock.json`).
</details>

<details>
<summary><strong>El healthcheck del contenedor sigue en <em>starting</em></strong></summary>

`docker compose ps` debería pasar a `healthy` en ~10s. Si no:
```bash
docker compose logs frontend
docker compose exec frontend wget -qO- http://127.0.0.1/healthz
```
</details>

---

## Documentación adicional

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — qué problema resuelve, audiencia, alcance.
- [`docs/DESIGN.md`](docs/DESIGN.md) — principios visuales, tokens, anti-patrones.

---

## Licencia

MIT. Ver `LICENSE` (si existe en el repo).
