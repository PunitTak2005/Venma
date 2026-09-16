const express = require('express');
const router = express.Router();
const {
  getMarketplaceMetrics,
  getSearchSuggestions,
  getPlatformSettings,
} = require('../controllers/publicController');

router.get('/metrics', getMarketplaceMetrics);
router.get('/search-suggestions', getSearchSuggestions);
router.get('/settings', getPlatformSettings);

module.exports = router;
