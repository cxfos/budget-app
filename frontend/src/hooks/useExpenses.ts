import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expense.service';
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types/expense.types';

export function useExpenses(filters?: ExpenseFilters) {
  const queryClient = useQueryClient();

  const { data: expensesData, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseService.getExpenses(filters),
  });

  const { data: totalExpenses, isLoading: isLoadingTotal } = useQuery({
    queryKey: ['totalExpenses', filters],
    queryFn: () => expenseService.getTotalExpenses(filters),
  });

  const { data: categoryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['expensesByCategory', filters],
    queryFn: () => expenseService.getCategorySummary(filters),
  });

  const createExpenseMutation = useMutation({
    mutationFn: (expense: CreateExpenseDTO) => expenseService.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['totalExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesByCategory'] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, ...expense }: UpdateExpenseDTO & { id: string }) => 
      expenseService.updateExpense(id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['totalExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesByCategory'] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['totalExpenses'] });
      queryClient.invalidateQueries({ queryKey: ['expensesByCategory'] });
    },
  });

  return {
    expenses: expensesData?.expenses ?? [],
    pagination: expensesData?.pagination ?? { total: 0, page: 1, limit: 10, pages: 0 },
    totalExpenses: totalExpenses ?? 0,
    categories: categoryData ?? [],
    isLoading: isLoadingExpenses || isLoadingTotal || isLoadingCategories,
    createExpense: createExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    isCreating: createExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
  };
} 