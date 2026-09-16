const express = require('express');
const router = express.Router();
const { validateCoupon, getVendorCoupons, createCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/validate', validateCoupon);
router.get('/vendor', protect, authorize('vendor', 'admin'), getVendorCoupons);
router.post('/', protect, authorize('vendor', 'admin'), createCoupon);

module.exports = router;
