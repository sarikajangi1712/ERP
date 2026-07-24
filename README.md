<div align="center">

# 🏢 Enterprise Mini ERP + CRM Operations Portal

[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express.js-v4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/bunnyvalluri/ERP/actions)

<p align="center">
  <b>A Production-Grade Full-Stack Enterprise Operations & Customer Relationship Management System</b><br>
  Engineered for wholesale, distribution, and multi-warehouse logistics management.
</p>

[Key Features](#-key-features--modules) •
[Tech Stack](#-tech-stack) •
[Quick Start](#-quick-start-guide-local-development) •
[Demo Credentials](#-demo-login-credentials) •
[API Documentation](#-api-documentation) •
[Docker Deployment](#-docker-deployment)

</div>

---

## 📋 Overview

The **Enterprise Mini ERP + CRM Operations Portal** is a high-performance web application designed to streamline business operations across CRM lead tracking, product master data, multi-depot warehouse inventory, sales delivery challans, tax invoice billing, and executive analytics.

Built with modern architectural patterns including **Atomic Database Transactions**, **Role-Based Access Control (RBAC)**, **Swagger API Specs**, and **GitHub Actions CI/CD Pipelines**.

---

## 🌟 Key Features & Modules

### 🔐 Multi-Role Authentication & RBAC
- **Dual-Token Architecture**: Short-lived JWT Access Tokens paired with secure HTTP-only Refresh Token rotation.
- **Strict Role Guards**: Granular permissions across 4 roles: `ADMIN`, `SALES`, `WAREHOUSE`, and `ACCOUNTS`.
- **Security Protocols**: Password hashing with `bcryptjs`, IP-based rate limiting, Helmet header protection, and CORS controls.

### 📊 Dynamic Executive Dashboard
- **Real-Time KPIs**: Revenue metrics, active lead counts, pending dispatch status, and low-stock reorder warnings.
- **Interactive Analytics**: Monthly revenue & sales trend charts powered by Chart.js.
- **Audit Activity Stream**: Live feed of recent system events and user actions.

### 👥 Customer CRM Pipeline
- **Contact Directory**: Complete customer directory with search, filtering, and tag classification.
- **Lead Pipeline**: Stage tracking (`PROSPECT`, `LEAD`, `ACTIVE`, `INACTIVE`).
- **Interaction Timeline**: Historical call notes, meeting logs, and scheduled follow-up reminders.
- **CSV Data Export**: One-click export for sales reporting.

### 📦 Product & Inventory Master Data
- **Catalog Management**: Barcode/SKU indexing, brand categorization, and GST tax bracket mapping.
- **Cloudinary CDN Upload**: Drag-and-drop image management for products.
- **Multi-Depot Warehouses**: Multi-warehouse stock tracking with location tagging.
- **Stock Audit & Guards**: Atomic Stock-In/Stock-Out transactions, inter-warehouse transfers, negative stock protection, and stock movement logs.

### 🚚 Sales Delivery Challans
- **Multi-Item Order Builder**: Real-time stock availability verification during draft creation.
- **Lifecycle Management**: `DRAFT` ➔ `CONFIRMED` ➔ `CANCELLED`.
- **Atomic Stock Deduction**: Automatically locks and deducts inventory from designated warehouses upon confirmation and restores stock on cancellation.

### 🧾 Tax Invoicing & Billing
- **One-Click Generation**: Instant conversion of confirmed delivery challans into tax invoices.
- **Payment Lifecycle**: `PENDING`, `PARTIAL`, `PAID`, `OVERDUE`.
- **Tax & Compliance**: Automated CGST/SGST/IGST calculation.
- **PDF Export**: Print-ready, branded PDF tax invoice generator.

### 📈 Reports & Audit Logs
- **Comprehensive Analytics**: Sales performance reports, inventory valuation, and GST liability summaries.
- **System Audit Logs**: Immutable log trail recording User ID, Action, IP Address, and Timestamps.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend SPA** | React 18, Vite 5, Tailwind CSS 3, React Router v6, Chart.js, Framer Motion, Lucide Icons |
| **Backend API** | Node.js v20, Express.js v4, Prisma ORM v5, JWT, bcryptjs, Winston Logger, Swagger UI |
| **Database** | PostgreSQL 16 (Relational DB with Prisma migrations & seeding) |
| **Media Storage** | Cloudinary CDN |
| **DevOps & CI/CD** | Docker, Docker Compose, GitHub Actions (Automated CI checks & audits) |

---

## 📁 Repository Structure

```
ERP-CRM/
├── backend/                  # Node.js Express API & Prisma ORM
│   ├── prisma/               # Database Schema & Seed Data
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/                  # Controllers, Routes, Services, Middlewares
│   ├── tests/                # API Test Suites
│   └── package.json
├── frontend/                 # React SPA (Vite + Tailwind CSS)
│   ├── src/                  # Components, Pages, Context, API Clients
│   ├── index.html
│   └── package.json
├── docs/                     # Architecture & Design Specifications
│   ├── PRD.md                # Product Requirements Document
│   ├── TRD.md                # Technical Requirements Document
│   ├── APP_FLOW.md           # Application Flow Diagram & Guide
│   ├── BACKEND_SCHEMA.md     # Database Schema Documentation
│   └── DEPLOYMENT.md         # Deployment Guidelines
├── scripts/                  # CI/CD & Engineering Audit Scripts
│   ├── loop-readiness.js
│   └── daily-triage.js
├── .github/workflows/        # GitHub Actions Automation
│   ├── ci-cd.yml             # Main CI/CD Build & Validation
│   ├── loop-readiness.yml    # Ecosystem Audit
│   └── security-scan.yml     # Security & Secrets Audit
├── docker-compose.yml        # Docker Multi-Container Configuration
├── Dockerfile.backend        # Container build for API service
├── Dockerfile.frontend       # Container build for React SPA
└── README.md
```

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL**: Local PostgreSQL instance or Docker container

---

### 2. Backend Setup (`backend/`)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Push Prisma schema to PostgreSQL database
npx prisma db push

# 5. Seed database with demo accounts & business data
npm run seed

# 6. Start backend development server
npm run dev
```

> 🌐 **Backend Server**: Runs on `http://localhost:5000/api`  
> 📚 **Swagger Documentation**: Interactive API Docs available at `http://localhost:5000/api-docs`

---

### 3. Frontend Setup (`frontend/`)

Open a new terminal tab:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```

> 💻 **Frontend Web App**: Accessible at `http://localhost:3000` (or Vite port `5173`)

---

### 💡 Root Workspace Commands

You can also run both services from the root folder:

```bash
# Start Frontend
npm run dev:frontend

# Start Backend
npm run dev:backend
```

---

## 🔑 Demo Login Credentials

Use the following seeded credentials to explore each role's distinct interface and permissions:

| Role | Email | Password | Accessible Modules & Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@erp.com` | `Password123!` | Full System Access, User Management, Audit Logs, Settings |
| 💼 **Sales Executive** | `sales@erp.com` | `Password123!` | Customer CRM, Sales Delivery Challans, Follow-up Tasks |
| 🏬 **Warehouse Manager** | `warehouse@erp.com` | `Password123!` | Product Master Catalog, Multi-Depot Inventory, Stock Movements |
| 💳 **Accounts Lead** | `accounts@erp.com` | `Password123!` | Tax Invoices, Payment Tracking, Revenue & GST Tax Reports |

---

## 📚 API Documentation

The backend includes auto-generated **Swagger OpenAPI 3.0** documentation.

1. Start the backend API (`cd backend && npm run dev`).
2. Visit **`http://localhost:5000/api-docs`** in your browser.
3. Use the interactive interface to test endpoints (`/auth/login`, `/customers`, `/products`, `/inventory`, `/challans`, `/invoices`).

---

## 🐳 Docker Deployment

To spin up the entire application stack (PostgreSQL + Node Backend + Nginx Frontend) with a single command:

```bash
# Build and launch containers in detached mode
docker-compose up --build -d

# Verify container health
docker-compose ps
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **PostgreSQL Database**: Port `5432`

To shut down the stack:
```bash
docker-compose down
```

---

## 🛡️ Continuous Integration & Quality Engineering

The repository includes automated **GitHub Actions Workflows**:

- **CI/CD Pipeline (`ci-cd.yml`)**: Automatically validates Prisma schemas and builds frontend & backend on every push.
- **Security Audit (`security-scan.yml`)**: Scans for exposed environment keys or vulnerable dependencies.
- **Readiness Audit (`loop-readiness.yml`)**: Ensures all architectural documentation (`docs/`) and configuration specs remain intact.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
