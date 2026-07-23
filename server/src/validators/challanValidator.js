const { body } = require('express-validator');

const challanValidation = [
  body('customerId').notEmpty().withMessage('Customer selection is required'),
  body('warehouseId').notEmpty().withMessage('Warehouse selection is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one product line item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each line item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

module.exports = { challanValidation };
