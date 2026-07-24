const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const { logAudit } = require('../services/auditService');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-access-token-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-2026';

/**
 * Standard Email Login & Auto-Provisioning
 */
async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email address and password are required.' });
    }

    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      // Allow seamless first-time login for demo emails (admin/sales/warehouse/accounts)
      const isDemoUser = ['admin@erp.com', 'sales@erp.com', 'warehouse@erp.com', 'accounts@erp.com'].includes(normalizedEmail);
      if (isDemoUser) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const displayName = normalizedEmail.split('@')[0];
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            password: hashedPassword,
            name: displayName.toUpperCase(),
            role: normalizedEmail.startsWith('admin') ? 'ADMIN' : normalizedEmail.startsWith('sales') ? 'SALES' : normalizedEmail.startsWith('warehouse') ? 'WAREHOUSE' : 'ACCOUNTS',
            isActive: true,
          },
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    } else {
      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Your account is inactive. Please contact system administrator.' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    }

    return issueUserSession(user, req, res);
  } catch (err) {
    next(err);
  }
}

/**
 * Google Sign In direct controller
 */
async function googleLogin(req, res, next) {
  try {
    const { email, name } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Google email is required.' });
    }

    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      const dummyPassword = await bcrypt.hash('GoogleUserDummyPass2026!', 12);
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: dummyPassword,
          name: name || normalizedEmail.split('@')[0],
          role: 'SALES',
          isActive: true,
        },
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account is inactive. Please contact system administrator.' });
    }

    return issueUserSession(user, req, res);
  } catch (err) {
    next(err);
  }
}

/**
 * Account Registration & Verification
 */
async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id: existing.id },
        data: { name: name || existing.name, password: hashedPassword, phone: phone || existing.phone },
      });
      return res.status(200).json({
        success: true,
        message: 'Account verified and updated successfully! Please Sign In.',
        data: { email: normalizedEmail },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || null,
        role: 'SALES',
        isActive: true,
      },
    });

    await logAudit({
      userId: newUser.id,
      action: 'USER_REGISTERED',
      entity: 'USER',
      entityId: newUser.id,
      details: `New account registered and verified: ${newUser.email}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Account created and verified successfully! Please Sign In.',
      data: { email: newUser.email },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Phone Number OTP Login / Sign Up
 */
async function loginWithPhoneOtp(req, res, next) {
  try {
    const { phone, otp } = req.body;
    const cleanPhone = phone ? phone.trim() : '';

    if (!cleanPhone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP are required.' });
    }

    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Try entering 123456.' });
    }

    let user = await prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    if (!user) {
      const generatedEmail = `user_${cleanPhone.replace(/[^0-9]/g, '')}@mobile.erp.com`;
      const dummyPassword = await bcrypt.hash('PhoneUserPass123!', 12);
      
      user = await prisma.user.create({
        data: {
          name: `Mobile User (${cleanPhone})`,
          email: generatedEmail,
          password: dummyPassword,
          phone: cleanPhone,
          role: 'SALES',
          isActive: true,
        },
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account is inactive. Please contact administrator.' });
    }

    return issueUserSession(user, req, res);
  } catch (err) {
    next(err);
  }
}

/**
 * Session Token Generator Helper
 */
async function issueUserSession(user, req, res) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  await logAudit({
    userId: user.id,
    action: 'USER_LOGIN',
    entity: 'USER',
    entityId: user.id,
    details: `User [${user.email}] logged in successfully`,
    ipAddress: req.ip,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: 'Login successful',
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    },
  });
}

async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const accessToken = jwt.sign(
      { id: savedToken.user.id, email: savedToken.user.email, name: savedToken.user.name, role: savedToken.user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNew },
    });

    await logAudit({
      userId: user.id,
      action: 'PASSWORD_CHANGE',
      entity: 'USER',
      entityId: user.id,
      details: 'User updated account password',
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, googleLogin, register, loginWithPhoneOtp, refreshToken, getMe, changePassword, logout };
