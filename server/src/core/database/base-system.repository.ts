import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { PaginatedResult, QueryOptions } from './base-tenant.repository.js';

export interface BaseSystemDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseSystemRepository<T extends BaseSystemDocument> {
  constructor(protected readonly model: Model<T>) {}

  public async create(data: Partial<T>): Promise<T> {
    const record = new this.model(data);
    return record.save();
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  public async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy ?? 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  public async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
