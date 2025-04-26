package handlers

import (
	"time"

	"github.com/cxfos/budget-app/internal/models"
	"github.com/cxfos/budget-app/pkg/db"
	"github.com/gofiber/fiber/v2"
)

// CreateExpense handles creating a new expense
func CreateExpense(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.ExpenseCreate
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// Create expense
	expense := &models.Expense{
		UserID:      userID,
		Amount:      req.Amount,
		Description: req.Description,
		Category:    req.Category,
		Date:        req.Date,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Insert expense into database
	err := db.DB.QueryRow(
		`INSERT INTO expenses (user_id, amount, description, category, date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
		expense.UserID, expense.Amount, expense.Description, expense.Category,
		expense.Date, expense.CreatedAt, expense.UpdatedAt,
	).Scan(&expense.ID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating expense",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Expense created successfully",
		"expense": expense,
	})
}

// GetExpenses handles retrieving all expenses for a user
func GetExpenses(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	// Get query parameters
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	// Build query
	query := `SELECT id, user_id, amount, description, category, date, created_at, updated_at 
		FROM expenses WHERE user_id = $1`
	args := []interface{}{userID}
	argCount := 2

	if startDate != "" {
		query += ` AND date >= $` + string(argCount)
		args = append(args, startDate)
		argCount++
	}

	if endDate != "" {
		query += ` AND date <= $` + string(argCount)
		args = append(args, endDate)
		argCount++
	}

	query += ` ORDER BY date DESC`

	// Execute query
	rows, err := db.DB.Query(query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving expenses",
		})
	}
	defer rows.Close()

	// Scan results
	var expenses []models.Expense
	for rows.Next() {
		var expense models.Expense
		err := rows.Scan(
			&expense.ID, &expense.UserID, &expense.Amount, &expense.Description,
			&expense.Category, &expense.Date, &expense.CreatedAt, &expense.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error scanning expenses",
			})
		}
		expenses = append(expenses, expense)
	}

	return c.JSON(fiber.Map{
		"expenses": expenses,
	})
}

// GetExpenseTotal handles retrieving the total expenses for a user in a given period
func GetExpenseTotal(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	// Get query parameters
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	// Build query
	query := `SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = $1`
	args := []interface{}{userID}
	argCount := 2

	if startDate != "" {
		query += ` AND date >= $` + string(argCount)
		args = append(args, startDate)
		argCount++
	}

	if endDate != "" {
		query += ` AND date <= $` + string(argCount)
		args = append(args, endDate)
		argCount++
	}

	// Execute query
	var total float64
	err := db.DB.QueryRow(query, args...).Scan(&total)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error calculating total",
		})
	}

	return c.JSON(fiber.Map{
		"total": total,
	})
}

// UpdateExpense handles updating an existing expense
func UpdateExpense(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	expenseID := c.Params("id")

	var req models.ExpenseUpdate
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// Build update query
	query := `UPDATE expenses SET updated_at = $1`
	args := []interface{}{time.Now()}
	argCount := 2

	if req.Amount != nil {
		query += `, amount = $` + string(argCount)
		args = append(args, *req.Amount)
		argCount++
	}

	if req.Description != nil {
		query += `, description = $` + string(argCount)
		args = append(args, *req.Description)
		argCount++
	}

	if req.Category != nil {
		query += `, category = $` + string(argCount)
		args = append(args, *req.Category)
		argCount++
	}

	if req.Date != nil {
		query += `, date = $` + string(argCount)
		args = append(args, *req.Date)
		argCount++
	}

	query += ` WHERE id = $` + string(argCount) + ` AND user_id = $` + string(argCount+1)
	args = append(args, expenseID, userID)

	// Execute update
	result, err := db.DB.Exec(query, args...)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error updating expense",
		})
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error checking update result",
		})
	}

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Expense not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Expense updated successfully",
	})
}

// DeleteExpense handles deleting an expense
func DeleteExpense(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	expenseID := c.Params("id")

	// Delete expense
	result, err := db.DB.Exec(
		"DELETE FROM expenses WHERE id = $1 AND user_id = $2",
		expenseID, userID,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error deleting expense",
		})
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error checking delete result",
		})
	}

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Expense not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Expense deleted successfully",
	})
}
