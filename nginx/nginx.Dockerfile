FROM nginx:latest

# Remove the default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx.conf (optional) use in entrypoint.sh for change sme data inside
COPY nginx.template.conf /etc/nginx/nginx.template.conf

# Copy custom vhosts (reverse proxy or static sites)
COPY conf.d/ /etc/nginx/conf.d/

# Copy SSL certs directly into the image
COPY ssl/ /etc/nginx/ssl/

# Copy static files (optional)
COPY html/ /usr/share/nginx/html/

# EXPOSE 80 443

# #use in  nginx/conf.d/default.conf ssl_session_ticket_key and ssl_ticket_key
# RUN openssl rand 80 > /etc/nginx/ssl/ticket.key

# # read and write permissions for owner only, and removes all permissions for group/others.
# RUN chmod 600 /etc/nginx/ssl/ticket.key

COPY entrypoint.sh /etc/nginx/entrypoint.sh
RUN chmod +x /etc/nginx/entrypoint.sh
RUN sed -i 's/\r//g' /etc/nginx/entrypoint.sh
CMD ["/etc/nginx/entrypoint.sh"]
# CMD ["nginx", "-g", "daemon off;"] RUN IN entrypoint.sh 
