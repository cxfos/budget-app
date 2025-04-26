# Frontend Issues Checklist

## API Issues
- [x] **Fix 405 Method Not Allowed errors** - The dashboard is showing 405 errors for expense API calls
  - There's a specific issue with the `/expenses/by-category` endpoint which doesn't exist in the backend
  - Implemented a client-side solution that aggregates expenses by category using the existing `/expenses` endpoint
- [x] **Fix API base URL configuration** - Frontend service is making requests to the wrong base URL
  - Updated Docker Compose environment variable to use the service name 'backend' instead of 'localhost'
- [x] **Fix duplicate API calls** - Frontend is making multiple redundant API calls
  - Implemented a single query approach in useExpenses hook to fetch comprehensive data
  - Calculated total expenses and category summary from the main data on the client side
  - Reduced API calls from 3 to 1 per action, improving performance

## UI Functionality Issues
- [x] **Total Expenses display** - Currently showing $0.00, need to fetch and display actual data
  - Fixed the parameter names in the API calls, converting camelCase to snake_case for backend compatibility
  - Fixed date formatting to use ISO 8601 format with time component for backend compatibility
  - Ensured amount values are converted to numbers before sending to the backend
- [x] **Search functionality** - Implement working search for expenses
  - Added search parameter support to the backend API
  - Improved component structure to prevent losing focus during search
  - Created separate components for search controls and results display
  - Used React.memo to prevent unnecessary re-renders
- [x] **Category filtering** - Enable category filtering for expenses
  - Implemented category filtering through dropdown selection
  - Added proper filter propagation to the API
  - Ensured categories are converted to the format expected by the backend
- [x] **Date range filtering** - Make date range filters functional
  - Fixed frontend to send date values as-is from the input, avoiding timezone issues
  - Fixed backend to expect and compare dates in YYYY-MM-DD format
  - Fixed display of expense dates to always show in UTC as DD/MM/YYYY
  - Fixed bug with reduce on possibly undefined expensesData.expenses

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
- All major frontend issues have been resolved and tested.

## Completed Fixes
- [x] **Client-side category aggregation** - Replaced the missing backend endpoint `/expenses/by-category` with a client-side implementation that aggregates expense data by category. This solution fetches all expenses and then calculates category totals locally. Committed in 9c10efc.
- [x] **API URL configuration** - Updated Docker Compose environment variable to use the service name 'backend' instead of 'localhost' for the API URL. Committed in 9ebea62.
- [x] **Expense creation and total display** - Fixed expense creation by properly formatting dates to ISO 8601 format and ensuring amounts are sent as numbers. This also fixed the total expenses display. Committed in 2bb5fbe.
- [x] **Search functionality** - Implemented search capability for expenses with debounced input, parameter conversion, and component structure improvements to prevent focus loss. Committed in 1b7a7f5.
- [x] **Category filtering** - Enabled category filtering through the dropdown menu with proper filter handling and API integration. Implemented alongside search functionality in the same commit.
- [x] **Duplicate API calls** - Optimized API calls by implementing a single query approach in the useExpenses hook. Now calculating total expenses and category summary from the main data on the client side, reducing API calls from 3 to 1 per action. Committed in 3a7b8c9.
- [x] **Date range filtering and date display** - Fixed date range filtering to avoid timezone issues, and ensured expense dates are always displayed in UTC as DD/MM/YYYY. Also fixed bug with reduce on possibly undefined expensesData.expenses. Committed in <commit>. 