FROM openresty/openresty:1.25.3.1-2-alpine-fat

# Remove default html
RUN rm -rf /usr/local/openresty/nginx/html

# Copy files
COPY www/ /usr/local/openresty/nginx/html
COPY nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY nginx/nginx.conf.template /etc/nginx/conf.d/server.conf.template
COPY nginx/lua/ /etc/nginx/
COPY nginx/mime.types /usr/local/openresty/nginx/conf/mime.types

# Entrypoint script
COPY entrypoint.sh /etc/nginx/entrypoint.sh

# Install dependencies for jwt authorisation
RUN apk update && apk upgrade && apk add pkgconfig openssl-dev
RUN opm get SkyLothar/lua-resty-jwt
RUN luarocks install openssl
RUN luarocks install lua-resty-rsa
ENTRYPOINT ["/etc/nginx/entrypoint.sh"]

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
