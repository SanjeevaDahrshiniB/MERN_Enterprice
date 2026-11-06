import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authRateLimiter } from '../../middlewares/rate-limiter.middleware.js';
import { loginSchema, registerSchema } from './auth.validator.js';

const router = Router();
const controller = new AuthController();

router.post('/login', authRateLimiter, validate({ body: loginSchema }), (req, res, next) => controller.login(req, res, next));
router.post('/register', authRateLimiter, validate({ body: registerSchema }), (req, res, next) => controller.register(req, res, next));
router.post('/refresh', (req, res, next) => controller.refresh(req, res, next));
router.post('/logout', authenticate, (req, res, next) => controller.logout(req, res, next));
router.get('/me', authenticate, (req, res, next) => controller.getProfile(req, res, next));

export const authRoutes = router;
