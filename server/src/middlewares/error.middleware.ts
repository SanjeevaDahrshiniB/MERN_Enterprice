import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorResponse } from '../core/types/api.types.js';
import { AppError } from '../utils/errors.js';
import { tenantContext } from '../core/database/tenant-context.js';
import { logger } from '../core/logger/logger.js';
import { env } from '../config/env.js';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = tenantContext.getRequestId();
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal server error occurred.';
  let details: Array<{ field?: string; message: string }> | undefined;
  let stack: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
    stack = err.stack;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Request validation failed.';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
  } else if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    message = 'A resource with this identifier or unique field already exists.';
  } else if (err instanceof Error) {
    stack = err.stack;
    if (err.message.includes('Tenant context missing')) {
      statusCode = 400;
      code = 'TENANT_CONTEXT_MISSING';
      message = err.message;
    } else {
      message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    }
  }

  // 5xx Server Errors are logged with stack trace; 4xx Client Errors are logged cleanly as warnings
  if (statusCode >= 500) {
    logger.error(message, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      stack
    });
  } else {
    logger.warn(message, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode
    });
  }

  const responsePayload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    },
    requestId,
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(responsePayload);
}
