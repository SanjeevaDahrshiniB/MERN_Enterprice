import { BaseTenantRepository } from '../../core/database/base-tenant.repository.js';
import { UserDocument, UserModel } from './user.schema.js';

export class UserRepository extends BaseTenantRepository<UserDocument> {
  constructor() {
    super(UserModel);
  }

  public async findByEmailWithPassword(email: string, tenantId?: string): Promise<UserDocument | null> {
    const filter: Record<string, unknown> = {
      email: email.toLowerCase(),
      isDeleted: { $ne: true }
    };

    if (tenantId) {
      filter.tenantId = tenantId;
    }

    return this.model.findOne(filter).select('+password +refreshToken').exec();
  }

  public async findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return this.model.findById(id).select('+refreshToken').exec();
  }

  public async updateRefreshToken(userId: string, hashedToken: string | null): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { refreshToken: hashedToken }).exec();
  }

  public async findGlobalByEmail(email: string): Promise<UserDocument[]> {
    return this.model.find({ email: email.toLowerCase(), isDeleted: { $ne: true } }).select('+password').exec();
  }
}
