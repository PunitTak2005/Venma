const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const products = await Product.find({});
  console.log(`Checking ${products.length} products in database...`);

  let finishColorCount = 0;
  let colorsCount = 0;

  for (const p of products) {
    let hasColorInSpec = false;
    if (p.specifications && Array.isArray(p.specifications)) {
      const match = p.specifications.filter(s =>
        (s.key && (s.key.toLowerCase().includes('finish') || s.key.toLowerCase().includes('color'))) ||
        (s.value && s.value.toLowerCase().includes('charcoal'))
      );
      if (match.length > 0) {
        console.log(`Product "${p.name}" (${p.slug}) has matching specs:`, match);
        hasColorInSpec = true;
      }
    }
    if (p.finishColor || p.finish || p.color) {
      console.log(`Product "${p.name}" has root field:`, { finishColor: p.finishColor, finish: p.finish, color: p.color });
      finishColorCount++;
    }
    if (p.colors && p.colors.length > 0) {
      console.log(`Product "${p.name}" has colors array:`, p.colors);
      colorsCount++;
    }
  }

  console.log('\nSummary:');
  console.log('Products with root color/finish:', finishColorCount);
  console.log('Products with colors array:', colorsCount);

  await mongoose.disconnect();
}

check().catch(console.error);
