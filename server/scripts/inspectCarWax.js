const mongoose = require('mongoose');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Category = require('../models/Category');

async function inspect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');

  const wax = await Product.findOne({ slug: 'ceramic-car-wax' }).populate('category').populate('vendor');
  console.log('Wax Product Details:');
  if (wax) {
    console.log({
      _id: wax._id,
      name: wax.name,
      slug: wax.slug,
      brand: wax.brand,
      price: wax.price,
      discountPrice: wax.discountPrice,
      rating: wax.rating,
      stock: wax.stock,
      category: wax.category ? { _id: wax.category._id, name: wax.category.name, slug: wax.category.slug } : null,
      vendor: wax.vendor ? { _id: wax.vendor._id, storeName: wax.vendor.storeName, storeSlug: wax.vendor.storeSlug } : null,
      images: wax.images,
      thumbnail: wax.thumbnail,
    });
  } else {
    console.log('Ceramic Car Wax product not found in database!');
  }

  const existingAutoShine = await Vendor.findOne({ storeSlug: 'autoshine-garage' });
  console.log('Existing AutoShine vendor:', existingAutoShine ? existingAutoShine.storeName : 'None');

  // Check Automotive Category
  const autoCategory = await Category.findOne({
    $or: [{ slug: 'automotive' }, { name: /automotive/i }]
  });
  console.log('Automotive Category:', autoCategory ? { _id: autoCategory._id, name: autoCategory.name, slug: autoCategory.slug } : 'Not found');

  // List all categories
  const allCategories = await Category.find({}).select('name slug');
  console.log('All categories:', allCategories.map(c => `${c.name} (${c.slug})`));

  await mongoose.disconnect();
}

inspect().catch(console.error);
