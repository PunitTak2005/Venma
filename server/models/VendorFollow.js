const mongoose = require('mongoose');

const VendorFollowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Enforce unique follow per user and vendor
VendorFollowSchema.index({ userId: 1, vendorId: 1 }, { unique: true });

module.exports = mongoose.model('VendorFollow', VendorFollowSchema);
