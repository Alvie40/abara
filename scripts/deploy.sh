#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"
SSH_OPTS="-tt -o ConnectTimeout=15 -o ConnectionAttempts=3"

TAR_NAME="/tmp/deploy_$(date +%s).tar.gz"

echo "📦 Criando pacote local: $(basename "$TAR_NAME")"
# Evita incluir arquivos desnecessários e metadados do macOS
COPYFILE_DISABLE=1 tar \
  --exclude='.git' \
  --exclude='.env.local' \
  --exclude='node_modules' \
  --exclude='static' \
  --exclude='frontend/dist' \
  --exclude='frontend-next/' \
  --exclude='screenshots/' \
  --exclude='path/' \
  --exclude='*.DS_Store' \
  --exclude='.aider*' \
  --exclude='Here is the updated Dockerfile' \
  --exclude='*.log' \
  -czf "$TAR_NAME" .

echo "📤 Enviando para o Omen via SCP..."
scp "$TAR_NAME" "$OMEN_HOST:/tmp/"

echo "📂 Extraindo no Omen e reiniciando containers..."
ssh $SSH_OPTS "$OMEN_HOST" << EOF
set -e
mkdir -p "$OMEN_PATH"
tar -xzf /tmp/$(basename "$TAR_NAME") -C "$OMEN_PATH"
rm /tmp/$(basename "$TAR_NAME")
cd "$OMEN_PATH"
export DOCKER_DEFAULT_PLATFORM=linux/amd64
sudo systemctl start docker
docker compose down
docker compose build --no-cache
docker compose up -d
EOF

echo "✅ Deploy finalizado com sucesso!"
