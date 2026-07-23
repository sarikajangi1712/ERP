const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAuditLogs(req, res, next) {
  try {
    const { action, entity, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(action && { action }),
      ...(entity && { entity }),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: Number(limit),
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAuditLogs };
