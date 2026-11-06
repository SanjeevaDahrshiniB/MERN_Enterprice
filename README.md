# Triune Enterprise SaaS Starter (TES v1.0)

A commercial, production-ready MERN (React + Node.js + Express + TypeScript + MongoDB) architecture and reusable starter repository built for multi-tenant SaaS products.

---

## 🚀 Quick Start (In 3 Minutes)

### 1. Backend Server Setup
```bash
cd server
npm.cmd run seed    # Seeds demo tenant, master roles, and test users
npm.cmd run dev     # Starts Express server on http://localhost:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm.cmd run dev     # Starts Vite client on http://localhost:3000
```

### 3. Demo Credentials
Open `http://localhost:3000` and sign in:
- **Email:** `admin@triunedemo.com`
- **Password:** `Admin@123`
- **Tenant Slug:** `triune-demo`

---

## 📚 Complete Developer Manuals

The full architecture documentation is split into clear, modular guides:

- [**01. Initial Setup Guide**](docs/manual/01_INITIAL_SETUP.md) — Node version, environment variables, seeding, and local servers.
- [**02. Folder Structure & Code Map**](docs/manual/02_FOLDER_STRUCTURE.md) — Directory layout and the 6-layer business module blueprint.
- [**03. Architecture & How It Works**](docs/manual/03_HOW_IT_WORKS.md) — Multi-tenancy isolation (`AsyncLocalStorage`), dual auth, silent refresh, RBAC, and ACID transactions.
- [**04. What We Have (Feature Inventory)**](docs/manual/04_WHAT_WE_HAVE.md) — Complete checklist of backend and frontend systems implemented.
- [**05. Standard API Response Contract**](docs/manual/05_STANDARD_RESPONSE_CONTRACT.md) — All possible API responses (200, 201, 400, 401, 403, 404, 409, 429, 500) with JSON examples.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, TypeScript (NodeNext), MongoDB (Mongoose), Zod, Bcrypt, JWT.
- **Frontend:** React 18, Vite, TypeScript, React Router DOM, SweetAlert2, Sonner, Lucide React, Pure CSS Variables Theme Engine.
- **Tools:** Bruno Git-Native API Collection (`docs/bruno/`), Dual-File Logger (`server/logs/`).
