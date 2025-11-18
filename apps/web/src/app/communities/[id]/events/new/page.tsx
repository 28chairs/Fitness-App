'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EventCreationForm } from '@/components/events/EventCreationForm';

function CreateEventPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>
          <EventCreationForm communityId={id} />
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <CreateEventPageContent params={params} />
    </ProtectedRoute>
  );
}

