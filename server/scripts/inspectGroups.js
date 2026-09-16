const mongoose = require('mongoose');
require('dotenv').config();

async function inspectGroups() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const collection = mongoose.connection.collection('products');
  const prods = await collection.find({}).toArray();

  const groups = {};
  prods.forEach(p => {
    // Extract base series name or product name
    const match = p.name.match(/^(.*?)(?:\s+Series\s+\d+)?$/i);
    const base = match ? match[1].trim() : p.name;
    if (!groups[base]) groups[base] = [];
    groups[base].push(p);
  });

  console.log(`Total unique product types/groups: ${Object.keys(groups).length}`);
  for (const [base, list] of Object.entries(groups)) {
    console.log(`- "${base}" (${list.length} products):`);
    console.log(`    Category: ${list[0].category}, Subcat: ${list[0].subcategory}, Img: ${list[0].images?.[0]}`);
  }

  process.exit(0);
}

inspectGroups();
