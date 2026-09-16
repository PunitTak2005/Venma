/**
 * VENMA — Safe Production Seed Script
 *
 * Idempotent: upserts only. Never deletes existing data.
 * Safe to run against a live MongoDB Atlas cluster.
 *
 * Usage:
 *   node scripts/seedProduction.js
 *
 * What it creates (only if missing):
 *   - Categories (12)
 *   - Demo accounts: admin@venma.com, vendor@venma.com, buyer@venma.com
 *   - Core vendors with correct Indian cities
 *   - PlatformSettings record
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User             = require('../models/User');
const Vendor           = require('../models/Vendor');
const Category         = require('../models/Category');
const PlatformSettings = require('../models/PlatformSettings');

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Electronics',          slug: 'electronics',          icon: 'Cpu',        featured: true },
  { name: 'Fashion',              slug: 'fashion',              icon: 'Shirt',       featured: true },
  { name: 'Sports',               slug: 'sports',               icon: 'Dumbbell',    featured: true },
  { name: 'Beauty',               slug: 'beauty',               icon: 'Sparkles',    featured: true },
  { name: 'Automotive',           slug: 'automotive',           icon: 'Car',         featured: true },
  { name: 'Kitchen',              slug: 'kitchen',              icon: 'Utensils',    featured: true },
  { name: 'Office',               slug: 'office',               icon: 'Briefcase',   featured: true },
  { name: 'Home & Living',        slug: 'home-living',          icon: 'Home',        featured: true },
  { name: 'Books',                slug: 'books',                icon: 'BookOpen',    featured: true },
  { name: 'Toys & Learning',      slug: 'toys',                 icon: 'Brain',       featured: true },
  { name: 'Eco Lifestyle',        slug: 'eco-lifestyle',        icon: 'Trees',       featured: true },
  { name: 'Workspace Accessories',slug: 'workspace-accessories',icon: 'Layers',      featured: false },
];

// ── Demo users ────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    name:  'Platform Admin',
    email: 'admin@venma.com',
    role:  'admin',
    address: { street: '184 B Block, Sector 14, Hiran Magri', city: 'Udaipur', state: 'Rajasthan', zipCode: '313002', country: 'India' },
  },
  {
    name:  'TechNova Electronics Owner',
    email: 'vendor@venma.com',
    role:  'vendor',
    address: { street: '104 Tech Boulevard, Outer Ring Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560103', country: 'India' },
  },
  {
    name:  'Demo Buyer',
    email: 'buyer@venma.com',
    role:  'customer',
    address: { street: '12 MG Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India' },
  },
];

// ── Core vendor profiles ──────────────────────────────────────────────────────
const VENDORS = [
  {
    storeName:  'TechNova Electronics',
    storeSlug:  'technova-electronics',
    email:      'vendor@venma.com',          // maps to demo vendor user
    specialty:  'Electronics & Smart Tech',
    logo:       '/generated-vendors/technova-electronics-logo.webp',
    banner:     '/generated-vendors/technova-electronics-banner.webp',
    rating: 4.9, numReviews: 142,
    phone: '+91 80 4567 8901',
    city: 'Bengaluru', state: 'Karnataka', zipCode: '560103',
    street: '104 Tech Boulevard, Outer Ring Road, Bellandur',
  },
  {
    storeName:  'FitMotion Sports',
    storeSlug:  'fitmotion-sports',
    email:      'fitmotion@markethub.com',
    specialty:  'Fitness Equipment & Gym Gear',
    logo:       '/generated-vendors/fitmotion-sports-logo.webp',
    banner:     '/generated-vendors/fitmotion-sports-banner.webp',
    rating: 4.8, numReviews: 76,
    phone: '+91 22 6123 4567',
    city: 'Mumbai', state: 'Maharashtra', zipCode: '400051',
    street: 'Plot C-59, G Block, Bandra Kurla Complex',
  },
  {
    storeName:  'AutoShine Garage',
    storeSlug:  'autoshine-garage',
    email:      'autoshine@markethub.com',
    specialty:  'Premium Car Care & Auto Accessories',
    logo:       '/generated-vendors/autoshine-garage-logo.webp',
    banner:     '/generated-vendors/autoshine-garage-banner.webp',
    rating: 4.8, numReviews: 124,
    phone: '+91 20 2567 8900',
    city: 'Pune', state: 'Maharashtra', zipCode: '411016',
    street: 'Senapati Bapat Road, Shivaji Nagar',
  },
  {
    storeName:  'KitchenCraft Essentials',
    storeSlug:  'kitchencraft-essentials',
    email:      'kitchencraft@markethub.com',
    specialty:  'Kitchen Appliances & Cookware',
    logo:       '/generated-vendors/kitchencraft-essentials-logo.webp',
    banner:     '/generated-vendors/kitchencraft-essentials-banner.webp',
    rating: 4.8, numReviews: 84,
    phone: '+91 8272 234567',
    city: 'Coorg', state: 'Karnataka', zipCode: '571201',
    street: '28 Estate Road, Madikeri Hill View',
  },
  {
    storeName:  'LuxeWear',
    storeSlug:  'luxewear',
    email:      'luxewear@markethub.com',
    specialty:  'Apparel, Bags, Watches & Fashion',
    logo:       '/generated-vendors/luxewear-logo.webp',
    banner:     '/generated-vendors/luxewear-banner.webp',
    rating: 4.8, numReviews: 110,
    phone: '+91 261 2456789',
    city: 'Surat', state: 'Gujarat', zipCode: '395002',
    street: '12 Ring Road Textile Tower, Diamond Park',
  },
  {
    storeName:  'Oak & Steel Workspace',
    storeSlug:  'oak-steel-workspace',
    email:      'oaksteel@markethub.com',
    specialty:  'Office Furniture & Productivity Workspace',
    logo:       '/generated-vendors/oak-steel-workspace-logo.webp',
    banner:     '/generated-vendors/oak-steel-workspace-banner.webp',
    rating: 4.9, numReviews: 120,
    phone: '+91 40 6789 0123',
    city: 'Hyderabad', state: 'Telangana', zipCode: '500081',
    street: '55 HITEC City Main Road, Cyber Pearl Precinct',
  },
  {
    storeName:  'HomeCraft Artisan Studio',
    storeSlug:  'homecraft-artisan-studio',
    email:      'homecraft@markethub.com',
    specialty:  'Artisan Home Decor & Lighting',
    logo:       '/generated-vendors/homecraft-artisan-studio-logo.webp',
    banner:     '/generated-vendors/homecraft-artisan-studio-banner.webp',
    rating: 4.9, numReviews: 88,
    phone: '+91 44 2345 6789',
    city: 'Chennai', state: 'Tamil Nadu', zipCode: '600028',
    street: '32 Raja Street, T. Nagar',
  },
  {
    storeName:  'Apex Gaming Hardware',
    storeSlug:  'apex-gaming-hardware',
    email:      'apexgaming@markethub.com',
    specialty:  'Gaming Peripherals & PC Hardware',
    logo:       '/generated-vendors/apex-gaming-hardware-logo.webp',
    banner:     '/generated-vendors/apex-gaming-hardware-banner.webp',
    rating: 4.8, numReviews: 95,
    phone: '+91 99 8877 6655',
    city: 'Bengaluru', state: 'Karnataka', zipCode: '560038',
    street: '78 Brigade Road, Central Bengaluru',
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('ERROR: MONGO_URI or MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  console.log('\n=== VENMA Production Seed (idempotent) ===\n');
  console.log(`Connecting to: ${mongoUri.replace(/:\/\/.*@/, '://<credentials>@')}`);
  await mongoose.connect(mongoUri);
  console.log('Connected.\n');

  const hashed = await bcrypt.hash('password123', 10);

  // ── 1. Categories ──────────────────────────────────────────────────────────
  let catCreated = 0;
  for (const cat of CATEGORIES) {
    const exists = await Category.exists({ slug: cat.slug });
    if (!exists) {
      await Category.create(cat);
      catCreated++;
    }
  }
  console.log(`✓ Categories — ${catCreated} created, ${CATEGORIES.length - catCreated} already existed`);

  // ── 2. Demo users ──────────────────────────────────────────────────────────
  let userCreated = 0;
  let userPasswordsRepaired = 0;
  const userMap = {};
  for (const u of DEMO_USERS) {
    let user = await User.findOne({ email: u.email }).select('+password');
    if (!user) {
      user = await User.create({ ...u, password: hashed });
      userCreated++;
    } else if (!user.password || !(await user.matchPassword('password123'))) {
      // Repair only the documented demo accounts; never alter other users.
      user.password = hashed;
      await user.save();
      userPasswordsRepaired++;
    }
    userMap[u.email] = user;
  }
  console.log(`✓ Demo users — ${userCreated} created, ${DEMO_USERS.length - userCreated} already existed, ${userPasswordsRepaired} passwords repaired`);
  console.log(`  admin@venma.com  / password123`);
  console.log(`  vendor@venma.com / password123`);
  console.log(`  buyer@venma.com  / password123`);

  // ── 3. Vendors ─────────────────────────────────────────────────────────────
  let vendorCreated = 0;
  for (const v of VENDORS) {
    const exists = await Vendor.exists({ storeSlug: v.storeSlug });
    if (exists) continue;

    // Find or create an owning user for this vendor
    let ownerUser = await User.findOne({ email: v.email });
    if (!ownerUser) {
      ownerUser = await User.create({
        name: `${v.storeName} Owner`,
        email: v.email,
        password: hashed,
        role: 'vendor',
        address: {
          street: v.street,
          city: v.city,
          state: v.state,
          zipCode: v.zipCode,
          country: 'India',
        },
      });
    }

    await Vendor.create({
      user: ownerUser._id,
      storeName: v.storeName,
      storeSlug: v.storeSlug,
      description: v.specialty,
      specialty: v.specialty,
      logo: v.logo,
      banner: v.banner,
      phone: v.phone,
      address: { street: v.street, city: v.city, state: v.state, zipCode: v.zipCode, country: 'India' },
      location: `${v.city}, ${v.state}`,
      rating: v.rating,
      numReviews: v.numReviews,
      status: 'approved',
      totalProducts: 0,
    });
    vendorCreated++;
  }
  console.log(`✓ Vendors — ${vendorCreated} created, ${VENDORS.length - vendorCreated} already existed`);

  // ── 4. PlatformSettings ────────────────────────────────────────────────────
  const settingsExist = await PlatformSettings.findOne({});
  if (!settingsExist) {
    await PlatformSettings.create({
      platformName: 'VENMA Marketplace',
      platformEmail: 'admin@venma.com',
      commissionRate: 10,
      currency: 'INR',
      taxRate: 18,
    });
    console.log('✓ PlatformSettings — created');
  } else {
    console.log('✓ PlatformSettings — already exists');
  }

  console.log('\n=== Seed complete ===\n');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
