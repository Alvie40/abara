#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"
SSH_OPTS="-tt -o ConnectTimeout=15 -o ConnectionAttempts=3"

echo "📦 Enviando código para o Omen via rsync..."
rsync -avz --delete \
  --rsync-path="bash -c 'rsync'" \
  -e "ssh $SSH_OPTS" \
  . "$OMEN_HOST:$OMEN_PATH" \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude 'node_modules' \
  --exclude 'static' \
  --exclude 'frontend/dist' \
  --exclude '*.DS_Store' \
  --exclude '.aider*' \
  --exclude 'frontend-next/' \
  --exclude 'path/' \
  --exclude 'Here is the updated Dockerfile' \
  --exclude 'screenshots/' \
  --exclude '*.log'

echo "🔄 Reiniciando containers no Omen..."
ssh $SSH_OPTS "$OMEN_HOST" << EOF
sudo systemctl start docker
cd $OMEN_PATH
docker compose down
docker compose up --build -d
EOF

echo "✅ Deploy finalizado com sucesso!"
