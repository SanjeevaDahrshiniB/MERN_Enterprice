import { Request, Response, NextFunction } from 'express';
import { StudentService } from './student.service.js';
import { ResponseHelper } from '../../utils/response.js';

export class StudentController {
  constructor(private readonly studentService: StudentService = new StudentService()) {}

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.studentService.createStudent(req.body);
      ResponseHelper.created(res, student);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.studentService.getStudentById(req.params.id as string);
      ResponseHelper.success(res, student);
    } catch (error) {
      next(error);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, sortBy, sortOrder, search, grade, section, status } = req.query;
      const result = await this.studentService.listStudents(
        { grade, section, status, search },
        {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc'
        }
      );

      ResponseHelper.success(res, result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.studentService.updateStudent(req.params.id as string, req.body);
      ResponseHelper.success(res, student);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.studentService.deleteStudent(req.params.id as string);
      ResponseHelper.success(res, { message: 'Student removed successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public async bulkImport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.studentService.bulkImportStudents(req.body.students);
      ResponseHelper.created(res, result);
    } catch (error) {
      next(error);
    }
  }
}
