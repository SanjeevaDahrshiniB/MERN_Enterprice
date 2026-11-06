import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { ResponseHelper } from '../../utils/response.js';

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      ResponseHelper.created(res, user);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id as string);
      ResponseHelper.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, sortBy, sortOrder, role, isActive, search } = req.query;
      const result = await this.userService.listUsers(
        { role, isActive, search },
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
      const user = await this.userService.updateUser(req.params.id as string, req.body);
      ResponseHelper.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.userService.deleteUser(req.params.id as string);
      ResponseHelper.success(res, { message: 'User deactivated successfully.' });
    } catch (error) {
      next(error);
    }
  }
}
