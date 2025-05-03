package models

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`
}

type Book struct {
	BaseModel
	Title         string    `json:"title" gorm:"type:varchar(255);not null"`
	Description   string    `json:"description" gorm:"type:text;not null"`
	Category      string    `json:"category" gorm:"type:varchar(255);not null"`
	Trending      bool      `json:"trending" gorm:"not null"`
	CoverImage    string    `json:"cover_image" gorm:"type:varchar(255);not null"`
	OldPrice      float64   `json:"old_price" gorm:"not null"`
	NewPrice      float64   `json:"new_price" gorm:"not null"`
	ISBN          string    `json:"isbn" gorm:"type:varchar(13);unique"`
	Author        string    `json:"author" gorm:"type:varchar(255)"`
	PublishedDate time.Time `json:"published_date"`
	StockQuantity int       `json:"stock_quantity" gorm:"default:0"`
	Publisher     string    `json:"publisher" gorm:"type:varchar(255)"`
	Language      string    `json:"language" gorm:"type:varchar(50)"`
	PageCount     int       `json:"page_count"`
}

type User struct {
	gorm.Model
	Email    string `json:"email" gorm:"unique;not null"`
	Name     string `json:"name" gorm:"not null"`
	Password string `json:"-" gorm:"not null"`
	IsAdmin  bool   `json:"is_admin" gorm:"default:false"`
}

type Address struct {
	City    string `json:"city" gorm:"type:varchar(255);not null"`
	Country string `json:"country" gorm:"type:varchar(255)"`
	State   string `json:"state" gorm:"type:varchar(255)"`
	Zipcode string `json:"zipcode" gorm:"type:varchar(255)"`
}

type Order struct {
	BaseModel
	Name       string  `json:"name" gorm:"type:varchar(255);not null"`
	Email      string  `json:"email" gorm:"type:varchar(255);not null"`
	Address    Address `json:"address" gorm:"embedded"`
	Phone      string  `json:"phone" gorm:"type:varchar(20);not null"`
	TotalPrice float64 `json:"total_price" gorm:"column:total_price;not null"`
	UserId     uint    `json:"user_id" gorm:"column:user_id;not null"`
	Books      []Book  `json:"books" gorm:"many2many:order_books;"`
	User       User    `json:"user" gorm:"foreignKey:user_id"`
}

type OrderBook struct {
	BaseModel
	OrderID uint `json:"order_id" gorm:"column:order_id;not null"`
	BookID  uint `json:"book_id" gorm:"column:book_id;not null"`
}

func (ob *OrderBook) TableName() string {
	return "order_books"
}

func (o *Order) TableName() string {
	return "orders"
}
