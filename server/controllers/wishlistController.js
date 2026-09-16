const Wishlist = require('../models/Wishlist');

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ customer: req.user._id }).populate({
      path: 'products',
      populate: { path: 'vendor', select: 'storeName' },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer: req.user._id, products: [] });
    }

    res.json({
      success: true,
      data: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or remove product from wishlist (toggle)
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ customer: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let added = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();
    await wishlist.populate({
      path: 'products',
      populate: { path: 'vendor', select: 'storeName' },
    });

    res.json({
      success: true,
      added,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      data: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};
