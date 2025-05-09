#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"

echo "📦 Enviando código para o Omen via rsync..."
rsync -avz --delete -e ssh . "$OMEN_HOST:$OMEN_PATH" \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.env.local' \
  --exclude 'static' \
  --exclude 'frontend/dist'

echo "🔄 Reiniciando containers no Omen..."
ssh "$OMEN_HOST" << EOF
sudo systemctl start docker
cd $OMEN_PATH
docker compose down
docker compose up --build -d
EOF

echo "✅ Deploy finalizado com sucesso!"
