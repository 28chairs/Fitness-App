'use client';

import type { Community } from '@/lib/api/types';

interface CommunityMembersProps {
  community: Community;
}

export function CommunityMembers({ community }: CommunityMembersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Members</h2>
      <div className="text-center py-8">
        <p className="text-3xl font-bold text-primary-600">{community.memberCount}</p>
        <p className="text-gray-600 mt-2">Active Members</p>
      </div>
      <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        View All Members
      </button>
    </div>
  );
}

