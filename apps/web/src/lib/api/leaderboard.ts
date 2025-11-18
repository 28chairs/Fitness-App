import { apiClient } from './client';
import type { LeaderboardEntry } from './types';

export const leaderboardApi = {
  getLocalLeaderboard: async (
    communityId: string,
    period: string = 'all-time'
  ): Promise<LeaderboardEntry[]> => {
    return apiClient.get<LeaderboardEntry[]>(`/leaderboards/communities/${communityId}`, {
      params: { period },
    });
  },

  getGlobalLeaderboard: async (
    period: string = 'all-time',
    activityType?: string
  ): Promise<LeaderboardEntry[]> => {
    return apiClient.get<LeaderboardEntry[]>('/leaderboards/global', {
      params: { period, activityType },
    });
  },
};

