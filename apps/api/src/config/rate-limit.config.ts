export const rateLimitConfig = {
  ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
  limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  // Stricter limits for auth endpoints
  auth: {
    ttl: 60,
    limit: 5, // 5 attempts per minute
  },
  // Payment endpoints
  payment: {
    ttl: 60,
    limit: 10, // 10 requests per minute
  },
  // General API
  api: {
    ttl: 60,
    limit: 100, // 100 requests per minute
  },
};

