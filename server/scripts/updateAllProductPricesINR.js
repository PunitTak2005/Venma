const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Order = require('../models/Order');

// Realistic Indian market prices (INR) for every product in the marketplace
const priceMap = {
  // Beauty
  'precision-serum-essence-series-11-11': { price: 1599, discountPrice: 1299 },
  
  // Electronics - Keyboards
  'mechakey-rgb': { price: 5999, discountPrice: 4999 },
  
  // Fashion - Footwear
  'nordic-sneakers-series-73-73': { price: 4299, discountPrice: 3499 },
  
  // Kitchen - Ceramics
  'organic-ceramic-mug-series-176-176': { price: 799, discountPrice: 599 },
  
  // Home & Living - Lighting
  'modern-minimalist-arc-floor-lamp': { price: 9499, discountPrice: 7999 },
  
  // Automotive - Car Care
  'ceramic-car-wax': { price: 1599, discountPrice: 1299 },
  
  // Sports - Fitness Equipment
  'smart-adjustable-dumbbell-set': { price: 22999, discountPrice: 18999 },
  
  // Toys - Educational
  'stem-modular-robotics-building-kit': { price: 5999, discountPrice: 4999 },
  
  // Office - Desk Accessories
  'walnut-desk-organizer-dock': { price: 2999, discountPrice: 2499 },
  
  // Books - Stationery
  'leather-bound-journal': { price: 1199, discountPrice: 899 },
  
  // Electronics - Flagship Laptops
  'novabook-air-14': { price: 84999, discountPrice: 74999 },
  
  // Electronics - Flagship Smartphone
  'nova-x-pro-smartphone': { price: 49999, discountPrice: 44999 },
  
  // Electronics - Tablets
  'novatab-11': { price: 28999, discountPrice: 24999 },
  
  // Electronics - Smartwatches
  'novawatch-active': { price: 6499, discountPrice: 4999 },
  
  // Electronics - Headphones
  'sonic-pro-anc-headphones': { price: 7499, discountPrice: 5999 },
  
  // Electronics - Earbuds
  'sonic-buds-air': { price: 3299, discountPrice: 2499 },
  
  // Electronics - Computer Mouse
  'nova-precision-mouse': { price: 2999, discountPrice: 2499 },
  
  // Electronics - Monitors
  'vision-27-4k-monitor': { price: 31999, discountPrice: 26999 },
  
  // Electronics - Speakers
  'novasound-portable-speaker': { price: 4499, discountPrice: 3499 },
  
  // Electronics - Power Banks
  'powercore-ultra-20000': { price: 3699, discountPrice: 2999 },
  
  // Electronics - Charging Accessories
  'tricharge-dock': { price: 1999, discountPrice: 1499 },
  
  // Electronics - Gaming Accessories
  'nova-game-controller': { price: 3799, discountPrice: 2999 },
  
  // Electronics - Smart Home Devices
  'nova-home-hub': { price: 8499, discountPrice: 6999 },
};

async function updatePrices() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/markethub');
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  console.log(`Found ${products.length} products to evaluate.\n`);

  let updatedCount = 0;
  for (const product of products) {
    const slug = product.slug;
    const mapping = priceMap[slug];

    if (!mapping) {
      console.warn(`[WARNING] No specific price mapping found for slug: ${slug} (${product.name})`);
      continue;
    }

    const prevPrice = product.price;
    const prevDiscount = product.discountPrice;

    product.price = mapping.price; // Original MRP
    product.discountPrice = mapping.discountPrice; // Selling Price

    await product.save();
    updatedCount++;

    const discountPercent = Math.round(((mapping.price - mapping.discountPrice) / mapping.price) * 100);
    console.log(
      `✓ [${product.name}] (${slug})\n` +
      `   Old: MRP ₹${prevPrice} | Sale ₹${prevDiscount}\n` +
      `   New: MRP ₹${mapping.price.toLocaleString('en-IN')} | Sale ₹${mapping.discountPrice.toLocaleString('en-IN')} (-${discountPercent}% OFF)\n`
    );
  }

  console.log(`\nSuccessfully updated ${updatedCount} product prices in MongoDB.`);

  // Recalculate existing orders to ensure all totals match current product prices
  const orders = await Order.find({});
  console.log(`Verifying and recalculating ${orders.length} existing orders...`);
  for (const order of orders) {
    for (const item of order.items) {
      const prod = await Product.findById(item.product);
      if (prod) {
        item.price = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
      }
    }
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    order.subtotal = Math.round(subtotal);
    order.tax = Math.round(subtotal * 0.18); // 18% GST standard in India
    order.shippingFee = subtotal > 999 ? 0 : 99; // Free delivery over ₹999
    order.totalAmount = Math.round(order.subtotal + order.tax + order.shippingFee - (order.discount || 0));
    await order.save();
  }
  console.log(`All order subtotals and totals recalculated in INR.`);

  await mongoose.disconnect();
}

updatePrices().catch(async (err) => {
  console.error('Error updating product prices:', err);
  await mongoose.disconnect();
  process.exit(1);
});
