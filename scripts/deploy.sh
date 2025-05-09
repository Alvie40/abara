#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"
ARCHIVE="deploy_$(date +%s).tar.gz"
SSH_OPTS="-tt -o ConnectTimeout=15 -o ConnectionAttempts=3"

echo "📦 Criando pacote local: $ARCHIVE"
tar --exclude=".git" \
    --exclude="node_modules" \
    --exclude=".env.local" \
    --exclude="static" \
    --exclude="frontend/dist" \
    --exclude="frontend-next/" \
    --exclude="screenshots/" \
    --exclude=".DS_Store" \
    --exclude=".aider*" \
    --exclude="path/" \
    --exclude="$ARCHIVE" \
    -czf "$ARCHIVE" .

echo "📤 Enviando para o Omen via SCP..."
scp "$ARCHIVE" "$OMEN_HOST:/tmp/"

echo "📂 Extraindo no Omen e reiniciando containers..."
ssh $SSH_OPTS "$OMEN_HOST" bash << EOF
set -e
mkdir -p "$OMEN_PATH"
tar -xzf /tmp/$ARCHIVE -C "$OMEN_PATH"
rm /tmp/$ARCHIVE
cd "$OMEN_PATH"
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# ✅ Garante que o Docker esteja ativo
sudo systemctl start docker

# ✅ Verifica Ollama e modelo
if ! command -v ollama >/dev/null 2>&1; then
  echo "⚙️ Instalando Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
  sudo systemctl enable --now ollama
else
  echo "✅ Ollama já instalado"
  if ! systemctl is-active --quiet ollama; then
    echo "🔄 Iniciando o serviço Ollama..."
    sudo systemctl start ollama
    sleep 3
  else
    echo "✅ Serviço Ollama já está em execução"
  fi
fi

if ! ollama list | grep -q 'llama3:8b'; then
  echo "⬇️ Baixando modelo llama3:8b..."
  ollama pull llama3:8b
else
  echo "✅ Modelo llama3:8b já está disponível"
fi

docker compose down
docker compose build --no-cache
docker compose up -d
EOF

echo "✅ Deploy finalizado com sucesso!"
