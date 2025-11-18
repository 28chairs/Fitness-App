'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { communitiesApi } from '@/lib/api';
import type { Community } from '@/lib/api/types';

interface CommunityHeaderProps {
  community: Community;
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const { isAuthenticated } = useAuthStore();
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setIsJoining(true);
    try {
      await communitiesApi.join(community.id);
      setIsMember(true);
    } catch (error) {
      console.error('Failed to join community:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-white shadow">
      {community.coverImageUrl ? (
        <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${community.coverImageUrl})` }} />
      ) : (
        <div className="h-64 bg-gradient-to-br from-primary-400 to-primary-600" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {community.logoUrl && (
              <img
                src={community.logoUrl}
                alt={community.name}
                className="h-20 w-20 rounded-full mr-4 object-cover border-4 border-white shadow-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
              <p className="text-gray-600 mt-1">
                📍 {community.location.city}, {community.location.state}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{community.memberCount} members</span>
                <span>{community.eventCount} events</span>
                <span className="capitalize">{community.category}</span>
              </div>
            </div>
          </div>
          {!isMember && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isJoining ? 'Joining...' : 'Join Community'}
            </button>
          )}
          {isMember && (
            <span className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white">
              Member
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

