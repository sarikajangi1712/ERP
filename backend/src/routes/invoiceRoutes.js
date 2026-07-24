const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  generateFromChallan,
  updatePayment,
  downloadInvoicePDF,
} = require('../controllers/invoiceController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');

router.use(authenticateToken);

router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.get('/:id/pdf', downloadInvoicePDF);
router.post('/generate-from-challan/:challanId', authorizeRoles('ADMIN', 'ACCOUNTS'), generateFromChallan);
router.patch('/:id/payment', authorizeRoles('ADMIN', 'ACCOUNTS'), updatePayment);

module.exports = router;