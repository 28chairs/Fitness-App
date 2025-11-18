'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '@/lib/api/leaderboard';
import { LeaderboardView } from '@/components/leaderboard/LeaderboardView';

export default function LeaderboardsPage() {
  const [view, setView] = useState<'local' | 'global'>('local');
  const [period, setPeriod] = useState('all-time');
  const [communityId, setCommunityId] = useState<string | null>(null);

  const { data: localLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'local', communityId, period],
    queryFn: () => leaderboardApi.getLocalLeaderboard(communityId!, period),
    enabled: view === 'local' && !!communityId,
  });

  const { data: globalLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'global', period],
    queryFn: () => leaderboardApi.getGlobalLeaderboard(period),
    enabled: view === 'global',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Leaderboards</h1>
        <LeaderboardView
          view={view}
          period={period}
          localLeaderboard={localLeaderboard || []}
          globalLeaderboard={globalLeaderboard || []}
          onViewChange={setView}
          onPeriodChange={setPeriod}
        />
      </div>
    </div>
  );
}

