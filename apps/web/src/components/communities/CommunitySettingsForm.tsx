'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { communitiesApi } from '@/lib/api';
import type { Community, CreateCommunityRequest } from '@/lib/api/types';

const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  privacy: z.enum(['public', 'private', 'invite_only']),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface CommunitySettingsFormProps {
  community: Community;
}

export function CommunitySettingsForm({ community }: CommunitySettingsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: community.name,
      description: community.description || '',
      privacy: community.privacy,
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setError(null);
      setSuccess(false);
      await communitiesApi.update(community.id, data as Partial<CreateCommunityRequest>);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/communities/${community.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update community. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Settings updated successfully! Redirecting...
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Community Name
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Privacy Settings
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              {...register('privacy')}
              type="radio"
              value="public"
              className="mr-2"
            />
            <span>Public - Anyone can find and join</span>
          </label>
          <label className="flex items-center">
            <input
              {...register('privacy')}
              type="radio"
              value="private"
              className="mr-2"
            />
            <span>Private - Only members can see</span>
          </label>
          <label className="flex items-center">
            <input
              {...register('privacy')}
              type="radio"
              value="invite_only"
              className="mr-2"
            />
            <span>Invite Only - Requires invitation</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

