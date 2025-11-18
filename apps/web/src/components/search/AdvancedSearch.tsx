'use client';

import { useState } from 'react';
import { LocationPicker } from './LocationPicker';

interface AdvancedSearchProps {
  onSearch: (filters: {
    search?: string;
    category?: string;
    location?: { lat: number; lon: number; radius: string };
    priceRange?: { min?: number; max?: number };
    sortBy?: string;
  }) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [radius, setRadius] = useState('10');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const handleSearch = () => {
    onSearch({
      search: search || undefined,
      category: category || undefined,
      location: location
        ? {
            lat: location.lat,
            lon: location.lon,
            radius: `${radius}mi`,
          }
        : undefined,
      priceRange:
        priceMin || priceMax
          ? {
              min: priceMin ? parseFloat(priceMin) : undefined,
              max: priceMax ? parseFloat(priceMax) : undefined,
            }
          : undefined,
      sortBy,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Advanced Search</h2>

      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities or events..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          <option value="running">Running</option>
          <option value="yoga">Yoga</option>
          <option value="cycling">Cycling</option>
          <option value="crossfit">CrossFit</option>
          <option value="pilates">Pilates</option>
          <option value="dance">Dance</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <LocationPicker
          onLocationSelect={(loc) => setLocation(loc)}
          initialLocation={location || undefined}
        />
        {location && (
          <div className="mt-2">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
              Radius (miles)
            </label>
            <input
              type="number"
              id="radius"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min="1"
              max="100"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Min"
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Max"
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="popularity">Popularity</option>
          <option value="distance">Distance</option>
          <option value="price">Price</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
      >
        Search
      </button>
    </div>
  );
}

