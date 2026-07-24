const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

async function logAudit({ userId, action, entity, entityId, details, ipAddress }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress: ipAddress || '127.0.0.1',
      },
    });
  } catch (err) {
    logger.error('Failed to create audit log entry', err);
  }
}

module.exports = { logAudit };
