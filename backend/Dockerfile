# Etapa de build: compilação do binário Go
FROM --platform=$BUILDPLATFORM golang:1.22-alpine AS builder

ARG TARGETARCH # Adicionado para receber a arquitetura de destino

WORKDIR /app

# Copia e instala dependências
COPY go.mod go.sum ./
RUN go mod download

# Copia o restante da aplicação
COPY . .

# Compila o binário para o arquivo correto
RUN CGO_ENABLED=0 GOOS=linux GOARCH=${TARGETARCH} go build -o server ./cmd/main.go

# Etapa final: imagem mínima com binário
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

# Porta padrão (altere se necessário)
EXPOSE 8080

CMD ["./main"]
