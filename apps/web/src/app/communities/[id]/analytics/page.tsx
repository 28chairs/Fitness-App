'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { analyticsApi } from '@/lib/api/analytics';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { DataExport } from '@/components/analytics/DataExport';

function CommunityAnalyticsPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => analyticsApi.getCommunityAnalytics(id),
  });

  const { data: eventMetrics } = useQuery({
    queryKey: ['event-metrics', id],
    queryFn: () => analyticsApi.getEventMetrics(id),
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
        {analytics && eventMetrics && (
          <>
            <AnalyticsDashboard analytics={analytics} eventMetrics={eventMetrics} />
            <div className="mt-6">
              <DataExport analytics={analytics} eventMetrics={eventMetrics} communityId={id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CommunityAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <CommunityAnalyticsPageContent params={params} />
    </ProtectedRoute>
  );
}

