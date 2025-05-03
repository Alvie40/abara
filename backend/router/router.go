package router

import (
	"backend/config"
	"backend/handlers"
	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, cfg *config.Config, bookHandler *handlers.BookHandler) {
	// Global middlewares
	r.Use(middlewares.CORSMiddleware())
	r.Use(middlewares.LoggingMiddleware())

	// Static file serving
	r.Static("/uploads", "./uploads")

	// API routes
	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", handlers.Health)

		// Message routes
		api.GET("/messages", handlers.GetMessages)
		api.POST("/messages", handlers.PostMessage)

		// User routes
		api.GET("/users", handlers.ListUsers)

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
			authorized.Use(middlewares.AuthMiddleware())
			{
				authorized.POST("/", bookHandler.CreateBook)
				authorized.PUT("/:id", bookHandler.UpdateBook)
				authorized.DELETE("/:id", bookHandler.DeleteBook)
				authorized.PATCH("/:id/stock", bookHandler.UpdateStock)
			}
		}
	}
}
