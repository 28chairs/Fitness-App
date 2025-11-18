'use client';

import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';
import { EventCard } from '@/components/events/EventCard';
import { EventCalendar } from '@/components/events/EventCalendar';
import { useState } from 'react';

type ViewMode = 'list' | 'calendar';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsApi.getAll(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
            <p className="mt-2 text-gray-600">Discover fitness events near you</p>
          </div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {viewMode === 'list' && events && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {viewMode === 'calendar' && events && <EventCalendar events={events} />}

        {events && events.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No upcoming events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

