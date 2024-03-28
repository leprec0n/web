#!/bin/bash
set -e

# Replace ENV placeholders with values
envsubst < /etc/nginx/conf.d/server.conf.template > /etc/nginx/conf.d/server.conf

# In order for NGINX to run from docker file
exec "$@"