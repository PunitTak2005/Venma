const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductCount,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { getFeaturedProductsByCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/count', getProductCount);
router.get('/featured-by-category', getFeaturedProductsByCategory);


router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
