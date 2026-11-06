import { TenantModel, TenantDocument } from '../modules/tenants/tenant.schema.js';

export async function seedDefaultTenant(): Promise<TenantDocument> {
  const defaultSlug = 'triune-demo';
  let tenant = await TenantModel.findOne({ slug: defaultSlug });

  if (!tenant) {
    tenant = await TenantModel.create({
      name: 'Triune Demo Academy',
      slug: defaultSlug,
      status: 'active',
      plan: 'pro'
    });
    console.log(`[Seed] Created default tenant: "${tenant.name}" (${tenant.slug}) - ID: ${tenant._id}`);
  } else {
    console.log(`[Seed] Default tenant already exists: "${tenant.name}" - ID: ${tenant._id}`);
  }

  return tenant;
}
