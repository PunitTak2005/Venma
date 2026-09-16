const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  downloadInvoice,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/invoice')
  .get(protect, downloadInvoice);

router.route('/:id/status')
  .put(protect, authorize('vendor', 'admin'), updateOrderStatus);

module.exports = router;
