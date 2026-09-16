const mongoose = require('mongoose');
require('dotenv').config();

async function updateDb() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const collection = mongoose.connection.collection('products');

  const lifestyleImages = [
    '/generated-products/home-living/modern-minimalist-arc-floor-lamp-lifestyle-1.webp',
    '/generated-products/home-living/modern-minimalist-arc-floor-lamp-lifestyle-2.webp',
    '/generated-products/home-living/modern-minimalist-arc-floor-lamp-lifestyle-3.webp'
  ];

  const res = await collection.updateOne(
    { name: /arc floor lamp/i },
    {
      $set: {
        images: lifestyleImages,
        thumbnail: lifestyleImages[0]
      }
    }
  );

  console.log(`Updated product in MongoDB: ${res.modifiedCount} modified`);
  const updated = await collection.findOne({ name: /arc floor lamp/i });
  console.log('Current product record:');
  console.log('Name:', updated.name);
  console.log('Images:', updated.images);
  console.log('Thumbnail:', updated.thumbnail);

  process.exit(0);
}

updateDb();
