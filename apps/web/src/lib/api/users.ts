import { apiClient } from './client';
import type { User } from './types';

export const usersApi = {
  getMe: async (): Promise<User> => {
    return apiClient.get<User>('/users/me');
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    return apiClient.put<User>('/users/me', data);
  },
};

