const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../services/auditService');

const prisma = new PrismaClient();

/**
 * Get list of all users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user (Admin only)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'SALES',
        phone: phone || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Audit Log
    await logAudit({
      userId: req.user.id,
      action: 'USER_CREATED',
      entity: 'USER',
      entityId: newUser.id,
      details: `Created new user ${newUser.name} (${newUser.email}) with role ${newUser.role}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle user active status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating oneself
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'USER_STATUS_TOGGLED',
      entity: 'USER',
      entityId: updated.id,
      details: `Set user status of ${updated.email} to ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `User ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  toggleUserStatus,
};
