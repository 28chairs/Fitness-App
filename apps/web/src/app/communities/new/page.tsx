'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CommunityCreationWizard } from '@/components/communities/CommunityCreationWizard';

function CreateCommunityPageContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Community</h1>
          <CommunityCreationWizard />
        </div>
      </div>
    </div>
  );
}

export default function CreateCommunityPage() {
  return (
    <ProtectedRoute>
      <CreateCommunityPageContent />
    </ProtectedRoute>
  );
}

