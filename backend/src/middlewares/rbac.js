const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication context missing',
        error: 'UNAUTHORIZED',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role [${req.user.role}] is not authorized to access this resource`,
        error: 'FORBIDDEN_ROLE',
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
