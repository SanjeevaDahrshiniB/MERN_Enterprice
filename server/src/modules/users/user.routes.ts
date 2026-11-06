import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema, queryUserSchema } from './user.validator.js';

const router = Router();
const controller = new UserController();

router.use(authenticate);

router.post(
  '/',
  requireRole('SUPER_ADMIN', 'TENANT_ADMIN'),
  validate({ body: createUserSchema }),
  (req, res, next) => controller.create(req, res, next)
);

router.get(
  '/',
  requireRole('SUPER_ADMIN', 'TENANT_ADMIN'),
  validate({ query: queryUserSchema }),
  (req, res, next) => controller.list(req, res, next)
);

router.get(
  '/:id',
  requireRole('SUPER_ADMIN', 'TENANT_ADMIN'),
  (req, res, next) => controller.getById(req, res, next)
);

router.put(
  '/:id',
  requireRole('SUPER_ADMIN', 'TENANT_ADMIN'),
  validate({ body: updateUserSchema }),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  requireRole('SUPER_ADMIN', 'TENANT_ADMIN'),
  (req, res, next) => controller.delete(req, res, next)
);

export const userRoutes = router;
