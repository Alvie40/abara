package services

import (
	"abara/backend/internal/models"
	"errors"

	"gorm.io/gorm"
)

type BookService struct {
	db *gorm.DB
}

func NewBookService(db *gorm.DB) *BookService {
	return &BookService{db: db}
}

func (s *BookService) CreateBook(book *models.Book) error {
	if err := s.validateISBN(book.ISBN); err != nil {
		return err
	}
	return s.db.Create(book).Error
}

func (s *BookService) UpdateBook(book *models.Book) error {
	if err := s.validateISBN(book.ISBN); err != nil {
		return err
	}
	return s.db.Save(book).Error
}

func (s *BookService) GetBookById(id uint) (*models.Book, error) {
	var book models.Book
	if err := s.db.First(&book, id).Error; err != nil {
		return nil, err
	}
	return &book, nil
}

func (s *BookService) GetAllBooks() ([]models.Book, error) {
	var books []models.Book
	if err := s.db.Find(&books).Error; err != nil {
		return nil, err
	}
	return books, nil
}

func (s *BookService) DeleteBook(id uint) error {
	return s.db.Delete(&models.Book{}, id).Error
}

func (s *BookService) GetHomeBooks() ([]models.Book, []models.Book, error) {
	var topSellers []models.Book
	var recommended []models.Book

	if err := s.db.Where("trending = ?", true).Limit(10).Find(&topSellers).Error; err != nil {
		return nil, nil, err
	}

	if err := s.db.Order("created_at desc").Limit(10).Find(&recommended).Error; err != nil {
		return nil, nil, err
	}

	return topSellers, recommended, nil
}

// UpdateStock updates the stock quantity of a book
func (s *BookService) UpdateStock(id uint, quantity int) error {
	return s.db.Model(&models.Book{}).Where("id = ?", id).
		Update("stock_quantity", gorm.Expr("stock_quantity + ?", quantity)).Error
}

// CheckAvailability checks if a book has enough stock
func (s *BookService) CheckAvailability(id uint, quantity int) (bool, error) {
	var book models.Book
	if err := s.db.Select("stock_quantity").First(&book, id).Error; err != nil {
		return false, err
	}
	return book.StockQuantity >= quantity, nil
}

// SearchBooks searches for books by various criteria
func (s *BookService) SearchBooks(query string) ([]models.Book, error) {
	var books []models.Book
	search := "%" + query + "%"
	err := s.db.Where("title ILIKE ? OR description ILIKE ? OR author ILIKE ? OR isbn LIKE ?",
		search, search, search, search).Find(&books).Error
	return books, err
}

// GetBooksByLanguage gets books filtered by language
func (s *BookService) GetBooksByLanguage(language string) ([]models.Book, error) {
	var books []models.Book
	err := s.db.Where("language = ?", language).Find(&books).Error
	return books, err
}

// validateISBN validates ISBN-13 format
func (s *BookService) validateISBN(isbn string) error {
	if isbn == "" {
		return nil // ISBN is optional
	}

	if len(isbn) != 13 {
		return errors.New("ISBN must be 13 digits")
	}

	var sum int
	for i := 0; i < 12; i++ {
		digit := int(isbn[i] - '0')
		if i%2 == 0 {
			sum += digit
		} else {
			sum += digit * 3
		}
	}

	checkDigit := (10 - (sum % 10)) % 10
	if checkDigit != int(isbn[12]-'0') {
		return errors.New("invalid ISBN-13 check digit")
	}

	return nil
}
