import { z } from 'zod';
import { emailSchema, passwordSchema, paginationQuerySchema } from '../../core/validation/common.schemas.js';

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(2, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'STAFF', 'USER']).default('USER'),
  permissions: z.array(z.string()).optional()
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'STAFF', 'USER']).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

export const queryUserSchema = paginationQuerySchema.extend({
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'STAFF', 'USER']).optional(),
  isActive: z.coerce.boolean().optional()
});
