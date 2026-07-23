const express = require('express');
const router = express.Router();
const {
  getStockLevels,
  handleStockAdjustment,
  handleStockTransfer,
  getWarehouses,
  getMovements,
} = require('../controllers/inventoryController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');
const { stockAdjustmentValidation, stockTransferValidation } = require('../validators/inventoryValidator');
const { validate } = require('../middlewares/validate');

router.use(authenticateToken);

router.get('/stock', getStockLevels);
router.get('/warehouses', getWarehouses);
router.get('/movements', authorizeRoles('ADMIN', 'WAREHOUSE'), getMovements);
router.post('/adjust', authorizeRoles('ADMIN', 'WAREHOUSE'), stockAdjustmentValidation, validate, handleStockAdjustment);
router.post('/transfer', authorizeRoles('ADMIN', 'WAREHOUSE'), stockTransferValidation, validate, handleStockTransfer);

module.exports = router;
