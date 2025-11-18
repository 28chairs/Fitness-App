'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { eventsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { RSVPButton } from '@/components/events/RSVPButton';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h1>
          <a href="/events" className="text-primary-600 hover:text-primary-500">
            Back to events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        {event.imageUrl ? (
          <div className="h-96 bg-cover bg-center" style={{ backgroundImage: `url(${event.imageUrl})` }} />
        ) : (
          <div className="h-96 bg-gradient-to-br from-primary-400 to-primary-600" />
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              {event.description && (
                <p className="text-gray-600 whitespace-pre-wrap mb-6">{event.description}</p>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Date & Time</h3>
                  <p className="text-gray-600">
                    {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-gray-600">
                    {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">{event.location.address}</p>
                  <p className="text-gray-600">
                    {event.location.city}, {event.location.state} {event.location.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Attendees</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {event.currentAttendees}
                    {event.capacity > 0 && ` / ${event.capacity}`}
                  </span>
                </div>
                {event.capacity > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(event.currentAttendees / event.capacity) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              {isAuthenticated ? (
                <RSVPButton event={event} />
              ) : (
                <a
                  href="/login"
                  className="block w-full text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign in to RSVP
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

