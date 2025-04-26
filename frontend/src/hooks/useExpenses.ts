import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expense.service';
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types/expense.types';

export function useExpenses(filters?: ExpenseFilters) {
  const queryClient = useQueryClient();

  // Single query for expenses with a higher limit to get comprehensive data
  const { data: expensesData, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseService.getExpenses({ ...filters, limit: 100 }),
  });

  // Calculate total expenses from the main data
  const totalExpenses = (expensesData?.expenses ?? []).reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate category summary from the main data
  const categories = (expensesData?.expenses ?? []).reduce((acc, expense) => {
    const currentTotal = acc.get(expense.category) || 0;
    acc.set(expense.category, currentTotal + expense.amount);
    return acc;
  }, new Map<string, number>());

  const categoryData = Array.from(categories.entries()).map(([category, total]) => ({
    category,
    total
  }));

  // Create pagination data
  const pagination = {
    total: expensesData?.pagination.total ?? 0,
    page: filters?.page ?? 1,
    limit: filters?.limit ?? 10,
    pages: Math.ceil((expensesData?.pagination.total ?? 0) / (filters?.limit ?? 10))
  };

  const createExpenseMutation = useMutation({
    mutationFn: (expense: CreateExpenseDTO) => expenseService.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, ...expense }: UpdateExpenseDTO & { id: string }) => 
      expenseService.updateExpense(id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  return {
    expenses: expensesData?.expenses ?? [],
    pagination,
    totalExpenses,
    categories: categoryData,
    isLoading: isLoadingExpenses,
    createExpense: createExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
  };
} 