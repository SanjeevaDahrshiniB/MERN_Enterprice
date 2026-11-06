/**
 * API Standard Response Contracts
 * Aligns with backend ResponseHelper standard (05_STANDARD_RESPONSE_CONTRACT.md)
 */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
