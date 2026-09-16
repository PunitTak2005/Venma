const mongoose = require('mongoose');

const CommissionTransactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    vendorStoreName: {
      type: String,
      required: true,
    },
    grossAmount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    vendorAmount: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommissionTransaction', CommissionTransactionSchema);
