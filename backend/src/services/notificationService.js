const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

async function createNotification({ userId, title, message, type = 'INFO', link }) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
  } catch (err) {
    logger.error('Failed to create notification', err);
  }
}

module.exports = { createNotification };
