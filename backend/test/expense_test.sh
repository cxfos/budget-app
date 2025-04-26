#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000/api"

echo "🔍 Testing Expense Management"
echo "============================"

# Test 1: Login to get token
echo -e "\n${GREEN}Test 1: Login to get authentication token${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo "Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to get token. Please run auth_test.sh first to create a user.${NC}"
  exit 1
fi

# Test 2: Create multiple expenses
echo -e "\n${GREEN}Test 2: Create multiple expenses${NC}"
for i in {1..5}; do
  AMOUNT=$((10 * $i))
  CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/expenses" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"amount\": $AMOUNT,
      \"description\": \"Test expense $i\",
      \"category\": \"Test\",
      \"date\": \"2024-03-14T00:00:00Z\"
    }")
  echo "Created expense $i - Response: $CREATE_RESPONSE"
done

# Test 3: Test pagination (page 1, limit 2)
echo -e "\n${GREEN}Test 3: Test pagination - Page 1, Limit 2${NC}"
PAGE1_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $PAGE1_RESPONSE"

# Test 4: Test pagination (page 2, limit 2)
echo -e "\n${GREEN}Test 4: Test pagination - Page 2, Limit 2${NC}"
PAGE2_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses?page=2&limit=2" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $PAGE2_RESPONSE"

# Test 5: Get total expenses
echo -e "\n${GREEN}Test 5: Get total expenses${NC}"
TOTAL_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses/total" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $TOTAL_RESPONSE"

# Test 6: Soft delete an expense
echo -e "\n${GREEN}Test 6: Soft delete first expense${NC}"
# Get first expense ID
FIRST_EXPENSE_ID=$(echo $PAGE1_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -z "$FIRST_EXPENSE_ID" ]; then
  echo -e "${RED}Failed to get expense ID${NC}"
  exit 1
fi

DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/expenses/${FIRST_EXPENSE_ID}" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $DELETE_RESPONSE"

# Test 7: Verify soft deleted expense is not returned
echo -e "\n${GREEN}Test 7: Verify soft deleted expense is not returned${NC}"
VERIFY_DELETE_RESPONSE=$(curl -s -X GET "${BASE_URL}/expenses" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $VERIFY_DELETE_RESPONSE"

# Test 8: Try to delete already deleted expense
echo -e "\n${GREEN}Test 8: Try to delete already deleted expense${NC}"
DELETE_AGAIN_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/expenses/${FIRST_EXPENSE_ID}" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $DELETE_AGAIN_RESPONSE"

# Test 9: Test invalid expense ID
echo -e "\n${GREEN}Test 9: Test invalid expense ID format${NC}"
INVALID_ID_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/expenses/invalid_id" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $INVALID_ID_RESPONSE"

echo -e "\n${GREEN}Expense Management Tests Completed${NC}" 