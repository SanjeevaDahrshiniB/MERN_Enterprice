import { Router } from 'express';
import { StudentController } from './student.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createStudentSchema,
  updateStudentSchema,
  queryStudentSchema,
  bulkImportStudentSchema
} from './student.validator.js';

const router = Router();
const controller = new StudentController();

// All student routes require authentication
router.use(authenticate);

// Create student: Super Admin, Tenant Admin, Staff
router.post(
  '/',
  requireRole('TENANT_ADMIN', 'STAFF'),
  validate({ body: createStudentSchema }),
  (req, res, next) => controller.create(req, res, next)
);

// List students: Super Admin, Tenant Admin, Staff, User
router.get(
  '/',
  requireRole('TENANT_ADMIN', 'STAFF', 'USER'),
  validate({ query: queryStudentSchema }),
  (req, res, next) => controller.list(req, res, next)
);

// Bulk import: Super Admin, Tenant Admin
router.post(
  '/import',
  requireRole('TENANT_ADMIN'),
  validate({ body: bulkImportStudentSchema }),
  (req, res, next) => controller.bulkImport(req, res, next)
);

// Get student by ID: Super Admin, Tenant Admin, Staff, User
router.get(
  '/:id',
  requireRole('TENANT_ADMIN', 'STAFF', 'USER'),
  (req, res, next) => controller.getById(req, res, next)
);

// Update student: Super Admin, Tenant Admin, Staff
router.put(
  '/:id',
  requireRole('TENANT_ADMIN', 'STAFF'),
  validate({ body: updateStudentSchema }),
  (req, res, next) => controller.update(req, res, next)
);

// Delete student: Super Admin, Tenant Admin
router.delete(
  '/:id',
  requireRole('TENANT_ADMIN'),
  (req, res, next) => controller.delete(req, res, next)
);

export const studentRoutes = router;
