import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  APP_NAME: z.string().default('Triune Enterprise SaaS'),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required and cannot be empty'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173'),
  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(5)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Config] Invalid environment variables in .env file:');
  console.error(parsed.error.format());
  process.exit(1);
}

// 1:1 direct naming matching .env
export const env = {
  APP_NAME: parsed.data.APP_NAME,
  PORT: parsed.data.PORT,
  NODE_ENV: parsed.data.NODE_ENV,
  MONGO_URI: parsed.data.MONGO_URI,
  JWT_ACCESS_SECRET: parsed.data.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: parsed.data.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: parsed.data.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: parsed.data.JWT_REFRESH_EXPIRES_IN,
  CORS_ORIGIN: parsed.data.CORS_ORIGIN,
  CORS_ORIGINS_ARRAY: parsed.data.CORS_ORIGIN.split(',').map((o) => o.trim()),
  RATE_LIMIT_WINDOW_MINUTES: parsed.data.RATE_LIMIT_WINDOW_MINUTES,
  RATE_LIMIT_MAX_REQUESTS: parsed.data.RATE_LIMIT_MAX_REQUESTS,
  AUTH_RATE_LIMIT_WINDOW_MINUTES: parsed.data.AUTH_RATE_LIMIT_WINDOW_MINUTES,
  AUTH_RATE_LIMIT_MAX_REQUESTS: parsed.data.AUTH_RATE_LIMIT_MAX_REQUESTS
};
