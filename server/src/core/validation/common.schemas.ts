import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(40, 'Password cannot exceed 40 characters');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional()
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

export function formatZodError(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message
  }));
}
