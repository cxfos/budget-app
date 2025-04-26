import { Expense, ExpenseFilters } from '../../types/expense.types';
import SearchControls from './SearchControls';
import ExpenseResults from './ExpenseResults';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onUpdate: (expense: { id: string; amount: number; description: string; category: string; date: string }) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  filters: ExpenseFilters;
  onFilterChange: (filters: Partial<ExpenseFilters>) => void;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function ExpenseList({
  expenses,
  isLoading,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  filters,
  onFilterChange,
  pagination,
}: ExpenseListProps) {

  const handlePageChange = (newPage: number) => {
    onFilterChange({ page: newPage });
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <SearchControls 
          filters={filters} 
          onFilterChange={onFilterChange} 
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <SearchControls 
        filters={filters} 
        onFilterChange={onFilterChange} 
      />
      <ExpenseResults 
        expenses={expenses}
        pagination={pagination}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onPageChange={handlePageChange}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
} 