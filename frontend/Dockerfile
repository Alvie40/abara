FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096" \
    VITE_API_URL=http://localhost:8080/api

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy NGINX configuration and security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY static.headers /etc/nginx/security.d/headers.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]