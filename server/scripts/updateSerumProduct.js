const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/venma').then(async () => {
  const col = mongoose.connection.db.collection('products');
  const res = await col.updateOne(
    { name: /Precision Serum Essence Series 123/i },
    { $set: {
      image: '/generated-products/beauty/precision-serum-essence-series-123-main.webp',
      images: [
        '/generated-products/beauty/precision-serum-essence-series-123-main.webp',
        '/generated-products/beauty/precision-serum-essence-series-123.webp'
      ]
    }}
  );
  console.log('Update result: modified', res.modifiedCount);

  const updated = await col.findOne({ name: /Precision Serum Essence Series 123/i });
  console.log('Updated product:', {
    id: updated._id,
    name: updated.name,
    slug: updated.slug,
    price: updated.price,
    rating: updated.rating,
    stock: updated.countInStock,
    images: updated.images,
    category: updated.category,
    vendor: updated.vendor
  });
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
