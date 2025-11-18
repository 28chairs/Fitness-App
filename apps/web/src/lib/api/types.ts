// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: 'organizer' | 'member' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  leaderboardOptOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'organizer' | 'member';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  logoUrl?: string;
  coverImageUrl?: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  privacy: 'public' | 'private' | 'invite_only';
  leaderboardEnabled: boolean;
  memberCount: number;
  eventCount: number;
  organizer: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityRequest {
  name: string;
  description?: string;
  category: string;
  logoUrl?: string;
  coverImageUrl?: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  privacy?: 'public' | 'private' | 'invite_only';
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  communityId: string;
  community: Community;
  type: 'single' | 'recurring';
  startDate: string;
  endDate: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
  capacity: number;
  currentAttendees: number;
  pricing: {
    type: 'free' | 'fixed' | 'tiered';
    amount?: number;
    currency?: string;
    tiers?: Array<{
      name: string;
      amount: number;
    }>;
    memberDiscount?: number;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
    exceptions?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  type: 'single' | 'recurring';
  startDate: string;
  endDate: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  capacity?: number;
  pricing?: any;
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
}

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  checkInAt?: string;
  createdAt: string;
}

// Membership Types
export interface Membership {
  id: string;
  communityId: string;
  userId: string;
  tier: 'basic' | 'premium' | 'vip' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  price: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  nextBillingDate?: string;
  benefits: string[];
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  communityId?: string;
  type: 'membership' | 'event' | 'merchandise' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  amount: number;
  platformFee: number;
  organizerAmount: number;
  currency: string;
  description?: string;
  paidAt?: string;
  createdAt: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  points: number;
  eventsAttended: number;
  checkIns: number;
}

// Analytics Types
export interface CommunityAnalytics {
  memberCount: number;
  eventCount: number;
  totalRevenue: number;
  recentEvents: number;
  growth: {
    members: number;
    events: number;
    revenue: number;
  };
}

export interface EventMetrics {
  totalEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  popularEvents: Array<{
    id: string;
    title: string;
    attendees: number;
    date: string;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

