'use client';

import { useState } from 'react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'running', label: 'Running' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'dance', label: 'Dance' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'pickleball', label: 'Pickleball' },
];

interface CommunityFiltersProps {
  filters: {
    search: string;
    category: string;
    location: { lat: number; lon: number; radius: string } | null;
  };
  onFiltersChange: (filters: any) => void;
}

export function CommunityFilters({ filters, onFiltersChange }: CommunityFiltersProps) {
  const [search, setSearch] = useState(filters.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              onFiltersChange({ search: '', category: '', location: null });
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

