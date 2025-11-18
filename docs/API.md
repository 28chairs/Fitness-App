# API Documentation

## Base URL

- **Development:** `http://localhost:3001/api/v1`
- **Production:** `https://api.yourdomain.com/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Body: {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'organizer' | 'member'
}
Response: {
  user: User
  accessToken: string
  refreshToken: string
}
```

#### Login
```
POST /auth/login
Body: {
  email: string
  password: string
}
Response: {
  user: User
  accessToken: string
  refreshToken: string
}
```

#### Refresh Token
```
POST /auth/refresh
Body: {
  refreshToken: string
}
Response: {
  accessToken: string
}
```

### Communities

#### Get All Communities
```
GET /communities
Query Params: {
  search?: string
  category?: string
  location?: { lat: number, lon: number, radius: string }
}
Response: Community[]
```

#### Get Community by ID
```
GET /communities/:id
Response: Community
```

#### Create Community
```
POST /communities
Body: CreateCommunityRequest
Response: Community
```

#### Update Community
```
PUT /communities/:id
Body: Partial<CreateCommunityRequest>
Response: Community
```

#### Join Community
```
POST /communities/:id/join
Response: void
```

#### Leave Community
```
DELETE /communities/:id/leave
Response: void
```

### Events

#### Get All Events
```
GET /events
Query Params: {
  communityId?: string
}
Response: Event[]
```

#### Get Event by ID
```
GET /events/:id
Response: Event
```

#### Create Event
```
POST /events/communities/:communityId
Body: CreateEventRequest
Response: Event
```

#### Update Event
```
PUT /events/:id
Body: Partial<CreateEventRequest>
Response: Event
```

#### RSVP to Event
```
POST /events/:id/rsvp
Response: EventRSVP
```

#### Cancel RSVP
```
DELETE /events/:id/rsvp
Response: void
```

### Payments

#### Create Payment Intent
```
POST /payments/create-intent
Body: {
  amount: number
  currency: string
  type: 'membership' | 'event' | 'merchandise'
  metadata?: any
}
Response: {
  clientSecret: string
}
```

#### Get Transactions
```
GET /payments/transactions
Response: Transaction[]
```

### Analytics

#### Get Community Analytics
```
GET /analytics/communities/:id
Response: CommunityAnalytics
```

#### Get Event Metrics
```
GET /analytics/communities/:id/events
Query Params: {
  startDate?: string
  endDate?: string
}
Response: EventMetrics
```

### Leaderboards

#### Get Local Leaderboard
```
GET /leaderboards/communities/:id
Query Params: {
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time'
}
Response: LeaderboardEntry[]
```

#### Get Global Leaderboard
```
GET /leaderboards/global
Query Params: {
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time'
  activityType?: string
}
Response: LeaderboardEntry[]
```

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Rate Limiting

- **Authentication endpoints:** 5 requests per minute
- **Payment endpoints:** 10 requests per minute
- **General API:** 100 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

