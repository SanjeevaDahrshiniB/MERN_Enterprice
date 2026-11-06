export interface LoginPayload {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface AuthUser {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
