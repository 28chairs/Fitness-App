import { render, screen } from '@testing-library/react';
import { CommunityCard } from '../communities/CommunityCard';
import type { Community } from '@/lib/api/types';

const mockCommunity: Community = {
  id: '1',
  name: 'Test Community',
  slug: 'test-community',
  description: 'Test Description',
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
};

describe('CommunityCard', () => {
  it('renders community information', () => {
    render(<CommunityCard community={mockCommunity} />);
    expect(screen.getByText('Test Community')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('100 members')).toBeInTheDocument();
  });
});

