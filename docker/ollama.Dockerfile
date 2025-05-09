FROM ollama/ollama:0.6.7

# Etapas:
# 1. Inicia o servidor Ollama em segundo plano
# 2. Aguarda 5 segundos
# 3. Executa o pull do modelo desejado
# 4. Encerra o servidor

RUN ollama serve & \
    sleep 5 && \
    ollama pull llama3:8b && \
    echo "Parando o ollama..." && \
    pkill -9 -f "ollama serve"
