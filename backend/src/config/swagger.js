const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini ERP + CRM Enterprise REST API Specification',
      version: '2.4.0',
      description: `
# 🚀 Enterprise Wholesale Operations & CRM REST API

Welcome to the official REST API documentation for the **Mini ERP + CRM Enterprise Platform**.

### 🌟 Key Architectural Features:
* 🔐 **Dual-Token Authentication**: JWT Access tokens (short-lived) + Refresh tokens with rotation & bcrypt password hashing.
* 👥 **Role-Based Access Control (RBAC)**: Enforced granular permissions (\`ADMIN\`, \`SALES\`, \`WAREHOUSE\`, \`ACCOUNTS\`).
* 📦 **Atomic Multi-Depot Inventory**: Negative stock protection guards & inter-depot stock transfer logs.
* 🧾 **GST Compliant Invoicing**: Automated CGST/SGST/IGST tax calculation & printable PDF generation.
* 🛡️ **Enterprise Audit Trail**: System-wide log capture tracking User ID, Action Type, IP Address, and Timestamps.

---
### 🔓 How to Test Endpoints:
1. Call \`POST /api/auth/login\` with email \`admin@erp.com\` & password \`Password123!\` to obtain your JWT token.
2. Click **Authorize 🔓** at the top right and enter: \`Bearer <your_access_token>\`.
3. Try any endpoint live!
      `,
      contact: {
        name: 'Mini ERP Enterprise Core Engineering Team',
        email: 'api-support@erp-crm.com',
        url: 'http://localhost:3000'
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server (Express.js REST Engine)'
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User login, registration, phone OTP, refresh token & session endpoints' },
      { name: 'Customer CRM', description: 'Customer directory, lead stages (Prospect, Lead, Active), notes & CSV exports' },
      { name: 'Product Catalog', description: 'Master SKUs, categories, pricing, unit measurements & active catalog' },
      { name: 'Multi-Depot Inventory', description: 'Warehouse stock balances, stock adjustments, & inter-depot transfers' },
      { name: 'Sales Challans', description: 'Draft delivery challan creation, stock validation & confirmation execution' },
      { name: 'Tax Invoices & GST', description: 'Tax invoice generation, GST calculations, payment status & PDF download' },
      { name: 'Executive Reports', description: 'Sales performance analytics, asset valuation & GST summaries' },
      { name: 'Security Audit Logs', description: 'System-wide audit trail logs tracing user activity and IP address' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'System Administrator' },
            email: { type: 'string', example: 'admin@erp.com' },
            role: { type: 'string', enum: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'], example: 'ADMIN' },
            phone: { type: 'string', example: '+919876543210' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 101 },
            name: { type: 'string', example: 'Apex Industrial Supplies' },
            email: { type: 'string', example: 'contact@apexind.com' },
            phone: { type: 'string', example: '+919876543210' },
            gstin: { type: 'string', example: '27AAAAA0000A1Z5' },
            address: { type: 'string', example: 'Plot 42, Industrial Area Phase II, Mumbai' },
            leadStage: { type: 'string', enum: ['PROSPECT', 'LEAD', 'ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
            creditLimit: { type: 'number', example: 500000 },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        SalesChallan: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 401 },
            challanNumber: { type: 'string', example: 'CHAL-20260724-0001' },
            customerId: { type: 'integer', example: 101 },
            status: { type: 'string', enum: ['DRAFT', 'CONFIRMED', 'CANCELLED'], example: 'CONFIRMED' },
            totalAmount: { type: 'number', example: 245000.00 },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation error or unauthorized operation' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/config/swaggerPaths.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
