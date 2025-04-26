package handlers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/cxfos/budget-app/internal/models"
	"github.com/cxfos/budget-app/pkg/db"
	"github.com/cxfos/budget-app/pkg/validator"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

// CreateExpense handles creating a new expense
func CreateExpense(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req models.ExpenseCreate
	if err := c.BodyParser(&req); err != nil {
		log.Error().Err(err).Msg("Failed to parse request body")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// Validate request
	if err := validator.Validate.Struct(req); err != nil {
		log.Error().Err(err).Interface("request", req).Msg("Validation failed")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Validation failed",
			"error":   err.Error(),
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
		log.Error().Err(err).Interface("expense", expense).Msg("Failed to create expense")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating expense",
			"error":   err.Error(),
		})
	}

	log.Info().Int("expense_id", expense.ID).Int("user_id", userID).Msg("Expense created successfully")
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
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	// Build query
	query := `SELECT id, user_id, amount, description, category, date, created_at, updated_at, deleted_at 
		FROM expenses WHERE user_id = $1 AND deleted_at IS NULL`
	countQuery := `SELECT COUNT(*) FROM expenses WHERE user_id = $1 AND deleted_at IS NULL`
	args := []interface{}{userID}
	argCount := 2

	if startDate != "" {
		if _, err := time.Parse("2006-01-02", startDate); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Invalid start_date format. Use YYYY-MM-DD",
				"error":   err.Error(),
			})
		}
		query += fmt.Sprintf(" AND date >= $%d", argCount)
		countQuery += fmt.Sprintf(" AND date >= $%d", argCount)
		args = append(args, startDate)
		argCount++
	}

	if endDate != "" {
		if _, err := time.Parse("2006-01-02", endDate); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "Invalid end_date format. Use YYYY-MM-DD",
				"error":   err.Error(),
			})
		}
		query += fmt.Sprintf(" AND date <= $%d", argCount)
		countQuery += fmt.Sprintf(" AND date <= $%d", argCount)
		args = append(args, endDate)
		argCount++
	}

	// Get total count
	var total int
	err := db.DB.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		log.Error().Err(err).Int("user_id", userID).Msg("Failed to count expenses")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error counting expenses",
			"error":   err.Error(),
		})
	}

	// Add pagination
	query += fmt.Sprintf(" ORDER BY date DESC LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, limit, offset)

	// Execute query
	rows, err := db.DB.Query(query, args...)
	if err != nil {
		log.Error().Err(err).Int("user_id", userID).Msg("Failed to retrieve expenses")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving expenses",
			"error":   err.Error(),
		})
	}
	defer rows.Close()

	// Scan results
	var expenses []models.Expense
	for rows.Next() {
		var expense models.Expense
		err := rows.Scan(
			&expense.ID, &expense.UserID, &expense.Amount, &expense.Description,
			&expense.Category, &expense.Date, &expense.CreatedAt, &expense.UpdatedAt, &expense.DeletedAt,
		)
		if err != nil {
			log.Error().Err(err).Int("user_id", userID).Msg("Failed to scan expense row")
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error scanning expenses",
				"error":   err.Error(),
			})
		}
		expenses = append(expenses, expense)
	}

	if err = rows.Err(); err != nil {
		log.Error().Err(err).Int("user_id", userID).Msg("Error iterating expense rows")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error processing expenses",
			"error":   err.Error(),
		})
	}

	log.Info().Int("user_id", userID).Int("count", len(expenses)).Msg("Retrieved expenses successfully")
	return c.JSON(fiber.Map{
		"expenses": expenses,
		"pagination": fiber.Map{
			"total": total,
			"page":  page,
			"limit": limit,
			"pages": (total + limit - 1) / limit,
		},
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
		query += ` AND date >= $` + fmt.Sprint(argCount)
		args = append(args, startDate)
		argCount++
	}

	if endDate != "" {
		query += ` AND date <= $` + fmt.Sprint(argCount)
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
		query += `, amount = $` + fmt.Sprint(argCount)
		args = append(args, *req.Amount)
		argCount++
	}

	if req.Description != nil {
		query += `, description = $` + fmt.Sprint(argCount)
		args = append(args, *req.Description)
		argCount++
	}

	if req.Category != nil {
		query += `, category = $` + fmt.Sprint(argCount)
		args = append(args, *req.Category)
		argCount++
	}

	if req.Date != nil {
		query += `, date = $` + fmt.Sprint(argCount)
		args = append(args, *req.Date)
		argCount++
	}

	query += ` WHERE id = $` + fmt.Sprint(argCount) + ` AND user_id = $` + fmt.Sprint(argCount+1)
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

// DeleteExpense handles deleting an expense (soft delete)
func DeleteExpense(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)
	expenseID := c.Params("id")

	// Convert expenseID to int for logging
	expenseIDInt, err := strconv.Atoi(expenseID)
	if err != nil {
		log.Error().Err(err).Str("expense_id", expenseID).Msg("Invalid expense ID format")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid expense ID format",
			"error":   err.Error(),
		})
	}

	// Soft delete expense
	result, err := db.DB.Exec(
		"UPDATE expenses SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL",
		expenseID, userID,
	)
	if err != nil {
		log.Error().Err(err).Int("expense_id", expenseIDInt).Int("user_id", userID).Msg("Failed to delete expense")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error deleting expense",
			"error":   err.Error(),
		})
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Error().Err(err).Msg("Error checking delete result")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error checking delete result",
			"error":   err.Error(),
		})
	}

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Expense not found or already deleted",
		})
	}

	log.Info().Int("expense_id", expenseIDInt).Int("user_id", userID).Msg("Expense soft deleted successfully")
	return c.JSON(fiber.Map{
		"message": "Expense deleted successfully",
	})
}
