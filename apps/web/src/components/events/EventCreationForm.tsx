'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { eventsApi } from '@/lib/api';
import type { CreateEventRequest } from '@/lib/api/types';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  capacity: z.number().min(0).optional(),
  type: z.enum(['single', 'recurring']).default('single'),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventCreationFormProps {
  communityId: string;
}

export function EventCreationForm({ communityId }: EventCreationFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'single',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      setError(null);
      const eventData: CreateEventRequest = {
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          latitude: 0, // Would be geocoded
          longitude: 0, // Would be geocoded
        },
        capacity: data.capacity || 0,
      };

      const event = await eventsApi.create(communityId, eventData);
      router.push(`/events/${event.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create event. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date & Time *
          </label>
          <input
            {...register('startDate')}
            type="datetime-local"
            id="startDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date & Time *
          </label>
          <input
            {...register('endDate')}
            type="datetime-local"
            id="endDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Event Type
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              {...register('type')}
              type="radio"
              value="single"
              className="mr-2"
              onChange={() => setIsRecurring(false)}
            />
            <span>Single Event</span>
          </label>
          <label className="flex items-center">
            <input
              {...register('type')}
              type="radio"
              value="recurring"
              className="mr-2"
              onChange={() => setIsRecurring(true)}
            />
            <span>Recurring Event</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <input
          {...register('address')}
          type="text"
          id="address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            {...register('city')}
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
            {...register('state')}
            type="text"
            id="state"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            Zip Code *
          </label>
          <input
            {...register('zipCode')}
            type="text"
            id="zipCode"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
          Capacity (0 for unlimited)
        </label>
        <input
          {...register('capacity', { valueAsNumber: true })}
          type="number"
          id="capacity"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}

