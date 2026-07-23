const express = require('express');
const router = express.Router();
const { getSalesReport, getInventoryReport, getGSTReport } = require('../controllers/reportController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

router.use(authenticateToken);

router.get('/sales', authorizeRoles('ADMIN', 'ACCOUNTS', 'SALES'), getSalesReport);
router.get('/inventory', authorizeRoles('ADMIN', 'WAREHOUSE', 'ACCOUNTS'), getInventoryReport);
router.get('/gst', authorizeRoles('ADMIN', 'ACCOUNTS'), getGSTReport);

module.exports = router;
