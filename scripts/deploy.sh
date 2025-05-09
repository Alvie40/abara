#!/bin/bash
set -e

echo "📦 Enviando código para o Omen via rsync..."
rsync -avz --delete -e ssh . omen:/home/alvaro/apps/5pso \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.env.local' \
  --exclude 'static' \
  --exclude 'frontend/dist'

echo "🔄 Reiniciando containers no Omen..."
ssh omen << 'EOF'
cd /home/alvaro/apps/5pso
docker compose down
docker compose up --build -d
EOF

echo "✅ Deploy finalizado com sucesso!"
