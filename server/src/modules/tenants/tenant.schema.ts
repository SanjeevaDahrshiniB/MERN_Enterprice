import { Schema, model, Document } from 'mongoose';
import { ITenant } from '../../core/types/tenant.types.js';

export interface TenantDocument extends Document, Omit<ITenant, 'id'> {}

const tenantSchema = new Schema<TenantDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'suspended', 'trial'],
      default: 'active',
      index: true
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro', 'enterprise'],
      default: 'starter'
    }
  },
  {
    timestamps: true
  }
);

export const TenantModel = model<TenantDocument>('Tenant', tenantSchema);
