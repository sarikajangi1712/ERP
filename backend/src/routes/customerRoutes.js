const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addNote,
  exportCSV,
} = require('../controllers/customerController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');
const { customerValidation } = require('../validators/customerValidator');
const { validate } = require('../middlewares/validate');

router.use(authenticateToken);

router.get('/', getCustomers);
router.get('/export/csv', authorizeRoles('ADMIN', 'SALES'), exportCSV);
router.get('/:id', getCustomerById);
router.post('/', authorizeRoles('ADMIN', 'SALES'), customerValidation, validate, createCustomer);
router.put('/:id', authorizeRoles('ADMIN', 'SALES'), updateCustomer);
router.delete('/:id', authorizeRoles('ADMIN'), deleteCustomer);
router.post('/:id/notes', authorizeRoles('ADMIN', 'SALES'), addNote);

module.exports = router;
