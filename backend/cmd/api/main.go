package main

import (
	"log"
	"os"
	"time"

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

	// Initialize database with retries
	var dbErr error
	for i := 0; i < 5; i++ {
		dbErr = db.InitDB()
		if dbErr == nil {
			break
		}
		log.Printf("Failed to connect to database, retrying in 5 seconds... (attempt %d/5)", i+1)
		time.Sleep(5 * time.Second)
	}
	if dbErr != nil {
		log.Fatal("Failed to connect to database after 5 attempts:", dbErr)
	}

	// Create new Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Budget App API v1.0",
	})

	// Add middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Public routes
	app.Get("/api/health", handlers.HealthCheck)
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
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
