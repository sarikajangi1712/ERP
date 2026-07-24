require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
  logger.info(`📖 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
});
