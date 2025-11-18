import { render, screen } from '@testing-library/react';
import { EventCard } from '../events/EventCard';
import type { Event } from '@/lib/api/types';

const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  description: 'Test Description',
  communityId: 'community-1',
  community: {
    id: 'community-1',
    name: 'Test Community',
    slug: 'test-community',
    category: 'running',
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    privacy: 'public',
    leaderboardEnabled: true,
    memberCount: 100,
    eventCount: 10,
    organizer: {
      id: 'user-1',
      email: 'organizer@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'organizer',
      status: 'active',
      emailVerified: true,
      leaderboardOptOut: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  type: 'single',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  location: {
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  capacity: 50,
  currentAttendees: 25,
  pricing: {
    type: 'free',
  },
  status: 'published',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('EventCard', () => {
  it('renders event information', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('25 attending')).toBeInTheDocument();
  });
});

