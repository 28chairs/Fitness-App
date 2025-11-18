'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communitiesApi, eventsApi } from '@/lib/api';
import { CommunityHeader } from '@/components/communities/CommunityHeader';
import { CommunityAbout } from '@/components/communities/CommunityAbout';
import { CommunityEvents } from '@/components/communities/CommunityEvents';
import { CommunityMembers } from '@/components/communities/CommunityMembers';

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communitiesApi.getById(id),
  });

  const { data: events } = useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getAll({ communityId: id }),
    enabled: !!id,
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
          <a href="/communities" className="text-primary-600 hover:text-primary-500">
            Back to communities
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader community={community} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CommunityAbout community={community} />
            <CommunityEvents events={events || []} communityId={id} />
          </div>
          <div className="lg:col-span-1">
            <CommunityMembers community={community} />
          </div>
        </div>
      </div>
    </div>
  );
}

