const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendorBySlug,
  getVendorDashboardStats,
  getVendorProducts,
  getVendorOrders,
  getVendorAnalytics,
  getVendorInventory,
  getVendorReviews,
  getVendorNotifications,
  getVendorProfile,
  updateVendorProfile,
  followVendor,
  unfollowVendor,
  getFollowStatus,
} = require('../controllers/vendorController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

// Public listing with optional user context for follow status
router.get('/', optionalAuth, getVendors);

// Vendor Dashboard routes (support /me/stats, /me/dashboard, /dashboard)
router.get('/me/stats', protect, authorize('vendor'), getVendorDashboardStats);
router.get('/me/dashboard', protect, authorize('vendor'), getVendorDashboardStats);
router.get('/dashboard', protect, authorize('vendor'), getVendorDashboardStats);

// Vendor Products routes
router.get('/me/products', protect, authorize('vendor'), getVendorProducts);
router.get('/products', protect, authorize('vendor'), getVendorProducts);

// Vendor Orders routes
router.get('/me/orders', protect, authorize('vendor'), getVendorOrders);
router.get('/orders', protect, authorize('vendor'), getVendorOrders);

// Vendor Analytics routes
router.get('/me/analytics', protect, authorize('vendor'), getVendorAnalytics);
router.get('/analytics', protect, authorize('vendor'), getVendorAnalytics);

// Vendor Inventory routes
router.get('/me/inventory', protect, authorize('vendor'), getVendorInventory);
router.get('/inventory', protect, authorize('vendor'), getVendorInventory);

// Vendor Reviews routes
router.get('/me/reviews', protect, authorize('vendor'), getVendorReviews);
router.get('/reviews', protect, authorize('vendor'), getVendorReviews);

// Vendor Notifications routes
router.get('/me/notifications', protect, authorize('vendor'), getVendorNotifications);
router.get('/notifications', protect, authorize('vendor'), getVendorNotifications);

// Vendor Profile routes
router.get('/me/profile', protect, authorize('vendor'), getVendorProfile);
router.put('/me/profile', protect, authorize('vendor'), updateVendorProfile);
router.get('/profile', protect, authorize('vendor'), getVendorProfile);
router.put('/profile', protect, authorize('vendor'), updateVendorProfile);

// Vendor Follow routes
router.post('/:vendorId/follow', protect, followVendor);
router.delete('/:vendorId/follow', protect, unfollowVendor);
router.get('/:vendorId/follow-status', optionalAuth, getFollowStatus);

// Vendor Profile / Storefront
router.get('/:idOrSlug', optionalAuth, getVendorBySlug);

module.exports = router;
