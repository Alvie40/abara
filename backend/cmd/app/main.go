package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/manjurulhoque/book-store/backend/internal/handlers"
	"github.com/manjurulhoque/book-store/backend/internal/middlewares"
	"github.com/manjurulhoque/book-store/backend/internal/models"
	"github.com/manjurulhoque/book-store/backend/internal/repositories"
	"github.com/manjurulhoque/book-store/backend/internal/services"
	"github.com/manjurulhoque/book-store/backend/pkg/db"
	"log/slog"
	"time"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		slog.Error("Error loading env file")
	}

	if err := db.DatabaseConnection(); err != nil {
		slog.Error("Error connecting to database", "error", err)
		panic(fmt.Sprintf("Error connecting to database: %v", err))
	}

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

	// Updated CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := router.Group("/api")
	{
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/token/refresh", userHandler.Refresh)

		api.GET("/user-orders", middlewares.AuthMiddleware(), orderHandler.GetOrdersForUser)
		api.POST("/orders", middlewares.AuthMiddleware(), orderHandler.CreateOrder)

		api.GET("/home-books", bookHandler.HomeBooks)
		api.POST("/books", bookHandler.CreateBook)
		api.GET("/books", bookHandler.GetBooks)
		api.GET("/books/:id", bookHandler.GetBookById)
		api.PATCH("/books/:id", bookHandler.UpdateBook)
	}

	err := router.Run()
	if err != nil {
		slog.Error("Failed to start the server", err)
		panic(err)
	}
}
