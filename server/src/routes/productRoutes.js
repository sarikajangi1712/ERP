const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');
const upload = require('../middlewares/upload');
const { productValidation } = require('../validators/productValidator');
const { validate } = require('../middlewares/validate');

router.use(authenticateToken);

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', authorizeRoles('ADMIN', 'WAREHOUSE'), upload.single('image'), productValidation, validate, createProduct);
router.put('/:id', authorizeRoles('ADMIN', 'WAREHOUSE'), upload.single('image'), updateProduct);
router.delete('/:id', authorizeRoles('ADMIN'), deleteProduct);

module.exports = router;
