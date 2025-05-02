FROM golang:1.22-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev postgresql-client git

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy migrations
COPY migrations ./migrations

# Copy the rest of the application
COPY . .

# Build the application
RUN CGO_ENABLED=1 go build -o main ./cmd/app/main.go

# Create an entrypoint script
RUN echo '#!/bin/sh\n\
while ! pg_isready -h db -U postgres; do\n\
    echo "Waiting for postgres...";\n\
    sleep 2;\n\
done\n\
psql -h db -U postgres -d bookstore -f /app/migrations/20240501000000_init.sql\n\
./main' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose the port
EXPOSE 8080

# Start the application
CMD ["/app/entrypoint.sh"]