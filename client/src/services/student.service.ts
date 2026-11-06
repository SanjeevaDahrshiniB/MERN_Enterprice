import { api } from './api';

export interface Student {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
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

export const studentService = {
  async getStudents(query: StudentFilterQuery = {}): Promise<{
    students: Student[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const res = await api.get('/students', { params: query });
    return {
      students: res.data.data || [],
      total: res.data.meta?.total ?? (res.data.data ? res.data.data.length : 0),
      page: res.data.meta?.page ?? 1,
      limit: res.data.meta?.limit ?? 10,
      totalPages: res.data.meta?.totalPages ?? 1
    };
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await api.get(`/students/${id}`);
    return res.data.data;
  },

  async createStudent(payload: CreateStudentPayload): Promise<Student> {
    const res = await api.post('/students', payload);
    return res.data.data;
  },

  async updateStudent(id: string, payload: Partial<CreateStudentPayload>): Promise<Student> {
    const res = await api.put(`/students/${id}`, payload);
    return res.data.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  }
};
