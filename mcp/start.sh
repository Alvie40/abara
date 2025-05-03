#!/bin/bash

# Inicia o servidor Ollama em segundo plano
echo "🚀 Iniciando Ollama..."
ollama serve &

# Aguarda Ollama estar pronto
echo "⏳ Aguardando Ollama iniciar..."
until curl -s http://localhost:11434 > /dev/null; do
    sleep 2
done

# Faz o pull do modelo se ainda não estiver disponível
echo "⬇️  Fazendo pull do modelo codellama:13b-instruct..."
ollama pull codellama:13b-instruct

# Container permanece vivo para uso como LLM backend
echo "✅ Ollama pronto e modelo carregado! Mantendo container ativo..."
tail -f /dev/null
