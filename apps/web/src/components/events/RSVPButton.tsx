'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';
import type { Event } from '@/lib/api/types';

interface RSVPButtonProps {
  event: Event;
}

export function RSVPButton({ event }: RSVPButtonProps) {
  const [isRsvped, setIsRsvped] = useState(false);
  const queryClient = useQueryClient();

  const rsvpMutation = useMutation({
    mutationFn: () => eventsApi.rsvp(event.id),
    onSuccess: () => {
      setIsRsvped(true);
      queryClient.invalidateQueries({ queryKey: ['event', event.id] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => eventsApi.cancelRsvp(event.id),
    onSuccess: () => {
      setIsRsvped(false);
      queryClient.invalidateQueries({ queryKey: ['event', event.id] });
    },
  });

  const handleRSVP = () => {
    if (isRsvped) {
      cancelMutation.mutate();
    } else {
      rsvpMutation.mutate();
    }
  };

  const isFull = event.capacity > 0 && event.currentAttendees >= event.capacity;

  return (
    <div className="space-y-4">
      {event.pricing && event.pricing.type !== 'free' && (
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            ${event.pricing.amount}
            {event.pricing.currency && ` ${event.pricing.currency}`}
          </p>
        </div>
      )}
      <button
        onClick={handleRSVP}
        disabled={isFull && !isRsvped}
        className={`w-full px-6 py-3 border rounded-md shadow-sm text-sm font-medium ${
          isRsvped
            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            : isFull
            ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'border-transparent text-white bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {rsvpMutation.isPending || cancelMutation.isPending
          ? 'Processing...'
          : isRsvped
          ? 'Cancel RSVP'
          : isFull
          ? 'Event Full'
          : 'RSVP'}
      </button>
      {isFull && !isRsvped && (
        <p className="text-sm text-gray-500 text-center">
          This event is full. You can join the waitlist.
        </p>
      )}
    </div>
  );
}

