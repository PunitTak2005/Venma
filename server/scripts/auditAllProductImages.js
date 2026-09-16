const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function audit() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venma');
  const collection = mongoose.connection.collection('products');

  const products = await collection.find({}).toArray();
  console.log(`Total products in database: ${products.length}`);

  const clientPublicDir = path.join(__dirname, '../../client/public');

  let unsplashCount = 0;
  let missingLocalFiles = 0;
  let validGeminiCount = 0;
  let otherCount = 0;

  const imageStats = {};
  const productsNeedingImages = [];

  products.forEach((p) => {
    const images = p.images || [];
    const mainImg = images[0] || p.thumbnail || '';

    // Count how many products use each image to detect duplicates
    imageStats[mainImg] = (imageStats[mainImg] || 0) + 1;

    let status = 'unknown';
    if (/unsplash\.com/i.test(mainImg)) {
      unsplashCount++;
      status = 'unsplash';
      productsNeedingImages.push({ id: p._id, name: p.name, category: p.subcategory || 'Other', current: mainImg, reason: 'unsplash' });
    } else if (mainImg.startsWith('/generated-products/')) {
      const localPath = path.join(clientPublicDir, mainImg);
      if (fs.existsSync(localPath)) {
        status = 'gemini_exists';
      } else {
        missingLocalFiles++;
        status = 'missing_file';
        productsNeedingImages.push({ id: p._id, name: p.name, category: p.subcategory || 'Other', current: mainImg, reason: 'missing_file' });
      }
    } else {
      otherCount++;
      productsNeedingImages.push({ id: p._id, name: p.name, category: p.subcategory || 'Other', current: mainImg, reason: 'non_gemini_path' });
    }
  });

  // Check duplicate images
  const duplicates = Object.entries(imageStats).filter(([img, count]) => count > 1 && img !== '');
  console.log(`\nAudit Results:`);
  console.log(`- Total products: ${products.length}`);
  console.log(`- Unsplash URLs: ${unsplashCount}`);
  console.log(`- Missing local files: ${missingLocalFiles}`);
  console.log(`- Other non-generated paths: ${otherCount}`);
  console.log(`- Unique images used across catalog: ${Object.keys(imageStats).length}`);
  console.log(`- Duplicate image paths shared by >1 product: ${duplicates.length}`);

  // Print sample of products needing images
  console.log(`\nTotal products needing replacement: ${productsNeedingImages.length}`);
  const byCat = {};
  productsNeedingImages.forEach(p => {
    byCat[p.category] = (byCat[p.category] || 0) + 1;
  });
  console.log('Breakdown by category/subcategory:', byCat);

  // Also check how many images exist on disk in client/public/generated-products
  const genDir = path.join(clientPublicDir, 'generated-products');
  let diskFiles = 0;
  if (fs.existsSync(genDir)) {
    function countFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory()) countFiles(path.join(dir, e.name));
        else diskFiles++;
      }
    }
    countFiles(genDir);
  }
  console.log(`Total files in client/public/generated-products: ${diskFiles}`);

  process.exit(0);
}

audit();
