import { Schema, model } from 'mongoose';
import { BaseTenantDocument } from '../../core/database/base-tenant.repository.js';
import { IStudent } from './student.types.js';

export interface StudentDocument extends BaseTenantDocument, Omit<IStudent, 'id'> {}

const studentSchema = new Schema<StudentDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    rollNumber: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    grade: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: 'active',
      index: true
    },
    dateOfBirth: { type: Date },
    parentPhone: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String }
  },
  {
    timestamps: true
  }
);

// Tenant-aware compound indexes
studentSchema.index({ tenantId: 1, rollNumber: 1 }, { unique: true });
studentSchema.index({ tenantId: 1, email: 1 });
studentSchema.index({ tenantId: 1, grade: 1, section: 1 });

export const StudentModel = model<StudentDocument>('Student', studentSchema);
