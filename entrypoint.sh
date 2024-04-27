#!/bin/bash
set -e

# Replace ENV placeholders with values
envsubst < /etc/nginx/conf.d/server.conf.template > /etc/nginx/conf.d/server.conf '${ACCOUNT_HOST} ${API_KEY}'
envsubst < /usr/local/openresty/nginx/html/js/templates/client.template.js > /usr/local/openresty/nginx/html/js/auth/client.js

# In order for NGINX to run from docker file
exec "$@"