const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const products = await Product.find({ subcategory: 'Charging' }).sort({ _id: 1 }).lean();
  console.log(`Found ${products.length} products with subcategory 'Charging':`);
  products.forEach((p, idx) => {
    console.log(`[${idx+1}] ID: ${p._id} | Slug: ${p.slug} | Name: "${p.name}" | Price: $${p.price} | Rating: ${p.rating} | Images: ${p.images}`);
  });
  process.exit(0);
}

run();
