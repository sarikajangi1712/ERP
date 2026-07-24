const express = require('express');
const router = express.Router();
const { getSettings, updateSetting } = require('../controllers/settingsController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

router.use(authenticateToken);

router.get('/', getSettings);
router.post('/', authorizeRoles('ADMIN'), updateSetting);

module.exports = router;
