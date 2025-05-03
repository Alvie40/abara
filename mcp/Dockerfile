FROM ollama/ollama:latest

# Instala Python, pip e curl
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instala aider
RUN pip3 install aider-chat

# Define diretório de trabalho
WORKDIR /workspace

# Copia código do MCP e script de inicialização
COPY . .
COPY start.sh .
RUN chmod +x start.sh

# Exponha a porta padrão do Ollama
EXPOSE 11434

# Roda o script de inicialização
CMD ["./start.sh"]
