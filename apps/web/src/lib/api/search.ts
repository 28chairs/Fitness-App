import { apiClient } from './client';
import type { Community, Event } from './types';

export const searchApi = {
  searchCommunities: async (params: {
    search?: string;
    category?: string;
    location?: { lat: number; lon: number; radius: string };
    priceRange?: { min?: number; max?: number };
  }): Promise<Community[]> => {
    return apiClient.get<Community[]>('/search/communities', { params });
  },

  searchEvents: async (params: {
    search?: string;
    communityId?: string;
    location?: { lat: number; lon: number; radius: string };
    dateRange?: { start?: string; end?: string };
  }): Promise<Event[]> => {
    return apiClient.get<Event[]>('/search/events', { params });
  },
};

