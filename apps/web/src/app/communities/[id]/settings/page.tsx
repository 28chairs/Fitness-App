'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { communitiesApi } from '@/lib/api';
import { CommunitySettingsForm } from '@/components/communities/CommunitySettingsForm';

function CommunitySettingsPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communitiesApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Community not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Settings</h1>
          <CommunitySettingsForm community={community} />
        </div>
      </div>
    </div>
  );
}

export default function CommunitySettingsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <CommunitySettingsPageContent params={params} />
    </ProtectedRoute>
  );
}

