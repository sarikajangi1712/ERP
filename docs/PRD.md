# Product Requirements Document (PRD)
## Mini ERP + CRM Operations Portal

---

## 1. Executive Summary & Goal
The **Mini ERP + CRM Operations Portal** is an integrated enterprise operational platform designed for wholesale and distribution companies. The platform unifies core operations—Customer Relationship Management (CRM), Product Catalog, Warehouse Inventory Control, Sales Challan issuance, Automated Invoicing, Analytics & Reports, Role-Based Access Control, and System Auditing—into a single web application.

---

## 2. Target Roles & Persona Matrix

| Role | Key Operational Responsibilities | Primary UI Views | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | Full system access, User Management, Global Reports, Audit Logs, Master Config | All Modules & System Settings | Full (Read / Write / Delete / Approve) |
| **Sales Executive** | Lead Management, Customer Profiles, Follow-up Logs, Sales Challan Creation | CRM, Products, Sales Challans, Daily Follow-ups | Sales & CRM write; Inventory Read-only |
| **Warehouse Staff**| Stock In, Stock Out, Stock Transfers, Low Stock Alerts, Inventory Audit | Warehouses, Inventory, Movement Logs | Inventory & Warehouse write; Sales Read-only |
| **Accounts Staff** | Invoice Generation, Payment Status updates, Tax Summaries, Financial Reports | Invoices, Revenue Reports, Sales Reports | Invoice & Financial write; Sales/Customer Read-only |

---

## 3. Detailed Functional Modules & Requirements

### 3.1 Authentication & User Access
- **Multi-Role JWT Auth**: Secure login supporting `ADMIN`, `SALES`, `WAREHOUSE`, and `ACCOUNTS` roles.
- **Token Security**: Dual-token architecture with short-lived access tokens (15m) and HTTP-only refresh tokens (7d) with token rotation.
- **Password Management**: Bcrypt hashing (rounds = 12), secure password reset via token, mandatory password change workflow.
- **Session Protection**: Automatic session expiration, brute-force protection with express-rate-limit (max 5 login attempts per 15 minutes per IP).

### 3.2 Dynamic Enterprise Dashboard
- **Real-time Operational Cards**: Total Active Customers, Total Product SKUs, Total Inventory Value (INR), Today's Sales Volume, Total Revenue, Pending Sales Challans, Unpaid Invoices, Low Stock Alerts.
- **Data Visualizations**:
  - Monthly Sales Trend (Line Chart)
  - Revenue Breakdown by Product Category (Doughnut Chart)
  - Warehouse Inventory Stock Level (Bar Chart)
  - Top 5 Selling Products (Horizontal Bar Chart)
- **Recent Activity Feed**: Real-time audit log list displaying user actions (e.g., "Warehouse Manager added 50 units of SKU-104").

### 3.3 Customer CRM Module
- **Customer Directory**: Tabular list with search by Name/Email/Phone/GST, filter by Lead Status (`PROSPECT`, `LEAD`, `ACTIVE`, `INACTIVE`), and pagination.
- **Comprehensive Profile**: Business Name, Contact Person, GSTIN, Email, Phone, Shipping & Billing Address, Credit Limit, Payment Terms.
- **CRM Timeline & Notes**: Historical activity feed containing logged phone calls, meeting notes, automated sales challan/invoice events.
- **Data Export**: Single-click export of customer records to CSV format.

### 3.4 Product Catalog Module
- **Product Master Data**: Name, Category, SKU (unique barcode-compatible identifier), Barcode, Purchase Price, Selling Price, GST Percentage (0%, 5%, 12%, 18%, 28%), Minimum Safety Stock, Warehouse Location.
- **Media Upload**: Integration with Cloudinary for product image storage and thumbnail optimization.
- **Stock Threshold Tracking**: Dynamic visual tags for `In Stock`, `Low Stock`, `Out of Stock`.

### 3.5 Inventory & Warehouse Operations
- **Warehouse Management**: Support for multi-warehouse allocation (Main Warehouse, Transit Hub, Regional Depot).
- **Stock Adjustments**:
  - **Stock In**: Purchase arrival / return intake.
  - **Stock Out**: Internal usage / damage write-offs.
  - **Stock Transfer**: Moving stock between warehouses with movement logging.
- **Guard Rail**: **Strict Rule**: Stock balance can NEVER drop below zero. System rejects any allocation attempt exceeding available inventory.

### 3.6 Sales Challan Module
- **Interactive Builder**: Select customer, search and add multiple product SKUs, adjust quantities, apply item-level discounts and GST.
- **Business Logic Enforcement**:
  - Stock validation upon drafting.
  - **Confirmation Action**: Locks challan, generates immutable Challan Number (`CHAL-YYYYMMDD-XXXX`), automatically reduces stock quantities from the selected warehouse, and saves product price snapshot.
  - **Cancellation Action**: Restores deducted inventory back to warehouse stock and logs audit record.

### 3.7 Invoice Module
- **Automated Generation**: One-click invoice conversion from Confirmed Sales Challans or direct invoice drafting (`INV-YYYYMMDD-XXXX`).
- **Financial Calculations**: Item subtotal, discount, SGST/CGST or IGST calculation, grand total.
- **Payment Lifecycle**: Status transitions (`PENDING`, `PARTIAL`, `PAID`, `OVERDUE`).
- **Print & PDF**: Client-side renderable, print-ready formal tax invoice layout with company branding and signature block.

### 3.8 CRM Follow-ups & Reminders
- **Daily Call Log**: Filter by "Today's Due Follow-ups", "Upcoming Follow-ups", "Overdue Calls".
- **Quick Action**: One-click call completion modal to record outcome and schedule next follow-up date.

### 3.9 Reports & Business Analytics
- **Sales Performance Report**: Filterable by date range, customer, or sales rep.
- **Inventory Audit & Valuation Report**: Total stock value, fast-moving vs slow-moving stock.
- **GST Tax Summary Report**: CGST/SGST/IGST breakdown for quarterly filing.
- **Multi-Format Export**: Download reports in CSV, Excel, and PDF formats.

### 3.10 System Audit Log & Security
- **Audit Tracking**: Comprehensive capture of action type (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `STOCK_TRANSFER`), user ID, target entity, timestamp, and IP address.
- **Notifications**: Automated trigger for low stock alerts, invoice generation, challan confirmations.

---

## 4. Non-Functional Requirements
- **Performance**: API response times under 200ms for p95 requests.
- **Availability**: 99.9% uptime target leveraging cloud serverless DB (Neon) and stateless backend containers.
- **Security**: OWASP Top 10 compliance, Helmet security headers, CORS origin verification, sanitized inputs.
