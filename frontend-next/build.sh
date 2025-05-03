#!/bin/bash

# Create build directory if it doesn't exist
mkdir -p build

# Build the application using Dockerfile.build
docker build -t frontend-builder -f Dockerfile.build .

# Create a temporary container from the builder image
docker create --name frontend-builder-container frontend-builder

# Copy build artifacts from the builder container to the local build directory
docker cp frontend-builder-container:/app/package.json ./build/
docker cp frontend-builder-container:/app/.next ./build/
docker cp frontend-builder-container:/app/public ./build/
docker cp frontend-builder-container:/app/node_modules ./build/

# Remove the temporary container
docker rm frontend-builder-container

# Build the final image
docker build -t frontend .