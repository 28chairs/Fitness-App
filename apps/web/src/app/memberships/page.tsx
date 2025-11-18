'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { membershipsApi } from '@/lib/api/memberships';
import { format } from 'date-fns';
import Link from 'next/link';

function MembershipsPageContent() {
  const { data: memberships, isLoading } = useQuery({
    queryKey: ['my-memberships'],
    queryFn: () => membershipsApi.getMyMemberships(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Memberships</h1>

        {memberships && memberships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberships.map((membership) => (
              <div key={membership.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {membership.tier} Membership
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      membership.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : membership.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {membership.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <strong>Billing:</strong> {membership.billingCycle} - ${membership.price}{' '}
                    {membership.currency}
                  </p>
                  {membership.startDate && (
                    <p>
                      <strong>Started:</strong>{' '}
                      {format(new Date(membership.startDate), 'MMM d, yyyy')}
                    </p>
                  )}
                  {membership.nextBillingDate && (
                    <p>
                      <strong>Next Billing:</strong>{' '}
                      {format(new Date(membership.nextBillingDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {membership.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  {membership.status === 'active' && (
                    <button className="flex-1 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                      Cancel
                    </button>
                  )}
                  <Link
                    href={`/communities/${membership.communityId}`}
                    className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Community
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">You don't have any active memberships.</p>
            <Link
              href="/communities"
              className="inline-block px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Communities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MembershipsPage() {
  return (
    <ProtectedRoute>
      <MembershipsPageContent />
    </ProtectedRoute>
  );
}

