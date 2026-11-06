# 02. Folder Structure & Code Map

The repository uses a flat, clean structure without monorepo overhead (`server/`, `client/`, `docs/`).

```
mern-enterprise/
├── server/                     # Backend API (Node.js, Express, TypeScript, MongoDB)
│   ├── src/
│   │   ├── config/             # Zod environment validation (env.ts)
│   │   ├── core/               # Shared architectural engines
│   │   │   ├── database/       # Connection pool, AsyncLocalStorage, Base Repositories, Transactions
│   │   │   ├── logger/         # Dual file logging (error.log, combined.log)
│   │   │   ├── security/       # Password hashing (bcryptjs), JWT signing, SHA-256 token hashing
│   │   │   ├── types/          # Domain TypeScript interfaces (api, tenant, user)
│   │   │   └── validation/     # Shared Zod schemas (common.schemas.ts)
│   │   ├── middlewares/        # Correlation ID, Auth, RBAC, Validation, Error, Rate Limiting
│   │   ├── modules/            # Business feature domains
│   │   │   ├── auth/           # Login, Register, Silent Refresh, Logout
│   │   │   ├── tenants/        # Tenant management & slug indexing
│   │   │   ├── users/          # User CRUD, role assignment, tenant scoping
│   │   │   └── students/       # Golden Reference 6-Layer Business Module
│   │   ├── seeds/              # Master idempotent database seeds
│   │   ├── utils/              # Standard errors (AppError) and ResponseHelper
│   │   ├── app.ts              # Express application assembly & security middlewares
│   │   └── server.ts           # HTTP server bootstrap & graceful shutdown
│   ├── logs/                   # Auto-generated runtime logs (error.log, combined.log)
│   ├── package.json
│   └── tsconfig.json
│
├── client/                     # Frontend Client (React 18, Vite, TypeScript)
│   ├── src/
│   │   ├── app/                # App Bootstrap (App.tsx), Router (routePaths), Providers
│   │   ├── components/         # Atomic UI (Button, Input, Modal, Table, Pagination) & Common
│   │   ├── layouts/            # Page Shells (MainLayout with Navbar, AuthLayout)
│   │   ├── modules/            # Business Domain Modules (auth, students with own pages & services)
│   │   ├── services/           # Low-level networking (apiClient, interceptors, storage)
│   │   ├── guards/             # Route Security (ProtectedRoute, GuestGuard, RoleGuard)
│   │   ├── hooks/              # Shared Hooks (useDebounce, useOnlineStatus, usePagination)
│   │   ├── config/             # Type-safe environment config (env.ts)
│   │   ├── constants/          # System roles (ROLES matching backend)
│   │   ├── types/              # Global TS contracts (api.types, common.types)
│   │   ├── utils/              # Pure utilities (date, format, classnames)
│   │   ├── styles/             # Pure CSS variables & global styling
│   │   ├── index.css           # Design system root import
│   │   └── main.tsx            # React DOM mounting
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── docs/                       # Project documentation
    ├── manual/                 # Modular onboarding manuals (01 - 05)
    └── bruno/                  # Git-native OpenCollection API client for Web & Mobile teams
```

---

## The 6-Layer Business Module Blueprint

Every feature module in `server/src/modules/<feature>/` follows this exact 6-layer architecture:

```
module-name/
├── feature.types.ts            # 1. Domain interfaces & status enums
├── feature.schema.ts           # 2. Mongoose schema with tenant compound indexes
├── feature.repository.ts       # 3. Inherits BaseTenantRepository (Automatic tenant isolation)
├── feature.validator.ts        # 4. Zod request schemas (create, update, query)
├── feature.service.ts          # 5. Core business rules & validation checks
├── feature.controller.ts       # 6. Thin HTTP controller returning ResponseHelper
└── feature.routes.ts           # Wire: authenticate -> requireRole -> validate -> controller
```

### How to Add a New Business Feature:
1. Duplicate the `server/src/modules/students/` folder and rename to your module (e.g., `invoices`).
2. Replace fields in `types.ts`, `schema.ts`, and `validator.ts`.
3. Mount the new route in `server/src/app.ts`: `app.use('/api/v1/invoices', invoiceRoutes);`.
4. Create frontend API service in `client/src/services/invoice.service.ts` calling `/v1/invoices` (or `/v2/invoices` for new contract versions).
