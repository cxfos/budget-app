package main

import (
	"log"
	"os"

	"github.com/cxfos/budget-app/internal/handlers"
	"github.com/cxfos/budget-app/internal/middleware"
	"github.com/cxfos/budget-app/pkg/db"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	if err := db.InitDB(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Create new Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Budget App API v1.0",
	})

	// Add middleware
	app.Use(logger.New())
	app.Use(cors.New())

	// Public routes
	app.Post("/api/register", handlers.Register)
	app.Post("/api/login", handlers.Login)

	// Protected routes
	api := app.Group("/api", middleware.AuthMiddleware())

	// Expense routes
	expenses := api.Group("/expenses")
	expenses.Post("/", handlers.CreateExpense)
	expenses.Get("/", handlers.GetExpenses)
	expenses.Get("/total", handlers.GetExpenseTotal)
	expenses.Put("/:id", handlers.UpdateExpense)
	expenses.Delete("/:id", handlers.DeleteExpense)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen(":" + port))
}
