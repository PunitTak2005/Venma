const Coupon = require('../models/Coupon');
const Vendor = require('../models/Vendor');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date() > new Date(coupon.validTo)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }

    if (cartTotal && cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of $${coupon.minPurchase} required for this coupon`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = ((cartTotal || 100) * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Number(discountAmount.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor coupons
// @route   GET /api/coupons/vendor
// @access  Private/Vendor
exports.getVendorCoupons = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    const coupons = await Coupon.find({ vendor: vendor ? vendor._id : null });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon (Vendor/Admin)
// @route   POST /api/coupons
// @access  Private/Vendor/Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchase, maxDiscount, validTo } = req.body;
    let vendorId = null;

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (vendor) vendorId = vendor._id;
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      vendor: vendorId,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : 0,
      validTo: validTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};
