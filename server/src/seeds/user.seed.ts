import { UserModel } from '../modules/users/user.schema.js';
import { hashPassword } from '../core/security/password.js';

export async function seedUsers(tenantId: string): Promise<void> {
  const defaultPassword = await hashPassword('Admin@123');

  // 1. Global Super Admin (system root)
  const superAdminEmail = 'superadmin@triune.com';
  let superAdmin = await UserModel.findOne({ email: superAdminEmail });
  if (!superAdmin) {
    superAdmin = await UserModel.create({
      tenantId: 'system_root',
      email: superAdminEmail,
      password: defaultPassword,
      firstName: 'System',
      lastName: 'SuperAdmin',
      role: 'SUPER_ADMIN',
      isActive: true
    });
    console.log(`[Seed] Created Super Admin: ${superAdmin.email} (Password: Admin@123)`);
  } else {
    console.log(`[Seed] Super Admin already exists: ${superAdmin.email}`);
  }

  // 2. Tenant Admin for Demo Tenant
  const tenantAdminEmail = 'admin@triunedemo.com';
  let tenantAdmin = await UserModel.findOne({ tenantId, email: tenantAdminEmail });
  if (!tenantAdmin) {
    tenantAdmin = await UserModel.create({
      tenantId,
      email: tenantAdminEmail,
      password: defaultPassword,
      firstName: 'Demo',
      lastName: 'Administrator',
      role: 'TENANT_ADMIN',
      isActive: true
    });
    console.log(`[Seed] Created Tenant Admin: ${tenantAdmin.email} (Password: Admin@123)`);
  } else {
    console.log(`[Seed] Tenant Admin already exists: ${tenantAdmin.email}`);
  }

  // 3. Demo Staff User
  const staffEmail = 'staff@triunedemo.com';
  let staff = await UserModel.findOne({ tenantId, email: staffEmail });
  if (!staff) {
    staff = await UserModel.create({
      tenantId,
      email: staffEmail,
      password: defaultPassword,
      firstName: 'Sarah',
      lastName: 'Staff',
      role: 'STAFF',
      isActive: true
    });
    console.log(`[Seed] Created Demo Staff: ${staff.email} (Password: Admin@123)`);
  } else {
    console.log(`[Seed] Demo Staff already exists: ${staff.email}`);
  }
}
