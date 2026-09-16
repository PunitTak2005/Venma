const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      unique: true,
    },
    storeSlug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    specialty: {
      type: String,
      default: '',
    },
    categoriesSold: {
      type: [String],
      default: [],
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    logo: {
      type: String,
      default: '/generated-vendors/technova-electronics-logo.webp',
    },
    banner: {
      type: String,
      default: '/generated-vendors/technova-electronics-banner.webp',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
      zipCode: { type: String, default: '' },
    },
    location: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'suspended'],
      default: 'approved', // Auto-approved for seed/verified vendor setup
    },
    commissionRate: {
      type: Number,
      default: 10, // 10% platform commission
    },
    balance: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    bankDetails: {
      accountHolder: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      routingNumber: { type: String, default: '' },
      bankName: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

VendorSchema.pre('save', function (next) {
  if (this.address && this.address.city && this.address.state) {
    this.location = `${this.address.city}, ${this.address.state}`;
  }
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Vendor', VendorSchema);
