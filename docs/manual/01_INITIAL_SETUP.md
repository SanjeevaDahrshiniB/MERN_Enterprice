# 01. Initial Setup Guide

This guide walks you through setting up and running the Triune Enterprise SaaS application locally in under 3 minutes.

---

## 1. Prerequisites

- **Node.js**: v20 or higher (`node -v`)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas connection string.

---

## 2. Environment Configuration

### Backend (`server/.env`)
Create `server/.env` (or copy from `server/.env.example`):

```env
APP_NAME=Triune Enterprise SaaS
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/triune_saas

# JWT Secrets (Minimum 16 characters)
JWT_ACCESS_SECRET=triune_super_secure_access_secret_change_in_production_123456
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=triune_super_secure_refresh_secret_change_in_production_654321
JWT_REFRESH_EXPIRES_IN=7d

# CORS Allowed Origins
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Rate Limiting Settings
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MINUTES=15
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

### Frontend (`client/.env`)
Create `client/.env`:

```env
# Points to backend /api gateway (service versioning is declared in domain services: /v1, /v2)
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 3. Database Seeding

Run the seed script to create the master roles, demo tenant, and administrator test accounts:

```bash
cd server
npm.cmd run seed
```

### Default Seeded Accounts:

| Role | Email | Password | Tenant Slug | Purpose |
|---|---|---|---|---|
| **SUPER_ADMIN** | `superadmin@triune.com` | `Admin@123` | *(None - System Root)* | System Administrator with full bypass |
| **TENANT_ADMIN** | `admin@triunedemo.com` | `Admin@123` | `triune-demo` | School / Tenant Administrator |
| **STAFF** | `staff@triunedemo.com` | `Admin@123` | `triune-demo` | Daily operational staff |

---

## 4. Starting the Development Servers

Open two separate terminals:

### Terminal 1: Backend Server (Port 5000)
```bash
cd server
npm.cmd run dev
```
> Server runs on `http://localhost:5000`. Health check: `http://localhost:5000/health`.

### Terminal 2: Frontend Client (Port 3000)
```bash
cd client
npm.cmd run dev
```
> Client runs on `http://localhost:3000`. Open in browser and sign in with the test accounts above.
