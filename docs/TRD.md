# Technical Requirements Document (TRD)
## Mini ERP + CRM Operations Portal

---

## 1. Document Information
- **Project Name**: Mini ERP + CRM Operations Portal
- **Version**: 1.0.0 Enterprise Production
- **Author**: Principal System Architect
- **Purpose**: Definitive technical specifications for architecture, engineering patterns, data flows, database schemas, APIs, security, and deployment pipelines.

---

## 2. System Overview & Architecture

### High-Level Architecture
The platform is built as a decoupled, multi-tier client-server architecture:
1. **Frontend Tier**: Single Page Application (SPA) built with React.js, Vite, Tailwind CSS, React Query, and Framer Motion.
2. **API Backend Tier**: Node.js REST API using Express.js, structured with Controller-Service-Repository pattern.
3. **Data Tier**: Managed PostgreSQL DB (Neon) accessed via Prisma ORM with connection pooling.
4. **Media Storage**: Cloudinary CDN for optimized image delivery.

```mermaid
graph TD
    User([Browser / Client SPA]) -->|HTTPS / REST API| ExpressServer[Node.js Express Server]
    ExpressServer -->|Auth / Middleware| SecurityLayer[Helmet / RateLimiter / JWT Guards]
    SecurityLayer -->|Business Logic| Controllers[API Controllers & Services]
    Controllers -->|ORM Queries| Prisma[Prisma ORM Client]
    Prisma -->|Pooled TCP| NeonDB[(Neon PostgreSQL DB)]
    Controllers -->|Image SDK| Cloudinary[Cloudinary CDN]
```

### Key Technical Stack
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, React Router 6, TanStack Query (React Query) v5, React Hook Form v7, Chart.js / react-chartjs-2, Lucide React, Framer Motion.
- **Backend**: Node.js v20+, Express.js v4, Prisma ORM v5, JWT (jsonwebtoken), bcryptjs, Winston, Express Validator, Helmet, CORS, Compression.
- **Database**: PostgreSQL 16 (Neon / Serverless DB).

---

## 3. Core Business Workflows & Data Flows

### Stock Allocation & Sales Challan Confirmation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Sales as Sales Executive
    participant Client as React SPA
    participant API as Express API
    participant SVC as Challan Service
    participant DB as PostgreSQL (Prisma)

    Sales->>Client: Click "Confirm Sales Challan"
    Client->>API: POST /api/challans/:id/confirm
    API->>SVC: confirmChallan(challanId, userId)
    SVC->>DB: Begin Database Transaction
    SVC->>DB: Fetch Challan & Item Quantities
    SVC->>DB: Check Inventory Levels for SKUs
    alt Inventory < Required Quantity
        DB-->>SVC: Insufficient Stock Error
        SVC-->>API: Throw StockValidationError (400)
        API-->>Client: 400 Bad Request ("Insufficient Stock for SKU-X")
    else Inventory >= Required Quantity
        SVC->>DB: Deduct Stock Quantity from Inventory
        SVC->>DB: Create StockMovement Audit Log Records
        SVC->>DB: Update Challan Status to CONFIRMED
        SVC->>DB: Commit Transaction
        SVC-->>API: Confirmation Success
        API-->>Client: 200 OK (Confirmed Challan + Updated Inventory)
    end
```

---

## 4. Database Schema Specifications

### PostgreSQL ER Model Diagram

```mermaid
erDiagram
    USERS ||--o{ REFRESH_TOKENS : has
    USERS ||--o{ AUDIT_LOGS : performs
    USERS ||--o{ SALES_CHALLANS : creates
    CUSTOMER_CRM ||--o{ CUSTOMER_NOTES : has
    CUSTOMER_CRM ||--o{ SALES_CHALLANS : places
    CUSTOMER_CRM ||--o{ INVOICES : billed_to
    CATEGORIES ||--o{ PRODUCTS : categorizes
    PRODUCTS ||--o{ INVENTORY : stored_in
    WAREHOUSES ||--o{ INVENTORY : houses
    PRODUCTS ||--o{ STOCK_MOVEMENTS : tracks
    WAREHOUSES ||--o{ STOCK_MOVEMENTS : located_at
    PRODUCTS ||--o{ SALES_ITEMS : contained_in
    SALES_CHALLANS ||--o{ SALES_ITEMS : contains
    SALES_CHALLANS ||--o| INVOICES : generates
    INVOICES ||--o{ INVOICE_ITEMS : contains

    USERS {
        uuid id PK
        string email UK
        string password
        string name
        enum role "ADMIN | SALES | WAREHOUSE | ACCOUNTS"
        boolean isActive
    }

    CUSTOMER_CRM {
        uuid id PK
        string companyName
        string contactPerson
        string email
        string phone
        string gstNumber
        enum leadStatus "PROSPECT | LEAD | ACTIVE | INACTIVE"
    }

    PRODUCTS {
        uuid id PK
        string sku UK
        string barcode UK
        string name
        decimal purchasePrice
        decimal sellingPrice
        decimal gstRate
        integer minStockAlert
    }

    INVENTORY {
        uuid id PK
        uuid productId FK
        uuid warehouseId FK
        integer quantity
    }

    SALES_CHALLANS {
        uuid id PK
        string challanNumber UK
        uuid customerId FK
        uuid warehouseId FK
        decimal totalAmount
        enum status "DRAFT | CONFIRMED | CANCELLED"
    }

    INVOICES {
        uuid id PK
        string invoiceNumber UK
        uuid challanId FK
        uuid customerId FK
        decimal grandTotal
        enum paymentStatus "PENDING | PARTIAL | PAID | OVERDUE"
    }
```

---

## 5. Security & Non-Functional Specifications

1. **Input Validation**: Express-validator on all POST/PUT endpoints.
2. **Password Security**: Bcrypt with minimum cost factor 12.
3. **Data Protection**: SQL Injection protection via Prisma parameterized queries; XSS prevention via automatic JSX escaping and Helmet CSP headers.
4. **Rate Limiting**: API Rate Limiting set to 100 requests per 15 minutes per IP; Auth rate limiting set to 5 requests per 15 minutes.
5. **Session Expiry**: Access Token expires in 15 minutes; Refresh token stored in HTTP-Only secure cookie expires in 7 days.
