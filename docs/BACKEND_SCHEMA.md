# Backend Architecture & Schema Specifications
## Mini ERP + CRM Operations Portal

---

## 1. Directory & Layered Architecture
The backend application is structured cleanly following the separation of concerns principle:

```
server/
├── prisma/
│   ├── schema.prisma       # Prisma ORM Data Models & Constraints
│   └── seed.js             # Database Seeder Script
├── src/
│   ├── config/             # Environment, DB, Cloudinary & Auth Config
│   ├── controllers/        # Express Route Handlers (Request / Response)
│   ├── middlewares/        # Authentication, Authorization, Validation, Error Handling
│   ├── routes/             # API Route Specifications
│   ├── services/           # Domain Business Logic & DB Transactions
│   ├── utils/              # Winston Logger, PDF & CSV Helpers
│   ├── validators/         # Input Validation Schemas
│   ├── app.js              # Express Application Initializer
│   └── server.js           # Server Port Listener
```

---

## 2. PostgreSQL Data Model Specifications (Prisma Enums & Models)

### Enums
- `Role`: `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`
- `LeadStatus`: `PROSPECT`, `LEAD`, `ACTIVE`, `INACTIVE`
- `ChallanStatus`: `DRAFT`, `CONFIRMED`, `CANCELLED`
- `PaymentStatus`: `PENDING`, `PARTIAL`, `PAID`, `OVERDUE`
- `StockMovementType`: `STOCK_IN`, `STOCK_OUT`, `TRANSFER`, `CHALLAN_DEDUCTION`, `CHALLAN_RESTORE`

---

## 3. Complete REST API Specifications

### Auth API (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Public | Authenticate user, return JWT access token & set refresh cookie |
| `POST` | `/refresh` | Public | Refresh expired access token using refresh token cookie |
| `POST` | `/logout` | Authenticated | Revoke refresh token and clear cookie |
| `GET` | `/me` | Authenticated | Fetch current user profile & permissions |
| `POST` | `/forgot-password` | Public | Send password reset token email |
| `POST` | `/reset-password` | Public | Reset password using valid reset token |
| `POST` | `/change-password` | Authenticated | Update password for logged in user |

### Customer CRM API (`/api/customers`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Roles | List customers with search, status filter & pagination |
| `POST` | `/` | Admin, Sales | Create new customer record |
| `GET` | `/:id` | All Roles | Get customer profile, details, timeline & notes |
| `PUT` | `/:id` | Admin, Sales | Update customer details |
| `DELETE`| `/:id` | Admin | Soft delete customer record |
| `POST` | `/:id/notes` | Admin, Sales | Add follow-up note to customer profile |
| `GET` | `/export/csv` | Admin, Sales | Download customers directory as CSV |

### Product Master API (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Roles | Search & list products with categories & stock |
| `POST` | `/` | Admin, Warehouse | Create product SKU with price, GST, image |
| `GET` | `/:id` | All Roles | Get single product SKU details |
| `PUT` | `/:id` | Admin, Warehouse | Update product details |
| `DELETE`| `/:id` | Admin | Delete product SKU |

### Inventory API (`/api/inventory`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/stock` | All Roles | View stock levels across warehouses |
| `POST` | `/adjust` | Admin, Warehouse | Stock In / Stock Out adjustment |
| `POST` | `/transfer` | Admin, Warehouse | Transfer stock between warehouses |
| `GET` | `/movements` | Admin, Warehouse | View stock movement audit log |
| `GET` | `/warehouses` | All Roles | List active warehouses |

### Sales Challan API (`/api/challans`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Admin, Sales, Wh | List sales challans |
| `POST` | `/` | Admin, Sales | Create sales challan draft |
| `GET` | `/:id` | Admin, Sales, Wh | Get challan details & line items |
| `PUT` | `/:id` | Admin, Sales | Update draft challan |
| `POST` | `/:id/confirm` | Admin, Sales | Lock challan & deduct warehouse stock |
| `POST` | `/:id/cancel` | Admin, Sales | Cancel challan & restore warehouse stock |

### Invoice API (`/api/invoices`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Admin, Accounts, Sales | List invoices |
| `POST` | `/generate-from-challan/:challanId` | Admin, Accounts | Generate tax invoice from confirmed sales challan |
| `GET` | `/:id` | Admin, Accounts, Sales | View invoice detail with printable layout |
| `PATCH` | `/:id/payment` | Admin, Accounts | Update payment status (`PAID`, `PARTIAL`, `OVERDUE`) |

### Dashboard & Reports API (`/api/dashboard` & `/api/reports`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | All Roles | Fetch core KPI cards & charts data |
| `GET` | `/api/reports/sales` | Admin, Accounts | Fetch sales report & trigger CSV export |
| `GET` | `/api/reports/inventory` | Admin, Wh, Accounts | Fetch inventory valuation report |
| `GET` | `/api/reports/gst` | Admin, Accounts | Fetch quarterly GST tax summary |

---

## 4. Centralized Error Handling Strategy
Standardized API JSON response format:

```json
{
  "success": false,
  "message": "Insufficient stock in Main Warehouse for SKU: PROD-102",
  "error": "STOCK_VALIDATION_ERROR",
  "statusCode": 400,
  "timestamp": "2026-07-22T14:00:00.000Z"
}
```
