export interface SystemRoleDefinition {
  name: string;
  description: string;
}

export const MASTER_ROLES: Record<string, SystemRoleDefinition> = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    description: 'System-wide administrator with bypass access to all tenants and configurations.'
  },
  TENANT_ADMIN: {
    name: 'TENANT_ADMIN',
    description: 'Administrator for a single tenant with full control over tenant business modules.'
  },
  STAFF: {
    name: 'STAFF',
    description: 'Staff member with day-to-day operational access.'
  },
  USER: {
    name: 'USER',
    description: 'Standard end-user with basic read-only access.'
  }
};
