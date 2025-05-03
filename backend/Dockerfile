FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy poetry files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Create and set up entrypoint script
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