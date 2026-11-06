import { connectDatabase, disconnectDatabase } from '../core/database/connection.js';
import { env } from '../config/env.js';
import { seedDefaultTenant } from './tenant.seed.js';
import { seedUsers } from './user.seed.js';

async function runMasterSeed() {
  console.log('==============================================');
  console.log('🌱 Starting Triune Master Database Seeding...');
  console.log(`Connecting to: ${env.MONGO_URI}`);
  console.log('==============================================');

  try {
    await connectDatabase({ uri: env.MONGO_URI });

    // Step 1: Seed default demonstration tenant
    const defaultTenant = await seedDefaultTenant();

    // Step 2: Seed default users (Super Admin, Tenant Admin, Staff)
    await seedUsers(defaultTenant._id.toString());

    console.log('==============================================');
    console.log('✅ Master Database Seeding Completed Successfully!');
    console.log('Default credentials for testing:');
    console.log('  1. Super Admin:  superadmin@triune.com / Admin@123');
    console.log('  2. Tenant Admin: admin@triunedemo.com / Admin@123 (Tenant: triune-demo)');
    console.log('  3. Staff User:   staff@triunedemo.com / Admin@123 (Tenant: triune-demo)');
    console.log('==============================================');
  } catch (error) {
    console.error('❌ Master Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

runMasterSeed();
