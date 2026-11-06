/**
 * Application Roles
 * Strictly matches backend RBAC roles (server/src/core/constants/roles.ts)
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  STAFF: 'STAFF',
  USER: 'USER'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
