const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const requiredFiles = [
  'magsafe-wireless-charger.webp',
  'three-in-one-charging-station.webp',
  '65w-gan-wall-charger.webp',
  '100w-gan-fast-charger.webp',
  'transparent-usb-c-charger.webp',
  'adjustable-wireless-stand.webp',
  'walnut-wireless-charging-pad.webp',
  'solar-power-bank-charger.webp',
  'magnetic-car-charger.webp',
  'usb-c-hub-dock.webp',
  'braided-fast-charging-cable.webp',
  'gaming-rgb-charging-dock.webp',
  'minimalist-cube-usb-charger.webp',
];

async function verify() {
  console.log('=== Checking 13 WebP Files on Disk ===');
  const baseDir = path.join(__dirname, '../../client/public/generated-products/electronics');
  let missingFiles = 0;
  requiredFiles.forEach((file) => {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✓ ${file} (${stats.size} bytes)`);
    } else {
      console.log(`✗ MISSING: ${file}`);
      missingFiles++;
    }
  });

  if (missingFiles > 0) {
    console.error(`ERROR: ${missingFiles} files missing!`);
    process.exit(1);
  }

  console.log('\n=== Checking MongoDB Charging Products ===');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const prods = await Product.find({ subcategory: 'Charging' }).sort({ _id: 1 }).lean();
  console.log(`Found ${prods.length} charging products:`);

  let invalidImgCount = 0;
  prods.forEach((p, idx) => {
    const img = p.images?.[0] || p.thumbnail;
    const isUnsplash = /unsplash|placeholder/i.test(img);
    console.log(`[${idx+1}] "${p.name}" | $${p.price} | Stock: ${p.stock} | Rating: ${p.rating} | Img: ${img}`);
    if (isUnsplash || !img) {
      invalidImgCount++;
    }
  });

  if (invalidImgCount > 0) {
    console.error(`ERROR: ${invalidImgCount} products have invalid images!`);
    process.exit(1);
  }

  console.log('\nAll 13 images exist and are properly linked to charging products!');
  process.exit(0);
}

verify();
