const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null, // Null means platform-wide / admin coupon
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validTo: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', CouponSchema);
