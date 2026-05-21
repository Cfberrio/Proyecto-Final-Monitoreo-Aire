# AirWatch BQ — Frontend

Dashboard de calidad del aire para Barranquilla. React 19 + Vite + Tailwind, consumiendo la API FastAPI del backend (sensor Smart Citizen Kit + modelo XGBoost).

---

## TL;DR — Cómo correrlo

**Tienes dos opciones.** Solo elige UNA.

### ⭐ Opción 1 — Docker (no instala nada en tu máquina)

```bash
cd frontend
docker compose up --build
```

Abre **http://localhost:5173**. Listo. Backend debe estar corriendo en `localhost:8000`.

### Opción 2 — Node nativo (para desarrollar con HMR)

```bash
cd frontend
npm ci          # instala todas las dependencias bit-perfect
npm run dev     # dev server con hot reload en http://localhost:5173
```

---

## Qué tienes que tener instalado

Solo necesitas **lo de la opción que vayas a usar**. No las dos.

| Opción | Instalar |
|---|---|
| **Docker** | [Docker Desktop](https://www.docker.com/products/docker-desktop) o Docker Engine 20+ |
| **Node nativo** | [Node.js 20+](https://nodejs.org/) (trae `npm 10+` incluido) |

Comprobar versiones:

```bash
docker --version    # 20+
node --version      # v20+
npm --version       # 10+
```

> **Nota sobre `requirements.txt`:** este es un proyecto JavaScript, no Python.
> El archivo que declara TODAS las dependencias es **`package.json`**, y el
> equivalente exacto a `pip install -r requirements.txt` es **`npm ci`**.
> `npm ci` lee `package-lock.json` e instala las versiones exactas — idéntico
> en cualquier máquina. El archivo [`requirements.txt`](./requirements.txt)
> que dejé en el repo es **documentación** del entorno, no es ejecutable.

---

## Configuración (`.env`)

Copia `.env.example` a `.env`. Variables disponibles:

| Variable | Default | Para qué |
|---|---|---|
| `VITE_API_BASE_URL` | vacío | Vacío = usa proxy de Vite/nginx (sin CORS). Si quieres apuntar a un host externo, pon la URL completa. |
| `VITE_POLLING_INTERVAL_MS` | `60000` | Cada cuánto refresca el sensor (ms). |
| `VITE_USE_MSW` | `false` | Si es `true`, mockea TODOS los endpoints en el navegador (demo offline sin backend). |
| `VITE_MSW_FAIL_RATE` | `0` | Con MSW activo, fracción 0–1 de peticiones que fallan al azar. |

---

## Cambiar la URL del backend en Docker

Por defecto el contenedor asume backend en la máquina host (`http://host.docker.internal:8000`). Para apuntar a otro lado:

```bash
# Backend en otro contenedor llamado "backend"
BACKEND_URL=http://backend:8000 docker compose up

# Backend en Render
BACKEND_URL=https://airwatch-bq-backend.onrender.com docker compose up
```

---

## Scripts npm

```bash
npm run dev       # dev server con HMR
npm run build     # build de producción → dist/
npm run preview   # sirve el build local
npm run lint      # eslint
npm test          # vitest (42 tests)
npm run test:ui   # vitest UI interactivo
```

---

## Lista de dependencias (declarativa)

Lo que sigue es solo referencia rápida. La fuente de verdad es `package.json` + `package-lock.json`. Versiones más detalladas en [`requirements.txt`](./requirements.txt).

### Runtime (van al bundle)

| Paquete | Para qué |
|---|---|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Navegación SPA (Dashboard, Predicciones) |
| `@tanstack/react-query` | Server state, caché, polling automático |
| `axios` | Cliente HTTP |
| `recharts` | Gráficas de serie de tiempo |
| `framer-motion` | Animaciones |
| `lucide-react` | Íconos SVG |
| `date-fns` | Formateo de fechas en español |
| `clsx` | Clases CSS condicionales |
| `@fontsource-variable/inter` | Tipografía Inter |

### Desarrollo (no van al bundle)

| Paquete | Para qué |
|---|---|
| `vite`, `@vitejs/plugin-react` | Bundler + dev server |
| `tailwindcss`, `postcss`, `autoprefixer` | Estilos utilitarios |
| `vitest`, `@vitest/ui` | Test runner |
| `@testing-library/*` | Renderizar y simular interacción en tests |
| `jsdom`, `whatwg-fetch` | DOM virtual + fetch para tests |
| `msw` | Mock service worker (demo offline + tests) |
| `eslint`, `eslint-plugin-*` | Linter |

---

## Endpoints que consume del backend

| Método | Path | Para qué |
|---|---|---|
| `GET`  | `/health` | Liveness |
| `GET`  | `/api/v1/status` | Estado del sistema |
| `GET`  | `/api/v1/sensor/current` | Última lectura del SCK |
| `GET`  | `/api/v1/sensor/historical/{sensor_id}` | Serie de tiempo |
| `GET`  | `/api/v1/sensor/sensors` | Lista de sensores |
| `POST` | `/api/v1/predictions/current` | Predicción con lectura en vivo |
| `POST` | `/api/v1/predictions/manual` | Predicción con valores manuales |
| `GET`  | `/api/v1/predictions/info` | Metadata del modelo XGBoost |

Si el sensor físico no ha publicado recientemente, `/predictions/current` devuelve **502** — la UI lo maneja como estado informativo y propone la predicción manual.

---

## Estructura

```
frontend/
├── Dockerfile             # multi-stage build con nginx
├── docker-compose.yml     # un comando: `docker compose up`
├── nginx.conf.template    # SPA fallback + proxy /api → BACKEND_URL
├── docker-entrypoint.sh   # envsubst de BACKEND_URL al arrancar
├── .dockerignore
├── package.json           # ⭐ fuente de verdad de dependencias
├── package-lock.json      # versiones exactas (reproducible)
├── requirements.txt       # documentación del entorno (no ejecutable)
├── vite.config.js
├── .env / .env.example
└── src/
    ├── api/               # axios + funciones por recurso
    ├── components/        # UI: dashboard, predictions, layout, ui
    ├── constants/         # SENSOR_CONFIG, AQI_LEVELS, recommendations
    ├── hooks/             # wrappers de React Query
    ├── mocks/             # handlers MSW para modo offline
    ├── pages/             # Dashboard, Predictions
    ├── styles/            # Tailwind + tokens
    └── utils/             # aqi, deviceStatus, formatters, validators
```

---

## Despliegue

| Plataforma | Build command | Output |
|---|---|---|
| **Docker** | `docker compose up -d` | Listo |
| **Vercel** | `npm ci && npm run build` | `dist/` |
| **Netlify** | `npm ci && npm run build` | `dist/` |
| **Render Static** | `npm ci && npm run build` | `dist/` |

En despliegues sin Docker, configura `VITE_API_BASE_URL` apuntando a la URL pública del backend antes del build.
