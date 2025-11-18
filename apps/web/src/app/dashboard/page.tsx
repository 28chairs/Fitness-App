'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/lib/store/auth-store';
import { useQuery } from '@tanstack/react-query';
import { communitiesApi, eventsApi } from '@/lib/api';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuthStore();

  const { data: myCommunities } = useQuery({
    queryKey: ['my-communities'],
    queryFn: () => communitiesApi.getAll(),
    enabled: !!user,
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => eventsApi.getAll(),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome back, {user?.firstName}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Communities</h2>
                <Link
                  href="/communities/new"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Create Community
                </Link>
              </div>
              {myCommunities && myCommunities.length > 0 ? (
                <div className="space-y-3">
                  {myCommunities.slice(0, 5).map((community) => (
                    <Link
                      key={community.id}
                      href={`/communities/${community.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300"
                    >
                      <p className="font-medium text-gray-900">{community.name}</p>
                      <p className="text-sm text-gray-500">{community.memberCount} members</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">You haven't joined any communities yet.</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300"
                    >
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No upcoming events.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/communities"
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Discover Communities
                </Link>
                <Link
                  href="/events"
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Browse Events
                </Link>
                <Link
                  href="/leaderboards"
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Leaderboards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

