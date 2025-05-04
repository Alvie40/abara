FROM golang:1.17-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o backend ./backend/cmd/main.go

FROM alpine:3.14
WORKDIR /app
COPY --from=builder /app/backend .
CMD ["/app/backend"]
