import { TenantRepository } from './tenant.repository.js';
import { TenantDocument } from './tenant.schema.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { PaginatedResult, QueryOptions } from '../../core/database/base-tenant.repository.js';

export class TenantService {
  constructor(private readonly tenantRepo: TenantRepository = new TenantRepository()) {}

  public async createTenant(data: { name: string; slug: string; plan?: 'free' | 'starter' | 'pro' | 'enterprise' }): Promise<TenantDocument> {
    const existing = await this.tenantRepo.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError(`Tenant with slug "${data.slug}" already exists.`);
    }

    return this.tenantRepo.create({
      name: data.name,
      slug: data.slug,
      status: 'active',
      plan: data.plan ?? 'starter'
    });
  }

  public async getTenantById(id: string): Promise<TenantDocument> {
    const tenant = await this.tenantRepo.findById(id);
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }
    return tenant;
  }

  public async listTenants(options: QueryOptions): Promise<PaginatedResult<TenantDocument>> {
    return this.tenantRepo.find({}, options);
  }
}
