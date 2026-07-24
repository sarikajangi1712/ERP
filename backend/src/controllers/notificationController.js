const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getNotifications(req, res, next) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { userId: null }, // System broadcast
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, markAsRead };
