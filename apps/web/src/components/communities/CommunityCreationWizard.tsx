'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { communitiesApi } from '@/lib/api';
import type { CreateCommunityRequest } from '@/lib/api/types';

const step1Schema = z.object({
  name: z.string().min(1, 'Community name is required'),
  category: z.string().min(1, 'Category is required'),
});

const step2Schema = z.object({
  description: z.string().optional(),
});

const step3Schema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

const step4Schema = z.object({
  privacy: z.enum(['public', 'private', 'invite_only']).default('public'),
});

const CATEGORIES = [
  { value: 'running', label: 'Running' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'dance', label: 'Dance' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'pickleball', label: 'Pickleball' },
  { value: 'other', label: 'Other' },
];

export function CommunityCreationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateCommunityRequest>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: '', category: '' },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: { description: '' },
  });

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const step4Form = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: { privacy: 'public' as const },
  });

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  });

  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  });

  const handleStep3 = step3Form.handleSubmit(async (data) => {
    // Get coordinates from address (simplified - would use geocoding API)
    const location = {
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      latitude: 0, // Would be geocoded
      longitude: 0, // Would be geocoded
    };
    setFormData({ ...formData, location });
    setStep(4);
  });

  const handleStep4 = step4Form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const community = await communitiesApi.create({
        ...formData,
        ...data,
        location: formData.location!,
      } as CreateCommunityRequest);
      router.push(`/communities/${community.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create community. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 5 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Basic Info</span>
          <span>Description</span>
          <span>Location</span>
          <span>Settings</span>
          <span>Review</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Community Name *
            </label>
            <input
              {...step1Form.register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g., Downtown Running Club"
            />
            {step1Form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {step1Form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              {...step1Form.register('category')}
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {step1Form.formState.errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {step1Form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Description */}
      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...step2Form.register('description')}
              id="description"
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Tell people about your community..."
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <form onSubmit={handleStep3} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              {...step3Form.register('address')}
              type="text"
              id="address"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {step3Form.formState.errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {step3Form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                {...step3Form.register('city')}
                type="text"
                id="city"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State *
              </label>
              <input
                {...step3Form.register('state')}
                type="text"
                id="state"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                Zip Code *
              </label>
              <input
                {...step3Form.register('zipCode')}
                type="text"
                id="zipCode"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                {...step3Form.register('country')}
                type="text"
                id="country"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Privacy Settings */}
      {step === 4 && (
        <form onSubmit={handleStep4} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Privacy Settings
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  {...step4Form.register('privacy')}
                  type="radio"
                  value="public"
                  className="mr-2"
                />
                <div>
                  <span className="font-medium">Public</span>
                  <p className="text-sm text-gray-500">Anyone can find and join your community</p>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  {...step4Form.register('privacy')}
                  type="radio"
                  value="private"
                  className="mr-2"
                />
                <div>
                  <span className="font-medium">Private</span>
                  <p className="text-sm text-gray-500">Only members can see your community</p>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  {...step4Form.register('privacy')}
                  type="radio"
                  value="invite_only"
                  className="mr-2"
                />
                <div>
                  <span className="font-medium">Invite Only</span>
                  <p className="text-sm text-gray-500">People need an invitation to join</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Review</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>Location:</strong> {formData.location?.city}, {formData.location?.state}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

