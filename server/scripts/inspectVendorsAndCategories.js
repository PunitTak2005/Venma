require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const Product = require('../models/Product');

const inspect = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const vendors = await Vendor.find().select('_id storeName storeSlug category totalProducts');
    const categories = await Category.find().select('_id name slug');
    const products = await Product.find().select('_id name slug sku vendor category');

    console.log('--- VENDORS ---');
    console.log(JSON.stringify(vendors, null, 2));

    console.log('--- CATEGORIES ---');
    console.log(JSON.stringify(categories, null, 2));

    console.log('--- EXISTING PRODUCTS COUNT ---', products.length);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

inspect();
