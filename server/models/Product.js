const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: 0,
      default: 10,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
    },
    brand: {
      type: String,
      default: 'Generic',
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    imageValid: {
      type: Boolean,
      default: false,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Add text index for search
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
