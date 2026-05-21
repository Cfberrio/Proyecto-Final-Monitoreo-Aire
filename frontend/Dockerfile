# syntax=docker/dockerfile:1.6

# ──────────────────────────────────────────────────────────────────
# Stage 1: build the Vite app
# ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps using lockfile for reproducibility
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .

# Build-time env: leave empty so the bundle uses relative /api paths,
# which nginx will then proxy to the backend at runtime.
ENV VITE_API_BASE_URL=""
ENV VITE_USE_MSW="false"
ENV VITE_POLLING_INTERVAL_MS="60000"

RUN npm run build

# ──────────────────────────────────────────────────────────────────
# Stage 2: serve via nginx with runtime-configurable backend URL
# ──────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# envsubst lives in gettext
RUN apk add --no-cache gettext curl

# Static bundle
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config template (BACKEND_URL substituted at container start)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint-airwatch.sh
RUN chmod +x /docker-entrypoint-airwatch.sh

# Default backend URL — override with -e BACKEND_URL=...
ENV BACKEND_URL="http://host.docker.internal:8000"

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1/ || exit 1

ENTRYPOINT ["/docker-entrypoint-airwatch.sh"]
CMD ["nginx", "-g", "daemon off;"]
