'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { Event } from '@/lib/api/types';

interface CommunityEventsProps {
  events: Event[];
  communityId: string;
}

export function CommunityEvents({ events, communityId }: CommunityEventsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        <Link
          href={`/communities/${communityId}/events/new`}
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Create Event
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-400 italic">No upcoming events.</p>
      ) : (
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                📍 {event.location.city}, {event.location.state}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>{event.currentAttendees} attending</span>
                {event.capacity > 0 && <span>Capacity: {event.capacity}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

