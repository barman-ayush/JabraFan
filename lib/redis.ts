/* eslint-disable no-var */
import { Redis } from 'ioredis';

// Define a type for the global object with our redis property
declare global {
  var redis: Redis | undefined;
}

// Create the Redis client
export const redis = global.redis || new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Save our instance if we're in development
if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}

export default redis;