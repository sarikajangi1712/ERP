const express = require('express');
const router = express.Router();
const { login, googleLogin, register, loginWithPhoneOtp, refreshToken, getMe, changePassword, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { loginValidation, changePasswordValidation } = require('../validators/authValidator');
const { validate } = require('../middlewares/validate');

router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/google-login', authLimiter, googleLogin);
router.post('/register', authLimiter, register);
router.post('/phone-login', authLimiter, loginWithPhoneOtp);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);
router.post('/change-password', authenticateToken, changePasswordValidation, validate, changePassword);

module.exports = router;
