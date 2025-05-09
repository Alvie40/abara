#!/usr/bin/env bash
set -euo pipefail

# Detecta arquitetura da máquina
ARCH=$(uname -m)
PLATFORM="linux/amd64"
if [[ "$ARCH" == "arm64" || "$ARCH" == "aarch64" ]]; then
  PLATFORM="linux/arm64"
fi

echo "🛠️ Detected architecture: $ARCH → Using platform: $PLATFORM"

# Cria builder se não existir
if ! docker buildx inspect multi-builder &>/dev/null; then
  echo "📦 Creating buildx builder 'multi-builder'..."
  docker buildx create --name multi-builder --use
  docker buildx inspect --bootstrap
fi

# Build multiplataforma (backend)
echo "🔨 Building backend for $PLATFORM..."
docker buildx build \
  --platform "$PLATFORM" \
  -t abara-backend:latest \
  -f backend/Dockerfile \
  backend/ \
  --load

# Sobe a stack
echo "🚀 Starting docker-compose..."
docker compose up --build
