import { useState, memo } from 'react';
import { Expense } from '../../types/expense.types';
import { ExpenseCard } from './ExpenseCard';

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
    <>
      <div className="border-t border-gray-200">
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
      </div>

      {pagination.pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ExpenseResults.displayName = 'ExpenseResults';

export default ExpenseResults; 