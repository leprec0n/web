FROM openresty/openresty:1.25.3.1-2-alpine-fat

# Remove default html
RUN rm -rf /usr/local/openresty/nginx/html

# Copy conf files
COPY nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY nginx/nginx.conf.template /etc/nginx/conf.d/server.conf.template
COPY nginx/set_variables.conf /etc/nginx/conf.d/set_variables.conf
COPY nginx/lua/authorise.lua /etc/nginx/authorise.lua

# Entrypoint script
COPY entrypoint.sh /etc/nginx/entrypoint.sh

# Install jwt decoder
RUN opm get SkyLothar/lua-resty-jwt

ENTRYPOINT ["/etc/nginx/entrypoint.sh"]

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
