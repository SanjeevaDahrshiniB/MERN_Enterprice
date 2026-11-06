import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestContextMiddleware } from './middlewares/request-context.middleware.js';
import { globalRateLimiter } from './middlewares/rate-limiter.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { NotFoundError } from './utils/errors.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { tenantRoutes } from './modules/tenants/tenant.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { studentRoutes } from './modules/students/student.routes.js';

export function createApp(): Express {
  const app = express();

  // Security headers & CORS
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS_ARRAY,
      credentials: true
    })
  );

  // Cookie parser for token handling
  app.use(cookieParser());

  // Body parsers with raw body buffer preservation for webhooks (Razorpay, Stripe, etc.)
  app.use(
    express.json({
      limit: '10mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      }
    })
  );
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request correlation and AsyncLocalStorage tenant context
  app.use(requestContextMiddleware);

  // Health check endpoint (Returns APP_NAME from .env as requested)
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'healthy',
      app: env.APP_NAME,
      timestamp: new Date().toISOString(),
      service: 'triune-enterprise-api'
    });
  });

  // Global API Rate Limiting (DDoS protection)
  app.use('/api', globalRateLimiter);

  // Master API v1 routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tenants', tenantRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/students', studentRoutes);

  // 404 Catch-all handler
  app.use((_req, _res, next) => {
    next(new NotFoundError('API endpoint'));
  });

  // Centralized Error Handler (Always last)
  app.use(errorMiddleware);

  return app;
}
