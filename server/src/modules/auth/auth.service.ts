import { UserRepository } from '../users/user.repository.js';
import { TenantRepository } from '../tenants/tenant.repository.js';
import { comparePassword, hashPassword } from '../../core/security/password.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../../core/security/jwt.js';
import { hashToken } from '../../core/security/crypto.js';
import { AuthTokens, AuthUserPayload } from '../../core/types/user.types.js';
import { env } from '../../config/env.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../utils/errors.js';

export class AuthService {
  constructor(
    private readonly userRepo: UserRepository = new UserRepository(),
    private readonly tenantRepo: TenantRepository = new TenantRepository()
  ) {}

  public async login(data: { email: string; password: string; tenantSlug?: string }): Promise<{ user: AuthUserPayload; tokens: AuthTokens }> {
    let tenantId: string | undefined;

    if (data.tenantSlug) {
      const tenant = await this.tenantRepo.findBySlug(data.tenantSlug);
      if (!tenant) {
        throw new NotFoundError(`Tenant "${data.tenantSlug}"`);
      }
      if (tenant.status !== 'active') {
        throw new UnauthorizedError('Tenant account is not active.');
      }
      tenantId = tenant._id.toString();
    }

    const user = await this.userRepo.findByEmailWithPassword(data.email, tenantId);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account has been deactivated.');
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const payload: AuthUserPayload = {
      userId: user._id.toString(),
      tenantId: user.tenantId,
      email: user.email,
      role: user.role
    };

    const accessToken = signAccessToken(payload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN
    });

    const refreshToken = signRefreshToken(
      { userId: payload.userId, tenantId: payload.tenantId },
      {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRES_IN
      }
    );

    // Store hashed refresh token in DB for revoking support
    const hashedRefresh = hashToken(refreshToken);
    await this.userRepo.updateRefreshToken(user._id.toString(), hashedRefresh);

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900 // 15 mins in seconds
      }
    };
  }

  public async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantSlug: string;
  }): Promise<{ user: AuthUserPayload; tokens: AuthTokens }> {
    const tenant = await this.tenantRepo.findBySlug(data.tenantSlug);
    if (!tenant) {
      throw new NotFoundError(`Tenant with slug "${data.tenantSlug}"`);
    }

    const existingUser = await this.userRepo.findByEmailWithPassword(data.email, tenant._id.toString());
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists in this tenant.');
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await this.userRepo.create({
      tenantId: tenant._id.toString(),
      email: data.email.toLowerCase(),
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'USER',
      permissions: ['student.read'],
      isActive: true
    });

    const payload: AuthUserPayload = {
      userId: newUser._id.toString(),
      tenantId: tenant._id.toString(),
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions
    };

    const accessToken = signAccessToken(payload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN
    });

    const refreshToken = signRefreshToken(
      { userId: payload.userId, tenantId: payload.tenantId },
      {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRES_IN
      }
    );

    // Store hashed refresh token in DB
    const hashedRefresh = hashToken(refreshToken);
    await this.userRepo.updateRefreshToken(newUser._id.toString(), hashedRefresh);

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    };
  }

  public async refreshToken(token: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const decoded = verifyToken<{ userId: string; tenantId: string }>(token, env.JWT_REFRESH_SECRET);
      const user = await this.userRepo.findByIdWithRefreshToken(decoded.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive.');
      }

      // Check if stored refresh token in DB matches the provided token
      const incomingHash = hashToken(token);
      if (user.refreshToken && user.refreshToken !== incomingHash) {
        throw new UnauthorizedError('Refresh token has been revoked.');
      }

      const payload: AuthUserPayload = {
        userId: user._id.toString(),
        tenantId: user.tenantId,
        email: user.email,
        role: user.role
      };

      const accessToken = signAccessToken(payload, {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN
      });

      return {
        accessToken,
        expiresIn: 900
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token.');
    }
  }

  public async logout(userId?: string): Promise<void> {
    if (userId) {
      await this.userRepo.updateRefreshToken(userId, null);
    }
  }
}
