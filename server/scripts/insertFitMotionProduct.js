const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const { isValidProductImage } = require('../utils/productImageValidation');

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[MongoDB] Connected successfully');

    // 1. Locate FitMotion Sports vendor
    let vendor = await Vendor.findOne({ storeSlug: 'fitmotion-sports' });
    if (!vendor) {
      vendor = await Vendor.findById('6aa8ef9e650fecb99ef6f947');
    }
    if (!vendor) {
      console.error('FitMotion Sports vendor not found in database!');
      process.exit(1);
    }
    console.log(`[Vendor Found] ID: ${vendor._id}, Name: ${vendor.storeName}`);

    // 2. Locate Sports category
    let category = await Category.findOne({ slug: 'sports' });
    if (!category) {
      category = await Category.findById('6aa8ef9d650fecb99ef6f93c');
    }
    if (!category) {
      console.error('Sports category not found in database!');
      process.exit(1);
    }
    console.log(`[Category Found] ID: ${category._id}, Name: ${category.name}`);

    // 3. Define images and validate with productImageValidation.js
    const images = [
      '/generated-products/sports/fitmotion-pro-resistance-bands-set-main.webp',
      '/generated-products/sports/fitmotion-pro-resistance-bands-set-angle.webp',
      '/generated-products/sports/fitmotion-pro-resistance-bands-set-detail.webp',
      '/generated-products/sports/fitmotion-pro-resistance-bands-set-pouch.webp',
    ];
    const thumbnail = images[0];

    for (const img of images) {
      const valid = isValidProductImage(img);
      console.log(`Image validation: ${img} => ${valid}`);
      if (!valid) {
        console.error(`Validation failed for ${img}`);
        process.exit(1);
      }
    }

    // 4. Product payload
    const productData = {
      name: 'FitMotion Pro Resistance Bands Set',
      slug: 'fitmotion-pro-resistance-bands-set',
      description: 'A premium resistance bands set designed for strength training, mobility exercises, home workouts, and rehabilitation. Includes multiple resistance levels with comfortable anti-slip handles and a durable carry pouch.',
      category: category._id,
      vendor: vendor._id,
      price: 1999,
      discountPrice: 1499,
      stock: 85,
      sku: 'FM-RB-PRO-001',
      brand: 'FitMotion',
      images,
      thumbnail,
      imageValid: true,
      specifications: [
        { key: 'Material', value: 'Natural Latex' },
        { key: 'Resistance Levels', value: 'Light to Extra Heavy (5 Tension Levels)' },
        { key: 'Handles', value: 'Anti-Slip Foam Grip with Steel Carabiners' },
        { key: 'Weight', value: '780 g' },
        { key: 'Warranty', value: '1 Year Manufacturer Warranty' },
        { key: 'Delivery', value: 'Free Delivery' },
      ],
      rating: 4.8,
      numReviews: 186,
      featured: true,
      isPublished: true,
      tags: ['resistance bands', 'fitness', 'strength training', 'home workout', 'gym gear', 'mobility', 'bestseller', 'sports'],
    };

    // 5. Upsert Product
    const existing = await Product.findOne({ sku: productData.sku });
    let product;
    if (existing) {
      console.log(`[Product Exists] Updating product ID: ${existing._id}`);
      Object.assign(existing, productData);
      product = await existing.save();
    } else {
      console.log('[Product Creating] Inserting new product...');
      product = await Product.create(productData);
    }
    console.log(`[Product Saved] ID: ${product._id}, Name: ${product.name}`);

    // 6. Update Vendor stats (totalProducts & categoriesSold)
    const count = await Product.countDocuments({ vendor: vendor._id, isPublished: true, imageValid: true });
    vendor.totalProducts = count;
    if (!vendor.categoriesSold.includes('Sports')) {
      vendor.categoriesSold.push('Sports');
    }
    await vendor.save();
    console.log(`[Vendor Updated] totalProducts: ${vendor.totalProducts}, categoriesSold: ${JSON.stringify(vendor.categoriesSold)}`);

    console.log('\n--- SUCCESS! ---');
    console.log(JSON.stringify({
      product: {
        id: product._id,
        name: product.name,
        slug: product.slug,
        vendor: vendor.storeName,
        category: category.name,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        rating: product.rating,
        numReviews: product.numReviews,
        featured: product.featured,
        images: product.images,
      },
      vendorTotalProducts: vendor.totalProducts,
    }, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error inserting product:', err);
    process.exit(1);
  }
}

main();
