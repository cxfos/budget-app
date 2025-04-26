import React, { useState, useEffect, useRef, memo } from 'react';
import { ExpenseFilters } from '../../types/expense.types';

interface SearchControlsProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: Partial<ExpenseFilters>) => void;
}

// Using memo to prevent re-renders when parent components change but props remain the same
const SearchControls = memo(({ filters, onFilterChange }: SearchControlsProps) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const searchTimeoutRef = useRef<number | null>(null);

  // Only update local search input when the filter changes from an external source
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search || '');
    }
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to update the actual filter after 500ms
    searchTimeoutRef.current = window.setTimeout(() => {
      onFilterChange({ search: value, page: 1 }); // Reset to page 1 when search changes
    }, 500);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category: e.target.value, page: 1 });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value, page: 1 });
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="px-4 py-5 sm:px-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          name="search"
          id="search"
          value={searchInput}
          onChange={handleSearchChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          placeholder="Search expenses..."
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          value={filters.category}
          onChange={handleCategoryChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={filters.startDate}
          onChange={handleDateChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={filters.endDate}
          onChange={handleDateChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
});

SearchControls.displayName = 'SearchControls';

export default SearchControls; 