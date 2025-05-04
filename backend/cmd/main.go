package main

import (
	"log"
	"os"

	"abara/backend/config"
	"abara/backend/internal/handlers"
	"abara/backend/internal/services"
	"abara/backend/internal/utils/db"
	"abara/backend/router"

	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin to release mode
	gin.SetMode(gin.ReleaseMode)

	cfg := config.Load()

	// Initialize database connection
	if err := db.DatabaseConnection(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize services
	bookService := services.NewBookService(db.DB)

	// Initialize handlers
	bookHandler := handlers.NewBookHandler(bookService)

	app := gin.Default()

	// Trust only local proxies and Docker network
	trustedProxies := []string{
		"127.0.0.1/8",    // Localhost
		"10.0.0.0/8",     // Docker network
		"172.16.0.0/12",  // Docker network
		"192.168.0.0/16", // Docker network
	}

	if err := app.SetTrustedProxies(trustedProxies); err != nil {
		log.Printf("Warning: Failed to set trusted proxies: %v", err)
	}

	router.SetupRoutes(app, cfg, bookHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on :%s", port)
	log.Fatal(app.Run(":" + port))
}
