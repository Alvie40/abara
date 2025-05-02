FROM golang:1.22-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev postgresql-client git

# Copy go mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the application
RUN CGO_ENABLED=1 go build -o main ./cmd/app/main.go

# Create and set up entrypoint script directly
RUN printf '#!/bin/sh\nwhile ! pg_isready -h db -U postgres; do\n    echo "Waiting for postgres..."\n    sleep 2\ndone\npsql -h db -U postgres -d bookstore -f /app/migrations/20240501000000_init.sql\n./main\n' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 8080

CMD ["/app/entrypoint.sh"]