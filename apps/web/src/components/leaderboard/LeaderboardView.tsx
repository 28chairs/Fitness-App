'use client';

import type { LeaderboardEntry } from '@/lib/api/types';

interface LeaderboardViewProps {
  view: 'local' | 'global';
  period: string;
  localLeaderboard: LeaderboardEntry[];
  globalLeaderboard: LeaderboardEntry[];
  onViewChange: (view: 'local' | 'global') => void;
  onPeriodChange: (period: string) => void;
}

export function LeaderboardView({
  view,
  period,
  localLeaderboard,
  globalLeaderboard,
  onViewChange,
  onPeriodChange,
}: LeaderboardViewProps) {
  const leaderboard = view === 'local' ? localLeaderboard : globalLeaderboard;
  const periods = ['daily', 'weekly', 'monthly', 'all-time'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange('local')}
            className={`px-4 py-2 rounded-md ${
              view === 'local'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Local
          </button>
          <button
            onClick={() => onViewChange('global')}
            className={`px-4 py-2 rounded-md ${
              view === 'global'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Global
          </button>
        </div>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          {periods.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  entry.rank === 1
                    ? 'bg-yellow-400 text-yellow-900'
                    : entry.rank === 2
                    ? 'bg-gray-300 text-gray-700'
                    : entry.rank === 3
                    ? 'bg-orange-400 text-orange-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {entry.rank}
              </div>
              {entry.avatarUrl ? (
                <img
                  src={entry.avatarUrl}
                  alt={entry.userName}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {entry.userName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{entry.userName}</p>
                <p className="text-sm text-gray-500">
                  {entry.eventsAttended} events • {entry.checkIns} check-ins
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary-600">{entry.points}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

