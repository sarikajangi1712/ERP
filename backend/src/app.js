const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const apiRouter = require('./routes/apiRouter');
const { errorHandler } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

const app = express();

// Custom Dark-Themed Swagger UI Config
const swaggerUiOptions = {
  customCss: `
    .swagger-ui { background-color: #06080F; color: #cbd5e1; font-family: system-ui, -apple-system, sans-serif; }
    .swagger-ui .topbar { background-color: #0A0D18; border-bottom: 1px solid #1e293b; padding: 14px 0; }
    .swagger-ui .topbar a span { font-weight: 800; color: #3b82f6; font-size: 17px; }
    .swagger-ui .info { margin: 24px 0; }
    .swagger-ui .info .title { color: #f8fafc; font-weight: 900; }
    .swagger-ui .info p, .swagger-ui .info li { color: #94a3b8; font-size: 14px; leading: 1.6; }
    .swagger-ui .scheme-container { background: #0B0F1D; border: 1px solid #1e293b; border-radius: 16px; box-shadow: none; padding: 15px; }
    .swagger-ui .opblock { border-radius: 14px; border: 1px solid #1e293b; background: #0E1424; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .swagger-ui .opblock .opblock-summary { padding: 10px 16px; }
    .swagger-ui .opblock .opblock-summary-method { border-radius: 10px; font-weight: 800; min-width: 75px; text-align: center; font-size: 12px; }
    .swagger-ui .opblock.opblock-post { background: rgba(16, 185, 129, 0.04); border-color: rgba(16, 185, 129, 0.3); }
    .swagger-ui .opblock.opblock-get { background: rgba(59, 130, 246, 0.04); border-color: rgba(59, 130, 246, 0.3); }
    .swagger-ui .opblock.opblock-put { background: rgba(245, 158, 11, 0.04); border-color: rgba(245, 158, 11, 0.3); }
    .swagger-ui .opblock.opblock-delete { background: rgba(244, 63, 94, 0.04); border-color: rgba(244, 63, 94, 0.3); }
    .swagger-ui .opblock-tag { color: #38bdf8; font-weight: 800; border-bottom: 1px solid #1e293b; padding: 12px 0; font-size: 18px; }
    .swagger-ui .btn.authorize { color: #10b981; border-color: #10b981; background: rgba(16, 185, 129, 0.1); border-radius: 12px; font-weight: 700; }
    .swagger-ui .btn.authorize svg { fill: #10b981; }
    .swagger-ui table thead tr th, .swagger-ui table thead tr td { color: #cbd5e1; border-bottom: 1px solid #1e293b; }
    .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #e2e8f0; }
    .swagger-ui section.models { border: 1px solid #1e293b; border-radius: 16px; background: #0E1424; }
    .swagger-ui section.models h4 { color: #f8fafc; }
    .swagger-ui input, .swagger-ui textarea, .swagger-ui select { background: #07090E !important; color: #f8fafc !important; border: 1px solid #1e293b !important; border-radius: 8px !important; }
  `,
  customSiteTitle: 'Mini ERP + CRM Enterprise REST API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    docExpansion: 'list'
  }
};

// Security & Optimization Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Cookie Parser polyfill
app.use((req, res, next) => {
  req.cookies = req.cookies || {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      req.cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  next();
});

// Rate limiting
app.use('/api/', apiLimiter);

// Swagger API Documentation Endpoint (/api-docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini ERP + CRM Portal Backend Operational', timestamp: new Date() });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
