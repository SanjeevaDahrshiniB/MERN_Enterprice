import { z } from 'zod';
import { emailSchema, paginationQuerySchema } from '../../core/validation/common.schemas.js';

export const createStudentSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required').trim(),
  firstName: z.string().min(2, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: emailSchema,
  grade: z.string().min(1, 'Grade is required').trim(),
  section: z.string().min(1, 'Section is required').trim(),
  gender: z.enum(['male', 'female', 'other']),
  status: z.enum(['active', 'inactive', 'graduated', 'suspended']).default('active'),
  dateOfBirth: z.coerce.date().optional(),
  parentPhone: z.string().optional()
});

export const updateStudentSchema = createStudentSchema.partial();

export const queryStudentSchema = paginationQuerySchema.extend({
  grade: z.string().optional(),
  section: z.string().optional(),
  status: z.enum(['active', 'inactive', 'graduated', 'suspended']).optional()
});

export const bulkImportStudentSchema = z.object({
  students: z.array(createStudentSchema).min(1, 'At least one student record is required')
});
