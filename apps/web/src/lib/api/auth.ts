import { apiClient } from './client';
import type { RegisterRequest, LoginRequest, AuthResponse, User } from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      apiClient.setRefreshToken(response.refreshToken);
    }
    return response;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      apiClient.setRefreshToken(response.refreshToken);
    }
    return response;
  },

  logout: () => {
    apiClient.clearTokens();
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
    }
    return response;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },
};

