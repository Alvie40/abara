#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"
SSH_OPTS="-o ConnectTimeout=15 -o ConnectionAttempts=3"
TAR_NAME="deploy_$(date +%s).tar.gz"

echo "📦 Criando pacote local: $TAR_NAME"
tar --exclude='.git' \
    --exclude='.env.local' \
    --exclude='node_modules' \
    --exclude='static' \
    --exclude='frontend/dist' \
    --exclude='*.DS_Store' \
    --exclude='.aider*' \
    --exclude='frontend-next/' \
    --exclude='path/' \
    --exclude='screenshots/' \
    --exclude='*.log' \
    --exclude="$TAR_NAME" \
    -czf "$TAR_NAME" .

echo "📤 Enviando para o Omen via SCP..."
scp "$TAR_NAME" "$OMEN_HOST:/tmp/$TAR_NAME"

echo "📂 Extraindo no Omen e reiniciando containers..."
ssh $SSH_OPTS "$OMEN_HOST" << EOF
set -e
mkdir -p "$OMEN_PATH"
tar -xzf /tmp/$TAR_NAME -C "$OMEN_PATH"
rm /tmp/$TAR_NAME
cd "$OMEN_PATH"
# Exporta apenas se for Apple Silicon
ARCH=\$(uname -m)
if [ "\$ARCH" = "arm64" ] || [ "\$ARCH" = "aarch64" ]; then
  export DOCKER_DEFAULT_PLATFORM=linux/amd64
fi

sudo systemctl start docker
docker compose down
docker compose build --no-cache
docker compose up -d
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
EOF

echo "✅ Deploy finalizado com sucesso!"
rm "$TAR_NAME"
