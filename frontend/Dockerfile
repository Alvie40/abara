FROM node:20-alpine

WORKDIR /app

# Increase Node memory limit and disable telemetry
ENV NODE_OPTIONS="--max-old-space-size=4096" \
    NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Update browserslist database and build
RUN npx update-browserslist-db@latest && \
    npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]