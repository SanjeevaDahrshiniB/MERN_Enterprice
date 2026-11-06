import { apiClient } from './apiClient';
import { setupInterceptors } from './interceptors';

// Attach interceptors to the client
setupInterceptors(apiClient);

export { apiClient, apiClient as api };
