const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const clientPublic = path.join(__dirname, '../../client/public');
const rootPublic = path.join(__dirname, '../../public');

const srcDir = path.join(clientPublic, 'generated-products/home-decor');
const targetClientDir = path.join(clientPublic, 'generated-products/home-living');
const targetRootDir = path.join(rootPublic, 'generated-products/home-living');

fs.mkdirSync(targetClientDir, { recursive: true });
fs.mkdirSync(targetRootDir, { recursive: true });

const copies = [
  { src: 'arc-floor-lamp-main.webp', dest: 'modern-minimalist-arc-floor-lamp-main.webp' },
  { src: 'arc-floor-lamp-angle.webp', dest: 'modern-minimalist-arc-floor-lamp-side.webp' },
  { src: 'arc-floor-lamp-detail.webp', dest: 'modern-minimalist-arc-floor-lamp-detail.webp' }
];

copies.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const destPath1 = path.join(targetClientDir, dest);
  const destPath2 = path.join(targetRootDir, dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath1);
    fs.copyFileSync(srcPath, destPath2);
    console.log(`Copied ${src} -> ${destPath1}`);
  } else {
    console.log(`Source missing: ${srcPath}`);
  }
});

async function updateDb() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const collection = mongoose.connection.collection('products');

  const newImages = [
    '/generated-products/home-living/modern-minimalist-arc-floor-lamp-main.webp',
    '/generated-products/home-living/modern-minimalist-arc-floor-lamp-side.webp',
    '/generated-products/home-living/modern-minimalist-arc-floor-lamp-detail.webp'
  ];

  const res = await collection.updateOne(
    { name: /arc floor lamp/i },
    {
      $set: {
        images: newImages,
        thumbnail: newImages[0]
      }
    }
  );

  console.log(`Updated product in MongoDB: ${res.modifiedCount} modified`);
  const updated = await collection.findOne({ name: /arc floor lamp/i });
  console.log('Current product record:');
  console.log('Name:', updated.name);
  console.log('Images:', updated.images);
  console.log('Thumbnail:', updated.thumbnail);

  process.exit(0);
}

updateDb();
