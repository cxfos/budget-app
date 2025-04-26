# API Tests

This directory contains test scripts to verify the functionality of the API endpoints.

## Authentication Flow Test

The `auth_test.sh` script tests the complete authentication flow including:
1. User registration
2. Duplicate registration (error case)
3. User login
4. Protected endpoint access without token (error case)
5. Protected endpoint access with token
6. Creating an expense
7. Getting expense total

### Running the Tests

1. Make sure the application is running locally:
   ```bash
   go run cmd/api/main.go
   ```

2. In a new terminal, run the test script:
   ```bash
   cd test
   ./auth_test.sh
   ```

The script will output the results of each test with color-coded responses. 