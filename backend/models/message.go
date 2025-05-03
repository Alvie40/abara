package models

type Message struct {
	ID      int    `json:"id"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
}
