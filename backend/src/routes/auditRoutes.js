const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

 
router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

router.get('/', getAuditLogs);

module.exports = router;
