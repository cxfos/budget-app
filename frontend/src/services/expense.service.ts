import api from './api';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types/expense.types';

// Track the last expenses query result for reuse
let lastExpensesResult: { 
  expenses: Expense[]; 
  pagination: { total: number; page: number; limit: number; pages: number };
  timestamp: number;
  filters?: string;
  total?: number;
} | null = null;

// Helper function to convert camelCase filter names to snake_case
const convertFiltersToSnakeCase = (filters?: ExpenseFilters) => {
  if (!filters) return {};
  
  const convertedFilters: Record<string, any> = {};
  
  // Format dates properly for the backend (YYYY-MM-DD)
  if (filters.startDate) {
    // Make sure we're sending just the date part in the proper format
    const startDate = new Date(filters.startDate);
    if (!isNaN(startDate.getTime())) {
      convertedFilters.start_date = startDate.toISOString().split('T')[0];
      console.log('Formatted start date:', convertedFilters.start_date);
    } else {
      console.warn('Invalid start date:', filters.startDate);
      convertedFilters.start_date = filters.startDate;
    }
  }
  
  if (filters.endDate) {
    // Make sure we're sending just the date part in the proper format
    const endDate = new Date(filters.endDate);
    if (!isNaN(endDate.getTime())) {
      convertedFilters.end_date = endDate.toISOString().split('T')[0];
      console.log('Formatted end date:', convertedFilters.end_date);
    } else {
      console.warn('Invalid end date:', filters.endDate);
      convertedFilters.end_date = filters.endDate;
    }
  }
  
  // Add other filters
  if (filters.category) convertedFilters.category = filters.category;
  if (filters.search) convertedFilters.search = filters.search;
  if (filters.page) convertedFilters.page = filters.page;
  if (filters.limit) convertedFilters.limit = filters.limit;
  
  console.log('Converted filters:', convertedFilters);
  return convertedFilters;
};

// Helper function to format date strings to ISO 8601
const formatDateToISO = (dateString: string): string => {
  // If it's already in ISO format, return as is
  if (dateString.includes('T')) return dateString;
  
  // Add time component to make it a full ISO 8601 date
  return `${dateString}T00:00:00Z`;
};

export const expenseService = {
  async getExpenses(filters?: ExpenseFilters): Promise<{ expenses: Expense[]; pagination: { total: number; page: number; limit: number; pages: number } }> {
    const convertedFilters = convertFiltersToSnakeCase(filters);
    const filtersString = JSON.stringify(convertedFilters);
    
    // Check if we can reuse an existing result
    if (lastExpensesResult && 
        Date.now() - lastExpensesResult.timestamp < 5000 && 
        lastExpensesResult.filters === filtersString) {
      return {
        expenses: lastExpensesResult.expenses,
        pagination: lastExpensesResult.pagination
      };
    }
    
    const { data } = await api.get('/expenses', { params: convertedFilters });
    
    // Store the result for potential reuse
    lastExpensesResult = { 
      ...data, 
      timestamp: Date.now(),
      filters: filtersString
    };
    
    return data;
  },

  async getExpense(id: string): Promise<Expense> {
    const { data } = await api.get(`/expenses/${id}`);
    return data.expense;
  },

  async createExpense(expense: CreateExpenseDTO): Promise<Expense> {
    // Ensure amount is a number and format date properly
    const formattedExpense = {
      ...expense,
      amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
      date: formatDateToISO(expense.date)
    };
    
    const { data } = await api.post('/expenses', formattedExpense);
    return data.expense;
  },

  async updateExpense(id: string, expense: UpdateExpenseDTO): Promise<void> {
    // Format date if it exists
    const formattedExpense = { ...expense };
    if (formattedExpense.date) {
      formattedExpense.date = formatDateToISO(formattedExpense.date);
    }
    
    // Ensure amount is a number if it exists
    if (formattedExpense.amount !== undefined && typeof formattedExpense.amount === 'string') {
      formattedExpense.amount = parseFloat(formattedExpense.amount as unknown as string);
    }
    
    await api.put(`/expenses/${id}`, formattedExpense);
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  async getTotalExpenses(filters?: ExpenseFilters): Promise<number> {
    const convertedFilters = convertFiltersToSnakeCase(filters);
    const filtersString = JSON.stringify(convertedFilters);
    
    // Check if we can reuse an existing result
    if (lastExpensesResult && 
        Date.now() - lastExpensesResult.timestamp < 5000 && 
        lastExpensesResult.filters === filtersString &&
        lastExpensesResult.total !== undefined) {
      return lastExpensesResult.total;
    }
    
    const { data } = await api.get('/expenses/total', { params: convertedFilters });
    
    // Update the last result with the total
    if (lastExpensesResult && lastExpensesResult.filters === filtersString) {
      lastExpensesResult.total = data.total;
    }
    
    return data.total;
  },

  async getCategorySummary(filters?: ExpenseFilters): Promise<{ category: string; total: number }[]> {
    const convertedFilters = convertFiltersToSnakeCase(filters);
    const filtersString = JSON.stringify(convertedFilters);
    
    // Check if we can reuse an existing result
    if (lastExpensesResult && 
        Date.now() - lastExpensesResult.timestamp < 5000 && 
        lastExpensesResult.filters === filtersString) {
      
      // Use the cached data to calculate category summaries
      const categoryMap = new Map<string, number>();
      
      lastExpensesResult.expenses.forEach((expense: Expense) => {
        const currentTotal = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, currentTotal + expense.amount);
      });
      
      const categoryData = Array.from(categoryMap.entries()).map(([category, total]) => ({
        category,
        total
      }));
      
      return categoryData;
    }
    
    // If we don't have cached data or it's too old, make a new API call
    // Use a higher limit to get more comprehensive category data
    const { data } = await api.get('/expenses', { 
      params: { 
        ...convertedFilters, 
        limit: 100,
        page: undefined // Don't include pagination for category summary
      } 
    });
    
    // Store for potential reuse
    lastExpensesResult = { 
      ...data, 
      timestamp: Date.now(),
      filters: filtersString
    };
    
    const categoryMap = new Map<string, number>();
    
    data.expenses.forEach((expense: Expense) => {
      const currentTotal = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentTotal + expense.amount);
    });
    
    const categoryData = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total
    }));
    
    return categoryData;
  }
}; 