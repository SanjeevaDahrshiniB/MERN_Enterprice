import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { TooManyRequestsError } from '../utils/errors.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired IP records every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export interface RateLimiterOptions {
  windowMinutes: number;
  maxRequests: number;
  prefix?: string;
  message?: string;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const windowMs = options.windowMinutes * 60 * 1000;
  const prefix = options.prefix || 'global';

  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip in test environment
    if (env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${prefix}:${ip}`;
    const now = Date.now();

    let record = memoryStore.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      memoryStore.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, options.maxRequests - record.count);
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > options.maxRequests) {
      res.setHeader('Retry-After', retryAfterSeconds);
      return next(
        new TooManyRequestsError(
          options.message ||
            `Too many requests from this IP. Please try again after ${options.windowMinutes} minutes.`
        )
      );
    }

    next();
  };
}

// 1. Global API Rate Limiter
export const globalRateLimiter = createRateLimiter({
  prefix: 'api',
  windowMinutes: env.RATE_LIMIT_WINDOW_MINUTES,
  maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  message: `Too many API requests. Please slow down and try again in ${env.RATE_LIMIT_WINDOW_MINUTES} minutes.`
});

// 2. Strict Auth Rate Limiter (Login / Register brute force protection)
export const authRateLimiter = createRateLimiter({
  prefix: 'auth',
  windowMinutes: env.AUTH_RATE_LIMIT_WINDOW_MINUTES,
  maxRequests: env.AUTH_RATE_LIMIT_MAX_REQUESTS,
  message: `Too many login attempts. Access blocked for ${env.AUTH_RATE_LIMIT_WINDOW_MINUTES} minutes to protect your account.`
});
