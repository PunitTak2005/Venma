const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/venma').then(async () => {
  const db = mongoose.connection.db;

  const newImages = [
    '/generated-products/beauty/serum-123-hero.png',
    '/generated-products/beauty/serum-123-lifestyle.png',
    '/generated-products/beauty/serum-123-detail.png'
  ];

  const result = await db.collection('products').updateOne(
    { slug: 'precision-serum-essence-series-123-123' },
    { $set: { images: newImages } }
  );

  console.log('matchedCount:', result.matchedCount);
  console.log('modifiedCount:', result.modifiedCount);

  // Verify
  const p = await db.collection('products').findOne(
    { slug: 'precision-serum-essence-series-123-123' },
    { projection: { name: 1, images: 1 } }
  );
  console.log('\nProduct after update:');
  console.log(JSON.stringify(p, null, 2));

  await mongoose.disconnect();
});
