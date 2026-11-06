import type { BaseEntity } from '../../../types/common.types';

export interface Student extends BaseEntity {
  tenantId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  gender: string;
  status: string;
  parentPhone?: string;
  dateOfBirth?: string;
}

export interface StudentFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  grade?: string;
  section?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateStudentPayload {
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  gender: string;
  parentPhone?: string;
  status?: string;
}
