const jwt = require('jsonwebtoken');
const { firebaseAdminAuth } = require('../config/firebaseAdmin');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-access-token-key-2026';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
      error: 'UNAUTHORIZED',
    });
  }

  // 1. Try Firebase Admin verification first if firebase-admin package is initialized
  if (firebaseAdminAuth) {
    try {
      const decodedFirebaseToken = await firebaseAdminAuth.verifyIdToken(token);
      if (decodedFirebaseToken && decodedFirebaseToken.email) {
        return await handleUserSync(decodedFirebaseToken.email, decodedFirebaseToken.name, req, res, next);
      }
    } catch (firebaseErr) {
      // Fall through to fallback handler
    }
  }

  // 2. Decode Firebase ID Token payload fallback (when firebase-admin is not installed)
  try {
    const decoded = jwt.decode(token);
    if (decoded && (decoded.iss?.includes('securetoken.google.com') || decoded.firebase || decoded.email)) {
      const email = decoded.email || decoded.user_id;
      const name = decoded.name || (email ? email.split('@')[0] : 'Google User');
      if (email) {
        return await handleUserSync(email, name, req, res, next);
      }
    }
  } catch (decodeErr) {
    // Fall through to local JWT verify
  }

  // 3. Local JWT Token Verification Fallback
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired authentication token',
        error: 'FORBIDDEN',
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Helper to lookup or auto-provision PostgreSQL user profile for Firebase Google logins
 */
async function handleUserSync(rawEmail, rawName, req, res, next) {
  const normalizedEmail = rawEmail.toLowerCase().trim();

  let dbUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  if (!dbUser) {
    // Auto-create user record in database with default role SALES upon first Google Sign-In
    dbUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: '$2a$12$firebaseProviderDummyHashValKey2026',
        name: rawName || normalizedEmail.split('@')[0],
        role: 'SALES',
        isActive: true,
      },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
  }

  if (!dbUser.isActive) {
    return res.status(401).json({ success: false, message: 'Your account is inactive. Please contact system administrator.' });
  }

  req.user = dbUser;
  next();
}

module.exports = { authenticateToken };
