const { body } = require('express-validator');

const productValidation = [
  body('sku').trim().notEmpty().withMessage('Product SKU is required'),
  body('barcode').trim().notEmpty().withMessage('Barcode is required'),
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('categoryId').notEmpty().withMessage('Category ID is required'),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('Valid purchase price required'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Valid selling price required'),
  body('gstRate').isFloat({ min: 0, max: 100 }).withMessage('Valid GST percentage required'),
];

module.exports = { productValidation };
