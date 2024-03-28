FROM openresty/openresty:1.25.3.1-2-alpine-fat

# Remove default html
RUN rm -rf /usr/local/openresty/nginx/html

# Copy conf files
COPY nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY nginx/nginx.conf.template /etc/nginx/conf.d/server.conf.template

# Entrypoint script
COPY entrypoint.sh /etc/nginx/entrypoint.sh
RUN chmod +x /etc/nginx/entrypoint.sh
ENTRYPOINT ["/etc/nginx/entrypoint.sh"]

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
