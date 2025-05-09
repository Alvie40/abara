#!/bin/sh
echo "⚙️ Preloading LLaMA3:8b..."
docker compose exec ollama ollama run llama3:8b --help
