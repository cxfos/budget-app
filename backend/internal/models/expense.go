package models

import "time"

type Expense struct {
	ID          int       `json:"id"`
	UserID      int       `json:"user_id"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ExpenseCreate struct {
	Amount      float64   `json:"amount" validate:"required,gt=0"`
	Description string    `json:"description" validate:"required"`
	Category    string    `json:"category" validate:"required"`
	Date        time.Time `json:"date" validate:"required"`
}

type ExpenseUpdate struct {
	Amount      *float64   `json:"amount,omitempty" validate:"omitempty,gt=0"`
	Description *string    `json:"description,omitempty"`
	Category    *string    `json:"category,omitempty"`
	Date        *time.Time `json:"date,omitempty"`
} 