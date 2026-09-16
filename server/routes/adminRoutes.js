const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllVendors,
  updateVendorStatus,
  getAllUsers,
  downloadReportPDF,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/vendors', getAllVendors);
router.put('/vendors/:id/status', updateVendorStatus);
router.get('/users', getAllUsers);
router.get('/reports/:type', downloadReportPDF);

module.exports = router;
