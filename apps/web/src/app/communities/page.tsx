'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communitiesApi, searchApi } from '@/lib/api';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { CommunityFilters } from '@/components/communities/CommunityFilters';
import { CommunityMapView } from '@/components/communities/CommunityMapView';

type ViewMode = 'list' | 'map';

export default function CommunitiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: null as { lat: number; lon: number; radius: string } | null,
  });

  const { data: communities, isLoading, error } = useQuery({
    queryKey: ['communities', filters],
    queryFn: () => {
      if (filters.search || filters.category || filters.location) {
        return searchApi.searchCommunities(filters);
      }
      return communitiesApi.getAll();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Discover Communities</h1>
          <p className="mt-2 text-gray-600">Find fitness communities near you</p>
        </div>

        <CommunityFilters filters={filters} onFiltersChange={setFilters} />

        <div className="mt-6 flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Map
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Failed to load communities. Please try again.
          </div>
        )}

        {viewMode === 'list' && communities && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}

        {viewMode === 'map' && communities && (
          <CommunityMapView communities={communities} />
        )}

        {communities && communities.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No communities found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

