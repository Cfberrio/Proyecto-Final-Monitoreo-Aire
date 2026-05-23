# syntax=docker/dockerfile:1.7
#
# AirWatch BQ — Frontend
# ----------------------
# Multi-stage build:
#   1. builder  → installs deps with `npm ci` and produces the Vite bundle
#   2. runtime  → serves the static bundle with nginx + proxies /api → backend
#
# Build:    docker build -t airwatch-bq-frontend .
# Run:      docker run --rm -p 5173:80 \
#             -e BACKEND_URL=http://host.docker.internal:8000 \
#             airwatch-bq-frontend
# Compose:  docker compose up --build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Builder
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the lockfiles first so the dependency layer is cached across builds.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts

# Copy the rest of the source.
COPY . .

# Build-time env: leave VITE_API_BASE_URL empty so the bundle uses relative
# /api paths. Nginx then proxies /api → ${BACKEND_URL} at runtime.
ENV VITE_API_BASE_URL="" \
    VITE_USE_MSW="false" \
    VITE_POLLING_INTERVAL_MS="60000" \
    NODE_ENV="production"

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Runtime (nginx)
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="airwatch-bq-frontend" \
      org.opencontainers.image.description="AirWatch BQ — air-quality dashboard for Barranquilla" \
      org.opencontainers.image.source="https://github.com/Cfberrio/Proyecto-Final-Monitoreo-Aire" \
      org.opencontainers.image.licenses="MIT"

# envsubst lives in gettext; wget ships in alpine and is enough for healthchecks.
RUN apk add --no-cache gettext

# Static bundle from the builder stage.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config template (BACKEND_URL is substituted at container start).
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint-airwatch.sh
RUN chmod +x /docker-entrypoint-airwatch.sh

# Default backend URL — override at run time with `-e BACKEND_URL=...`.
ENV BACKEND_URL="http://host.docker.internal:8000"

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1

ENTRYPOINT ["/docker-entrypoint-airwatch.sh"]
CMD ["nginx", "-g", "daemon off;"]
