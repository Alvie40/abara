FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/static.headers /etc/nginx/security.d/headers.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
