#!/bin/bash

# Start Ollama server in the background
ollama serve &

# Wait for Ollama to start
sleep 5

# Pull the model if it's not already present
ollama pull codellama:13b-instruct

# Keep the container running
tail -f /dev/null