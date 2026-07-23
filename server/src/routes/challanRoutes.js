const express = require('express');
const router = express.Router();
const {
  getChallans,
  getChallanById,
  createChallan,
  confirmSalesChallan,
  cancelSalesChallan,
} = require('../controllers/challanController');
const { authenticateToken } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/rbac');
const { challanValidation } = require('../validators/challanValidator');
const { validate } = require('../middlewares/validate');

router.use(authenticateToken);

router.get('/', getChallans);
router.get('/:id', getChallanById);
router.post('/', authorizeRoles('ADMIN', 'SALES'), challanValidation, validate, createChallan);
router.post('/:id/confirm', authorizeRoles('ADMIN', 'SALES'), confirmSalesChallan);
router.post('/:id/cancel', authorizeRoles('ADMIN', 'SALES'), cancelSalesChallan);

module.exports = router;
