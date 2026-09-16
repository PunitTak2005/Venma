const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

async function updateWaxGallery() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  console.log('Connected to MongoDB');

  const wax = await Product.findOne({ name: 'Ceramic Car Wax' });
  if (!wax) {
    console.error('Ceramic Car Wax product not found in database!');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('Found product ID:', wax._id);
  console.log('Previous images:', wax.images);
  console.log('Previous thumbnail:', wax.thumbnail);

  const newImages = [
    '/generated-products/automotive/ceramic-car-wax-main.webp',
    '/generated-products/automotive/ceramic-car-wax-garage.webp',
    '/generated-products/automotive/ceramic-car-wax-detail.webp',
  ];

  wax.images = newImages;
  wax.thumbnail = newImages[0];
  wax.imageValid = true;

  await wax.save();
  console.log('Successfully updated Ceramic Car Wax product gallery.');

  const updated = await Product.findById(wax._id);
  console.log('Updated record:');
  console.log({
    _id: updated._id,
    name: updated.name,
    vendor: updated.vendor,
    sku: updated.sku,
    price: updated.price,
    rating: updated.rating,
    stock: updated.stock,
    category: updated.category,
    slug: updated.slug,
    thumbnail: updated.thumbnail,
    images: updated.images,
    imageValid: updated.imageValid,
  });

  await mongoose.disconnect();
}

updateWaxGallery().catch(async (err) => {
  console.error('Error updating car wax gallery:', err);
  await mongoose.disconnect();
  process.exit(1);
});
