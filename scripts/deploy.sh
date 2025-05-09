# ✅ Verifica se o Ollama está instalado
if ! command -v ollama >/dev/null 2>&1; then
  echo "⚙️ Instalando Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
  sudo systemctl enable --now ollama
else
  echo "✅ Ollama já instalado"

  # ✅ Verifica se o serviço está rodando, e inicia se necessário
  if ! systemctl is-active --quiet ollama; then
    echo "🔄 Iniciando o serviço Ollama..."
    sudo systemctl start ollama
    sleep 3
  else
    echo "✅ Serviço Ollama já está em execução"
  fi
fi

# ✅ Só faz pull se o modelo ainda não estiver presente
if ! ollama list | grep -q 'llama3:8b'; then
  echo "⬇️ Baixando modelo llama3:8b..."
  ollama pull llama3:8b
else
  echo "✅ Modelo llama3:8b já está disponível"
fi
