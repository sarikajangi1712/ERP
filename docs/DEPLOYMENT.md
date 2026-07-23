# Deployment & Production Setup Guide
## Mini ERP + CRM Operations Portal

---

## 1. Cloud Architecture & Environments

- **Database**: Neon PostgreSQL (Serverless, Auto-scaling DB)
- **Backend API**: Railway or Render (Node.js Container Deployment)
- **Frontend SPA**: Vercel or Netlify (Vite React CDN Deployment)
- **Media Storage**: Cloudinary (Cloud CDN Image Repository)

---

## 2. Step-by-Step Production Deployment

### Step 1: Database Provisioning (Neon PostgreSQL)
1. Log into [Neon.tech](https://neon.tech) and create a new PostgreSQL database instance: `erp_crm_prod`.
2. Copy the Direct PostgreSQL Connection string: `postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/erp_crm_prod?sslmode=require`.

### Step 2: Backend API Deployment (Railway)
1. Connect GitHub repository to Railway.
2. Set Root Directory to `/server`.
3. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL=postgresql://...`
   - `JWT_SECRET=your_super_secret_jwt_key`
   - `JWT_REFRESH_SECRET=your_super_secret_refresh_key`
   - `FRONTEND_URL=https://your-app.vercel.app`
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
4. Build Command: `npx prisma generate && npx prisma db push && npm run seed`
5. Start Command: `node src/server.js`

### Step 3: Frontend SPA Deployment (Vercel)
1. Import repository on Vercel.
2. Set Framework Preset: `Vite`.
3. Root Directory: `/client`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL=https://your-railway-backend.up.railway.app/api`
5. Deploy.

---

## 3. Local Docker Orchestration

To run the entire ecosystem locally using Docker Compose:

```bash
# Clone repository
git clone https://github.com/your-org/erp-crm-portal.git
cd erp-crm-portal

# Copy environment template
cp .env.example .env

# Spin up Postgres, Express API, and React Client
docker-compose up --build -d

# Verify containers are running
docker-compose ps
```

Access points:
- **Frontend SPA**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`
- **Swagger Documentation**: `http://localhost:5000/api-docs`
