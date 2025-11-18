import { apiClient } from './client';
import type { Membership } from './types';

export const membershipsApi = {
  getMemberships: async (communityId: string): Promise<Membership[]> => {
    return apiClient.get<Membership[]>(`/memberships/communities/${communityId}`);
  },

  getMyMemberships: async (): Promise<Membership[]> => {
    return apiClient.get<Membership[]>('/memberships/me');
  },

  purchaseMembership: async (data: {
    communityId: string;
    tier: string;
    billingCycle: 'monthly' | 'annual' | 'lifetime';
  }): Promise<Membership> => {
    return apiClient.post<Membership>('/memberships/purchase', data);
  },

  cancelMembership: async (membershipId: string): Promise<void> => {
    await apiClient.delete(`/memberships/${membershipId}`);
  },

  updateMembership: async (membershipId: string, data: { tier?: string }): Promise<Membership> => {
    return apiClient.patch<Membership>(`/memberships/${membershipId}`, data);
  },
};

