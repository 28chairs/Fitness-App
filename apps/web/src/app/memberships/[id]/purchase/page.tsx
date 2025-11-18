'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { communitiesApi } from '@/lib/api';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function MembershipPurchaseContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communitiesApi.getById(id),
  });

  const handlePaymentSuccess = () => {
    router.push(`/communities/${id}?membership=success`);
  };

  const handlePaymentError = (err: string) => {
    setError(err);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Community not found</h1>
        </div>
      </div>
    );
  }

  // Mock membership data - would come from API
  const membershipTiers = [
    {
      id: 'basic',
      name: 'Basic Membership',
      price: 9.99,
      currency: 'USD',
      benefits: ['Access to all events', 'Community feed', 'Basic analytics'],
    },
    {
      id: 'premium',
      name: 'Premium Membership',
      price: 19.99,
      currency: 'USD',
      benefits: ['All Basic features', 'Priority event access', 'Advanced analytics', 'Custom branding'],
    },
  ];

  const [selectedTier, setSelectedTier] = useState(membershipTiers[0]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Join {community.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Membership Tier</h2>
            <div className="space-y-4">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTier.id === tier.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                    <span className="text-xl font-bold text-primary-600">
                      ${tier.price}/{tier.currency === 'USD' ? 'mo' : tier.currency}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <PaymentForm
              amount={selectedTier.price}
              currency={selectedTier.currency}
              type="membership"
              metadata={{
                communityId: id,
                membershipTier: selectedTier.id,
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MembershipPurchasePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <MembershipPurchaseContent params={params} />
    </ProtectedRoute>
  );
}

