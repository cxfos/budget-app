#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000/api"

echo "🔍 Testing Authentication Flow"
echo "=============================="

# Test 1: Register a new user
echo -e "\n${GREEN}Test 1: Register a new user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Response: $REGISTER_RESPONSE"

# Test 2: Try to register the same user again (should fail)
echo -e "\n${GREEN}Test 2: Try to register the same user again${NC}"
REGISTER_DUPLICATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Response: $REGISTER_DUPLICATE_RESPONSE"

# Test 3: Login with correct credentials
echo -e "\n${GREEN}Test 3: Login with correct credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Response: $LOGIN_RESPONSE"

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to get token from login response${NC}"
  exit 1
fi

# Test 4: Access protected endpoint without token (should fail)
echo -e "\n${GREEN}Test 4: Access protected endpoint without token${NC}"
UNAUTH_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses")
echo "Response: $UNAUTH_RESPONSE"

# Test 5: Access protected endpoint with token
echo -e "\n${GREEN}Test 5: Access protected endpoint with token${NC}"
AUTH_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $AUTH_RESPONSE"

# Test 6: Create an expense with token
echo -e "\n${GREEN}Test 6: Create an expense with token${NC}"
CREATE_EXPENSE_RESPONSE=$(curl -s -X POST "${BASE_URL}/expenses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "description": "Test expense",
    "category": "Food",
    "date": "2024-03-14T00:00:00Z"
  }')
echo "Response: $CREATE_EXPENSE_RESPONSE"

# Test 7: Get expense total
echo -e "\n${GREEN}Test 7: Get expense total${NC}"
TOTAL_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses/total" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $TOTAL_RESPONSE"

echo -e "\n${GREEN}Authentication Flow Tests Completed${NC}" 