import { Schema, model } from 'mongoose';
import { BaseTenantDocument } from '../../core/database/base-tenant.repository.js';
import { IUser, UserRole } from '../../core/types/user.types.js';

export interface UserDocument extends BaseTenantDocument, Omit<IUser, 'id'> {
  password: string;
  refreshToken?: string;
}

const userSchema = new Schema<UserDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    refreshToken: { type: String, select: false }, // Hashed refresh token for revocation support
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'TENANT_ADMIN', 'STAFF', 'USER'],
      default: 'USER',
      index: true
    },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String }
  },
  {
    timestamps: true
  }
);

// Compound index: email is unique per tenant
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const UserModel = model<UserDocument>('User', userSchema);
