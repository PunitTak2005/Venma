const mongoose = require('mongoose');
require('dotenv').config();

const uniqueChargingImages = [
  '/generated-products/electronics/magsafe-wireless-charger.webp',
  '/generated-products/electronics/three-in-one-charging-station.webp',
  '/generated-products/electronics/65w-gan-wall-charger.webp',
  '/generated-products/electronics/100w-gan-fast-charger.webp',
  '/generated-products/electronics/transparent-usb-c-charger.webp',
  '/generated-products/electronics/adjustable-wireless-stand.webp',
  '/generated-products/electronics/walnut-wireless-charging-pad.webp',
  '/generated-products/electronics/solar-power-bank-charger.webp',
  '/generated-products/electronics/magnetic-car-charger.webp',
  '/generated-products/electronics/usb-c-hub-dock.webp',
  '/generated-products/electronics/braided-fast-charging-cable.webp',
  '/generated-products/electronics/gaming-rgb-charging-dock.webp',
  '/generated-products/electronics/minimalist-cube-usb-charger.webp',
];

async function updateDirect() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  const collection = mongoose.connection.collection('products');

  const chargingProducts = await collection.find({ subcategory: 'Charging' }).sort({ _id: 1 }).toArray();
  console.log(`Direct updating ${chargingProducts.length} charging products...`);

  for (let i = 0; i < chargingProducts.length; i++) {
    const prod = chargingProducts[i];
    const selectedImg = uniqueChargingImages[i % uniqueChargingImages.length];

    await collection.updateOne(
      { _id: prod._id },
      {
        $set: {
          images: [selectedImg],
          thumbnail: selectedImg
        }
      }
    );
    console.log(`[${i+1}] Updated "${prod.name}" (_id: ${prod._id}) -> ${selectedImg}`);
  }

  console.log('Update complete. Verifying directly from collection:');
  const check = await collection.find({ subcategory: 'Charging' }).sort({ _id: 1 }).toArray();
  check.forEach((p, idx) => {
    console.log(`Verified [${idx+1}] "${p.name}" -> ${p.images?.[0]}`);
  });

  process.exit(0);
}

updateDirect();
