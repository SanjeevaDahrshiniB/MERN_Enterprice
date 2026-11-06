import { Request, Response, NextFunction } from 'express';
import { tenantContext } from '../core/database/tenant-context.js';
import { generateSecureToken } from '../core/security/crypto.js';

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || `req_${generateSecureToken(8)}`;
  res.setHeader('x-request-id', requestId);

  tenantContext.run(
    {
      requestId,
      tenantId: undefined,
      userId: undefined
    },
    () => {
      next();
    }
  );
}
