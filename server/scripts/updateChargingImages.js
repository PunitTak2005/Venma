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

async function updateChargingProducts() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venma');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const chargingProducts = await Product.find({ subcategory: 'Charging' }).sort({ _id: 1 });
  console.log(`Found ${chargingProducts.length} charging products to update with unique images.`);

  let updatedCount = 0;
  for (let i = 0; i < chargingProducts.length; i++) {
    const prod = chargingProducts[i];
    // Map to unique charging images
    const selectedImg = uniqueChargingImages[i % uniqueChargingImages.length];

    prod.images = [selectedImg];
    prod.thumbnail = selectedImg;

    await prod.save();
    updatedCount++;
    console.log(`[${i+1}] Updated "${prod.name}" (_id: ${prod._id}) -> ${selectedImg}`);
  }

  console.log(`\nSuccessfully updated ${updatedCount} charging products in MongoDB!`);
  process.exit(0);
}

updateChargingProducts();
