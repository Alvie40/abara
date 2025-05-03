FROM python:3.12-slim

WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala Poetry
RUN pip install poetry

# Copia código e arquivos do projeto logo no início
COPY . .

# Garante que 'app' é um pacote Python
RUN mkdir -p app && touch app/__init__.py

# Configura e instala dependências com Poetry
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

# Cria diretório de uploads
RUN mkdir -p uploads && chmod 777 uploads

# Script de inicialização
RUN echo '#!/bin/sh\n\
while ! pg_isready -h db -U postgres; do\n\
    echo "Waiting for postgres..."\n\
    sleep 2\n\
done\n\
alembic upgrade head\n\
uvicorn app.main:app --host 0.0.0.0 --port 8080\n' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 8080

CMD ["/app/entrypoint.sh"]
