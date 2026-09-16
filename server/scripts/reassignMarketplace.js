const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// 1. Genuine Vendors Specifications
const genuineVendorsData = [
  {
    storeName: 'TechNova Electronics',
    storeSlug: 'technova-electronics',
    email: 'technova@venma.com',
    desc: 'Sells electronics, computer accessories, gadgets, smart devices, charging accessories, audio products, keyboards, mice, monitors, webcams, USB hubs, and desk tech.',
    specialty: 'Electronics & Smart Devices',
    logo: 'https://images.openai.com/static-rsc-4/0vZwJNpmDZLVf-RXPA0v3NCWXBzYrF8Wl56z0zNM21KQkW-gN9mPTOabSjYsicXyWTOi2Okz9l4oNIk865zcwH5ZfoW-ns66w-KbndBl-g0KoE8BUCEOFx6TC19_DaIkjX47PSyENaTpuqaQ4QYUzEIu8lrgISoypjEjPkEx1_w?purpose=inline',
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
    logo: 'https://images.openai.com/static-rsc-4/eh5AFfIYVH0nMXJ7BOAwee5L88FHTlLYxtZKr5Y7R_BF8FeGMoLyVAnLezkFAA32kEQZoKrEpLz14v5Uz4w68rfwyy1UpM1zSCJDds2vjVBQM_1y6vr0ylN-VseYcAL9hQyWFC5FklRCj68o3w8Xj4iO77GlzjWzZ8JSHKicV_Y?purpose=inline',
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
  {
    storeName: 'Oak & Steel Workspace',
    storeSlug: 'oak-steel-workspace',
    email: 'oaksteel@venma.com',
    desc: 'Sells office furniture, ergonomic chairs, desks, desk organizers, monitor stands, workspace accessories, and productivity furniture.',
    specialty: 'Office Furniture & Productivity Workspace',
    logo: 'https://images.openai.com/static-rsc-4/7TXLnrDs3yea-zR6jcTFom6GsfVfdNd3Prn0B1xOLnyw0PQ1BQYSdtfrTn8AwdCmC5-Xx6XL2dJEYVaBNW2LXzIA3RbSr40b9666XI0TAZVFFx-HEd9WnqMGAFzzTLs81CJsPtxv_DAdac0YIc3jaXpoacW-Ywu1tLLxIHmn7Hc?purpose=inline',
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
  {
    storeName: 'KitchenCraft Essentials',
    storeSlug: 'kitchencraft-essentials',
    email: 'kitchencraft@venma.com',
    desc: 'Sells kitchen appliances, cookware, dining products, coffee accessories, and food preparation tools.',
    specialty: 'Kitchen Appliances & Cookware',
    logo: 'https://images.openai.com/static-rsc-4/OdnIjp78Sfkmz99VC96JYX8sNnlfJXYKDgL5zbM8vZ4FH4oLZ0xykxtjXS_iE2WgAg1nroatMZcvhawfpH0kkgmpO_jxeRrPg6xZ8OaojbNOpoR0gCG30aU5WfE9P9nmigsXUiwOVEgEX39nUJwAT__V2P6GWnbBlnP2fzem5r0?purpose=inline',
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
  {
    storeName: 'LuxeWear',
    storeSlug: 'luxewear',
    email: 'luxewear@venma.com',
    desc: 'Sells clothing, shoes, bags, wallets, watches, and fashion accessories.',
    specialty: 'Apparel, Bags, Watches & Fashion',
    logo: 'https://images.openai.com/static-rsc-4/hjQzFjV6aqbW5TXi35qWfrNEJ-J4P_HSvcV0f5bVVSKPUF8rVCsdTuYk-A9zYiCiq259fpxsDXTqlTgltClVgY4yayHZKaweYdwoAm3-imMeoy0opwbAa9ApdSW1KnDOJ5S6NDYykADJkKXAIwlW_vBWJSDMpqrOqm1bgp263FE?purpose=inline',
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
    storeName: 'FitMotion Sports',
    storeSlug: 'fitmotion-sports',
    email: 'fitmotion@venma.com',
    desc: 'Sells fitness equipment, yoga accessories, sports gear, gym products, and outdoor fitness items.',
    specialty: 'Fitness Equipment & Gym Gear',
    logo: 'https://images.openai.com/static-rsc-4/FwhojJmlV5VbnyraqCqRht4MpLvmdKKkw7r-92gGuQihRCIbOyGdPoAKIZezQrO7xs4L75BCWT-fflWAMOOIGpDzNoqshp_BxxtkuCAnALwhUMFulZXSl470oGUtfgxJjqA6xYflt2nQdavPEgG0g1u_YywLdphjhrPhPtyR6vk?purpose=inline',
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
    logo: 'https://images.openai.com/static-rsc-4/5_Fx7j9KE42RzHbD_7fW0Wwy3aRt6-5GrTCar67clwAVWk0_o_iutuRXfV3Oz5BQtZu4jCR5W8K7v7TGyncO1M5awh9bpodRht0qtLVqRaD_W7ECs9DA3IqtI0IbkiO7vrWufPFKF7tg1uTdnDi6FG0e0CO9d2oMUsr6Um5mFWg?purpose=inline',
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
];

// 2. Standard Marketplace Categories
const standardizedCategories = [
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

// Helper to match a product to vendor, category, and subcategory
function classifyProduct(name) {
  const n = name.toLowerCase();

  // 1. TechNova Electronics
  if (n.includes('headphone')) {
    return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Audio' };
  }
  if (n.includes('keyboard')) {
    return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Accessories' };
  }
  if (n.includes('mouse')) {
    return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Accessories' };
  }
  if (n.includes('charger') || n.includes('charging')) {
    return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Charging' };
  }
  if (n.includes('robotics') || n.includes('webcam') || n.includes('usb') || n.includes('hub')) {
    return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Smart Devices' };
  }

  // 2. Oak & Steel Workspace
  if (n.includes('chair') || n.includes('desk') && !n.includes('lamp') && !n.includes('organizer')) {
    return { vendorSlug: 'oak-steel-workspace', categorySlug: 'office-furniture', subcategory: 'Chairs' };
  }
  if (n.includes('desk organizer') || n.includes('dock') || n.includes('monitor stand') || n.includes('desk shelf')) {
    return { vendorSlug: 'oak-steel-workspace', categorySlug: 'workspace-accessories', subcategory: 'Organizers' };
  }

  // 3. Urban Living Co.
  if (n.includes('lamp') || n.includes('lighting')) {
    return { vendorSlug: 'urban-living-co', categorySlug: 'home-living', subcategory: 'Lighting' };
  }
  if (n.includes('rug') || n.includes('vase') || n.includes('montessori') || n.includes('decor') || n.includes('art')) {
    return { vendorSlug: 'urban-living-co', categorySlug: 'home-living', subcategory: 'Decor' };
  }
  if (n.includes('storage') || n.includes('shelf') || n.includes('shelves')) {
    return { vendorSlug: 'urban-living-co', categorySlug: 'home-living', subcategory: 'Storage' };
  }

  // 4. KitchenCraft Essentials
  if (n.includes('espresso') || n.includes('kettle') || n.includes('coffee')) {
    return { vendorSlug: 'kitchencraft-essentials', categorySlug: 'kitchen', subcategory: 'Appliances' };
  }
  if (n.includes('mug') || n.includes('cookware') || n.includes('knife') || n.includes('pot')) {
    return { vendorSlug: 'kitchencraft-essentials', categorySlug: 'kitchen', subcategory: 'Cookware' };
  }

  // 5. LuxeWear
  if (n.includes('watch') || n.includes('chronograph')) {
    return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Watches' };
  }
  if (n.includes('backpack') || n.includes('wallet')) {
    return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Wallets' };
  }
  if (n.includes('bag')) {
    return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Bags' };
  }
  if (n.includes('sneaker') || n.includes('shoe') || n.includes('apparel') || n.includes('jacket')) {
    return { vendorSlug: 'luxewear', categorySlug: 'fashion', subcategory: 'Bags' };
  }

  // 6. FitMotion Sports
  if (n.includes('yoga') || n.includes('mat')) {
    return { vendorSlug: 'fitmotion-sports', categorySlug: 'fitness', subcategory: 'Yoga' };
  }
  if (n.includes('fitness') || n.includes('dumbbell') || n.includes('gym') || n.includes('tracker')) {
    return { vendorSlug: 'fitmotion-sports', categorySlug: 'fitness', subcategory: 'Gym Equipment' };
  }

  // 7. GreenLeaf Lifestyle
  if (n.includes('water bottle') || n.includes('eco bottle')) {
    return { vendorSlug: 'greenleaf-lifestyle', categorySlug: 'eco-lifestyle', subcategory: 'Sustainable Products' };
  }
  if (n.includes('serum') || n.includes('bamboo') || n.includes('organic')) {
    return { vendorSlug: 'greenleaf-lifestyle', categorySlug: 'eco-lifestyle', subcategory: 'Sustainable Products' };
  }

  // Fallback defaults
  return { vendorSlug: 'technova-electronics', categorySlug: 'electronics', subcategory: 'Accessories' };
}

async function run() {
  try {
    console.log('[Migration] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma');
    console.log('[Migration] Connected.');

    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    // 1. Setup Standard Categories
    console.log('[Migration] Upserting standardized categories...');
    const categoryMap = {};
    for (const catData of standardizedCategories) {
      let cat = await Category.findOne({ slug: catData.slug });
      if (!cat) {
        cat = await Category.create(catData);
      } else {
        cat.name = catData.name;
        cat.icon = catData.icon;
        cat.description = catData.desc || catData.description;
        cat.banner = catData.banner;
        cat.subcategories = catData.subcategories;
        cat.featured = catData.featured;
        await cat.save();
      }
      categoryMap[cat.slug] = cat;
    }

    // 2. Setup Genuine Marketplace Vendors and their Users
    console.log('[Migration] Upserting genuine marketplace vendors...');
    const vendorMap = {};
    for (let idx = 0; idx < genuineVendorsData.length; idx++) {
      const vData = genuineVendorsData[idx];

      // Find or create user
      let user = await User.findOne({ email: vData.email });
      if (!user && idx === 0) {
        // Also check if primary demo vendor exists
        user = await User.findOne({ email: 'vendor@venma.com' });
      }

      if (!user) {
        user = await User.create({
          name: `${vData.storeName} Owner`,
          email: vData.email,
          password: defaultPasswordHash,
          role: 'vendor',
          address: vData.address,
        });
      } else {
        user.name = `${vData.storeName} Owner`;
        await user.save();
      }

      // Upsert Vendor profile
      let vendor = await Vendor.findOne({ storeSlug: vData.storeSlug });
      if (!vendor) {
        vendor = await Vendor.findOne({ user: user._id });
      }

      if (!vendor) {
        vendor = await Vendor.create({
          user: user._id,
          storeName: vData.storeName,
          storeSlug: vData.storeSlug,
          description: vData.desc,
          specialty: vData.specialty,
          logo: vData.logo,
          banner: vData.banner,
          phone: vData.phone,
          address: vData.address,
          rating: vData.rating,
          numReviews: vData.numReviews,
          status: 'approved',
          categoriesSold: [],
          totalProducts: 0,
        });
      } else {
        vendor.user = user._id;
        vendor.storeName = vData.storeName;
        vendor.storeSlug = vData.storeSlug;
        vendor.description = vData.desc;
        vendor.specialty = vData.specialty;
        vendor.logo = vData.logo;
        vendor.banner = vData.banner;
        vendor.phone = vData.phone;
        vendor.address = vData.address;
        vendor.rating = vData.rating;
        vendor.numReviews = vData.numReviews;
        vendor.status = 'approved';
        await vendor.save();
      }
      vendorMap[vData.storeSlug] = vendor;
    }

    // Identify genuine vendor IDs
    const genuineSlugs = genuineVendorsData.map((v) => v.storeSlug);
    const genuineVendorIds = Object.values(vendorMap).map((v) => v._id.toString());
    const oldVendors = await Vendor.find({ _id: { $nin: genuineVendorIds } });
    console.log(`[Migration] Found ${oldVendors.length} other vendor records in database.`);

    // 3. Reassign every Product in the Database
    console.log('[Migration] Reassigning products to genuine vendors and correct categories...');
    const allProducts = await Product.find({});
    console.log(`[Migration] Total products in database to process: ${allProducts.length}`);

    const vendorProductCounts = {};
    const vendorCategoriesSold = {};
    genuineSlugs.forEach((s) => {
      vendorProductCounts[s] = 0;
      vendorCategoriesSold[s] = new Set();
    });

    for (const prod of allProducts) {
      const classification = classifyProduct(prod.name);
      const targetVendor = vendorMap[classification.vendorSlug];
      const targetCategory = categoryMap[classification.categorySlug];

      if (!targetVendor || !targetCategory) {
        console.error(`[Migration] Could not find target vendor/category for: ${prod.name}`);
        continue;
      }

      // Strictly preserve all existing IDs, slugs, SKUs, prices, ratings, stock, descriptions, images!
      prod.vendor = targetVendor._id;
      prod.category = targetCategory._id;
      prod.subcategory = classification.subcategory;
      prod.brand = targetVendor.storeName.split(' ')[0];

      await prod.save();

      vendorProductCounts[classification.vendorSlug]++;
      vendorCategoriesSold[classification.vendorSlug].add(targetCategory.name);
    }

    // 4. Update Vendor Total Products & Categories Sold
    console.log('[Migration] Updating vendor product counts and categories sold...');
    for (const vSlug of genuineSlugs) {
      const vendor = vendorMap[vSlug];
      vendor.totalProducts = vendorProductCounts[vSlug];
      vendor.categoriesSold = Array.from(vendorCategoriesSold[vSlug]);
      await vendor.save();
      console.log(`[Migration] ${vendor.storeName}: ${vendor.totalProducts} products across [${vendor.categoriesSold.join(', ')}]`);
    }

    // 5. Clean up old placeholder vendors
    if (oldVendors.length > 0) {
      const oldVendorIds = oldVendors.map((v) => v._id);
      const remainingOld = await Product.countDocuments({ vendor: { $in: oldVendorIds } });
      if (remainingOld === 0) {
        // Update any old orders to point to valid vendor if necessary
        await Vendor.deleteMany({ _id: { $in: oldVendorIds } });
        console.log(`[Migration] Safely removed ${oldVendors.length} placeholder vendors.`);
      }
    }

    console.log('[Migration] Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Migration] Error:', err);
    process.exit(1);
  }
}

run();
