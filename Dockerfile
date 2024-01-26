FROM nginx:1.21.3-alpine
RUN mkdir /app
COPY dist /app
COPY frontend_nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]