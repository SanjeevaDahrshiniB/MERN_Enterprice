import { api } from './api';
import Cookies from 'js-cookie';

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

export interface LoginResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post('/v1/auth/login', payload);
    const data: LoginResponse = res.data.data;

    // Set cookies for request transmission
    Cookies.set('accessToken', data.tokens.accessToken, { expires: 15 / 1440, sameSite: 'lax' });
    Cookies.set('refreshToken', data.tokens.refreshToken, { expires: 7, sameSite: 'lax' });

    // Store user session in localStorage
    localStorage.setItem('triune_access_token', data.tokens.accessToken);
    localStorage.setItem('triune_user', JSON.stringify(data.user));

    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/v1/auth/logout');
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('triune_access_token');
      localStorage.removeItem('triune_user');
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('triune_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = Cookies.get('accessToken') || localStorage.getItem('triune_access_token');
    return Boolean(token && this.getCurrentUser());
  }
};
