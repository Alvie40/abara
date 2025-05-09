package handlers

import (
	"net/http"

	"abara/backend/internal/models"

	"github.com/gin-gonic/gin"
)

type MessageHandler struct{}

func NewMessageHandler() *MessageHandler {
	return &MessageHandler{}
}

func (h *MessageHandler) GetMessages(c *gin.Context) {
	messages := []models.Message{}
	// TODO: Implement database query
	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

func (h *MessageHandler) PostMessage(c *gin.Context) {
	var msg models.Message
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// TODO: Save to database
	c.JSON(http.StatusCreated, gin.H{"message": msg})
}
