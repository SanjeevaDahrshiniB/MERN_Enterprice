import { BaseSystemRepository } from '../../core/database/base-system.repository.js';
import { TenantDocument, TenantModel } from './tenant.schema.js';

export class TenantRepository extends BaseSystemRepository<TenantDocument> {
  constructor() {
    super(TenantModel);
  }

  public async findBySlug(slug: string): Promise<TenantDocument | null> {
    return this.model.findOne({ slug }).exec();
  }
}
