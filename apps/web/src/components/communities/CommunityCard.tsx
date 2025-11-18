'use client';

import Link from 'next/link';
import type { Community } from '@/lib/api/types';

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/communities/${community.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {community.coverImageUrl ? (
          <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${community.coverImageUrl})` }} />
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600" />
        )}
        <div className="p-6">
          <div className="flex items-center mb-2">
            {community.logoUrl && (
              <img
                src={community.logoUrl}
                alt={community.name}
                className="h-12 w-12 rounded-full mr-3 object-cover"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-900">{community.name}</h3>
          </div>
          {community.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="capitalize">{community.category}</span>
            <span>{community.memberCount} members</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            📍 {community.location.city}, {community.location.state}
          </div>
        </div>
      </div>
    </Link>
  );
}

