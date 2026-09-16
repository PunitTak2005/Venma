const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review for a product
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      customer: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      customer: req.user._id,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true,
    });

    // Update product average rating & review count
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    product.rating = Number(avgRating.toFixed(1));
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
