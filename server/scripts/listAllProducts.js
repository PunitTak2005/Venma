const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function list() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const Product = mongoose.connection.collection('products');
  const Category = mongoose.connection.collection('categories');
  const cats = await Category.find({}).toArray();
  const catMap = new Map(cats.map(c => [c._id.toString(), c.name]));

  const products = await Product.find({}).sort({ createdAt: 1 }).toArray();
  console.log('Total products:', products.length);
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const cat = catMap.get(p.category?.toString()) || 'Unknown';
    console.log(JSON.stringify({
      index: i + 1,
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      category: cat,
      subcategory: p.subcategory || '',
      price: p.price,
      discountPrice: p.discountPrice || 0,
      rating: p.rating,
      stock: p.stock
    }));
  }
  await mongoose.disconnect();
}

list().catch(console.error);
