# 04. What We Have (Feature Inventory)

This checklist provides a complete breakdown of all architectural engines, business features, and frontend systems implemented in this starter.

---

## 1. Backend Systems (`server/`)

- [x] **Zod-Validated Environment**: 1:1 uppercase variables in `server/src/config/env.ts` with strict mandatory checks (e.g. `MONGO_URI` required).
- [x] **Database Engine**: Mongoose connection pooling with auto-reconnect and graceful shutdown (`SIGTERM`, `SIGINT`).
- [x] **Multi-Tenancy Engine**: `AsyncLocalStorage` context isolating tenant IDs across asynchronous request chains.
- [x] **Base Tenant Repository**: Automatic tenant isolation, pagination (`page`, `limit`), sorting, soft delete (`isDeleted: true`), and transaction session support.
- [x] **Security Engine**:
  - Bcrypt password hashing (Salt work factor: 12).
  - JWT Access Token (15m expiry) and Refresh Token (7d expiry).
  - Cryptographic SHA-256 token hashing for database storage and instant revocation on logout.
- [x] **Middleware Pipeline**:
  - `request-context.middleware`: Generates `x-request-id` (correlation ID).
  - `auth.middleware`: Dual auth (Bearer header + HttpOnly cookies).
  - `permission.middleware`: Clean role-based authorization (`requireRole`).
  - `validate.middleware`: Zod schema validation on body, query, and params.
  - `rate-limiter.middleware`: Two-tier rate limiter (Global API + Strict Auth).
  - `error.middleware`: Centralized error handler writing structured logs to `server/logs/error.log`.
- [x] **Raw Webhook Body Buffer**: `express.json({ verify: ... })` preserving untouched `req.rawBody` for Razorpay / Stripe signature checks.
- [x] **ACID Transactions**: `withTransaction` unit of work helper with standalone fallback.
- [x] **Database Seeding (`npm run seed`)**: Idempotent seeding creating `SUPER_ADMIN`, `TENANT_ADMIN`, and `STAFF` test accounts.
- [x] **Business Modules**:
  - `auth`: Login, Register, Silent Refresh, Logout (with DB token wipe), Current Profile.
  - `tenants`: Creation, Listing, Slug indexing.
  - `users`: User management with unique compound index `{ tenantId: 1, email: 1 }`.
  - `students`: Full 6-layer reference module with search, class filtering, and bulk import.

---

## 2. Frontend Systems (`client/`)

- [x] **Routing (`react-router-dom`)**:
  - `/login`: Clean login form with demo credentials autofill.
  - `/students`: Protected dashboard accessible only with valid session.
  - `*`: Custom 404 Not Found page.
- [x] **Route Guards (`src/guards/`)**:
  - `ProtectedRoute.tsx`: Redirects unauthenticated visitors to `/login`.
  - `GuestGuard.tsx`: Redirects already logged-in users away from `/login`.
  - `RoleGuard.tsx`: Simple role-based gate for components and pages.
- [x] **Layout System (`src/layouts/`)**:
  - `MainLayout.tsx`: Encapsulates Navbar, OfflineBanner, and responsive Side Drawer.
  - `AuthLayout.tsx`: Centered layout for authentication screens.
- [x] **Feature-Driven Domain Modules (`src/modules/`)**:
  - `modules/auth/`: Contains LoginPage, auth.service.ts, auth.types.ts.
  - `modules/students/`: Contains StudentListPage, student.service.ts, student.types.ts.
- [x] **Atomic UI Component Library (`src/components/ui/`)**:
  - Reusable primitives: `Button`, `Input`, `Modal`, `Table`, `Pagination`, `Loader`.
- [x] **Core Services & Storage (`src/services/`)**:
  - `services/api/`: Decoupled `apiClient` with silent 401 refresh `interceptors`.
  - `services/storage/`: Type-safe storage service for cookies and localStorage with `triune_` prefix.
- [x] **Modern Pure CSS Theme Engine (`index.css`)**:
  - CSS Custom Properties (`:root` for light mode, `[data-theme="dark"]` for dark mode).
  - 1-click instantaneous 0.2s smooth theme switcher.
  - Zero heavy CSS framework overhead (CSS bundle: 5.5 kB).
- [x] **Responsive Mobile Experience**:
  - Desktop: Horizontal navigation bar.
  - Mobile (< 768px): Hamburger button opening a smooth animated Off-Canvas Side Drawer with user profile, module links, theme switch, and sign out.
- [x] **Interactive UI Enhancements**:
  - **SweetAlert2 (`sweetalert2`)**: Modern modal dialogs for Delete and Sign Out confirmations.
  - **Sonner (`sonner`)**: Floating toast notifications with countdown progress bars.
  - **Offline Banner (`OfflineBanner.tsx`)**: Sticky alert appearing immediately when internet disconnects.
  - **React Error Boundary (`ErrorBoundary.tsx`)**: Catches runtime render crashes and presents a recovery screen.
  - **Empty State Component (`EmptyState.tsx`)**: Clean UI displayed when a list has 0 records.
  - **Dynamic Date Helper (`date.ts`)**: Auto-detects browser timezone, formats UTC timestamps, and builds day-boundary ranges for queries.
  - **Value Formatter (`format.ts`)**: Replaces blank empty strings with `'N/A'`.
