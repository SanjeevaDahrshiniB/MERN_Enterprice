/**
 * Common Global Types
 */

export type Nullable<T> = T | null;

export type SortOrder = 'asc' | 'desc';

export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
