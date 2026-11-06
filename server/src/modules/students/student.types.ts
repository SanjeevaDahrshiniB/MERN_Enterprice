export type StudentGender = 'male' | 'female' | 'other';
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface IStudent {
  id: string;
  tenantId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  gender: StudentGender;
  status: StudentStatus;
  dateOfBirth?: Date;
  parentPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}
