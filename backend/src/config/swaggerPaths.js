/**
 * OpenAPI 3.0 Path Annotations for Mini ERP + CRM Enterprise REST API
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user with Email & Password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@erp.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT access & refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'

 * /auth/google-login:
 *   post:
 *     summary: Firebase Google OAuth Single Sign-On
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: firebase_google_id_token_string
 *     responses:
 *       200:
 *         description: Google auth verified & token issued.

 * /auth/register:
 *   post:
 *     summary: Register new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rajesh Sharma
 *               email:
 *                 type: string
 *                 example: rajesh@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *               phone:
 *                 type: string
 *                 example: +919876543210
 *     responses:
 *       201:
 *         description: Account registered successfully.

 * /auth/phone-login:
 *   post:
 *     summary: Authenticate via Mobile Phone OTP Code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, otp]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: +919876543210
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Phone OTP verified. Token issued.

 * /auth/me:
 *   get:
 *     summary: Get currently authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details.

 * /customers:
 *   get:
 *     summary: List customer CRM directory with pagination & search
 *     tags: [Customer CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter by customer name, email, or phone
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *           enum: [PROSPECT, LEAD, ACTIVE, INACTIVE]
 *         description: Filter by CRM lead pipeline stage
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Paginated customer list.
 *   post:
 *     summary: Create a new customer CRM record
 *     tags: [Customer CRM]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully.

 * /products:
 *   get:
 *     summary: Retrieve master product catalog & SKU list
 *     tags: [Product Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category SKU
 *     responses:
 *       200:
 *         description: List of catalog items.

 * /inventory:
 *   get:
 *     summary: Get multi-depot stock levels per warehouse
 *     tags: [Multi-Depot Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock levels across warehouses.

 * /inventory/transfer:
 *   post:
 *     summary: Perform atomic stock transfer between warehouse depots
 *     tags: [Multi-Depot Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, fromDepot, toDepot, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 201
 *               fromDepot:
 *                 type: string
 *                 example: Central Depot A
 *               toDepot:
 *                 type: string
 *                 example: North Hub B
 *               quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Inter-depot stock transfer completed.

 * /challans:
 *   get:
 *     summary: List sales delivery challans
 *     tags: [Sales Challans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales challans.
 *   post:
 *     summary: Create draft sales delivery challan
 *     tags: [Sales Challans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesChallan'
 *     responses:
 *       201:
 *         description: Draft challan created.

 * /challans/{id}/confirm:
 *   post:
 *     summary: Confirm sales challan & deduct physical stock atomically
 *     tags: [Sales Challans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Challan confirmed & stock deducted from depot.

 * /invoices:
 *   get:
 *     summary: List tax invoices & GST summaries
 *     tags: [Tax Invoices & GST]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tax invoices list.
 *   post:
 *     summary: Generate GST tax invoice from confirmed challan
 *     tags: [Tax Invoices & GST]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [challanId]
 *             properties:
 *               challanId:
 *                 type: integer
 *                 example: 401
 *     responses:
 *       201:
 *         description: Tax invoice generated with GST breakdown.

 * /invoices/{id}/pdf:
 *   get:
 *     summary: Download printable tax invoice PDF document
 *     tags: [Tax Invoices & GST]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Binary PDF stream of printable GST invoice.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary

 * /audit-logs:
 *   get:
 *     summary: Retrieve enterprise audit logs (Admin only)
 *     tags: [Security Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: System audit trail entries.

 * /reports/sales:
 *   get:
 *     summary: Executive sales performance revenue report
 *     tags: [Executive Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales analytics data.
 */
