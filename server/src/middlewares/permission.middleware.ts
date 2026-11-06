import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export function requirePermission(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication is required before checking permissions.');
    }

    // Super Admin has full system access
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const userPermissions = new Set(req.user.permissions || []);
    const hasAll = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAll) {
      throw new ForbiddenError(
        `Missing required permission(s): ${requiredPermissions.join(', ')}`
      );
    }

    next();
  };
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication is required before checking roles.');
    }

    if (req.user.role === 'SUPER_ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    throw new ForbiddenError(`Action restricted to roles: ${allowedRoles.join(', ')}`);
  };
}
