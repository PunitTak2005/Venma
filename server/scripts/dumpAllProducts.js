const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://127.0.0.1:27017/markethub').then(async () => {
  const products = await mongoose.connection.db.collection('products').find({}).sort({ category: 1, name: 1 }).toArray();
  const vendors = await mongoose.connection.db.collection('vendors').find({}).toArray();
  const categories = await mongoose.connection.db.collection('categories').find({}).toArray();

  const vendorMap = {};
  vendors.forEach(v => vendorMap[v._id.toString()] = v.storeName || v.name);

  const categoryMap = {};
  categories.forEach(c => categoryMap[c._id.toString()] = c.name);

  console.log('Total Products in DB:', products.length);

  // Group by category
  const byCategory = {};
  const byVendor = {};

  products.forEach(p => {
    const catName = categoryMap[p.category?.toString()] || p.category || 'Uncategorized';
    const vendName = vendorMap[p.vendor?.toString()] || 'Unknown Vendor';

    byCategory[catName] = (byCategory[catName] || 0) + 1;
    byVendor[vendName] = (byVendor[vendName] || 0) + 1;
  });

  console.log('\n--- BY CATEGORY ---');
  console.log(JSON.stringify(byCategory, null, 2));

  console.log('\n--- BY VENDOR ---');
  console.log(JSON.stringify(byVendor, null, 2));

  // Generate markdown artifact
  let md = '# VENMA Marketplace — Complete Database Product Catalog\n\n';
  md += `**Total Live Products in Database:** ${products.length}\n\n`;

  md += '## Summary Breakdown\n\n';
  md += '### Products by Category\n\n';
  md += '| Category | Count |\n| :--- | :--- |\n';
  for (const [cat, count] of Object.entries(byCategory)) {
    md += `| ${cat} | ${count} |\n`;
  }

  md += '\n### Products by Vendor\n\n';
  md += '| Vendor | Count |\n| :--- | :--- |\n';
  for (const [v, count] of Object.entries(byVendor)) {
    md += `| ${v} | ${count} |\n`;
  }

  md += '\n---\n\n## Full Product List (209 Products)\n\n';
  md += '| # | Product Name | Category | Vendor | Price | Stock | Rating | Primary Image |\n';
  md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';

  products.forEach((p, idx) => {
    const catName = categoryMap[p.category?.toString()] || p.category || 'Uncategorized';
    const vendName = vendorMap[p.vendor?.toString()] || 'Unknown Vendor';
    const price = typeof p.price === 'number' ? '$' + p.price.toFixed(2) : (p.price || 'N/A');
    const stock = p.countInStock !== undefined ? p.countInStock : (p.stock || 'N/A');
    const rating = p.rating || 'N/A';
    const img = (p.images && p.images.length > 0) ? p.images[0] : (p.image || 'N/A');
    md += `| ${idx + 1} | **${p.name.replace(/\|/g, '-')}** | ${catName} | ${vendName} | ${price} | ${stock} | ⭐ ${rating} | \`${img}\` |\n`;
  });

  const artifactPath = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/a1d24e8e-bffc-4d3c-955b-739831cb57b3/all_products.md';
  fs.writeFileSync(artifactPath, md, 'utf8');
  console.log('\nCatalog written to:', artifactPath);

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
