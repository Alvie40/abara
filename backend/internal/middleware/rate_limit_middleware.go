package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// Implement a simple in-memory rate limiter using token bucket algorithm
type rateLimiter struct {
	ips    map[string]*rate.Limiter
	mu     *sync.RWMutex
	rate   rate.Limit
	burst  int
	ttl    time.Duration
	ticker *time.Ticker
}

func newRateLimiter(r rate.Limit, b int, ttl time.Duration) *rateLimiter {
	rl := &rateLimiter{
		ips:    make(map[string]*rate.Limiter),
		mu:     &sync.RWMutex{},
		rate:   r,
		burst:  b,
		ttl:    ttl,
		ticker: time.NewTicker(ttl),
	}

	// Start cleanup routine
	go func() {
		for range rl.ticker.C {
			rl.mu.Lock()
			rl.ips = make(map[string]*rate.Limiter)
			rl.mu.Unlock()
		}
	}()

	return rl
}

func (rl *rateLimiter) getLimiter(ip string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.ips[ip]
	if !exists {
		limiter = rate.NewLimiter(rl.rate, rl.burst)
		rl.ips[ip] = limiter
	}

	return limiter
}

// RateLimitMiddleware creates a middleware for rate limiting based on IP
// r: requests per second
// b: burst size (maximum number of requests allowed to accumulate)
// ttl: time to live for the rate limiter
func RateLimitMiddleware(r float64, b int, ttl time.Duration) gin.HandlerFunc {
	rl := newRateLimiter(rate.Limit(r), b, ttl)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := rl.getLimiter(ip)
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
