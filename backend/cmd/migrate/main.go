package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/lib/pq"
)

func main() {
	// Get database connection details from environment variables
	dbHost := getEnvOrDefault("DB_HOST", "localhost")
	dbPort := getEnvOrDefault("DB_PORT", "5432")
	dbUser := getEnvOrDefault("DB_USER", "postgres")
	dbPassword := getEnvOrDefault("DB_PASSWORD", "postgres")
	dbName := getEnvOrDefault("DB_NAME", "budget_app")

	// Construct connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	// Connect to database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer db.Close()

	// Test connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}

	// Get migrations directory
	migrationsDir := "migrations"
	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		log.Fatalf("Error reading migrations directory: %v", err)
	}

	// Execute each migration file in order
	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".sql") {
			continue
		}

		log.Printf("Executing migration: %s", file.Name())

		// Read migration file
		content, err := ioutil.ReadFile(filepath.Join(migrationsDir, file.Name()))
		if err != nil {
			log.Fatalf("Error reading migration file %s: %v", file.Name(), err)
		}

		// Execute migration
		_, err = db.Exec(string(content))
		if err != nil {
			log.Fatalf("Error executing migration %s: %v", file.Name(), err)
		}

		log.Printf("Successfully executed migration: %s", file.Name())
	}

	log.Println("All migrations completed successfully")
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
