package config

import "os"

type Config struct {
	DatabaseURL string
	McpURL      string
	SecretKey   string
}

func Load() *Config {
	return &Config{
		DatabaseURL: os.Getenv("DATABASE_URL"),
		McpURL:      os.Getenv("MCP_URL"),
		SecretKey:   os.Getenv("SECRET_KEY"),
	}
}
