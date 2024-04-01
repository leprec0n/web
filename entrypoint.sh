#!/bin/bash
set -e

# Replace ENV placeholders with values
envsubst < /etc/nginx/conf.d/server.conf.template > /etc/nginx/conf.d/server.conf
envsubst < /usr/local/openresty/nginx/html/js/auth0.template.js > /usr/local/openresty/nginx/html/js/auth0.js

# In order for NGINX to run from docker file
exec "$@"