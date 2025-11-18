'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { Event } from '@/lib/api/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {event.imageUrl ? (
          <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${event.imageUrl})` }} />
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600" />
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
          {event.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
          )}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>{format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>{event.location.city}, {event.location.state}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span>{event.currentAttendees} attending</span>
              {event.capacity > 0 && (
                <span className="text-primary-600">
                  {event.capacity - event.currentAttendees} spots left
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

