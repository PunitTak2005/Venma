const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Category = require('../models/Category');

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');

  // 1. Locate Ceramic Car Wax product
  const waxProduct = await Product.findOne({ slug: 'ceramic-car-wax' });
  if (!waxProduct) {
    console.error('ERROR: Ceramic Car Wax product not found in database!');
    process.exit(1);
  }
  console.log(`Found product: "${waxProduct.name}" (ID: ${waxProduct._id})`);
  const prevVendorId = waxProduct.vendor;
  console.log(`Current vendor ID: ${prevVendorId}`);

  // 2. Create or find User for AutoShine Garage
  const vendorEmail = 'autoshine@markethub.com';
  let vendorUser = await User.findOne({ email: vendorEmail });
  if (!vendorUser) {
    vendorUser = await User.create({
      name: 'AutoShine Garage Partner',
      email: vendorEmail,
      password: 'password123',
      role: 'vendor',
      phone: '+91 20 2567 8900',
      address: {
        street: 'Senapati Bapat Road, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
      },
    });
    console.log(`Created vendor user: ${vendorUser.email} (ID: ${vendorUser._id})`);
  } else {
    console.log(`Vendor user already exists: ${vendorUser.email} (ID: ${vendorUser._id})`);
  }

  // 3. Create or update AutoShine Garage Vendor Document
  let autoShineVendor = await Vendor.findOne({ storeSlug: 'autoshine-garage' });
  if (!autoShineVendor) {
    autoShineVendor = await Vendor.create({
      user: vendorUser._id,
      storeName: 'AutoShine Garage',
      storeSlug: 'autoshine-garage',
      description:
        'AutoShine Garage specializes in premium automotive care products, detailing essentials, cleaning solutions, ceramic coatings, polishing kits, and vehicle maintenance accessories for car enthusiasts and professionals.',
      specialty: 'Premium Car Care & Auto Accessories',
      categoriesSold: ['Automotive'],
      totalProducts: 1,
      logo: '/generated-vendors/autoshine-garage-logo.webp',
      banner: '/generated-vendors/autoshine-garage-banner.webp',
      phone: '+91 20 2567 8900',
      address: {
        street: 'Senapati Bapat Road, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
      },
      status: 'approved',
      commissionRate: 10,
      balance: 0,
      totalRevenue: 0,
      rating: 4.8,
      numReviews: 1240,
      followersCount: 342,
      createdAt: new Date('2021-03-15T09:00:00.000Z'),
    });
    console.log(`Created Vendor: "${autoShineVendor.storeName}" (ID: ${autoShineVendor._id})`);
  } else {
    console.log(`AutoShine Garage vendor already exists (ID: ${autoShineVendor._id})`);
    autoShineVendor.storeName = 'AutoShine Garage';
    autoShineVendor.description =
      'AutoShine Garage specializes in premium automotive care products, detailing essentials, cleaning solutions, ceramic coatings, polishing kits, and vehicle maintenance accessories for car enthusiasts and professionals.';
    autoShineVendor.specialty = 'Premium Car Care & Auto Accessories';
    autoShineVendor.categoriesSold = ['Automotive'];
    autoShineVendor.logo = '/generated-vendors/autoshine-garage-logo.webp';
    autoShineVendor.banner = '/generated-vendors/autoshine-garage-banner.webp';
    autoShineVendor.phone = '+91 20 2567 8900';
    autoShineVendor.address = {
      street: 'Senapati Bapat Road, Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    };
    autoShineVendor.rating = 4.8;
    autoShineVendor.numReviews = 1240;
    autoShineVendor.createdAt = new Date('2021-03-15T09:00:00.000Z');
    await autoShineVendor.save();
    console.log(`Updated AutoShine Garage details`);
  }

  // 4. Update Ceramic Car Wax product's vendor
  waxProduct.vendor = autoShineVendor._id;
  await waxProduct.save();
  console.log(`Updated product "${waxProduct.name}" vendor to AutoShine Garage (${autoShineVendor._id})`);

  // 5. Update product counts on AutoShine Garage
  const autoShineProductCount = await Product.countDocuments({
    vendor: autoShineVendor._id,
    imageValid: true,
  });
  autoShineVendor.totalProducts = autoShineProductCount;
  await autoShineVendor.save();
  console.log(`AutoShine Garage totalProducts: ${autoShineVendor.totalProducts}`);

  // 6. Update product counts and categories on Previous Vendor (Urban Living Co.)
  if (prevVendorId && prevVendorId.toString() !== autoShineVendor._id.toString()) {
    const prevVendor = await Vendor.findById(prevVendorId);
    if (prevVendor) {
      const remainingProducts = await Product.find({
        vendor: prevVendor._id,
        imageValid: true,
      }).populate('category');

      prevVendor.totalProducts = remainingProducts.length;

      // Recalculate categories sold
      const remainingCats = [
        ...new Set(
          remainingProducts.map((p) => p.category?.name).filter(Boolean)
        ),
      ];
      prevVendor.categoriesSold = remainingCats;
      await prevVendor.save();
      console.log(
        `Previous vendor (${prevVendor.storeName}) updated: totalProducts = ${prevVendor.totalProducts}, categoriesSold = [${prevVendor.categoriesSold.join(', ')}]`
      );
    }
  }

  // 7. Verify Product in DB
  const verifiedWax = await Product.findOne({ slug: 'ceramic-car-wax' }).populate('vendor').populate('category');
  console.log('\n--- VERIFICATION: Ceramic Car Wax ---');
  console.log({
    productName: verifiedWax.name,
    slug: verifiedWax.slug,
    vendorName: verifiedWax.vendor?.storeName,
    vendorSlug: verifiedWax.vendor?.storeSlug,
    categoryName: verifiedWax.category?.name,
    price: verifiedWax.price,
    discountPrice: verifiedWax.discountPrice,
  });

  // 8. Verify AutoShine Garage
  console.log('\n--- VERIFICATION: AutoShine Garage ---');
  console.log({
    storeName: autoShineVendor.storeName,
    storeSlug: autoShineVendor.storeSlug,
    specialty: autoShineVendor.specialty,
    rating: autoShineVendor.rating,
    numReviews: autoShineVendor.numReviews,
    totalProducts: autoShineVendor.totalProducts,
    location: `${autoShineVendor.address.city}, ${autoShineVendor.address.state}, ${autoShineVendor.address.country}`,
    memberSince: autoShineVendor.createdAt,
    logo: autoShineVendor.logo,
    banner: autoShineVendor.banner,
  });

  await mongoose.disconnect();
  console.log('\nMigration finished successfully.');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
