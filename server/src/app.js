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

// Security & Optimization Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Cookie Parser polyfill (simple parser)
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

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mini ERP + CRM Portal Backend Operational', timestamp: new Date() });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
