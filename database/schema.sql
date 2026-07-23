-- PostgreSQL Normalized DDL Schema
-- Mini ERP + CRM Operations Portal

CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS');
CREATE TYPE "LeadStatus" AS ENUM ('PROSPECT', 'LEAD', 'ACTIVE', 'INACTIVE');
CREATE TYPE "StockMovementType" AS ENUM ('STOCK_IN', 'STOCK_OUT', 'TRANSFER', 'CHALLAN_DEDUCTION', 'CHALLAN_RESTORE');
CREATE TYPE "ChallanStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE');

-- Users Table
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" DEFAULT 'SALES',
    "isActive" BOOLEAN DEFAULT true,
    "phone" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Customers Table
CREATE TABLE "customers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "companyName" VARCHAR(255) NOT NULL,
    "contactPerson" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "gstNumber" VARCHAR(50) UNIQUE,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "pincode" VARCHAR(20) NOT NULL,
    "leadStatus" "LeadStatus" DEFAULT 'PROSPECT',
    "creditLimit" NUMERIC(12, 2) DEFAULT 0.00,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Categories & Products
CREATE TABLE "categories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "products" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sku" VARCHAR(100) UNIQUE NOT NULL,
    "barcode" VARCHAR(100) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "categoryId" UUID NOT NULL REFERENCES "categories"("id"),
    "purchasePrice" NUMERIC(10, 2) NOT NULL,
    "sellingPrice" NUMERIC(10, 2) NOT NULL,
    "gstRate" NUMERIC(5, 2) DEFAULT 18.00,
    "minStockAlert" INT DEFAULT 10,
    "imageUrl" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Warehouses & Inventory
CREATE TABLE "warehouses" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "isDefault" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "inventories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "warehouseId" UUID NOT NULL REFERENCES "warehouses"("id") ON DELETE CASCADE,
    "quantity" INT DEFAULT 0 CHECK ("quantity" >= 0),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("productId", "warehouseId")
);

-- Sales Challans & Invoices
CREATE TABLE "sales_challans" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "challanNumber" VARCHAR(100) UNIQUE NOT NULL,
    "customerId" UUID NOT NULL REFERENCES "customers"("id"),
    "warehouseId" UUID NOT NULL REFERENCES "warehouses"("id"),
    "createdById" UUID NOT NULL REFERENCES "users"("id"),
    "status" "ChallanStatus" DEFAULT 'DRAFT',
    "subTotal" NUMERIC(12, 2) NOT NULL,
    "taxAmount" NUMERIC(12, 2) NOT NULL,
    "discountAmount" NUMERIC(12, 2) DEFAULT 0.00,
    "grandTotal" NUMERIC(12, 2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "invoices" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "invoiceNumber" VARCHAR(100) UNIQUE NOT NULL,
    "challanId" UUID UNIQUE REFERENCES "sales_challans"("id"),
    "customerId" UUID NOT NULL REFERENCES "customers"("id"),
    "paymentStatus" "PaymentStatus" DEFAULT 'PENDING',
    "subTotal" NUMERIC(12, 2) NOT NULL,
    "taxAmount" NUMERIC(12, 2) NOT NULL,
    "discountAmount" NUMERIC(12, 2) DEFAULT 0.00,
    "grandTotal" NUMERIC(12, 2) NOT NULL,
    "paidAmount" NUMERIC(12, 2) DEFAULT 0.00,
    "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs & Notifications
CREATE TABLE "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entityId" VARCHAR(255),
    "details" TEXT,
    "ipAddress" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
