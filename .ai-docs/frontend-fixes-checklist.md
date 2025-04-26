# Frontend Issues Checklist

## API Issues
- [x] **Fix 405 Method Not Allowed errors** - The dashboard is showing 405 errors for expense API calls
  - There's a specific issue with the `/expenses/by-category` endpoint which doesn't exist in the backend
  - Implemented a client-side solution that aggregates expenses by category using the existing `/expenses` endpoint
- [x] **Fix API base URL configuration** - Frontend service is making requests to the wrong base URL
  - Updated Docker Compose environment variable to use the service name 'backend' instead of 'localhost'

## UI Functionality Issues
- [ ] **Total Expenses display** - Currently showing $0.00, need to fetch and display actual data
  - Fixed the parameter names in the API calls, converting camelCase to snake_case for backend compatibility
  - Fixed date formatting to use ISO 8601 format with time component for backend compatibility
  - Ensured amount values are converted to numbers before sending to the backend
- [ ] **Search functionality** - Implement working search for expenses
- [ ] **Category filtering** - Enable category filtering for expenses
- [ ] **Date range filtering** - Make date range filters functional

## Fix Process
For each issue, follow these steps exactly:

1. **Analysis**: Check backend to know what the frontend should be doing (do not change backend)
2. **Implementation**: Make the fix for the item
3. **Build**: Rebuild frontend docker
4. **Manual Testing**: Wait for user confirmation that the fix works as expected
   - If issues are found, note them and go back to step 2
5. **Commit**: Only after manual testing is confirmed successful, create a commit with a short, present tense message
6. **Next Item**: Move to the next item on the checklist

## Current Status
- **Total Expenses display**: 
  - ✅ Analysis completed
  - ✅ Implementation completed
  - ✅ Build completed
  - ⏳ Waiting for manual testing confirmation
  - ⏳ Commit pending

## Completed Fixes
- [x] **Client-side category aggregation** - Replaced the missing backend endpoint `/expenses/by-category` with a client-side implementation that aggregates expense data by category. This solution fetches all expenses and then calculates category totals locally. Committed in 9c10efc.
- [x] **API URL configuration** - Updated Docker Compose environment variable to use the service name 'backend' instead of 'localhost' for the API URL. Committed in 9ebea62. 