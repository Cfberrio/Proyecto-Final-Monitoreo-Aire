#!/bin/sh
# -----------------------------------------------------------------------------
# AirWatch BQ — Frontend container entrypoint.
#
# Renders the nginx config from a template, substituting ${BACKEND_URL} at
# container start so the same image can talk to any backend without rebuilding.
# -----------------------------------------------------------------------------
set -eu

: "${BACKEND_URL:?BACKEND_URL must be set (e.g. http://host.docker.internal:8000)}"

# Strip trailing slash so the proxy_pass concatenation stays clean.
BACKEND_URL="${BACKEND_URL%/}"
export BACKEND_URL

envsubst '${BACKEND_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "[airwatch] proxying /api → ${BACKEND_URL}"

exec "$@"
