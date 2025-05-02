package main

import (
	"fmt"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/manjurulhoque/book-store/backend/internal/handlers"
	"github.com/manjurulhoque/book-store/backend/internal/middlewares"
	"github.com/manjurulhoque/book-store/backend/internal/models"
	"github.com/manjurulhoque/book-store/backend/internal/repositories"
	"github.com/manjurulhoque/book-store/backend/internal/services"
	"github.com/manjurulhoque/book-store/backend/pkg/db"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		slog.Error("Error loading env file")
	}

	db.Init()

	err = db.DB.AutoMigrate(&models.Book{}, &models.User{}, &models.Order{}, &models.OrderBook{})
	if err != nil {
		slog.Error("Error migrating database", "error", err.Error())
		panic(fmt.Sprintf("Error migrating database: %v", err))
	}
}

func main() {
	// Initialize repositories and services
	orderRepo := repositories.NewOrderRepository(db.DB)
	bookRepo := repositories.NewBookRepository(db.DB)
	userRepo := repositories.NewUserRepository(db.DB)

	orderService := services.NewOrderService(orderRepo)
	bookService := services.NewBookService(bookRepo)
	userService := services.NewUserService(userRepo)

	// Initialize handlers
	orderHandler := handlers.NewOrderHandler(orderService)
	bookHandler := handlers.NewBookHandler(bookService)
	userHandler := handlers.NewUserHandler(userService)

	// This is the main entry point for the application
	router := gin.Default()
	router.Static("/uploads", "./uploads")

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := router.Group("/api")
	{
		// Public routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/token/refresh", userHandler.Refresh)
		api.GET("/home-books", bookHandler.HomeBooks)
		api.GET("/books", bookHandler.GetBooks)
		api.GET("/books/:id", bookHandler.GetBookById)

		// Protected routes
		protected := api.Group("/", middlewares.AuthMiddleware())
		{
			protected.GET("/user-orders", orderHandler.GetOrdersForUser)
			protected.POST("/orders", orderHandler.CreateOrder)
			
			// Admin-only book operations
			protected.POST("/books", bookHandler.CreateBook)
			protected.PATCH("/books/:id", bookHandler.UpdateBook)
		}
	}

	err := router.Run()
	if err != nil {
		slog.Error("Failed to start the server", "error", err.Error())
		panic(err)
	}
}
