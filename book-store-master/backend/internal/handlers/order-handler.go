package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/book-store/backend/internal/models"
	"github.com/manjurulhoque/book-store/backend/internal/services"
	"log/slog"
	"net/http"
	"strconv"
	"sync"
)

type OrderHandler struct {
	orderService *services.OrderService
}

func NewOrderHandler(orderService *services.OrderService) *OrderHandler {
	return &OrderHandler{orderService: orderService}
}

func (h *OrderHandler) GetOrdersForUser(c *gin.Context) {
	if userId, exists := c.Get("userId"); !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	} else {
		orders, err := h.orderService.GetOrdersForUser(userId.(uint))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, orders)
	}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var order models.Order
	var orderInput struct {
		models.BaseModel
		Name       string         `json:"name" gorm:"type:varchar(255);not null"`
		Email      string         `json:"email" gorm:"type:varchar(255);not null"`
		Address    models.Address `json:"address" gorm:"embedded"`
		Phone      string         `json:"phone" gorm:"type:varchar(20);not null"`
		TotalPrice float64        `json:"total_price" gorm:"column:total_price;not null"`
		UserId     uint           `json:"user_id" gorm:"column:user_id;not null"`

		BookIds []int `json:"book_ids"`
	}
	if err := c.ShouldBindJSON(&orderInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if userId, exists := c.Get("userId"); !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	} else {
		order.UserId = userId.(uint)
	}

	order.Name = orderInput.Name
	order.Email = orderInput.Email
	order.Address = orderInput.Address
	order.Phone = orderInput.Phone
	order.TotalPrice = orderInput.TotalPrice

	orderId, err := h.orderService.CreateOrder(&order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	slog.Info("Order created", "order_id", orderId)
	var wg sync.WaitGroup
	// Create order_books
	for _, bookId := range orderInput.BookIds {
		wg.Add(1)
		go func(bookId int) {
			defer wg.Done()
			err = h.orderService.CreateOrderBook(orderId, uint(bookId))
			if err != nil {
				slog.Error("Failed to create order book", "error", err.Error())
			}
		}(bookId)
	}

	c.JSON(http.StatusOK, order)
}

func (h *OrderHandler) GetOrderById(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	order, err := h.orderService.GetOrderById(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, order)
}
