import { BaseTenantRepository } from '../../core/database/base-tenant.repository.js';
import { StudentDocument, StudentModel } from './student.schema.js';

export class StudentRepository extends BaseTenantRepository<StudentDocument> {
  constructor() {
    super(StudentModel);
  }

  public async findByRollNumber(rollNumber: string): Promise<StudentDocument | null> {
    const tenantId = this.getTenantId();
    return this.model.findOne({
      tenantId,
      rollNumber,
      isDeleted: { $ne: true }
    }).exec();
  }

  public async findByEmail(email: string): Promise<StudentDocument | null> {
    const tenantId = this.getTenantId();
    return this.model.findOne({
      tenantId,
      email: email.toLowerCase(),
      isDeleted: { $ne: true }
    }).exec();
  }
}
