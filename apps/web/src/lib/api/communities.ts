import { apiClient } from './client';
import type { Community, CreateCommunityRequest, PaginatedResponse } from './types';

export const communitiesApi = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    location?: { lat: number; lon: number; radius: string };
  }): Promise<Community[]> => {
    return apiClient.get<Community[]>('/communities', { params });
  },

  getById: async (id: string): Promise<Community> => {
    return apiClient.get<Community>(`/communities/${id}`);
  },

  create: async (data: CreateCommunityRequest): Promise<Community> => {
    return apiClient.post<Community>('/communities', data);
  },

  update: async (id: string, data: Partial<CreateCommunityRequest>): Promise<Community> => {
    return apiClient.put<Community>(`/communities/${id}`, data);
  },

  join: async (id: string): Promise<void> => {
    await apiClient.post(`/communities/${id}/join`);
  },

  leave: async (id: string): Promise<void> => {
    await apiClient.delete(`/communities/${id}/leave`);
  },
};

