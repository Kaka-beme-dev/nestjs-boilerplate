#!/bin/sh

echo "Starting entrypoint script..."
echo "Substituting environment variables in nginx.template.conf"
echo "Substituting APP_PORT=$APP_PORT  APPPORT2=${APP_PORT}"
# Substitute the environment variables and generate nginx.conf  $SSL_CERT_PATH $SSL_KEY_PATH
# envsubst '$APP_PORT' < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf
cp /etc/nginx/nginx.template.conf /tmp/nginx_tmp.conf && \
envsubst '${APP_PORT}' < /tmp/nginx_tmp.conf > /etc/nginx/nginx.conf && \
rm /tmp/nginx_tmp.conf

# Start nginx
echo "=====Starting nginx with generated config:"
cat /etc/nginx/nginx.conf

nginx -g 'daemon off;'
