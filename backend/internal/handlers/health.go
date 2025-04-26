package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// HealthCheck handles the health check endpoint
func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "Service is healthy",
	})
}
