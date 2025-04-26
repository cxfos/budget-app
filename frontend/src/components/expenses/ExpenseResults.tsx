import { useState, memo } from 'react';
import { Expense } from '../../types/expense.types';
import { ExpenseCard } from './ExpenseCard';
import { Pagination } from './Pagination';

interface ExpenseResultsProps {
  expenses: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onUpdate: (expense: { id: string; amount: number; description: string; category: string; date: string }) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Using memo to prevent re-renders when parent components change but props remain the same
const ExpenseResults = memo(({
  expenses,
  pagination,
  onUpdate,
  onDelete,
  onPageChange,
  isUpdating,
  isDeleting,
}: ExpenseResultsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {expenses.length === 0 ? (
          <li className="py-4 px-6 text-center text-gray-500">
            No expenses found matching your criteria.
          </li>
        ) : (
          expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              isEditing={editingId === expense.id.toString()}
              onEdit={() => setEditingId(expense.id.toString())}
              onCancelEdit={() => setEditingId(null)}
            />
          ))
        )}
      </ul>
      <div className="mt-4">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
});

ExpenseResults.displayName = 'ExpenseResults';

export default ExpenseResults; 