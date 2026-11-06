import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service.js';
import { ResponseHelper } from '../../utils/response.js';

export class TenantController {
  constructor(private readonly tenantService: TenantService = new TenantService()) {}

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await this.tenantService.createTenant(req.body);
      ResponseHelper.created(res, tenant);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await this.tenantService.getTenantById(req.params.id as string);
      ResponseHelper.success(res, tenant);
    } catch (error) {
      next(error);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.tenantService.listTenants(req.query);
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
}
