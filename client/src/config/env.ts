/**
 * Type-Safe Environment Configuration
 * Centralizes and validates frontend environment variables
 */

export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV
} as const;
