const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const User = require('../server/models/User');
const Vendor = require('../server/models/Vendor');
const Category = require('../server/models/Category');
const Product = require('../server/models/Product');
const Order = require('../server/models/Order');
const Review = require('../server/models/Review');
const Coupon = require('../server/models/Coupon');
const Wishlist = require('../server/models/Wishlist');

const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Cpu',
    description: 'Smart gadgets, computers, audio, charging accessories, and personal devices',
    banner: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Audio', 'Accessories', 'Charging', 'Smart Devices'],
    featured: true,
  },
  {
    name: 'Office Furniture',
    slug: 'office-furniture',
    icon: 'Briefcase',
    description: 'Ergonomic chairs, executive desks, and commercial workspace furniture',
    banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Chairs', 'Desks'],
    featured: true,
  },
  {
    name: 'Workspace Accessories',
    slug: 'workspace-accessories',
    icon: 'Layers',
    description: 'Desk organizers, monitor stands, docking stations, and productivity accessories',
    banner: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Organizers', 'Monitor Stands', 'Docking Stations'],
    featured: true,
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    icon: 'Home',
    description: 'Artisan furniture, modern lighting, geometric rugs, and living room accessories',
    banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Storage', 'Lighting', 'Decor'],
    featured: true,
  },
  {
    name: 'Kitchen',
    slug: 'kitchen',
    icon: 'Utensils',
    description: 'Espresso machines, culinary cookware, ceramic mugs, and dining accessories',
    banner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Appliances', 'Cookware'],
    featured: true,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Luxury chronographs, leather wallets, everyday backpacks, and designer sneakers',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Wallets', 'Watches', 'Bags'],
    featured: true,
  },
  {
    name: 'Fitness',
    slug: 'fitness',
    icon: 'Dumbbell',
    description: 'High-density yoga mats, precision dumbbells, fitness trackers, and gym gear',
    banner: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Yoga', 'Gym Equipment'],
    featured: true,
  },
  {
    name: 'Eco Lifestyle',
    slug: 'eco-lifestyle',
    icon: 'Trees',
    description: 'Sustainable water bottles, botanical serum essences, and wellness products',
    banner: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Sustainable Products'],
    featured: true,
  },
];

const vendorSeeds = [
  {
    storeName: 'TechNova Electronics',
    storeSlug: 'technova-electronics',
    email: 'technova@venma.com',
    desc: 'Sells electronics, computer accessories, gadgets, smart devices, charging accessories, audio products, keyboards, mice, monitors, webcams, USB hubs, and desk tech.',
    specialty: 'Electronics & Smart Devices',
    logo: '/generated-vendors/technova-electronics-logo.webp',
    banner: '/generated-vendors/technova-electronics-banner.webp',
    rating: 4.9,
    numReviews: 142,
    phone: '+91 80 4123 4567',
    location: 'Bengaluru, Karnataka',
    address: {
      street: '104 Koramangala 4th Block, 80 Feet Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560034',
    },
  },
  {
    storeName: 'Urban Living Co.',
    storeSlug: 'urban-living-co',
    email: 'urbanliving@venma.com',
    desc: 'Sells home décor, furniture, storage, lighting, organizers, mirrors, wall décor, and living room accessories.',
    specialty: 'Home Décor & Living Room Essentials',
    logo: '/generated-vendors/urban-living-co-logo.webp',
    banner: '/generated-vendors/urban-living-co-banner.webp',
    rating: 4.8,
    numReviews: 98,
    phone: '+91 11 2654 3210',
    location: 'Delhi, Delhi',
    address: {
      street: '42 Hauz Khas Village, Designer Lane',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      zipCode: '110016',
    },
  },
  // NOTE: UrbanStride removed — vendor had 0 products and was permanently deleted.
  {
    storeName: 'Oak & Steel Workspace',
    storeSlug: 'oak-steel-workspace',
    email: 'oaksteel@venma.com',
    desc: 'Sells office furniture, ergonomic chairs, desks, desk organizers, monitor stands, workspace accessories, and productivity furniture.',
    specialty: 'Office Furniture & Productivity Workspace',
    logo: '/generated-vendors/oak-steel-workspace-logo.webp',
    banner: '/generated-vendors/oak-steel-workspace-banner.webp',
    rating: 4.9,
    numReviews: 120,
    phone: '+91 40 6789 0123',
    location: 'Hyderabad, Telangana',
    address: {
      street: '55 HITEC City Main Road, Cyber Pearl Precinct',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      zipCode: '500081',
    },
  },
  // NOTE: Elite Workspace removed — vendor had 0 products and was permanently deleted.
  {
    storeName: 'KitchenCraft Essentials',
    storeSlug: 'kitchencraft-essentials',
    email: 'kitchencraft@venma.com',
    desc: 'Sells kitchen appliances, cookware, dining products, coffee accessories, and food preparation tools.',
    specialty: 'Kitchen Appliances & Cookware',
    logo: '/generated-vendors/kitchencraft-essentials-logo.webp',
    banner: '/generated-vendors/kitchencraft-essentials-banner.webp',
    rating: 4.8,
    numReviews: 84,
    phone: '+91 8272 234567',
    location: 'Coorg, Karnataka',
    address: {
      street: '28 Estate Road, Madikeri Hill View',
      city: 'Coorg',
      state: 'Karnataka',
      country: 'India',
      zipCode: '571201',
    },
  },
  // NOTE: BrewCraft Coffee removed — vendor had 0 products and was permanently deleted.
  {
    storeName: 'LuxeWear',
    storeSlug: 'luxewear',
    email: 'luxewear@venma.com',
    desc: 'Sells clothing, shoes, bags, wallets, watches, and fashion accessories.',
    specialty: 'Apparel, Bags, Watches & Fashion',
    logo: '/generated-vendors/luxewear-logo.webp',
    banner: '/generated-vendors/luxewear-banner.webp',
    rating: 4.8,
    numReviews: 110,
    phone: '+91 261 2456789',
    location: 'Surat, Gujarat',
    address: {
      street: '12 Ring Road Textile Tower, Diamond Park',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      zipCode: '395002',
    },
  },
  {
    storeName: 'ChronoLux',
    storeSlug: 'chronolux',
    email: 'chronolux@venma.com',
    desc: 'Master handcrafted luxury timepieces, precision automatic movements, and high-jewelry timepieces crafted for horology connoisseurs.',
    specialty: 'Luxury Chronographs & Precision Timepieces',
    logo: '/generated-vendors/luxewear-logo.webp',
    banner: '/generated-vendors/luxewear-banner.webp',
    rating: 4.9,
    numReviews: 148,
    phone: '+91 261 2891234',
    location: 'Surat, Gujarat',
    address: {
      street: '88 Diamond Bourse Boulevard, Khajod',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      zipCode: '395007',
    },
  },
  {
    storeName: 'FitMotion Sports',
    storeSlug: 'fitmotion-sports',
    email: 'fitmotion@venma.com',
    desc: 'Sells fitness equipment, yoga accessories, sports gear, gym products, and outdoor fitness items.',
    specialty: 'Fitness Equipment & Gym Gear',
    logo: '/generated-vendors/fitmotion-sports-logo.webp',
    banner: '/generated-vendors/fitmotion-sports-banner.webp',
    rating: 4.8,
    numReviews: 76,
    phone: '+91 22 2673 8900',
    location: 'Mumbai, Maharashtra',
    address: {
      street: '76 Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400050',
    },
  },
  {
    storeName: 'GreenLeaf Lifestyle',
    storeSlug: 'greenleaf-lifestyle',
    email: 'greenleaf@venma.com',
    desc: 'Sells eco-friendly products, sustainable home items, bamboo products, reusable products, and wellness accessories.',
    specialty: 'Eco-Friendly & Sustainable Living',
    logo: '/generated-vendors/greenleaf-lifestyle-logo.webp',
    banner: '/generated-vendors/greenleaf-lifestyle-banner.webp',
    rating: 4.9,
    numReviews: 89,
    phone: '+91 141 2367890',
    location: 'Jaipur, Rajasthan',
    address: {
      street: '22 Johari Bazaar Heritage Row, Pink City',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302003',
    },
  },
  {
    storeName: 'GlowLeaf Skincare',
    storeSlug: 'glowleaf-skincare',
    email: 'glowleaf@venma.com',
    desc: 'Organic Ayurvedic botanical skincare serums, herbal cleansers, and cold-pressed facial elixirs formulated with regal heritage recipes.',
    specialty: 'Ayurvedic & Botanical Organic Skincare',
    logo: '/generated-vendors/greenleaf-lifestyle-logo.webp',
    banner: '/generated-vendors/greenleaf-lifestyle-banner.webp',
    rating: 4.9,
    numReviews: 104,
    phone: '+91 141 4567891',
    location: 'Jaipur, Rajasthan',
    address: {
      street: '51 C-Scheme Botanical Avenue',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302001',
    },
  },
  {
    storeName: 'AutoShine Garage',
    storeSlug: 'autoshine-garage',
    email: 'autoshine@venma.com',
    desc: 'Professional-grade automotive detailing compounds, ceramic coatings, high-pressure foam cannons, and precision car care gear.',
    specialty: 'Automotive Detailing & Performance Care',
    logo: '/generated-vendors/oak-steel-workspace-logo.webp',
    banner: '/generated-vendors/oak-steel-workspace-banner.webp',
    rating: 4.8,
    numReviews: 73,
    phone: '+91 20 2567 8901',
    location: 'Pune, Maharashtra',
    address: {
      street: '19 Senapati Bapat Road, Auto Hub Precinct',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '411016',
    },
  },
  {
    storeName: 'Occasion Events',
    storeSlug: 'occasion-events',
    email: 'occasion@venma.com',
    desc: 'Luxury royal wedding favors, heritage event decor, ceremonial gift hampers, and artisanal celebration accessories.',
    specialty: 'Heritage Event Decor & Royal Gifts',
    logo: '/generated-vendors/luxewear-logo.webp',
    banner: '/generated-vendors/luxewear-banner.webp',
    rating: 4.9,
    numReviews: 65,
    phone: '+91 294 242 1234',
    location: 'Udaipur, Rajasthan',
    address: {
      street: '34 City Palace Road, Old Heritage Quarter',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '313001',
    },
  },
  {
    storeName: 'Qezmora Education',
    storeSlug: 'qezmora-education',
    email: 'qezmora@venma.com',
    desc: 'Comprehensive educational kits, STEM learning modules, robotics development boards, and academic reference sets.',
    specialty: 'STEM Learning Kits & Academic Resources',
    logo: '/generated-vendors/technova-electronics-logo.webp',
    banner: '/generated-vendors/technova-electronics-banner.webp',
    rating: 4.8,
    numReviews: 81,
    phone: '+91 731 254 3210',
    location: 'Indore, Madhya Pradesh',
    address: {
      street: '62 Vijay Nagar Main Square, Tech Ed Arcade',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      zipCode: '452010',
    },
  },
];

function classifyProduct(name) {
  const n = name.toLowerCase();
  if (n.includes('headphone')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Audio' };
  if (n.includes('keyboard') || n.includes('mouse')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Accessories' };
  if (n.includes('charger') || n.includes('charging')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Charging' };
  if (n.includes('robotics') || n.includes('webcam') || n.includes('usb') || n.includes('hub')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Smart Devices' };

  if (n.includes('chair') || n.includes('desk') && !n.includes('lamp') && !n.includes('organizer')) return { vendorSlug: 'oak-steel-workspace', categorySlug: 'office-furniture', subcategory: 'Chairs' };
  if (n.includes('desk organizer') || n.includes('dock') || n.includes('monitor stand') || n.includes('desk shelf')) return { vendorSlug: 'oak-steel-workspace', categorySlug: 'workspace-accessories', subcategory: 'Organizers' };

  if (n.includes('lamp') || n.includes('lighting')) return { vendorSlug: 'urban-living-co', categorySlug: 'home-living', subcategory: 'Lighting' };
  if (n.includes('rug') || n.includes('vase') || n.includes('montessori') || n.includes('decor') || n.includes('art')) return { vendorSlug: 'urban-living-co', categorySlug: 'home-living', subcategory: 'Decor' };
  if (n.includes('storage') || n.includes('shelf') || n.includes('shelves')) return { vendorSlug: 'urban-living-co', categorySlug: 'home-living', subcategory: 'Storage' };

  if (n.includes('espresso') || n.includes('kettle') || n.includes('coffee')) return { vendorSlug: 'kitchencraft-essentials', categorySlug: 'kitchen', subcategory: 'Appliances' };
  if (n.includes('mug') || n.includes('cookware') || n.includes('knife') || n.includes('pot')) return { vendorSlug: 'kitchencraft-essentials', categorySlug: 'kitchen', subcategory: 'Cookware' };

  if (n.includes('watch') || n.includes('chronograph')) return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Watches' };
  if (n.includes('backpack') || n.includes('wallet')) return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Wallets' };
  if (n.includes('bag') || n.includes('sneaker') || n.includes('shoe') || n.includes('apparel') || n.includes('jacket')) return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Bags' };

  if (n.includes('yoga') || n.includes('mat')) return { vendorSlug: 'fitmotion-sports', categorySlug: 'fitness', subcategory: 'Yoga' };
  if (n.includes('fitness') || n.includes('dumbbell') || n.includes('gym') || n.includes('tracker')) return { vendorSlug: 'fitmotion-sports', categorySlug: 'fitness', subcategory: 'Gym Equipment' };

  if (n.includes('water bottle') || n.includes('eco bottle')) return { vendorSlug: 'greenleaf-lifestyle', categorySlug: 'eco-lifestyle', subcategory: 'Sustainable Products' };
  if (n.includes('serum') || n.includes('bamboo') || n.includes('organic')) return { vendorSlug: 'greenleaf-lifestyle', categorySlug: 'eco-lifestyle', subcategory: 'Sustainable Products' };

  return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Accessories' };
}

const productAdjectives = ['Ultra', 'Pro', 'Aero', 'Nordic', 'Ergonomic', 'Signature', 'Wireless', 'Smart', 'Organic', 'Handmade', 'Titanium', 'Precision', 'Elite', 'Eco'];
const productNouns = ['Headphones', 'Chronograph Watch', 'Desk Lamp', 'Sneakers', 'Espresso Machine', 'Backpack', 'Gaming Keyboard', 'Mechanical Mouse', 'Ceramic Mug', 'Fitness Tracker', 'Lounge Chair', 'Serum Essence', 'Water Bottle', 'Wireless Charger'];

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma');
    console.log('[Seed] Connected! Clearing existing data...');

    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
      Wishlist.deleteMany({}),
    ]);

    // 1. Create Admin User
    console.log('[Seed] Creating Admin & Customers...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminEmail = 'admin@venma.com'.toLowerCase().trim();
    let admin = await User.findOne({ email: adminEmail }).select('+password');
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
        address: {
          street: '184 B Block, Sector 14, Hiran Magri',
          city: 'Udaipur',
          state: 'Rajasthan',
          zipCode: '313002',
          country: 'India',
        },
      });
    } else {
      admin.role = 'admin';
      admin.password = 'password123';
      await admin.save();
    }

    // 2. Create 100 Customers (buyer@venma.com as primary demo customer)
    const buyerEmail = 'buyer@venma.com'.toLowerCase().trim();
    let demoBuyer = await User.findOne({ email: buyerEmail }).select('+password');
    if (!demoBuyer) {
      demoBuyer = await User.create({
        name: 'Demo Buyer',
        email: buyerEmail,
        password: 'password123',
        role: 'customer',
        phone: '+91 9812345678',
        address: {
          street: '12 MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India',
        },
      });
    } else {
      demoBuyer.password = 'password123';
      demoBuyer.role = 'customer';
      await demoBuyer.save();
    }

    const customerDocs = [];
    for (let i = 2; i <= 100; i++) {
      const email = `customer${i}@example.com`.toLowerCase().trim();
      const exists = await User.exists({ email });
      if (!exists) {
        customerDocs.push({
          name: `Customer ${i}`,
          email,
          password: hashedPassword,
          role: 'customer',
          phone: `+91 98${(20000000 + i * 137).toString().slice(0, 8)}`,
          address: {
            street: `${100 + i} Mahatma Gandhi Road`,
            city: i % 3 === 0 ? 'Bengaluru' : i % 3 === 1 ? 'Mumbai' : 'Delhi',
            state: i % 3 === 0 ? 'Karnataka' : i % 3 === 1 ? 'Maharashtra' : 'Delhi',
            zipCode: `${560001 + (i % 50)}`,
            country: 'India',
          },
        });
      }
    }
    if (customerDocs.length > 0) {
      await User.insertMany(customerDocs);
    }

    // 3. Create Genuine Marketplace Vendors
    console.log('[Seed] Creating Genuine Marketplace Vendors...');
    const createdVendors = [];
    const vendorMapBySlug = {};

    for (let i = 0; i < vendorSeeds.length; i++) {
      const vData = vendorSeeds[i];
      const vendorEmail = (i === 0 ? 'vendor@venma.com' : vData.email).toLowerCase().trim();
      let vendorUser = await User.findOne({ email: vendorEmail }).select('+password');
      if (!vendorUser) {
        vendorUser = await User.create({
          name: `${vData.storeName} Owner`,
          email: vendorEmail,
          password: 'password123',
          role: 'vendor',
          address: vData.address,
        });
      } else {
        vendorUser.role = 'vendor';
        vendorUser.password = 'password123';
        await vendorUser.save();
      }

      const vendor = await Vendor.create({
        user: vendorUser._id,
        storeName: vData.storeName,
        storeSlug: vData.storeSlug,
        description: vData.desc,
        specialty: vData.specialty,
        logo: vData.logo,
        banner: vData.banner,
        phone: vData.phone,
        location: vData.location,
        address: vData.address,
        rating: vData.rating,
        numReviews: vData.numReviews,
        status: 'approved',
        balance: 1420.5 + i * 250,
        totalRevenue: 8400.0 + i * 950,
        categoriesSold: [],
        totalProducts: 0,
        bankDetails: {
          accountHolder: vData.storeName,
          accountNumber: '**** **** 8829',
          routingNumber: 'HDFC0001234',
          bankName: i % 3 === 0 ? 'HDFC Bank' : i % 3 === 1 ? 'State Bank of India' : 'ICICI Bank',
        },
      });
      createdVendors.push(vendor);
      vendorMapBySlug[vData.storeSlug] = vendor;
    }

    // 4. Create Standard Categories
    console.log('[Seed] Creating Standard Marketplace Categories...');
    const categoryDocs = categoriesData.map((c) => ({
      ...c,
      slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));
    const createdCategories = await Category.insertMany(categoryDocs);
    const categoryMapBySlug = {};
    createdCategories.forEach((c) => {
      categoryMapBySlug[c.slug] = c;
    });

    // 5. Create 200 Products with Consistent Vendor & Category Specialization
    console.log('[Seed] Creating 200 Products with realistic attributes...');
    const productDocs = [];
    const vendorProductCounts = {};
    const vendorCategoriesSold = {};
    vendorSeeds.forEach((v) => {
      vendorProductCounts[v.storeSlug] = 0;
      vendorCategoriesSold[v.storeSlug] = new Set();
    });

    for (let i = 1; i <= 200; i++) {
      const adj = productAdjectives[i % productAdjectives.length];
      const noun = productNouns[i % productNouns.length];
      const productName = `${adj} ${noun} Series ${i}`;
      const classification = classifyProduct(productName);
      const vendor = vendorMapBySlug[classification.vendorSlug];
      const category = categoryMapBySlug[classification.categorySlug];

      const basePrice = Math.floor(25 + (i * 7) % 350) + 0.99;
      const hasDiscount = i % 3 === 0;
      const discountPrice = hasDiscount ? Math.round(basePrice * 0.82) - 0.01 : 0;

      let dir = 'electronics';
      let imgSlug = 'wireless-headphones';
      if (/watch/i.test(noun)) { dir = 'accessories'; imgSlug = 'chronograph-watch'; }
      else if (/lamp/i.test(noun)) { dir = 'home-decor'; imgSlug = 'desk-lamp'; }
      else if (/sneaker/i.test(noun)) { dir = 'fashion'; imgSlug = 'minimalist-sneakers'; }
      else if (/espresso/i.test(noun)) { dir = 'kitchen'; imgSlug = 'espresso-machine'; }
      else if (/backpack/i.test(noun)) { dir = 'fashion'; imgSlug = 'commute-backpack'; }
      else if (/keyboard/i.test(noun)) { dir = 'gaming'; imgSlug = 'gaming-keyboard'; }
      else if (/mouse/i.test(noun)) { dir = 'gaming'; imgSlug = 'mechanical-mouse'; }
      else if (/mug/i.test(noun)) { dir = 'kitchen'; imgSlug = 'ceramic-mug'; }
      else if (/fitness/i.test(noun)) { dir = 'sports'; imgSlug = 'fitness-tracker'; }
      else if (/chair/i.test(noun)) { dir = 'home-living'; imgSlug = 'lounge-chair'; }
      else if (/serum/i.test(noun)) { dir = 'beauty'; imgSlug = 'serum-essence'; }
      else if (/water/i.test(noun)) { dir = 'sports'; imgSlug = 'water-bottle'; }
      else if (/charger/i.test(noun)) { dir = 'electronics'; imgSlug = 'wireless-charger'; }

      const chargingImages = [
        'magsafe-wireless-charger.webp',
        'three-in-one-charging-station.webp',
        '65w-gan-wall-charger.webp',
        '100w-gan-fast-charger.webp',
        'transparent-usb-c-charger.webp',
        'adjustable-wireless-stand.webp',
        'walnut-wireless-charging-pad.webp',
        'solar-power-bank-charger.webp',
        'magnetic-car-charger.webp',
        'usb-c-hub-dock.webp',
        'braided-fast-charging-cable.webp',
        'gaming-rgb-charging-dock.webp',
        'minimalist-cube-usb-charger.webp',
      ];
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
      const fileSlug = `${adj.toLowerCase()}-${noun.toLowerCase().replace(/\s+/g, '-')}-series-${i}`;
      let mainImg = `/generated-products/${dir}/${fileSlug}.webp`;
      if (/charger/i.test(noun)) {
        mainImg = `/generated-products/electronics/${chargingImages[i % chargingImages.length]}`;
      } else if (/lamp/i.test(noun)) {
        mainImg = `/generated-products/home-living/lighting/${lightingImages[i % lightingImages.length]}`;
      }

      if (!require('fs').existsSync(path.join(__dirname, '../client/public', mainImg))) continue;

      productDocs.push({
        name: productName,
        slug: `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
        description: `Engineered for excellence, the ${productName} by ${vendor.storeName} delivers unmatched performance and aesthetic sophistication. Built with premium materials to guarantee longevity and daily satisfaction.`,
        category: category._id,
        subcategory: classification.subcategory,
        vendor: vendor._id,
        price: basePrice,
        discountPrice,
        stock: 15 + (i * 3) % 85,
        sku: `MH-${category.slug.slice(0, 3).toUpperCase()}-${1000 + i}`,
        brand: vendor.storeName.split(' ')[0],
        images: [mainImg, mainImg, mainImg],
        thumbnail: mainImg,
        imageValid: true,
        specifications: [
          { key: 'Material', value: 'High-grade Aluminum & Eco-composite' },
          { key: 'Warranty', value: '2-Year Manufacturer Warranty' },
          { key: 'Origin', value: `Crafted & Inspected in ${vendor.location || 'India'}` },
          { key: 'Weight', value: `${(0.4 + (i % 10) * 0.2).toFixed(1)} kg` },
        ],
        rating: Number((4.0 + ((i * 3) % 10) * 0.1).toFixed(1)),
        numReviews: 4 + (i % 25),
        featured: i % 8 === 0,
        isPublished: true,
        tags: [category.name.toLowerCase(), classification.subcategory.toLowerCase(), adj.toLowerCase(), 'bestseller'],
      });

      vendorProductCounts[classification.vendorSlug]++;
      vendorCategoriesSold[classification.vendorSlug].add(category.name);
    }

    const createdProducts = await Product.insertMany(productDocs);

    // Update vendor totalProducts & categoriesSold
    for (const v of createdVendors) {
      v.totalProducts = vendorProductCounts[v.storeSlug] || 0;
      v.categoriesSold = Array.from(vendorCategoriesSold[v.storeSlug] || []);
      await v.save();
    }

    // 6. Create 400 Reviews
    console.log('[Seed] Creating 400 Product Reviews...');
    const reviewComments = [
      'Exceeded all my expectations! Build quality is remarkably high.',
      'Super fast shipping from VENMA. Seamless unboxing experience.',
      'Great value for money. Looks even sleeker in person than in photos.',
      'Solid performance, will definitely buy again from this vendor!',
      'Five stars! Customer service was also very responsive.',
      'Works like a charm. Very clean design and premium textures.',
    ];
    const reviewDocs = [];
    for (let i = 0; i < 400; i++) {
      const product = createdProducts[i % createdProducts.length];
      const customer = createdCustomers[i % createdCustomers.length];
      reviewDocs.push({
        product: product._id,
        customer: customer._id,
        rating: 4 + (i % 2),
        title: i % 2 === 0 ? 'Outstanding Experience' : 'Top Tier Quality',
        comment: reviewComments[i % reviewComments.length],
        verifiedPurchase: true,
      });
    }
    await Review.insertMany(reviewDocs);

    // 7. Create Promotional Coupons
    console.log('[Seed] Creating Promotional Coupons...');
    await Coupon.insertMany([
      {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 50,
        validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 30,
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'FLASH50',
        discountType: 'fixed',
        discountValue: 50,
        minPurchase: 200,
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);

    // 8. Create 250 Orders
    console.log('[Seed] Creating 250 Orders...');
    const orderStatuses = ['delivered', 'delivered', 'shipped', 'processing', 'pending'];
    const paymentMethods = ['stripe', 'cod', 'stripe'];
    const orderDocs = [];

    for (let i = 1; i <= 250; i++) {
      const customer = createdCustomers[i % createdCustomers.length];
      const prod1 = createdProducts[(i * 3) % createdProducts.length];
      const prod2 = createdProducts[(i * 5 + 1) % createdProducts.length];
      const status = orderStatuses[i % orderStatuses.length];
      const payMethod = paymentMethods[i % paymentMethods.length];

      const p1Price = prod1.discountPrice > 0 ? prod1.discountPrice : prod1.price;
      const p2Price = prod2.discountPrice > 0 ? prod2.discountPrice : prod2.price;
      const subtotal = Number((p1Price * 1 + p2Price * 2).toFixed(2));
      const tax = Number((subtotal * 0.08).toFixed(2));
      const shippingFee = subtotal > 100 ? 0 : 9.99;
      const totalAmount = Number((subtotal + tax + shippingFee).toFixed(2));

      orderDocs.push({
        orderNumber: `MH-${200000 + i}`,
        customer: customer._id,
        items: [
          {
            product: prod1._id,
            vendor: prod1.vendor,
            name: prod1.name,
            image: prod1.images[0],
            price: p1Price,
            quantity: 1,
            status: status === 'delivered' ? 'delivered' : 'shipped',
          },
          {
            product: prod2._id,
            vendor: prod2.vendor,
            name: prod2.name,
            image: prod2.images[0],
            price: p2Price,
            quantity: 2,
            status: status === 'delivered' ? 'delivered' : 'pending',
          },
        ],
        shippingAddress: {
          name: customer.name,
          street: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          zipCode: customer.address.zipCode,
          country: customer.address.country,
          phone: customer.phone,
        },
        paymentMethod: payMethod,
        isPaid: payMethod === 'stripe' || status === 'delivered',
        paidAt: payMethod === 'stripe' || status === 'delivered' ? new Date(Date.now() - (250 - i) * 3600000) : null,
        subtotal,
        tax,
        shippingFee,
        discount: 0,
        totalAmount,
        orderStatus: status,
        createdAt: new Date(Date.now() - (250 - i) * 3600000 * 2),
        trackingTimeline: [
          { status: 'Order Placed', note: 'Customer initiated order', timestamp: new Date(Date.now() - 48 * 3600000) },
          { status: 'Processing', note: 'Order packaged by vendor', timestamp: new Date(Date.now() - 24 * 3600000) },
          { status: status.toUpperCase(), note: `Carrier transit update: ${status}`, timestamp: new Date() },
        ],
      });
    }
    await Order.insertMany(orderDocs);
    await require('../server/scripts/reduceMarketplaceCatalog').cleanup();

    console.log('--------------------------------------------------');
    console.log('✨ [SEED COMPLETED SUCCESSFULLY!]');
    console.log(`- 1 Admin: admin@venma.com / password123`);
    console.log(`- 1 Demo Vendor: vendor@venma.com / password123 (TechNova Electronics)`);
    console.log(`- 1 Demo Buyer: buyer@venma.com / password123`);
    console.log(`- 7 Genuine Specialized Vendors Seeded`);
    console.log(`- 10 Standard Categories Seeded`);
    console.log(`- 10 Products Seeded with specialized vendors & subcategories`);
    console.log(`- 100 Customers Seeded`);
    console.log(`- 250 Orders Seeded`);
    console.log(`- 400 Reviews Seeded`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seed();
