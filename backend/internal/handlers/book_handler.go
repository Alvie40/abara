package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"abara/backend/internal/models"
	"abara/backend/internal/services"
)

type BookHandler struct {
	bookService *services.BookService
}

func NewBookHandler(bookService *services.BookService) *BookHandler {
	return &BookHandler{bookService: bookService}
}

func (h *BookHandler) HomeBooks(c *gin.Context) {
	topSellerBooks, recommendedBooks, err := h.bookService.GetHomeBooks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{
		"top_seller_books":  topSellerBooks,
		"recommended_books": recommendedBooks,
	}, "status": true})
}

func (h *BookHandler) GetBooks(c *gin.Context) {
	books, err := h.bookService.GetAllBooks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": books, "status": true})
}

func (h *BookHandler) CreateBook(c *gin.Context) {
	var book models.Book
	book.Title = c.PostForm("title")
	book.Description = c.PostForm("description")
	book.Category = c.PostForm("category")
	book.Trending = c.PostForm("trending") == "true"
	book.OldPrice, _ = strconv.ParseFloat(c.PostForm("old_price"), 64)
	book.NewPrice, _ = strconv.ParseFloat(c.PostForm("new_price"), 64)
	book.ISBN = c.PostForm("isbn")
	book.Author = c.PostForm("author")
	book.Publisher = c.PostForm("publisher")
	book.Language = c.PostForm("language")
	book.PageCount, _ = strconv.Atoi(c.PostForm("page_count"))
	book.StockQuantity, _ = strconv.Atoi(c.PostForm("stock_quantity"))

	if publishedDate := c.PostForm("published_date"); publishedDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", publishedDate); err == nil {
			book.PublishedDate = parsedDate
		}
	}

	// Handle file upload
	file, err := c.FormFile("cover_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cover image is required", "status": false})
		return
	}

	// Generate a unique file name using uuid and keep the original extension
	extension := filepath.Ext(file.Filename)
	newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
	filePath := filepath.Join("uploads", newFileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	book.CoverImage = filePath

	if err := h.bookService.CreateBook(&book); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": true, "message": "Book created successfully", "book": book})
}

func (h *BookHandler) GetBookById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID", "status": false})
		return
	}

	book, err := h.bookService.GetBookById(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": book, "status": true})
}

func (h *BookHandler) UpdateBook(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID", "status": false})
		return
	}

	book, err := h.bookService.GetBookById(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	book.Title = c.PostForm("title")
	book.Description = c.PostForm("description")
	book.Category = c.PostForm("category")
	book.Trending = c.PostForm("trending") == "true"
	book.OldPrice, _ = strconv.ParseFloat(c.PostForm("old_price"), 64)
	book.NewPrice, _ = strconv.ParseFloat(c.PostForm("new_price"), 64)
	book.ISBN = c.PostForm("isbn")
	book.Author = c.PostForm("author")
	book.Publisher = c.PostForm("publisher")
	book.Language = c.PostForm("language")
	book.PageCount, _ = strconv.Atoi(c.PostForm("page_count"))
	book.StockQuantity, _ = strconv.Atoi(c.PostForm("stock_quantity"))

	if publishedDate := c.PostForm("published_date"); publishedDate != "" {
		if parsedDate, err := time.Parse("2006-01-02", publishedDate); err == nil {
			book.PublishedDate = parsedDate
		}
	}

	// Handle file upload if new image is provided
	if file, err := c.FormFile("cover_image"); err == nil {
		extension := filepath.Ext(file.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join("uploads", newFileName)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}
		book.CoverImage = filePath
	}

	if err := h.bookService.UpdateBook(book); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": true, "message": "Book updated successfully", "book": book})
}

func (h *BookHandler) DeleteBook(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID", "status": false})
		return
	}

	if err := h.bookService.DeleteBook(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": true, "message": "Book deleted successfully"})
}

// SearchBooks handles searching for books
func (h *BookHandler) SearchBooks(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required", "status": false})
		return
	}

	books, err := h.bookService.SearchBooks(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": books, "status": true})
}

// GetBooksByLanguage handles fetching books by language
func (h *BookHandler) GetBooksByLanguage(c *gin.Context) {
	language := c.Param("lang")
	if language == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Language parameter is required", "status": false})
		return
	}

	books, err := h.bookService.GetBooksByLanguage(language)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": books, "status": true})
}

// UpdateStock handles updating book stock quantity
func (h *BookHandler) UpdateStock(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID", "status": false})
		return
	}

	var input struct {
		Quantity int `json:"quantity" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "status": false})
		return
	}

	if err := h.bookService.UpdateStock(uint(id), input.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": true, "message": "Stock updated successfully"})
}
