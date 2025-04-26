import api from './api';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types/expense.types';

export const expenseService = {
  async getExpenses(filters?: ExpenseFilters): Promise<{ expenses: Expense[]; pagination: { total: number; page: number; limit: number; pages: number } }> {
    const { data } = await api.get('/expenses', { params: filters });
    return data;
  },

  async getExpense(id: string): Promise<Expense> {
    const { data } = await api.get(`/expenses/${id}`);
    return data.expense;
  },

  async createExpense(expense: CreateExpenseDTO): Promise<Expense> {
    const { data } = await api.post('/expenses', expense);
    return data.expense;
  },

  async updateExpense(id: string, expense: UpdateExpenseDTO): Promise<void> {
    await api.put(`/expenses/${id}`, expense);
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  async getTotalExpenses(filters?: ExpenseFilters): Promise<number> {
    const { data } = await api.get('/expenses/total', { params: filters });
    return data.total;
  },

  async getCategorySummary(filters?: ExpenseFilters): Promise<{ category: string; total: number }[]> {
    const { data } = await api.get('/expenses', { params: { ...filters, limit: 100 } });
    
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