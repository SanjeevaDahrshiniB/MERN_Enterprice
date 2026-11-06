import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthUserPayload } from '../types/user.types.js';

export interface TokenOptions {
  secret: string;
  expiresIn?: string | number;
}

export function signAccessToken(payload: AuthUserPayload, options: TokenOptions): string {
  const signOptions: SignOptions = {
    expiresIn: (options.expiresIn ?? '15m') as SignOptions['expiresIn']
  };
  return jwt.sign(payload, options.secret, signOptions);
}

export function signRefreshToken(payload: { userId: string; tenantId: string }, options: TokenOptions): string {
  const signOptions: SignOptions = {
    expiresIn: (options.expiresIn ?? '7d') as SignOptions['expiresIn']
  };
  return jwt.sign(payload, options.secret, signOptions);
}

export function verifyToken<T = AuthUserPayload>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}
