#!/bin/sh
set -eu

# Strip trailing slash from BACKEND_URL so the proxy_pass concatenation is clean.
BACKEND_URL="${BACKEND_URL%/}"
export BACKEND_URL

# Render templates and place them in the nginx conf.d directory.
envsubst '${BACKEND_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "[airwatch] proxying /api → ${BACKEND_URL}"

exec "$@"
