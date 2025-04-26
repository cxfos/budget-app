import api from './api';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types/expense.types';

// Helper function to convert camelCase filter names to snake_case
const convertFiltersToSnakeCase = (filters?: ExpenseFilters) => {
  if (!filters) return {};
  
  const convertedFilters: Record<string, any> = {};
  
  if (filters.startDate) convertedFilters.start_date = filters.startDate;
  if (filters.endDate) convertedFilters.end_date = filters.endDate;
  if (filters.category) convertedFilters.category = filters.category;
  if (filters.search) convertedFilters.search = filters.search;
  if (filters.page) convertedFilters.page = filters.page;
  if (filters.limit) convertedFilters.limit = filters.limit;
  
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
    const { data } = await api.get('/expenses', { params: convertedFilters });
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
    const { data } = await api.get('/expenses/total', { params: convertedFilters });
    return data.total;
  },

  async getCategorySummary(filters?: ExpenseFilters): Promise<{ category: string; total: number }[]> {
    const convertedFilters = convertFiltersToSnakeCase(filters);
    const { data } = await api.get('/expenses', { params: { ...convertedFilters, limit: 100 } });
    
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