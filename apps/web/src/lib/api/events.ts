import { apiClient } from './client';
import type { Event, CreateEventRequest, EventRSVP } from './types';

export const eventsApi = {
  getAll: async (params?: { communityId?: string }): Promise<Event[]> => {
    return apiClient.get<Event[]>('/events', { params });
  },

  getById: async (id: string): Promise<Event> => {
    return apiClient.get<Event>(`/events/${id}`);
  },

  create: async (communityId: string, data: CreateEventRequest): Promise<Event> => {
    return apiClient.post<Event>(`/events/communities/${communityId}`, data);
  },

  update: async (id: string, data: Partial<CreateEventRequest>): Promise<Event> => {
    return apiClient.put<Event>(`/events/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  rsvp: async (id: string): Promise<EventRSVP> => {
    return apiClient.post<EventRSVP>(`/events/${id}/rsvp`);
  },

  cancelRsvp: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}/rsvp`);
  },
};

