#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"
ARCHIVE_NAME="deploy_$(date +%s).tar.gz"
EXCLUDES=(
  --exclude='.git'
  --exclude='.env.local'
  --exclude='node_modules'
  --exclude='static'
  --exclude='frontend/dist'
  --exclude='*.DS_Store'
  --exclude='.aider*'
  --exclude='frontend-next/'
  --exclude='path/'
  --exclude='Here is the updated Dockerfile'
  --exclude='screenshots/'
  --exclude='*.log'
)

echo "📦 Criando pacote local: $ARCHIVE_NAME"
tar czf "/tmp/$ARCHIVE_NAME" "${EXCLUDES[@]}" .

echo "📤 Enviando para o Omen via SCP..."
scp "/tmp/$ARCHIVE_NAME" "$OMEN_HOST:/tmp/$ARCHIVE_NAME"

echo "📂 Extraindo no Omen e reiniciando containers..."
ssh "$OMEN_HOST" << EOF
sudo systemctl start docker
rm -rf "$OMEN_PATH"
mkdir -p "$OMEN_PATH"
tar xzf "/tmp/$ARCHIVE_NAME" -C "$OMEN_PATH"
rm "/tmp/$ARCHIVE_NAME"
cd "$OMEN_PATH"
docker compose down
docker compose up --build -d
EOF

echo "✅ Deploy finalizado com sucesso!"
