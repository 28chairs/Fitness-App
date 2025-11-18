import { apiClient } from './client';
import type { CommunityAnalytics, EventMetrics } from './types';

export const analyticsApi = {
  getCommunityAnalytics: async (communityId: string): Promise<CommunityAnalytics> => {
    return apiClient.get<CommunityAnalytics>(`/analytics/communities/${communityId}`);
  },

  getEventMetrics: async (
    communityId: string,
    startDate?: string,
    endDate?: string
  ): Promise<EventMetrics> => {
    return apiClient.get<EventMetrics>(`/analytics/communities/${communityId}/events`, {
      params: { startDate, endDate },
    });
  },
};

