import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ResponseHelper } from '../../utils/response.js';
import { env } from '../../config/env.js';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProduction = env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      this.setTokenCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      this.setTokenCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      ResponseHelper.created(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Refresh token not found in cookies or request body.' }
        });
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      });

      ResponseHelper.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.authService.logout(req.user?.userId);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      ResponseHelper.success(res, { message: 'Logged out successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      ResponseHelper.success(res, req.user);
    } catch (error) {
      next(error);
    }
  }
}
