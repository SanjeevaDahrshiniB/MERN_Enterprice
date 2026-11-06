import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../core/security/jwt.js';
import { AuthUserPayload } from '../core/types/user.types.js';
import { tenantContext } from '../core/database/tenant-context.js';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
      tenantId?: string;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Check Bearer Authorization header (Mobile apps, Bruno, etc.)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to HttpOnly cookie (Web browsers)
  if (!token && req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new UnauthorizedError('Authentication token is missing from authorization header and cookies.');
  }

  try {
    const payload = verifyToken<AuthUserPayload>(token, env.JWT_ACCESS_SECRET);
    req.user = payload;
    req.tenantId = payload.tenantId;

    // Update AsyncLocalStorage context with authenticated tenant and user
    const currentContext = tenantContext.getContext();
    if (currentContext) {
      currentContext.tenantId = payload.tenantId;
      currentContext.userId = payload.userId;
      currentContext.userRole = payload.role;
      currentContext.userEmail = payload.email;
    }

    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired access token.');
  }
}
