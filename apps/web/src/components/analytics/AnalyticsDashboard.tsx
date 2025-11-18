'use client';

import type { CommunityAnalytics, EventMetrics } from '@/lib/api/types';

interface AnalyticsDashboardProps {
  analytics: CommunityAnalytics;
  eventMetrics: EventMetrics;
}

export function AnalyticsDashboard({ analytics, eventMetrics }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Members</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.memberCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Events</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.eventCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${analytics.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Avg Attendance</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Math.round(eventMetrics.averageAttendance)}
          </p>
        </div>
      </div>

      {/* Event Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Performance</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{eventMetrics.totalEvents}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Attendees</p>
            <p className="text-2xl font-bold text-gray-900">{eventMetrics.totalAttendees}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Attendance</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(eventMetrics.averageAttendance)}
            </p>
          </div>
        </div>
      </div>

      {/* Popular Events */}
      {eventMetrics.popularEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Events</h2>
          <div className="space-y-3">
            {eventMetrics.popularEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-lg font-semibold text-primary-600">{event.attendees} attendees</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

