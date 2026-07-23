const { body } = require('express-validator');

const stockAdjustmentValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('warehouseId').notEmpty().withMessage('Warehouse ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('type').isIn(['STOCK_IN', 'STOCK_OUT']).withMessage('Adjustment type must be STOCK_IN or STOCK_OUT'),
];

const stockTransferValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('fromWarehouseId').notEmpty().withMessage('Source warehouse is required'),
  body('toWarehouseId').notEmpty().withMessage('Destination warehouse is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Transfer quantity must be at least 1'),
];

module.exports = { stockAdjustmentValidation, stockTransferValidation };
