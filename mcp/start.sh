#!/bin/bash

# Importar funções de logging
source /workspace/scripts/log_helper.sh

# Função para verificar se o processo Ollama está rodando
check_ollama() {
    pgrep ollama >/dev/null
    return $?
}

# Função para matar processo Ollama existente
kill_ollama() {
    log_warning "Tentando matar processo Ollama existente..."
    pkill ollama
    sleep 2
}

# Função para iniciar Ollama
start_ollama() {
    log_info "Iniciando Ollama..."
    
    # Se já estiver rodando, mata o processo
    if check_ollama; then
        kill_ollama
    fi
    
    # Inicia o Ollama em background
    ollama serve &
    
    # Aguarda inicialização
    local max_attempts=30
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:11434/api/health >/dev/null; then
            log_success "Ollama iniciado com sucesso"
            return 0
        fi
        log_info "Aguardando Ollama iniciar (tentativa $attempt de $max_attempts)..."
        sleep 2
        ((attempt++))
    done
    
    log_error "Falha ao iniciar Ollama após $max_attempts tentativas"
    return 1
}

# Função para baixar modelo
download_model() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Tentando baixar modelo codellama (tentativa $attempt de $max_attempts)..."
        if ollama pull codellama:13b-instruct; then
            log_success "Modelo baixado com sucesso"
            return 0
        fi
        log_warning "Falha na tentativa $attempt"
        ((attempt++))
        sleep 5
    done
    
    log_error "Não foi possível baixar o modelo após $max_attempts tentativas"
    return 1
}

# Função principal
main() {
    log_info "Iniciando serviço MCP..."
    
    # Inicia Ollama
    if ! start_ollama; then
        log_error "Falha ao iniciar Ollama. Saindo..."
        exit 1
    fi
    
    # Baixa o modelo
    if ! download_model; then
        log_error "Falha ao baixar modelo. Saindo..."
        exit 1
    fi
    
    # Mantém o container rodando e monitora o Ollama
    while true; do
        if ! check_ollama; then
            log_error "Ollama parou de responder. Tentando reiniciar..."
            if ! start_ollama; then
                log_error "Falha ao reiniciar Ollama"
                exit 1
            fi
        fi
        sleep 30
    done
}

# Executa função principal com logging
main "$@" 2>&1 | tee -a /workspace/logs/mcp.log
