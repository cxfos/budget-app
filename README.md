# 📋 Budgeting App Backend (Go + Fiber + PostgreSQL)

A simple budgeting application backend built with Go, Fiber, and PostgreSQL. This MVP allows users to register, log in, add expenses, and view their total spending per cycle.

## Technologies

- Backend: Go, Fiber
- Database: PostgreSQL
- Authentication: JWT
- Frontend: React.js with TypeScript (for future integration)
- Deployment: Docker containers

## Features

- User registration and login with JWT authentication
- CRUD operations for expenses
- Endpoint to retrieve expenses for a specific cycle
- Endpoint to get total sum of expenses for the current cycle

## Prerequisites

- Go 1.21 or later
- PostgreSQL 15 or later
- Docker and Docker Compose (for containerized deployment)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cxfos/budget-app.git
   cd budget-app
   ```

2. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

3. Install dependencies:
   ```bash
   go mod download
   ```

## Running the Application

### Local Development

1. Start PostgreSQL:
   ```bash
   docker-compose up db
   ```

2. Run database migrations:
   ```bash
   psql -U postgres -d budget_app -f migrations/001_init.sql
   ```

3. Start the application:
   ```bash
   go run cmd/api/main.go
   ```

### Docker Deployment

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Public Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get JWT token

### Protected Endpoints (require JWT token)

- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - List all expenses
- `GET /api/expenses/total` - Get total expenses for a period
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

## Development Checklist

### Project Setup
- [x] Initialize project folder
- [x] Initialize Git repository
- [x] Create `.gitignore` file
- [x] Initialize Go module
- [x] Install Fiber framework
- [x] Set up basic project structure
- [x] Create initial `main.go`

### Database Setup
- [x] Set up PostgreSQL
- [x] Create database schema
- [x] Create basic database connection
- [x] Test DB connection

### Authentication (JWT)
- [x] Create user registration endpoint
- [x] Create user login endpoint
- [x] Generate and return JWT token
- [x] Middleware to protect private routes

### Expense Management
- [x] Create expense model
- [x] Add endpoint to create new expense
- [x] Add endpoint to list user expenses
- [x] Add endpoint to calculate total per cycle

### Middleware
- [x] Create authentication middleware
- [x] Create error handling middleware

### Environment Configuration
- [x] Add `.env` file
- [x] Load environment variables

### Docker Deployment
- [x] Create `Dockerfile`
- [x] Create `docker-compose.yml`
- [x] Test full setup locally

### Final Polish
- [ ] Test authentication flow
- [ ] Review commit history
- [ ] Push project to GitHub
- [ ] Deploy to Render/Fly.io

## ✨ Commit Style Reminder
✅ Small and frequent  
✅ Present tense ("Add", "Create", "Fix", "Implement")  
✅ Clear and descriptive ("Add expense model and routes", "Fix JWT middleware bug")
