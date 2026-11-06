import { Model, Document, FilterQuery, UpdateQuery, ClientSession } from 'mongoose';
import { tenantContext } from './tenant-context.js';

export interface BaseTenantDocument extends Document {
  tenantId: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  populate?: string | string[];
}

export abstract class BaseTenantRepository<T extends BaseTenantDocument> {
  constructor(protected readonly model: Model<T>) {}

  protected getTenantId(): string {
    return tenantContext.getTenantId();
  }

  protected getUserId(): string | undefined {
    return tenantContext.getUserId();
  }

  public async create(data: Partial<T>, options?: { session?: ClientSession }): Promise<T> {
    const tenantId = this.getTenantId();
    const userId = this.getUserId();

    const record = new this.model({
      ...data,
      tenantId,
      createdBy: userId,
      isDeleted: false
    });

    return record.save({ session: options?.session });
  }

  public async findById(id: string, options?: { session?: ClientSession }): Promise<T | null> {
    const tenantId = this.getTenantId();
    const query = this.model.findOne({
      _id: id,
      tenantId,
      isDeleted: { $ne: true }
    } as FilterQuery<T>);

    if (options?.session) {
      query.session(options.session);
    }
    return query.exec();
  }

  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    const tenantId = this.getTenantId();
    return this.model.findOne({
      ...filter,
      tenantId,
      isDeleted: { $ne: true }
    } as FilterQuery<T>).exec();
  }

  public async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    const tenantId = this.getTenantId();
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy ?? 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const scopedFilter = {
      ...filter,
      tenantId,
      isDeleted: { $ne: true }
    } as FilterQuery<T>;

    const [items, total] = await Promise.all([
      this.model.find(scopedFilter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(scopedFilter).exec()
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  public async updateById(
    id: string,
    update: UpdateQuery<T>,
    options?: { session?: ClientSession }
  ): Promise<T | null> {
    const tenantId = this.getTenantId();
    const userId = this.getUserId();

    const query = this.model.findOneAndUpdate(
      {
        _id: id,
        tenantId,
        isDeleted: { $ne: true }
      } as FilterQuery<T>,
      {
        ...update,
        updatedBy: userId
      },
      { new: true, runValidators: true }
    );

    if (options?.session) {
      query.session(options.session);
    }
    return query.exec();
  }

  public async softDeleteById(
    id: string,
    deletedBy?: string,
    options?: { session?: ClientSession }
  ): Promise<T | null> {
    const tenantId = this.getTenantId();
    const userId = deletedBy ?? this.getUserId();

    const query = this.model.findOneAndUpdate(
      {
        _id: id,
        tenantId,
        isDeleted: { $ne: true }
      } as FilterQuery<T>,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId
      },
      { new: true }
    );

    if (options?.session) {
      query.session(options.session);
    }
    return query.exec();
  }

  public async hardDeleteById(id: string): Promise<boolean> {
    const tenantId = this.getTenantId();
    const result = await this.model.deleteOne({
      _id: id,
      tenantId
    } as FilterQuery<T>).exec();
    return result.deletedCount > 0;
  }

  public async count(filter: FilterQuery<T> = {}): Promise<number> {
    const tenantId = this.getTenantId();
    return this.model.countDocuments({
      ...filter,
      tenantId,
      isDeleted: { $ne: true }
    } as FilterQuery<T>).exec();
  }
}
