const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

async function updateJournalGallery() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  console.log('Connected to MongoDB');

  const journal = await Product.findOne({ name: 'Leather Bound Journal' });
  if (!journal) {
    console.error('Leather Bound Journal product not found in database!');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('Found product ID:', journal._id);
  console.log('Previous images:', journal.images);
  console.log('Previous thumbnail:', journal.thumbnail);

  const newImages = [
    '/generated-products/books/leather-bound-journal-main.webp',
    '/generated-products/books/leather-bound-journal-lifestyle.webp',
    '/generated-products/books/leather-bound-journal-detail.webp',
  ];

  journal.images = newImages;
  journal.thumbnail = newImages[0];
  journal.imageValid = true;

  await journal.save();
  console.log('Successfully updated Leather Bound Journal product gallery.');

  const updated = await Product.findById(journal._id);
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

updateJournalGallery().catch(async (err) => {
  console.error('Error updating journal gallery:', err);
  await mongoose.disconnect();
  process.exit(1);
});
