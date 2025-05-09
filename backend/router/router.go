package router

import (
	"net/http"

	"abara/backend/config"
	"abara/backend/internal/handlers"
	"abara/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, cfg *config.Config, bookHandler *handlers.BookHandler) {
	// Global middlewares
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.LoggingMiddleware())

	// Static file serving
	r.Static("/uploads", "./uploads")

	// API routes
	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "healthy"})
		})

		// Book routes
		books := api.Group("/books")
		{
			books.GET("/", bookHandler.GetBooks)
			books.GET("/home", bookHandler.HomeBooks)
			books.GET("/:id", bookHandler.GetBookById)
			books.GET("/search", bookHandler.SearchBooks)
			books.GET("/language/:lang", bookHandler.GetBooksByLanguage)

			// Protected routes
			authorized := books.Group("/")
			authorized.Use(middleware.AuthMiddleware())
			{
				authorized.POST("/", bookHandler.CreateBook)
				authorized.PUT("/:id", bookHandler.UpdateBook)
				authorized.DELETE("/:id", bookHandler.DeleteBook)
				authorized.PATCH("/:id/stock", bookHandler.UpdateStock)
			}
		}

		// Message routes
		messages := api.Group("/messages")
		messageHandler := handlers.NewMessageHandler()
		{
			messages.GET("/", messageHandler.GetMessages)
			messages.POST("/", messageHandler.PostMessage)
		}
	}
}
