#!/bin/bash
set -e

OMEN_HOST="alvaro@192.168.86.76"
OMEN_PATH="/home/alvaro/apps/5pso"
SSH_OPTS="-o ConnectTimeout=15 -o ConnectionAttempts=3"
ARCHIVE="deploy_$(date +%s).tar.gz"

echo "📦 Criando pacote local: $ARCHIVE"
tar --exclude-vcs \
    --exclude='node_modules' \
    --exclude='frontend/dist' \
    --exclude='static' \
    --exclude='*.DS_Store' \
    --exclude='.aider*' \
    --exclude='frontend-next/' \
    --exclude='path/' \
    --exclude='screenshots/' \
    --exclude='*.log' \
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

# ⚙️ Verifica se Ollama está instalado
if ! command -v ollama >/dev/null 2>&1; then
  echo "⚙️ Instalando Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
  sudo systemctl enable --now ollama
else
  echo "✅ Ollama já instalado"
fi

# 🔍 Verifica se o modelo já está disponível
if ! ollama list | grep -q 'llama3:8b'; then
  echo "⬇️ Baixando modelo llama3:8b..."
  ollama pull llama3:8b
else
  echo "✅ Modelo llama3:8b já está disponível"
fi

export DOCKER_DEFAULT_PLATFORM=linux/amd64
sudo systemctl start docker
docker compose down
docker compose build --no-cache
docker compose up -d
EOF

echo "✅ Deploy finalizado com sucesso!"
