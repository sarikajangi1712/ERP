# Pattern: Controller-Service-Repository
## Mini ERP + CRM Operations Portal

All backend modules must strictly adhere to the layered pattern:
- **Routes (`src/routes/`)**: HTTP endpoint definitions, middleware attachment (auth, rbac, rateLimiter, validator).
- **Controllers (`src/controllers/`)**: Handles request parameters, input extraction, HTTP response formatting, and error forwarding.
- **Services (`src/services/`)**: Domain business logic, database transactions, stock deduction rules, auto-numbering, and audit log triggers.
- **Prisma ORM (`prisma/schema.prisma`)**: Parameterized database queries and constraints.
