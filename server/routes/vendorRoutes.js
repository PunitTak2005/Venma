const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorBySlug,
  getVendorDashboardStats,
  getVendorProducts,
  getVendorOrders,
  followVendor,
  unfollowVendor,
  getFollowStatus,
} = require('../controllers/vendorController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

// Public listing with optional user context for follow status
router.get('/', optionalAuth, getVendors);

// Vendor Dashboard routes
router.get('/me/stats', protect, authorize('vendor'), getVendorDashboardStats);
router.get('/me/products', protect, authorize('vendor'), getVendorProducts);
router.get('/me/orders', protect, authorize('vendor'), getVendorOrders);

// Vendor Follow routes
router.post('/:vendorId/follow', protect, followVendor);
router.delete('/:vendorId/follow', protect, unfollowVendor);
router.get('/:vendorId/follow-status', optionalAuth, getFollowStatus);

// Vendor Profile / Storefront
router.get('/:idOrSlug', optionalAuth, getVendorBySlug);

module.exports = router;
