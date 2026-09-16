const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Layers', // Lucide icon name
    },
    banner: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
