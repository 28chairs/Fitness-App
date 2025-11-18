'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import type { Event } from '@/lib/api/types';
import 'react-calendar/dist/Calendar.css';

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const eventsOnDate = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const eventDates = events.map((event) => new Date(event.startDate));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            tileClassName={({ date }) => {
              const hasEvent = eventDates.some(
                (eventDate) =>
                  eventDate.getDate() === date.getDate() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getFullYear() === date.getFullYear()
              );
              return hasEvent ? 'bg-primary-100 text-primary-700' : '';
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events on {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          {eventsOnDate.length === 0 ? (
            <p className="text-gray-400 italic">No events on this date</p>
          ) : (
            <div className="space-y-3">
              {eventsOnDate.map((event) => (
                <a
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.startDate), 'h:mm a')}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

