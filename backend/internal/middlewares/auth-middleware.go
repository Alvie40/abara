package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/book-store/backend/internal/repositories"
	"github.com/manjurulhoque/book-store/backend/internal/services"
	"github.com/manjurulhoque/book-store/backend/pkg/db"
	"log/slog"
	"net/http"
	"strings"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")

		bearerToken := ""

		if len(strings.Split(token, " ")) == 2 {
			bearerToken = strings.Split(token, " ")[1]
		}

		if bearerToken == "" {
			slog.Error("No bearer token found")
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
			})
			c.Abort()
			return
		}

		userRepo := repositories.NewUserRepository(db.DB)
		userService := services.NewUserService(userRepo)

		claims, err := userService.VerifyToken(bearerToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			c.Abort()
			return
		}

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			c.Abort()
			return
		}

		user, err := userRepo.GetUserByEmail(claims.Email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
			})
			c.Abort()
			return
		}
		if user.Email != claims.Email {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
			})
			c.Abort()
			return
		}
		c.Set("Claims", claims)
		c.Set("userId", user.ID)
		c.Set("email", user.Email)
		c.Set("isAdmin", user.IsAdmin)
		c.Next()
	}
}
