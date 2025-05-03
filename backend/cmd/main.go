package main

import (
	"log"
	"os"

	"backend/config"
	"backend/router"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	app := gin.Default()

	router.SetupRoutes(app, cfg)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on :%s", port)
	log.Fatal(app.Run(":" + port))
}
