import { z } from 'zod';
import { emailSchema, passwordSchema } from '../../core/validation/common.schemas.js';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  tenantSlug: z.string().optional()
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  tenantSlug: z.string().min(2, 'Tenant slug is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});
