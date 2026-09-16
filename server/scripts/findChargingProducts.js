const mongoose = require('mongoose');
require('dotenv').config();

async function checkChargingProducts() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venma');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const products = await Product.find({
    $or: [
      { subcategory: { $regex: /charg|dock|cable|power/i } },
      { name: { $regex: /charg|magsafe|power bank|dock|cable|usb|gan|station/i } }
    ]
  }).lean();

  console.log(`Found ${products.length} potential charging/dock/cable products:`);
  products.forEach(p => {
    console.log(`- ID: ${p._id}, Name: "${p.name}", Subcat: "${p.subcategory}", Slug: "${p.slug}", Images: ${JSON.stringify(p.images)}`);
  });

  process.exit(0);
}

checkChargingProducts();
