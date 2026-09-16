const mongoose = require('mongoose');
require('dotenv').config();

async function inspect() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venma');
  const collection = mongoose.connection.collection('products');

  const products = await collection.find({}).toArray();
  const bySubcat = {};
  const imageSources = {
    unsplash: 0,
    generated: 0,
    other: 0
  };

  products.forEach(p => {
    const sub = p.subcategory || 'None';
    if (!bySubcat[sub]) bySubcat[sub] = [];
    bySubcat[sub].push(p);

    const img = p.images?.[0] || '';
    if (img.includes('unsplash')) imageSources.unsplash++;
    else if (img.startsWith('/generated-products/')) imageSources.generated++;
    else imageSources.other++;
  });

  console.log('Product image sources:', imageSources);
  console.log('\nProducts by subcategory:');
  for (const [sub, prods] of Object.entries(bySubcat)) {
    console.log(`Subcategory: "${sub}" (${prods.length} products). Sample images:`);
    prods.slice(0, 3).forEach(p => {
      console.log(`  - "${p.name}" (${p._id}): ${p.images?.[0]}`);
    });
  }

  // Check Category banners in MongoDB
  const catCollection = mongoose.connection.collection('categories');
  const categories = await catCollection.find({}).toArray();
  console.log(`\nCategories in MongoDB (${categories.length}):`);
  categories.forEach(c => {
    console.log(`- "${c.name}" (slug: ${c.slug}): banner = ${c.banner}`);
  });

  process.exit(0);
}

inspect();
