export type TenantStatus = 'active' | 'suspended' | 'trial';

export interface ITenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}
