FROM golang:1.17-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o backend ./cmd/backend

FROM alpine:3.14
WORKDIR /app
COPY --from=builder /app/backend .
EXPOSE 8080
CMD ["/app/backend"]
