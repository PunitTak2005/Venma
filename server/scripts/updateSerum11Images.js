const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/markethub').then(async () => {
  const db = mongoose.connection.db;

  const newImages = [
    '/generated-products/beauty/serum-11-hero.png',
    '/generated-products/beauty/serum-11-lifestyle.png',
    '/generated-products/beauty/serum-11-detail.png'
  ];

  const result = await db.collection('products').updateOne(
    { slug: 'precision-serum-essence-series-11-11' },
    { $set: { images: newImages } }
  );

  console.log('matchedCount :', result.matchedCount);
  console.log('modifiedCount:', result.modifiedCount);

  // Verify
  const p = await db.collection('products').findOne(
    { slug: 'precision-serum-essence-series-11-11' },
    { projection: { name: 1, slug: 1, sku: 1, price: 1, images: 1 } }
  );
  console.log('\nProduct after update:');
  console.log(JSON.stringify(p, null, 2));

  await mongoose.disconnect();
});
