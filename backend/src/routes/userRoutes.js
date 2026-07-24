const express = require('express');
const router = express.Router();
const { getUsers, createUser, toggleUserStatus } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;
