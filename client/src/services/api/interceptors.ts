import axios, { type AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { env } from '../../config/env';

export function setupInterceptors(api: AxiosInstance): void {
  // 1. Request Interceptor: Inject Bearer access token
  api.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken') || localStorage.getItem('triune_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 2. Response Interceptor: Automatic Silent Token Refresh and Request Retry
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/refresh')
      ) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${env.API_BASE_URL}/v1/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = res.data?.data?.accessToken;
          if (newAccessToken) {
            Cookies.set('accessToken', newAccessToken);
            localStorage.setItem('triune_access_token', newAccessToken);
          }

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          Cookies.remove('accessToken');
          localStorage.removeItem('triune_access_token');
          localStorage.removeItem('triune_user');
          window.location.reload();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
