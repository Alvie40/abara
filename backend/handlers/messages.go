package handlers

import (
	"backend/models"

	"github.com/gin-gonic/gin"
)

func GetMessages(c *gin.Context) {
	messages := []models.Message{}
	// TODO: Implement database query
	c.JSON(200, gin.H{"messages": messages})
}

func PostMessage(c *gin.Context) {
	var msg models.Message
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	// TODO: Save to database
	c.JSON(201, gin.H{"message": msg})
}
