package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Get request path and method
		path := c.Request.URL.Path
		method := c.Request.Method

		// Process request
		c.Next()

		// Stop timer
		duration := time.Since(start)
		status := c.Writer.Status()

		// Log request details
		slog.Info("Request processed",
			"path", path,
			"method", method,
			"status", status,
			"duration", duration,
			"client_ip", c.ClientIP(),
			"user_agent", c.Request.UserAgent(),
		)
	}
}
