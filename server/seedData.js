const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Coupon = require('./models/Coupon');
const Wishlist = require('./models/Wishlist');
const PlatformSettings = require('./models/PlatformSettings');

const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Cpu',
    description: 'Smart gadgets, computers, audio, charging accessories, and personal devices',
    banner: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Office Furniture',
    slug: 'office-furniture',
    icon: 'Briefcase',
    description: 'Ergonomic chairs, executive desks, and commercial workspace furniture',
    banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Workspace Accessories',
    slug: 'workspace-accessories',
    icon: 'Layers',
    description: 'Desk organizers, monitor stands, docking stations, and productivity accessories',
    banner: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    icon: 'Home',
    description: 'Artisan furniture, modern lighting, geometric rugs, and living room accessories',
    banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Kitchen',
    slug: 'kitchen',
    icon: 'Utensils',
    description: 'Espresso machines, culinary cookware, ceramic mugs, and dining accessories',
    banner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Luxury chronographs, leather wallets, everyday backpacks, and designer sneakers',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Eco Lifestyle',
    slug: 'eco-lifestyle',
    icon: 'Trees',
    description: 'Sustainable water bottles, botanical serum essences, and wellness products',
    banner: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Sports',
    slug: 'sports',
    icon: 'Dumbbell',
    description: 'Strength training, adjustable dumbbells, fitness gear, and athletic accessories',
    banner: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    icon: 'Sparkles',
    description: 'Ayurvedic botanical skincare, revitalizing facial serums, organic moisturizers, and natural wellness',
    banner: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Books',
    slug: 'books',
    icon: 'BookOpen',
    description: 'Artisanal leather journals, academic references, calligraphy stationery, and literature',
    banner: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Toys & Learning',
    slug: 'toys',
    icon: 'Brain',
    description: 'STEM robotics kits, Montessori wooden math boards, scientific experiment labs, and educational toys',
    banner: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Office',
    slug: 'office',
    icon: 'Briefcase',
    description: 'Executive motorized standing desks, high-back ergonomic mesh chairs, and premium workstations',
    banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    icon: 'Car',
    description: 'Premium car care products, ceramic coatings, detailing essentials, and vehicle maintenance accessories',
    banner: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
];

const vendorSeeds = [
  {
    storeName: 'TechNova Electronics',
    storeSlug: 'technova-electronics',
    email: 'technova@markethub.com',
    desc: 'Sells electronics, computer accessories, gadgets, smart devices, charging accessories, audio products, keyboards, mice, monitors, webcams, USB hubs, and desk tech.',
    specialty: 'Electronics & Smart Tech',
    logo: '/generated-vendors/technova-electronics-logo.webp',
    banner: '/generated-vendors/technova-electronics-banner.webp',
    rating: 4.9,
    numReviews: 142,
    phone: '+91 80 4567 8901',
    address: {
      street: '104 Tech Boulevard, Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560103',
    },
    location: 'Bengaluru, Karnataka',
  },
  {
    storeName: 'FitMotion Sports',
    storeSlug: 'fitmotion-sports',
    email: 'fitmotion@markethub.com',
    desc: 'Sells fitness equipment, yoga accessories, sports gear, gym products, and outdoor fitness items.',
    specialty: 'Fitness Equipment & Gym Gear',
    logo: '/generated-vendors/fitmotion-sports-logo.webp',
    banner: '/generated-vendors/fitmotion-sports-banner.webp',
    rating: 4.8,
    numReviews: 76,
    phone: '+91 22 6123 4567',
    address: {
      street: 'Plot C-59, G Block, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400051',
    },
    location: 'Mumbai, Maharashtra',
  },
  // NOTE: BrewCraft Coffee removed — vendor had 0 products and was permanently deleted.
  {
    storeName: 'GlowLeaf Skincare',
    storeSlug: 'glowleaf-skincare',
    email: 'glowleaf@markethub.com',
    desc: 'Pure organic botanical skincare, revitalizing serums, herbal wellness products, and cruelty-free cosmetics.',
    specialty: 'Botanical Skincare & Wellness',
    logo: '/generated-vendors/greenleaf-lifestyle-logo.webp',
    banner: '/generated-vendors/greenleaf-lifestyle-banner.webp',
    rating: 4.9,
    numReviews: 108,
    phone: '+91 14 1237 8899',
    address: {
      street: 'MI Road, C-Scheme',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302001',
    },
    location: 'Jaipur, Rajasthan',
  },
  // NOTE: UrbanStride removed — vendor had 0 products and was permanently deleted.
  {
    storeName: 'ChronoLux',
    storeSlug: 'chronolux',
    email: 'chronolux@markethub.com',
    desc: 'High-precision chronographs, handcrafted luxury timepieces, designer leather straps, and horology accessories.',
    specialty: 'Luxury Watches & Horology',
    logo: '/generated-vendors/luxewear-logo.webp',
    banner: '/generated-vendors/luxewear-banner.webp',
    rating: 4.9,
    numReviews: 132,
    phone: '+91 26 1288 7766',
    address: {
      street: 'Diamond Bourse Road, Ring Road',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      zipCode: '395007',
    },
    location: 'Surat, Gujarat',
  },
  {
    storeName: 'AutoShine Garage',
    storeSlug: 'autoshine-garage',
    email: 'autoshine@markethub.com',
    desc: 'AutoShine Garage specializes in premium automotive care products, detailing essentials, cleaning solutions, ceramic coatings, and vehicle maintenance accessories.',
    specialty: 'Premium Car Care & Auto Accessories',
    logo: '/generated-vendors/autoshine-garage-logo.webp',
    banner: '/generated-vendors/autoshine-garage-banner.webp',
    rating: 4.8,
    numReviews: 124,
    phone: '+91 20 2567 8900',
    address: {
      street: 'Senapati Bapat Road, Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '411016',
    },
    location: 'Pune, Maharashtra',
  },
  // NOTE: Elite Workspace removed — vendor had 0 products and was permanently deleted.
  {
    storeName: 'Occasion Events',
    storeSlug: 'occasion-events',
    email: 'occasionevents@markethub.com',
    desc: 'Curated luxury celebrations, heritage decor, royal wedding themes, bespoke invitations, and gifting solutions.',
    specialty: 'Royal Event Decor & Gifting',
    logo: '/generated-vendors/technova-electronics-logo.webp',
    banner: '/generated-vendors/technova-electronics-banner.webp',
    rating: 4.9,
    numReviews: 68,
    phone: '+91 29 4248 1122',
    address: {
      street: '184 B Block, Sector 14, Hiran Magri',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '313002',
    },
    location: 'Udaipur, Rajasthan',
  },
  {
    storeName: 'Qezmora Education',
    storeSlug: 'qezmora-education',
    email: 'qezmora@markethub.com',
    desc: 'Educational STEM kits, robotics modules, student laboratory gear, stationery, and creative learning supplies.',
    specialty: 'Education & STEM Learning Kits',
    logo: '/generated-vendors/technova-electronics-logo.webp',
    banner: '/generated-vendors/technova-electronics-banner.webp',
    rating: 4.8,
    numReviews: 54,
    phone: '+91 73 1400 3344',
    address: {
      street: 'Vijay Nagar Square, AB Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      zipCode: '452001',
    },
    location: 'Indore, Madhya Pradesh',
  },
  {
    storeName: 'Urban Living Co.',
    storeSlug: 'urban-living-co',
    email: 'urbanliving@markethub.com',
    desc: 'Sells home décor, furniture, storage, lighting, organizers, mirrors, wall décor, and living room accessories.',
    specialty: 'Home Décor & Living Room Essentials',
    logo: '/generated-vendors/urban-living-co-logo.webp',
    banner: '/generated-vendors/urban-living-co-banner.webp',
    rating: 4.8,
    numReviews: 98,
    phone: '+91 11 4150 9977',
    address: {
      street: 'Connaught Place, Inner Circle',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      zipCode: '110001',
    },
    location: 'Delhi, Delhi',
  },
  {
    storeName: 'Oak & Steel Workspace',
    storeSlug: 'oak-steel-workspace',
    email: 'oaksteel@markethub.com',
    desc: 'Sells office furniture, ergonomic chairs, desks, desk organizers, monitor stands, workspace accessories, and productivity furniture.',
    specialty: 'Office Furniture & Productivity Workspace',
    logo: '/generated-vendors/oak-steel-workspace-logo.webp',
    banner: '/generated-vendors/oak-steel-workspace-banner.webp',
    rating: 4.9,
    numReviews: 120,
    phone: '+91 40 2311 5588',
    address: {
      street: 'Mindspace IT Park, Hitec City',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      zipCode: '500081',
    },
    location: 'Hyderabad, Telangana',
  },
  {
    storeName: 'KitchenCraft Essentials',
    storeSlug: 'kitchencraft-essentials',
    email: 'kitchencraft@markethub.com',
    desc: 'Sells kitchen appliances, cookware, dining products, coffee accessories, and food preparation tools.',
    specialty: 'Kitchen Appliances & Cookware',
    logo: '/generated-vendors/kitchencraft-essentials-logo.webp',
    banner: '/generated-vendors/kitchencraft-essentials-banner.webp',
    rating: 4.8,
    numReviews: 84,
    phone: '+91 82 7222 3499',
    address: {
      street: 'Madikeri Estate Road',
      city: 'Coorg',
      state: 'Karnataka',
      country: 'India',
      zipCode: '571201',
    },
    location: 'Coorg, Karnataka',
  },
  {
    storeName: 'LuxeWear',
    storeSlug: 'luxewear',
    email: 'luxewear@markethub.com',
    desc: 'Sells clothing, shoes, bags, wallets, watches, and fashion accessories.',
    specialty: 'Apparel, Bags, Watches & Fashion',
    logo: '/generated-vendors/luxewear-logo.webp',
    banner: '/generated-vendors/luxewear-banner.webp',
    rating: 4.8,
    numReviews: 110,
    phone: '+91 26 1288 7755',
    address: {
      street: 'Diamond Bourse Road, Ring Road',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      zipCode: '395007',
    },
    location: 'Surat, Gujarat',
  },
  {
    storeName: 'GreenLeaf Lifestyle',
    storeSlug: 'greenleaf-lifestyle',
    email: 'greenleaf@markethub.com',
    desc: 'Sells eco-friendly products, sustainable home items, bamboo products, reusable products, and wellness accessories.',
    specialty: 'Eco-Friendly & Sustainable Living',
    logo: '/generated-vendors/greenleaf-lifestyle-logo.webp',
    banner: '/generated-vendors/greenleaf-lifestyle-banner.webp',
    rating: 4.9,
    numReviews: 89,
    phone: '+91 14 1237 8877',
    address: {
      street: 'MI Road, C-Scheme',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302001',
    },
    location: 'Jaipur, Rajasthan',
  },
];

function classifyProduct(name) {
  const n = name.toLowerCase();
  if (n.includes('wax') || n.includes('ceramic') || n.includes('car') || n.includes('automotive') || n.includes('detailing')) {
    return { vendorSlug: 'autoshine-garage', categorySlug: 'automotive' };
  }
  if (n.includes('dumbbell')) return { vendorSlug: 'fitmotion-sports', categorySlug: 'sports' };
  if (n.includes('headphone')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics' };
  if (n.includes('keyboard') || n.includes('mouse')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics' };
  if (n.includes('charger') || n.includes('charging')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics' };
  if (n.includes('robotics') || n.includes('webcam') || n.includes('usb') || n.includes('hub')) return { vendorSlug: 'technova-electronics', categorySlug: 'electronics' };

  if (n.includes('chair') || n.includes('desk') && !n.includes('lamp') && !n.includes('organizer')) return { vendorSlug: 'oak-steel-workspace', categorySlug: 'office-furniture' };
  if (n.includes('desk organizer') || n.includes('dock') || n.includes('monitor stand') || n.includes('desk shelf')) return { vendorSlug: 'oak-steel-workspace', categorySlug: 'workspace-accessories' };

  if (n.includes('lamp') || n.includes('lighting')) return { vendorSlug: 'urban-living-co', categorySlug: 'home-living' };
  if (n.includes('rug') || n.includes('vase') || n.includes('montessori') || n.includes('decor') || n.includes('art')) return { vendorSlug: 'urban-living-co', categorySlug: 'home-living' };
  if (n.includes('storage') || n.includes('shelf') || n.includes('shelves')) return { vendorSlug: 'urban-living-co', categorySlug: 'home-living' };

  if (n.includes('espresso') || n.includes('kettle') || n.includes('coffee')) return { vendorSlug: 'kitchencraft-essentials', categorySlug: 'kitchen' };
  if (n.includes('mug') || n.includes('cookware') || n.includes('knife') || n.includes('pot')) return { vendorSlug: 'kitchencraft-essentials', categorySlug: 'kitchen' };

  if (n.includes('watch') || n.includes('chronograph')) return { vendorSlug: 'luxewear', categorySlug: 'fashion' };
  if (n.includes('backpack') || n.includes('wallet')) return { vendorSlug: 'luxewear', categorySlug: 'fashion' };
  if (n.includes('bag') || n.includes('sneaker') || n.includes('shoe') || n.includes('apparel') || n.includes('jacket')) return { vendorSlug: 'luxewear', categorySlug: 'fashion' };

  if (n.includes('yoga') || n.includes('mat')) return { vendorSlug: 'fitmotion-sports', categorySlug: 'sports' };
  if (n.includes('fitness') || n.includes('dumbbell') || n.includes('gym') || n.includes('tracker')) return { vendorSlug: 'fitmotion-sports', categorySlug: 'sports' };

  if (n.includes('water bottle') || n.includes('eco bottle')) return { vendorSlug: 'greenleaf-lifestyle', categorySlug: 'eco-lifestyle' };
  if (n.includes('serum') || n.includes('bamboo') || n.includes('organic')) return { vendorSlug: 'greenleaf-lifestyle', categorySlug: 'eco-lifestyle' };

  return { vendorSlug: 'technova-electronics', categorySlug: 'electronics' };
}

const productAdjectives = ['Ultra', 'Pro', 'Aero', 'Nordic', 'Ergonomic', 'Signature', 'Wireless', 'Smart', 'Organic', 'Handmade', 'Titanium', 'Precision', 'Elite', 'Eco'];
const productNouns = ['Headphones', 'Chronograph Watch', 'Desk Lamp', 'Sneakers', 'Espresso Machine', 'Backpack', 'Gaming Keyboard', 'Mechanical Mouse', 'Ceramic Mug', 'Fitness Tracker', 'Lounge Chair', 'Serum Essence', 'Water Bottle', 'Wireless Charger'];

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/markethub');
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

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@venma.com',
      password: hashedPassword,
      role: 'admin',
      address: {
        street: '184 B Block, Sector 14, Hiran Magri',
        city: 'Udaipur',
        state: 'Rajasthan',
        zipCode: '313002',
        country: 'India',
      },
    });

    // 2. Create 100 Customers
    const customerDocs = [];
    for (let i = 1; i <= 100; i++) {
      customerDocs.push({
        name: `Customer ${i}`,
        email: i === 1 ? 'buyer@venma.com' : `customer${i}@example.com`,
        password: hashedPassword,
        role: 'customer',
        phone: `+91 98${String(10000000 + i).slice(0, 8)}`,
        address: {
          street: `${100 + i} M.G. Road`,
          city: i % 3 === 0 ? 'Bengaluru' : i % 3 === 1 ? 'Mumbai' : 'Delhi',
          state: i % 3 === 0 ? 'Karnataka' : i % 3 === 1 ? 'Maharashtra' : 'Delhi',
          zipCode: `${560001 + (i % 50)}`,
          country: 'India',
        },
      });
    }
    const createdCustomers = await User.insertMany(customerDocs);

    // 3. Create Genuine Marketplace Vendors
    console.log('[Seed] Creating Genuine Marketplace Vendors with Indian Cities...');
    const createdVendors = [];
    const vendorMapBySlug = {};

    for (let i = 0; i < vendorSeeds.length; i++) {
      const vData = vendorSeeds[i];
      const vendorUser = await User.create({
        name: `${vData.storeName} Owner`,
        email: i === 0 ? 'vendor@venma.com' : vData.email,
        password: hashedPassword,
        role: 'vendor',
        address: vData.address,
      });

      const vendor = await Vendor.create({
        user: vendorUser._id,
        storeName: vData.storeName,
        storeSlug: vData.storeSlug,
        description: vData.desc,
        specialty: vData.specialty,
        logo: vData.logo,
        banner: vData.banner,
        phone: vData.phone,
        address: vData.address,
        location: vData.location || `${vData.address.city}, ${vData.address.state}`,
        rating: vData.rating,
        numReviews: vData.numReviews,
        status: 'approved',
        balance: 1420.5 + i * 250,
        totalRevenue: 8400.0 + i * 950,
        categoriesSold: [],
        totalProducts: 0,
        bankDetails: {
          accountHolder: vData.storeName,
          accountNumber: '**** **** ' + (8820 + i),
          routingNumber: 'HDFC000' + (1000 + i),
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

      // Skip if vendor or category not found — prevents _id crash
      if (!vendor || !category) continue;

      const inrBaseMap = {
        'electronics': 4999,
        'office-furniture': 8999,
        'workspace-accessories': 2499,
        'home-living': 7999,
        'kitchen': 1999,
        'fashion': 3499,
        'sports': 4999,
        'automotive': 4999,
        'eco-lifestyle': 1499,
      };
      const basePrice = inrBaseMap[classification.categorySlug] || 1999;
      const hasDiscount = i % 3 === 0;
      const discountPrice = hasDiscount ? Math.round(basePrice * 0.8) : 0;

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
        tags: [category.name.toLowerCase(), adj.toLowerCase(), 'bestseller'],
      });

      vendorProductCounts[classification.vendorSlug]++;
      vendorCategoriesSold[classification.vendorSlug].add(category.name);
    }

    // Explicit Product 1: Ceramic Car Wax -> AutoShine Garage
    const autoShineVendor = vendorMapBySlug['autoshine-garage'];
    const automotiveCategory = categoryMapBySlug['automotive'];
    if (autoShineVendor && automotiveCategory) {
      productDocs.push({
        name: 'Ceramic Car Wax',
        slug: 'ceramic-car-wax',
        description: 'Advanced hydrophobic ceramic car wax delivering deep gloss, UV protection, and intense water beading for up to 6 months of showroom shine.',
        category: automotiveCategory._id,
        vendor: autoShineVendor._id,
        price: 4999,
        discountPrice: 0,
        stock: 96,
        sku: 'MH-AUT-1099',
        brand: 'AutoShine',
        images: [
          '/generated-products/automotive/ceramic-car-wax-main.webp',
          '/generated-products/automotive/ceramic-car-wax-garage.webp',
          '/generated-products/automotive/ceramic-car-wax-detail.webp',
        ],
        thumbnail: '/generated-products/automotive/ceramic-car-wax-main.webp',
        imageValid: true,
        specifications: [
          { key: 'Volume', value: '473 ml (16 fl oz)' },
          { key: 'Finish', value: 'Ultra-Glossy Ceramic Coating' },
          { key: 'Protection Duration', value: 'Up to 6 Months' },
          { key: 'Application', value: 'Hand Wipe or Dual Action Buffer' },
        ],
        rating: 4.8,
        numReviews: 124,
        featured: true,
        isPublished: true,
        tags: ['automotive', 'car wax', 'ceramic coating', 'detailing', 'bestseller'],
      });
      vendorProductCounts['autoshine-garage'] = (vendorProductCounts['autoshine-garage'] || 0) + 1;
      vendorCategoriesSold['autoshine-garage'].add(automotiveCategory.name);
    }

    // Explicit Product 2: Smart Adjustable Dumbbell Set -> FitMotion Sports
    const fitMotionVendor = vendorMapBySlug['fitmotion-sports'];
    const sportsCategory = categoryMapBySlug['sports'] || categoryMapBySlug['fitness'];
    if (fitMotionVendor && sportsCategory) {
      productDocs.push({
        name: 'Smart Adjustable Dumbbell Set',
        slug: 'smart-adjustable-dumbbell-set',
        description: 'Rapid-switch adjustable dumbbells featuring compact selector dials from 5 to 52.5 lbs per dumbbell. Built with durable cast-iron plates and textured ergonomic grip.',
        category: sportsCategory._id,
        vendor: fitMotionVendor._id,
        price: 14999,
        discountPrice: 12499,
        stock: 45,
        sku: 'FM-DMB-SMART-01',
        brand: 'FitMotion',
        images: [
          '/generated-products/sports/smart-adjustable-dumbbell-set-main.webp',
          '/generated-products/sports/smart-adjustable-dumbbell-set-side.webp',
          '/generated-products/sports/smart-adjustable-dumbbell-set-detail.webp',
          '/generated-products/sports/smart-adjustable-dumbbell-set-5-52-5-lbs.webp',
        ],
        thumbnail: '/generated-products/sports/smart-adjustable-dumbbell-set-main.webp',
        imageValid: true,
        specifications: [
          { key: 'Weight Range', value: '5 to 52.5 lbs (2.3 to 24 kg)' },
          { key: 'Adjustment System', value: 'Quick-Turn Selector Dial' },
          { key: 'Plate Material', value: 'Heavy-Duty Coated Cast Iron' },
          { key: 'Warranty', value: '2-Year Full Coverage' },
        ],
        rating: 4.9,
        numReviews: 88,
        featured: true,
        isPublished: true,
        tags: ['fitness', 'dumbbell', 'gym', 'sports', 'bestseller'],
      });
      vendorProductCounts['fitmotion-sports'] = (vendorProductCounts['fitmotion-sports'] || 0) + 1;
      vendorCategoriesSold['fitmotion-sports'].add(sportsCategory.name);
    }

    // Auto-seed category-appropriate products for any vendors that currently have 0 products
    const { vendorProductBlueprints } = require('./scripts/seedMissingProducts');
    for (const v of createdVendors) {
      if ((vendorProductCounts[v.storeSlug] || 0) === 0) {
        const blueprints = vendorProductBlueprints[v.storeSlug];
        if (blueprints && blueprints.length > 0) {
          for (let bpIdx = 0; bpIdx < blueprints.length; bpIdx++) {
            const bp = blueprints[bpIdx];
            const targetCategory = categoryMapBySlug[bp.categorySlug] || createdCategories[0];
            const specs = [...(bp.specifications || [])];
            if (!specs.some((s) => s.key === 'Origin')) {
              specs.push({
                key: 'Origin',
                value: `Crafted & Inspected in ${v.location || 'India'}`,
              });
            }
            productDocs.push({
              name: bp.name,
              slug: `${bp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${bpIdx}`,
              description: bp.description,
              category: targetCategory._id,
              vendor: v._id,
              price: bp.price,
              discountPrice: bp.discountPrice || 0,
              stock: bp.stock || 30,
              sku: bp.sku || `MH-${targetCategory.slug.slice(0, 3).toUpperCase()}-${2000 + bpIdx}`,
              brand: bp.brand || v.storeName.split(' ')[0],
              images: bp.images,
              thumbnail: bp.images[0],
              imageValid: true,
              specifications: specs,
              rating: bp.rating || 4.8,
              numReviews: bp.numReviews || 25,
              featured: !!bp.featured,
              isPublished: true,
              tags: bp.tags || [targetCategory.name.toLowerCase(), 'bestseller'],
            });
            vendorProductCounts[v.storeSlug] = (vendorProductCounts[v.storeSlug] || 0) + 1;
            vendorCategoriesSold[v.storeSlug].add(targetCategory.name);
          }
        }
      }
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
      const subtotal = Math.round(p1Price * 1 + p2Price * 2);
      const tax = Math.round(subtotal * 0.18);
      const shippingFee = subtotal > 999 ? 0 : 99;
      const totalAmount = Math.round(subtotal + tax + shippingFee);

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
    await require('./scripts/reduceMarketplaceCatalog').cleanup();

    await PlatformSettings.findOneAndUpdate(
      {},
      {
        platformName: 'VENMA',
        legalEntity: 'VENMA Multi-Vendor Marketplace Inc.',
        tagline: 'Buy. Sell. Grow Together.',
        officialAddress: {
          street: '184 B Block, Sector 14, Hiran Magri',
          city: 'Udaipur',
          state: 'Rajasthan',
          country: 'India',
          formatted: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
          googleMapsUrl:
            'https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India',
          embedMapUrl:
            'https://maps.google.com/maps?q=184+B+Block,+Sector+14,+Hiran+Magri,+Udaipur,+Rajasthan,+India&t=&z=15&ie=UTF8&iwloc=&output=embed',
        },
        contact: {
          supportEmail: 'support@markethub.com',
          helpline: '+91 6367088841',
          businessHours: 'Mon - Sat (9:00 AM - 7:00 PM IST)',
        },
      },
      { upsert: true, new: true }
    );

    console.log('--------------------------------------------------');
    console.log('✨ [SEED COMPLETED SUCCESSFULLY!]');
    console.log(`- 1 Admin:       admin@venma.com  / password123`);
    console.log(`- 1 Demo Vendor: vendor@venma.com / password123 (TechNova Electronics)`);
    console.log(`- 1 Demo Buyer:  buyer@venma.com  / password123`);
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
