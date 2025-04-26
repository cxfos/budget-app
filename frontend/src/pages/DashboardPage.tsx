import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { TotalExpenses } from '../components/dashboard/TotalExpenses';

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    search: '',
    page: 1,
    limit: 10,
  });

  const {
    expenses,
    pagination,
    totalExpenses,
    isLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    isCreating,
    isUpdating,
    isDeleting,
  } = useExpenses(filters);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Add Expense
        </button>
      </div>

      <div className="mb-8">
        <TotalExpenses total={totalExpenses} />
      </div>

      <div className="mt-8">
        <ExpenseList
          expenses={expenses}
          isLoading={isLoading}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          filters={filters}
          onFilterChange={handleFilterChange}
          pagination={pagination}
        />
      </div>

      {isFormOpen && (
        <ExpenseForm
          onSubmit={createExpense}
          onClose={() => setIsFormOpen(false)}
          isLoading={isCreating}
        />
      )}
    </div>
  );
} 