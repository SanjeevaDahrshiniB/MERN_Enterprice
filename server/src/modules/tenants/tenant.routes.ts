import { Router } from 'express';
import { TenantController } from './tenant.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createTenantSchema } from './tenant.validator.js';

const router = Router();
const controller = new TenantController();

router.post(
  '/',
  authenticate,
  requireRole('SUPER_ADMIN'),
  validate({ body: createTenantSchema }),
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  '/',
  authenticate,
  requireRole('SUPER_ADMIN'),
  (req, res, next) => controller.list(req, res, next)
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => controller.getById(req, res, next)
);

export const tenantRoutes = router;
