export interface Expense {
  id: number;
  user_id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateExpenseDTO {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface UpdateExpenseDTO {
  amount?: number;
  description?: string;
  category?: string;
  date?: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} 