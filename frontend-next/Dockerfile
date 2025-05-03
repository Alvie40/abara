FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Copy only the necessary files from the build directory
COPY ./build/package.json ./
COPY ./build/.next ./.next
COPY ./build/public ./public
COPY ./build/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]