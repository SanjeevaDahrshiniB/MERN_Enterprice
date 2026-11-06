import { StudentRepository } from './student.repository.js';
import { StudentDocument } from './student.schema.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { PaginatedResult, QueryOptions } from '../../core/database/base-tenant.repository.js';

export class StudentService {
  constructor(private readonly studentRepo: StudentRepository = new StudentRepository()) {}

  public async createStudent(data: Partial<StudentDocument>): Promise<StudentDocument> {
    if (data.rollNumber) {
      const existing = await this.studentRepo.findByRollNumber(data.rollNumber);
      if (existing) {
        throw new ConflictError(`Student with roll number "${data.rollNumber}" already exists in this tenant.`);
      }
    }

    return this.studentRepo.create(data);
  }

  public async getStudentById(id: string): Promise<StudentDocument> {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new NotFoundError('Student');
    }
    return student;
  }

  public async listStudents(
    filter: Record<string, unknown> = {},
    options: QueryOptions = {}
  ): Promise<PaginatedResult<StudentDocument>> {
    const queryFilter: Record<string, unknown> = {};

    if (filter.grade) queryFilter.grade = filter.grade;
    if (filter.section) queryFilter.section = filter.section;
    if (filter.status) queryFilter.status = filter.status;
    if (filter.search) {
      queryFilter.$or = [
        { firstName: { $regex: filter.search, $options: 'i' } },
        { lastName: { $regex: filter.search, $options: 'i' } },
        { rollNumber: { $regex: filter.search, $options: 'i' } }
      ];
    }

    return this.studentRepo.find(queryFilter, options);
  }

  public async updateStudent(id: string, data: Partial<StudentDocument>): Promise<StudentDocument> {
    const student = await this.getStudentById(id);

    if (data.rollNumber && data.rollNumber !== student.rollNumber) {
      const existing = await this.studentRepo.findByRollNumber(data.rollNumber);
      if (existing) {
        throw new ConflictError(`Student with roll number "${data.rollNumber}" already exists.`);
      }
    }

    const updated = await this.studentRepo.updateById(id, data);
    if (!updated) {
      throw new NotFoundError('Student');
    }
    return updated;
  }

  public async deleteStudent(id: string): Promise<void> {
    await this.getStudentById(id);
    await this.studentRepo.softDeleteById(id);
  }

  public async bulkImportStudents(students: Array<Partial<StudentDocument>>) {
    const createdList: StudentDocument[] = [];
    const errors: Array<{ rollNumber?: string; message: string }> = [];

    for (const item of students) {
      try {
        if (item.rollNumber) {
          const existing = await this.studentRepo.findByRollNumber(item.rollNumber);
          if (existing) {
            errors.push({ rollNumber: item.rollNumber, message: 'Roll number already exists' });
            continue;
          }
        }
        const created = await this.studentRepo.create(item);
        createdList.push(created);
      } catch (err: any) {
        errors.push({ rollNumber: item.rollNumber, message: err.message });
      }
    }

    return {
      totalSubmitted: students.length,
      importedCount: createdList.length,
      failedCount: errors.length,
      errors
    };
  }
}
