import { api } from '../../../services/api';
import type { Student, StudentFilterQuery, CreateStudentPayload } from '../types/student.types';

export const studentService = {
  async getStudents(query: StudentFilterQuery = {}): Promise<{
    students: Student[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const res = await api.get('/v1/students', { params: query });
    return {
      students: res.data.data || [],
      total: res.data.meta?.total ?? (res.data.data ? res.data.data.length : 0),
      page: res.data.meta?.page ?? 1,
      limit: res.data.meta?.limit ?? 10,
      totalPages: res.data.meta?.totalPages ?? 1
    };
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await api.get(`/v1/students/${id}`);
    return res.data.data;
  },

  async createStudent(payload: CreateStudentPayload): Promise<Student> {
    const res = await api.post('/v1/students', payload);
    return res.data.data;
  },

  async updateStudent(id: string, payload: Partial<CreateStudentPayload>): Promise<Student> {
    const res = await api.put(`/v1/students/${id}`, payload);
    return res.data.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await api.delete(`/v1/students/${id}`);
  }
};
