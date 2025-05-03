FROM ollama/ollama:latest

# Install Python for MCP server and curl for healthcheck
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install aider and other dependencies
RUN pip3 install aider-chat

# Pull CodeLlama model
RUN ollama pull codellama:13b-instruct

WORKDIR /workspace

# Copy MCP server code and startup script
COPY . .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 11434

CMD ["./start.sh"]