package db

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func DatabaseConnection() error {
	var err error

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		// Fallback to individual connection parameters
		host := os.Getenv("DB_HOST")
		if host == "" {
			host = "host.containers.internal" // Updated for podman connectivity
		}
		username := os.Getenv("DB_USER")
		if username == "" {
			username = "postgres"
		}
		password := os.Getenv("DB_PASSWORD")
		if password == "" {
			password = "postgres"
		}
		dbName := os.Getenv("DB_NAME")
		if dbName == "" {
			dbName = "abara" // Updated from bookstore to abara
		}
		port := os.Getenv("DB_PORT")
		if port == "" {
			port = "5432"
		}
		databaseURL = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
			host, username, password, dbName, port)
	}

	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	return err
}
