const mongoose = require('mongoose');
require('dotenv').config();

const lightingImages = [
  'ceramic-bedside-table-lamp.webp',
  'olive-mushroom-table-lamp.webp',
  'brass-globe-table-lamp.webp',
  'scandinavian-tripod-floor-lamp.webp',
  'slim-ambient-sofa-floor-lamp.webp',
  'matte-black-industrial-pendant-light.webp',
  'boho-woven-rattan-pendant-light.webp',
  'hammered-brass-dome-pendant-light.webp',
  'dual-up-down-minimalist-wall-sconce.webp',
  'vintage-edison-brass-wall-light.webp',
  'linear-indirect-led-wall-sconce.webp',
  'gravity-architectural-led-desk-lamp.webp',
  'articulated-swing-arm-desk-lamp.webp',
  'rgb-ambient-neon-rope-light.webp',
  'smart-wi-fi-tunable-led-bulb.webp',
  'ambient-smart-bedside-globe-lamp.webp'
];

async function updateLighting() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const collection = mongoose.connection.collection('products');

  // 1. Update Modern Minimalist Arc Floor Lamp
  const arcImg = '/generated-products/home-living/lighting/modern-minimalist-arc-floor-lamp.webp';
  await collection.updateOne(
    { name: /arc floor lamp/i },
    {
      $set: {
        images: [
          arcImg,
          '/generated-products/home-living/modern-minimalist-arc-floor-lamp-lifestyle-1.webp',
          '/generated-products/home-living/modern-minimalist-arc-floor-lamp-lifestyle-2.webp'
        ],
        thumbnail: arcImg
      }
    }
  );
  console.log('Updated Modern Minimalist Arc Floor Lamp with lighting folder path.');

  // 2. Update all Aero Desk Lamp Series products
  const aeroLamps = await collection.find({ name: /aero desk lamp/i }).sort({ _id: 1 }).toArray();
  console.log(`Found ${aeroLamps.length} Aero Desk Lamp products.`);

  for (let i = 0; i < aeroLamps.length; i++) {
    const lamp = aeroLamps[i];
    const imgFilename = lightingImages[i % lightingImages.length];
    const imgPath = `/generated-products/home-living/lighting/${imgFilename}`;

    await collection.updateOne(
      { _id: lamp._id },
      {
        $set: {
          images: [imgPath],
          thumbnail: imgPath
        }
      }
    );
    console.log(`[${i+1}] Updated "${lamp.name}" -> ${imgPath}`);
  }

  // 3. Verification
  console.log('\n=== Verifying All 16 Lighting Products in MongoDB ===');
  const check = await collection.find({ subcategory: 'Lighting' }).sort({ _id: 1 }).toArray();
  const seenImages = new Set();
  let dupCount = 0;

  check.forEach((p, idx) => {
    const img = p.images?.[0];
    if (seenImages.has(img)) {
      dupCount++;
      console.log(`[${idx+1}] DUPLICATE: "${p.name}" -> ${img}`);
    } else {
      seenImages.add(img);
      console.log(`[${idx+1}] UNIQUE: "${p.name}" -> ${img}`);
    }
  });

  console.log(`\nVerification finished: Total unique images: ${seenImages.size}, Duplicate images: ${dupCount}`);
  process.exit(0);
}

updateLighting();
