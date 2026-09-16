const mongoose = require('mongoose');
require('dotenv').config();

async function findLightingProducts() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venma');
  const collection = mongoose.connection.collection('products');

  const products = await collection.find({
    $or: [
      { subcategory: /lighting/i },
      { name: /lamp|light|lantern|sconce|pendant|chandelier|led|bulb/i }
    ]
  }).sort({ _id: 1 }).toArray();

  console.log(`Found ${products.length} lighting products in MongoDB:`);
  products.forEach((p, idx) => {
    console.log(`[${idx+1}] ID: ${p._id} | Name: "${p.name}" | Subcat: "${p.subcategory}" | Slug: "${p.slug}" | Current Img: ${p.images?.[0]}`);
  });

  process.exit(0);
}

findLightingProducts();
