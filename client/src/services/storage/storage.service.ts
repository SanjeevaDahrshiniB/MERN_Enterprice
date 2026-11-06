import Cookies from 'js-cookie';

const PREFIX = 'triune_';

export const storageService = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set failed', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },

  // Cookie helpers
  getCookie(key: string): string | undefined {
    return Cookies.get(key);
  },

  setCookie(key: string, value: string, options?: Cookies.CookieAttributes): void {
    Cookies.set(key, value, options);
  },

  removeCookie(key: string): void {
    Cookies.remove(key);
  }
};
