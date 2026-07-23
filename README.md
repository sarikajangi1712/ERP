# Enterprise Mini ERP + CRM Operations Portal

> **Full-Stack Enterprise Operations Platform** for wholesale & distribution management. Built with React.js (Vite + Tailwind CSS), Node.js (Express), PostgreSQL (Prisma ORM), Docker, and integrated Loop Engineering workflows.

---

## 🌟 Key Features & Modules

- **Authentication & Security**: Multi-role JWT authentication (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`), dual-token architecture with refresh token rotation, bcrypt password hashing, express-rate-limit, Helmet HTTP headers.
- **Dynamic Executive Dashboard**: Real-time stats cards, low stock reorder alerts, monthly sales trend charts, top selling products, recent audit log feed.
- **Customer CRM**: Contact directory, lead status pipeline (`PROSPECT`, `LEAD`, `ACTIVE`, `INACTIVE`), interaction note timeline, CSV export.
- **Product Catalog**: Barcode & SKU master data, category filters, GST tax rate configuration, Cloudinary CDN image dropzone upload.
- **Warehouse Inventory Control**: Multi-warehouse depot management, atomic stock adjustments (Stock In, Stock Out), inter-warehouse transfers, movement audit trail, negative inventory guards.
- **Sales Challans**: Multi-item draft builder, stock availability check, status lifecycle (`DRAFT` -> `CONFIRMED` -> `CANCELLED`), automatic warehouse stock deduction upon confirmation, stock restoration on cancellation.
- **Tax Invoices**: One-click invoice generation from confirmed sales challans, payment lifecycle (`PENDING`, `PARTIAL`, `PAID`, `OVERDUE`), printable tax invoice, downloadable PDF generation.
- **CRM Follow-ups**: Scheduled call reminders, daily due outreach list.
- **Analytics & Reports**: Sales performance report, inventory valuation report, GST tax summary, multi-format CSV export.
- **Audit Trail & Logs**: System-wide activity logs capturing user ID, action type, timestamp, IP address.
- **Loop Engineering Ecosystem**: Safe continuous engineering loops for daily triage, PR babysitting, dependency sweeping, and security audits.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, React Router v6, TanStack Query (React Query v5), React Hook Form, Chart.js, Framer Motion, Lucide Icons.
- **Backend**: Node.js v20, Express.js v4, Prisma ORM v5, JWT (jsonwebtoken), bcryptjs, Winston Logger, Express Validator, Helmet, CORS, Compression, Swagger UI.
- **Database**: PostgreSQL 16 (Neon Serverless DB ready).
- **Storage**: Cloudinary CDN.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD.

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database (or Docker)

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma Client & push schema to PostgreSQL
npx prisma generate
npx prisma db push

# Seed demo users & business data
npm run seed

# Start API server
npm run dev
```
API server running at: `http://localhost:5000/api`
Swagger API Docs available at: `http://localhost:5000/api-docs`

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Client SPA running at: `http://localhost:3000`

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Primary Accessible Modules |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@erp.com` | `Password123!` | All Modules, Audit Logs, Master Config |
| **Sales Executive** | `sales@erp.com` | `Password123!` | Customer CRM, Sales Challans, Follow-ups |
| **Warehouse Manager** | `warehouse@erp.com` | `Password123!` | Product Catalog, Inventory Control, Warehouses |
| **Accounts Lead** | `accounts@erp.com` | `Password123!` | Tax Invoices, Revenue & GST Reports |

---

## 🐳 Docker Deployment

Run the unified stack with PostgreSQL, Express API, and Nginx React frontend:

```bash
# Spin up containers
docker-compose up --build -d

# Verify container status
docker-compose ps
```

---

## 🔁 Loop Engineering Integration

The project includes an active Loop Engineering ecosystem:
- [LOOP.md](file:///c:/Users/SHILPA/Downloads/ERP-CRM/LOOP.md) — Architecture & loop specifications
- [STATE.md](file:///c:/Users/SHILPA/Downloads/ERP-CRM/STATE.md) — Continuous task & state tracker
- [loop-constraints.md](file:///c:/Users/SHILPA/Downloads/ERP-CRM/loop-constraints.md) — Non-negotiable safety guardrails
- [loop-budget.md](file:///c:/Users/SHILPA/Downloads/ERP-CRM/loop-budget.md) — Resource limits
- `.github/workflows/` — Automated workflows for PR Babysitter, Security Audit, Daily Triage.
