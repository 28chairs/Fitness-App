'use client';

import { useState } from 'react';
import type { CommunityAnalytics, EventMetrics } from '@/lib/api/types';

interface DataExportProps {
  analytics: CommunityAnalytics;
  eventMetrics: EventMetrics;
  communityId: string;
}

export function DataExport({ analytics, eventMetrics, communityId }: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const csvData = [
        ['Metric', 'Value'],
        ['Total Members', analytics.memberCount],
        ['Total Events', analytics.eventCount],
        ['Total Revenue', analytics.totalRevenue],
        ['Average Attendance', Math.round(eventMetrics.averageAttendance)],
        ['Total Attendees', eventMetrics.totalAttendees],
      ];

      const csvContent = csvData.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${communityId}-${new Date().toISOString()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    // PDF export would require a library like jsPDF
    // For MVP, we'll show a message
    alert('PDF export coming soon. Please use CSV export for now.');
    setIsExporting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Data</h2>
      <div className="flex gap-4">
        <button
          onClick={exportToCSV}
          disabled={isExporting}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>
    </div>
  );
}

