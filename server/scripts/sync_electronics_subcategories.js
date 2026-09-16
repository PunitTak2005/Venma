const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const electronicsProductsData = [
  {
    name: 'NovaBook Air 14',
    slug: 'novabook-air-14',
    subcategory: 'Laptops',
    price: 1199,
    discountPrice: 1099,
    stock: 25,
    sku: 'TN-ELEC-LAP-001',
    brand: 'TechNova',
    rating: 4.9,
    numReviews: 32,
    description: 'Premium aluminum ultrabook powered by Intel Core Ultra with 16GB RAM, 512GB fast NVMe SSD, and all-day battery life in a razor-thin chassis.',
    image: '/generated-products/electronics/novabook-air-14.webp',
    specifications: [
      { key: 'Processor', value: 'Intel Core Ultra 7' },
      { key: 'RAM', value: '16GB LPDDR5X' },
      { key: 'Storage', value: '512GB PCIe Gen4 SSD' },
      { key: 'Display', value: '14-inch 2.8K OLED 120Hz' },
      { key: 'Weight', value: '1.24 kg' },
    ],
  },
  {
    name: 'Nova X Pro Smartphone',
    slug: 'nova-x-pro-smartphone',
    subcategory: 'Smartphones',
    price: 899,
    discountPrice: 849,
    stock: 30,
    sku: 'TN-ELEC-PHO-002',
    brand: 'TechNova',
    rating: 4.8,
    numReviews: 46,
    description: 'Flagship smartphone featuring a dynamic 120Hz LTPO OLED display, pro-grade 50MP triple-lens camera system, and ultra-fast 65W charging.',
    image: '/generated-products/electronics/nova-x-pro-smartphone.webp',
    specifications: [
      { key: 'Display', value: '6.7-inch 120Hz LTPO OLED' },
      { key: 'Camera', value: '50MP Main + 50MP Ultra-Wide + 50MP Periscope' },
      { key: 'Battery', value: '5000 mAh, 65W Fast Charge' },
      { key: 'RAM/Storage', value: '12GB / 256GB' },
    ],
  },
  {
    name: 'NovaTab 11',
    slug: 'novatab-11',
    subcategory: 'Tablets',
    price: 549,
    discountPrice: 499,
    stock: 20,
    sku: 'TN-ELEC-TAB-003',
    brand: 'TechNova',
    rating: 4.8,
    numReviews: 28,
    description: 'Ultra-slim 11-inch productivity and entertainment tablet with active stylus support, quad stereo speakers, and seamless multitasking.',
    image: '/generated-products/electronics/novatab-11.webp',
    specifications: [
      { key: 'Screen Size', value: '11-inch 2K IPS 90Hz' },
      { key: 'Stylus', value: 'Active Stylus Included' },
      { key: 'Audio', value: 'Quad Stereo Speakers' },
      { key: 'Battery Life', value: 'Up to 14 Hours' },
    ],
  },
  {
    name: 'NovaWatch Active',
    slug: 'novawatch-active',
    subcategory: 'Smartwatches',
    price: 199,
    discountPrice: 179,
    stock: 40,
    sku: 'TN-ELEC-WAT-004',
    brand: 'TechNova',
    rating: 4.7,
    numReviews: 39,
    description: 'Sleek lightweight smartwatch featuring a brilliant always-on AMOLED display, comprehensive heart-rate and SpO2 health tracking, and GPS.',
    image: '/generated-products/electronics/novawatch-active.webp',
    specifications: [
      { key: 'Display', value: '1.43-inch AMOLED Always-On' },
      { key: 'Sensors', value: 'Heart Rate, SpO2, Sleep, GPS' },
      { key: 'Water Resistance', value: '5 ATM (50m)' },
      { key: 'Battery Life', value: 'Up to 10 Days' },
    ],
  },
  {
    name: 'Sonic Pro ANC Headphones',
    slug: 'sonic-pro-anc-headphones',
    subcategory: 'Headphones',
    price: 279,
    discountPrice: 249,
    stock: 22,
    sku: 'TN-ELEC-HED-005',
    brand: 'Sonic',
    rating: 4.9,
    numReviews: 52,
    description: 'Over-ear studio-grade wireless headphones with Hybrid Active Noise Cancellation, custom high-resolution drivers, and plush memory foam earcups.',
    image: '/generated-products/electronics/sonic-pro-anc-headphones.webp',
    specifications: [
      { key: 'Noise Cancellation', value: 'Hybrid ANC (Up to 38dB)' },
      { key: 'Driver Size', value: '40mm Custom Bio-Cellulose' },
      { key: 'Playtime', value: '40 Hours with ANC On' },
      { key: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm AUX' },
    ],
  },
  {
    name: 'Sonic Buds Air',
    slug: 'sonic-buds-air',
    subcategory: 'Earbuds',
    price: 129,
    discountPrice: 109,
    stock: 35,
    sku: 'TN-ELEC-BUD-006',
    brand: 'Sonic',
    rating: 4.8,
    numReviews: 64,
    description: 'True wireless earbuds with ergonomic in-ear comfort, crisp spatial sound, dual-mic ENC clear calls, and a pocket-sized wireless fast charging case.',
    image: '/generated-products/electronics/sonic-buds-air.webp',
    specifications: [
      { key: 'Playtime', value: '8h buds / 32h with case' },
      { key: 'Charging', value: 'Qi Wireless & USB-C Fast Charge' },
      { key: 'Water Resistance', value: 'IPX5 Sweatproof' },
      { key: 'Microphone', value: 'Dual-mic Environmental Noise Canceling' },
    ],
  },
  {
    name: 'MechaKey RGB',
    slug: 'mechakey-rgb',
    subcategory: 'Keyboards',
    price: 149,
    discountPrice: 129,
    stock: 28,
    sku: 'TN-ELEC-KEY-007',
    brand: 'TechNova',
    rating: 4.9,
    numReviews: 41,
    description: 'Premium hot-swappable mechanical gaming keyboard featuring linear lubricated switches, per-key RGB backlighting, and a solid CNC aluminum top plate.',
    image: '/generated-products/electronics/mechakey-rgb.webp',
    specifications: [
      { key: 'Switch Type', value: 'Hot-swappable Linear Mechanical' },
      { key: 'Layout', value: '75% Compact Layout' },
      { key: 'Backlighting', value: 'Per-key RGB 16.8M Colors' },
      { key: 'Connectivity', value: 'Tri-Mode: 2.4GHz, Bluetooth 5.1, Type-C' },
    ],
  },
  {
    name: 'Nova Precision Mouse',
    slug: 'nova-precision-mouse',
    subcategory: 'Computer Mouse',
    price: 79,
    discountPrice: 69,
    stock: 45,
    sku: 'TN-ELEC-MOU-008',
    brand: 'TechNova',
    rating: 4.7,
    numReviews: 33,
    description: 'Ergonomic wireless mouse designed for all-day comfort and precision, featuring hyper-fast magnetic scrolling, silent clicks, and multi-device pairing.',
    image: '/generated-products/electronics/nova-precision-mouse.webp',
    specifications: [
      { key: 'DPI Range', value: '200 to 8000 DPI Darkfield Sensor' },
      { key: 'Buttons', value: '6 Programmable Buttons' },
      { key: 'Battery', value: 'Up to 70 Days per charge' },
      { key: 'Connectivity', value: 'Bluetooth & 2.4GHz Wireless' },
    ],
  },
  {
    name: 'Vision 27 4K Monitor',
    slug: 'vision-27-4k-monitor',
    subcategory: 'Monitors',
    price: 449,
    discountPrice: 399,
    stock: 15,
    sku: 'TN-ELEC-MON-009',
    brand: 'TechNova',
    rating: 4.8,
    numReviews: 25,
    description: 'Professional 27-inch 4K UHD IPS monitor featuring razor-thin bezels, 99% sRGB color accuracy, HDR400, and a 65W USB-C single-cable power delivery hub.',
    image: '/generated-products/electronics/vision-27-4k-monitor.webp',
    specifications: [
      { key: 'Resolution', value: '3840 x 2160 (4K UHD) IPS' },
      { key: 'Color Gamut', value: '99% sRGB, Delta E < 2' },
      { key: 'Ports', value: 'USB-C (65W PD), HDMI 2.1, DisplayPort 1.4' },
      { key: 'Stand', value: 'Height, Tilt, Pivot & Swivel Adjustable' },
    ],
  },
  {
    name: 'NovaSound Portable Speaker',
    slug: 'novasound-portable-speaker',
    subcategory: 'Speakers',
    price: 89,
    discountPrice: 79,
    stock: 50,
    sku: 'TN-ELEC-SPE-010',
    brand: 'TechNova',
    rating: 4.8,
    numReviews: 58,
    description: 'Rugged portable Bluetooth speaker with punchy 360-degree bass, IP67 waterproof and dustproof rating, and 16 hours of continuous battery life.',
    image: '/generated-products/electronics/novasound-portable-speaker.webp',
    specifications: [
      { key: 'Output Power', value: '24W 360-degree Stereo' },
      { key: 'Battery Life', value: '16 Hours' },
      { key: 'Waterproof Rating', value: 'IP67 Waterproof & Float' },
      { key: 'Connectivity', value: 'Bluetooth 5.3 & TWS Pair' },
    ],
  },
  {
    name: 'PowerCore Ultra 20000',
    slug: 'powercore-ultra-20000',
    subcategory: 'Power Banks',
    price: 59,
    discountPrice: 49,
    stock: 60,
    sku: 'TN-ELEC-POW-011',
    brand: 'TechNova',
    rating: 4.9,
    numReviews: 72,
    description: 'High-capacity 20000mAh portable charger with 65W dual-port USB-C Power Delivery fast charging for laptops, phones, and accessories.',
    image: '/generated-products/electronics/powercore-ultra-20000.webp',
    specifications: [
      { key: 'Capacity', value: '20,000 mAh (74Wh)' },
      { key: 'Max Output', value: '65W USB-C Power Delivery' },
      { key: 'Ports', value: '2x USB-C PD, 1x USB-A QC 3.0' },
      { key: 'Display', value: 'Smart Digital LED Percentage Screen' },
    ],
  },
  {
    name: 'TriCharge Dock',
    slug: 'tricharge-dock',
    subcategory: 'Charging Accessories',
    price: 79,
    discountPrice: 69,
    stock: 38,
    sku: 'TN-ELEC-CHG-012',
    brand: 'TechNova',
    rating: 4.8,
    numReviews: 44,
    description: 'Minimalist 3-in-1 magnetic wireless charging station that simultaneously powers your smartphone, smartwatch, and wireless earbuds with a single cable.',
    image: '/generated-products/electronics/tricharge-dock.webp',
    specifications: [
      { key: 'Charging Capacity', value: '3-in-1: 15W Phone + 5W Watch + 5W Earbuds' },
      { key: 'Design', value: 'Foldable Aviation-Grade Aluminum & Soft Silicone' },
      { key: 'Input', value: 'USB-C 30W Adapter Included' },
    ],
  },
  {
    name: 'Nova Game Controller',
    slug: 'nova-game-controller',
    subcategory: 'Gaming Accessories',
    price: 69,
    discountPrice: 59,
    stock: 32,
    sku: 'TN-ELEC-GAM-013',
    brand: 'TechNova',
    rating: 4.7,
    numReviews: 37,
    description: 'Multi-platform wireless gaming controller featuring Hall Effect anti-drift magnetic analog sticks, subtle RGB edge accents, and textured ergonomic grips.',
    image: '/generated-products/electronics/nova-game-controller.webp',
    specifications: [
      { key: 'Sticks & Triggers', value: 'Hall Effect Magnetic Sensing (Zero Drift)' },
      { key: 'Compatibility', value: 'PC, Switch, Android, iOS' },
      { key: 'Lighting', value: 'Customizable Dual RGB Edge Strips' },
      { key: 'Battery', value: '1000 mAh (20 Hours play)' },
    ],
  },
  {
    name: 'Nova Home Hub',
    slug: 'nova-home-hub',
    subcategory: 'Smart Home Devices',
    price: 119,
    discountPrice: 99,
    stock: 24,
    sku: 'TN-ELEC-HUB-014',
    brand: 'TechNova',
    rating: 4.8,
    numReviews: 29,
    description: 'Central smart home touch display and speaker with built-in Matter/Zigbee hub, crystal-clear voice assistant, and seamless multi-device control.',
    image: '/generated-products/electronics/nova-home-hub.webp',
    specifications: [
      { key: 'Display', value: '7-inch HD Touchscreen' },
      { key: 'Smart Protocols', value: 'Matter, Thread, Zigbee, Wi-Fi 6' },
      { key: 'Audio', value: 'Full-range speaker with passive bass radiator' },
      { key: 'Privacy', value: 'Physical camera shutter & mic-mute switch' },
    ],
  },
];

async function syncElectronics() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/venma');
  console.log('Connected to MongoDB');

  const electronicsCat = await Category.findOne({ slug: 'electronics' });
  if (!electronicsCat) throw new Error('Electronics category not found');

  const vendor = await Vendor.findOne({ storeSlug: 'technova-electronics' });
  if (!vendor) throw new Error('TechNova Electronics vendor not found');

  // Update Electronics Category with all 14 subcategories
  const subcategoryNames = electronicsProductsData.map((p) => p.subcategory);
  electronicsCat.subcategories = subcategoryNames;
  await electronicsCat.save();
  console.log('Updated Electronics subcategories:', subcategoryNames);

  // Check if existing keyboard product exists to preserve its ID
  const existingKeyboard = await Product.findOne({
    category: electronicsCat._id,
    name: /Wireless Gaming Keyboard/i,
  });

  for (const item of electronicsProductsData) {
    let existing;
    if (item.subcategory === 'Keyboards' && existingKeyboard) {
      existing = existingKeyboard;
    } else {
      existing = await Product.findOne({
        category: electronicsCat._id,
        subcategory: item.subcategory,
      });
    }

    if (!existing) {
      existing = await Product.findOne({
        slug: item.slug,
      });
    }

    const payload = {
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: electronicsCat._id,
      subcategory: item.subcategory,
      vendor: vendor._id,
      price: item.price,
      discountPrice: item.discountPrice,
      stock: item.stock,
      sku: item.sku,
      brand: item.brand,
      images: [item.image],
      thumbnail: item.image,
      imageValid: true,
      specifications: item.specifications,
      rating: item.rating,
      numReviews: item.numReviews,
      featured: item.subcategory === 'Keyboards' || item.subcategory === 'Laptops',
      isPublished: true,
    };

    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      console.log(`Updated [${item.subcategory}] -> ${existing.name} (_id: ${existing._id})`);
    } else {
      const created = await Product.create(payload);
      console.log(`Created [${item.subcategory}] -> ${created.name} (_id: ${created._id})`);
    }
  }

  // Ensure no other duplicate/stray electronics products exist
  const allElectronics = await Product.find({ category: electronicsCat._id });
  console.log(`\nTotal Electronics products in database: ${allElectronics.length}`);
  for (const p of allElectronics) {
    console.log(`- [${p.subcategory}] ${p.name} | $${p.price} | ${p.images[0]}`);
  }

  // Update Vendor count and categoriesSold
  const vendorProducts = await Product.find({ vendor: vendor._id }).populate('category', 'name');
  const categoriesSold = [...new Set(vendorProducts.map((p) => p.category?.name).filter(Boolean))];
  await Vendor.updateOne(
    { _id: vendor._id },
    { $set: { totalProducts: vendorProducts.length, categoriesSold } }
  );
  console.log(`Updated TechNova vendor: ${vendorProducts.length} total products`);

  await mongoose.disconnect();
}

syncElectronics().catch(async (err) => {
  console.error('Error syncing electronics products:', err);
  await mongoose.disconnect();
  process.exit(1);
});
