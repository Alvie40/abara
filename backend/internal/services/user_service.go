package services

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"abara/backend/internal/models"
	"abara/backend/internal/repositories"
)

type UserClaims struct {
	jwt.RegisteredClaims
	ID      uint   `json:"id"`
	Email   string `json:"email"`
	IsAdmin bool   `json:"is_admin"`
}

type UserService interface {
	RegisterUser(name, email, password string) error
	LoginUser(email, password string) (string, string, error)
	VerifyToken(token string) (*UserClaims, error)
	RefreshToken(refreshToken string) (string, error)
}

type userService struct {
	userRepo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{userRepo: repo}
}

func (s *userService) RegisterUser(name, email, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}

	return s.userRepo.CreateUser(user)
}

func (s *userService) LoginUser(email, password string) (string, string, error) {
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		return "", "", errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", "", errors.New("incorrect password")
	}

	// Generate Access and Refresh Tokens
	accessToken, err := s.generateToken(user, time.Hour*24)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.generateToken(user, time.Hour*24*7)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *userService) VerifyToken(tokenString string) (*UserClaims, error) {
	claims := &UserClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

func (s *userService) RefreshToken(refreshToken string) (string, error) {
	claims, err := s.VerifyToken(refreshToken)
	if err != nil {
		return "", err
	}

	user, err := s.userRepo.GetUserByEmail(claims.Email)
	if err != nil {
		return "", err
	}

	newToken, err := s.generateToken(user, time.Hour*24)
	if err != nil {
		return "", err
	}

	return newToken, nil
}

func (s *userService) generateToken(user *models.User, expiration time.Duration) (string, error) {
	claims := UserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		ID:      user.ID,
		Email:   user.Email,
		IsAdmin: user.IsAdmin,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
