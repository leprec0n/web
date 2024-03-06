FROM nginx:1.25.4
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY /nginx /etc/nginx/templates
EXPOSE 80