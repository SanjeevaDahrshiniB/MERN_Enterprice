import { UserRepository } from './user.repository.js';
import { UserDocument } from './user.schema.js';
import { hashPassword } from '../../core/security/password.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';
import { PaginatedResult, QueryOptions } from '../../core/database/base-tenant.repository.js';

export class UserService {
  constructor(private readonly userRepo: UserRepository = new UserRepository()) {}

  public async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'STAFF' | 'USER';
    permissions?: string[];
  }): Promise<UserDocument> {
    const existing = await this.userRepo.findByEmailWithPassword(data.email);
    if (existing) {
      throw new ConflictError(`User with email "${data.email}" already exists in this tenant.`);
    }

    const hashedPassword = await hashPassword(data.password);

    return this.userRepo.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role ?? 'USER',
      permissions: data.permissions ?? [],
      isActive: true
    });
  }

  public async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  public async listUsers(
    filter: Record<string, unknown> = {},
    options: QueryOptions = {}
  ): Promise<PaginatedResult<UserDocument>> {
    const queryFilter: Record<string, unknown> = {};
    if (filter.role) queryFilter.role = filter.role;
    if (filter.isActive !== undefined) queryFilter.isActive = filter.isActive;
    if (filter.search) {
      queryFilter.$or = [
        { firstName: { $regex: filter.search, $options: 'i' } },
        { lastName: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } }
      ];
    }

    return this.userRepo.find(queryFilter, options);
  }

  public async updateUser(id: string, data: Partial<UserDocument>): Promise<UserDocument> {
    const user = await this.getUserById(id);

    const updated = await this.userRepo.updateById(id, data);
    if (!updated) {
      throw new NotFoundError('User');
    }
    return updated;
  }

  public async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    await this.userRepo.softDeleteById(id);
  }
}
