package services

import (
	"github.com/manjurulhoque/book-store/backend/internal/models"
	"github.com/manjurulhoque/book-store/backend/internal/repositories"
)

type BookService interface {
	CreateBook(book *models.Book) error
	GetBookById(id uint) (*models.Book, error)
	GetAllBooks() ([]models.Book, error)
	UpdateBook(book *models.Book) error
	DeleteBook(id uint) error
	GetHomeBooks() ([]models.Book, []models.Book, error)
}

type bookService struct {
	bookRepo repositories.BookRepository
}

func NewBookService(repo repositories.BookRepository) BookService {
	return &bookService{bookRepo: repo}
}

func (s *bookService) CreateBook(book *models.Book) error {
	return s.bookRepo.CreateBook(book)
}

func (s *bookService) GetBookById(id uint) (*models.Book, error) {
	return s.bookRepo.GetBookById(id)
}

func (s *bookService) GetAllBooks() ([]models.Book, error) {
	return s.bookRepo.GetAllBooks()
}

func (s *bookService) UpdateBook(book *models.Book) error {
	return s.bookRepo.UpdateBook(book)
}

func (s *bookService) DeleteBook(id uint) error {
	return s.bookRepo.DeleteBook(id)
}

func (s *bookService) GetHomeBooks() ([]models.Book, []models.Book, error) {
	return s.bookRepo.GetHomeBooks()
}
