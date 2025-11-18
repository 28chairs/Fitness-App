'use client';

import type { Community } from '@/lib/api/types';

interface CommunityAboutProps {
  community: Community;
}

export function CommunityAbout({ community }: CommunityAboutProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
      {community.description ? (
        <p className="text-gray-600 whitespace-pre-wrap">{community.description}</p>
      ) : (
        <p className="text-gray-400 italic">No description provided.</p>
      )}
    </div>
  );
}

