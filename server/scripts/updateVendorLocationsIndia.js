const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const vendorLocationUpdates = [
  {
    storeSlug: 'technova-electronics',
    storeName: 'TechNova Electronics',
    location: 'Bengaluru, Karnataka',
    address: {
      street: '104 Koramangala 4th Block, 80 Feet Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560034',
    },
    phone: '+91 80 4123 4567',
  },
  {
    storeSlug: 'fitmotion-sports',
    storeName: 'FitMotion Sports',
    location: 'Mumbai, Maharashtra',
    address: {
      street: '76 Linking Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400050',
    },
    phone: '+91 22 2673 8900',
  },
  {
    storeSlug: 'brewcraft-coffee',
    storeName: 'BrewCraft Coffee',
    location: 'Coorg, Karnataka',
    address: {
      street: '14 Coffee Plantation Trail, Kushalnagar',
      city: 'Coorg',
      state: 'Karnataka',
      country: 'India',
      zipCode: '571234',
    },
    phone: '+91 8272 256789',
    specialty: 'Specialty Coffee Beans & Barista Gear',
    desc: 'Artisan single-origin coffees, precision pour-over brewers, espresso tools, and roasting equipment sourced directly from Coorg estates.',
  },
  {
    storeSlug: 'kitchencraft-essentials',
    storeName: 'KitchenCraft Essentials',
    location: 'Coorg, Karnataka',
    address: {
      street: '28 Estate Road, Madikeri Hill View',
      city: 'Coorg',
      state: 'Karnataka',
      country: 'India',
      zipCode: '571201',
    },
    phone: '+91 8272 234567',
  },
  {
    storeSlug: 'glowleaf-skincare',
    storeName: 'GlowLeaf Skincare',
    location: 'Jaipur, Rajasthan',
    address: {
      street: '51 C-Scheme Botanical Avenue',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302001',
    },
    phone: '+91 141 4567891',
    specialty: 'Ayurvedic & Botanical Organic Skincare',
    desc: 'Organic Ayurvedic botanical skincare serums, herbal cleansers, and cold-pressed facial elixirs formulated with regal heritage recipes.',
  },
  {
    storeSlug: 'greenleaf-lifestyle',
    storeName: 'GreenLeaf Lifestyle',
    location: 'Jaipur, Rajasthan',
    address: {
      street: '22 Johari Bazaar Heritage Row, Pink City',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '302003',
    },
    phone: '+91 141 2367890',
  },
  {
    storeSlug: 'urbanstride',
    storeName: 'UrbanStride',
    location: 'Delhi, Delhi',
    address: {
      street: '18 Connaught Place, Inner Circle',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      zipCode: '110001',
    },
    phone: '+91 11 4152 7890',
    specialty: 'Urban Footwear & Streetwear Fashion',
    desc: 'Contemporary urban footwear, lifestyle apparel, and modern city accessories designed for movement.',
  },
  {
    storeSlug: 'urban-living-co',
    storeName: 'Urban Living Co.',
    location: 'Delhi, Delhi',
    address: {
      street: '42 Hauz Khas Village, Designer Lane',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      zipCode: '110016',
    },
    phone: '+91 11 2654 3210',
  },
  {
    storeSlug: 'chronolux',
    storeName: 'ChronoLux',
    location: 'Surat, Gujarat',
    address: {
      street: '88 Diamond Bourse Boulevard, Khajod',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      zipCode: '395007',
    },
    phone: '+91 261 2891234',
    specialty: 'Luxury Chronographs & Precision Timepieces',
    desc: 'Master handcrafted luxury timepieces, precision automatic movements, and high-jewelry timepieces crafted for horology connoisseurs.',
  },
  {
    storeSlug: 'luxewear',
    storeName: 'LuxeWear',
    location: 'Surat, Gujarat',
    address: {
      street: '12 Ring Road Textile Tower, Diamond Park',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      zipCode: '395002',
    },
    phone: '+91 261 2456789',
  },
  {
    storeSlug: 'autoshine-garage',
    storeName: 'AutoShine Garage',
    location: 'Pune, Maharashtra',
    address: {
      street: '19 Senapati Bapat Road, Auto Hub Precinct',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '411016',
    },
    phone: '+91 20 2567 8901',
  },
  {
    storeSlug: 'elite-workspace',
    storeName: 'Elite Workspace',
    location: 'Hyderabad, Telangana',
    address: {
      street: '72 Financial District, Nanakramguda',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      zipCode: '500032',
    },
    phone: '+91 40 4455 6677',
    specialty: 'Executive Office Desks & Ergonomics',
    desc: 'Executive workspace systems, motorized standing desks, bespoke ergonomic task chairs, and premium modular office fixtures.',
  },
  {
    storeSlug: 'oak-steel-workspace',
    storeName: 'Oak & Steel Workspace',
    location: 'Hyderabad, Telangana',
    address: {
      street: '55 HITEC City Main Road, Cyber Pearl Precinct',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      zipCode: '500081',
    },
    phone: '+91 40 6789 0123',
  },
  {
    storeSlug: 'occasion-events',
    storeName: 'Occasion Events',
    location: 'Udaipur, Rajasthan',
    address: {
      street: '34 City Palace Road, Old Heritage Quarter',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      zipCode: '313001',
    },
    phone: '+91 294 242 1234',
    specialty: 'Heritage Event Decor & Royal Gifts',
    desc: 'Luxury royal wedding favors, heritage event decor, ceremonial gift hampers, and artisanal celebration accessories.',
  },
  {
    storeSlug: 'qezmora-education',
    storeName: 'Qezmora Education',
    location: 'Indore, Madhya Pradesh',
    address: {
      street: '62 Vijay Nagar Main Square, Tech Ed Arcade',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      zipCode: '452010',
    },
    phone: '+91 731 254 3210',
    specialty: 'STEM Learning Kits & Academic Resources',
    desc: 'Comprehensive educational kits, STEM learning modules, robotics development boards, and academic reference sets.',
  },
];

async function updateAll() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/markethub');
    console.log('Connected! Updating all vendor locations...');

    for (const v of vendorLocationUpdates) {
      let existingVendor = await Vendor.findOne({
        $or: [{ storeSlug: v.storeSlug }, { storeName: v.storeName }],
      });

      if (existingVendor) {
        existingVendor.location = v.location;
        existingVendor.address = {
          street: v.address.street,
          city: v.address.city,
          state: v.address.state,
          country: v.address.country,
          zipCode: v.address.zipCode,
        };
        if (v.phone) existingVendor.phone = v.phone;
        await existingVendor.save();
        console.log(`Updated existing vendor: ${existingVendor.storeName} -> ${existingVendor.location}`);

        // Also update the associated user if exists
        if (existingVendor.user) {
          await User.findByIdAndUpdate(existingVendor.user, {
            phone: v.phone,
            address: existingVendor.address,
          });
        }
      } else {
        // Create vendor and user if missing
        console.log(`Creating vendor: ${v.storeName}...`);
        const hashedPassword = await bcrypt.hash('password123', 10);
        const email = `${v.storeSlug.replace(/-/g, '')}@markethub.com`;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: `${v.storeName} Owner`,
            email,
            password: hashedPassword,
            role: 'vendor',
            phone: v.phone,
            address: v.address,
          });
        }

        const newVendor = await Vendor.create({
          user: user._id,
          storeName: v.storeName,
          storeSlug: v.storeSlug,
          description: v.desc || `${v.storeName} offers premier Indian retail products and services.`,
          specialty: v.specialty || 'General Goods & Services',
          logo: `/generated-vendors/${v.storeSlug}-logo.webp`,
          banner: `/generated-vendors/${v.storeSlug}-banner.webp`,
          phone: v.phone,
          location: v.location,
          address: v.address,
          rating: 4.8,
          numReviews: 45,
          status: 'approved',
          balance: 2500,
          totalRevenue: 15000,
          categoriesSold: [],
          totalProducts: 0,
          bankDetails: {
            accountHolder: v.storeName,
            accountNumber: '**** **** 9821',
            routingNumber: 'HDFC0001234',
            bankName: 'HDFC Bank',
          },
        });
        console.log(`Created new vendor: ${newVendor.storeName} -> ${newVendor.location}`);
      }
    }

    // Also update any product Origin specifications
    console.log('Updating product origin specifications...');
    const allVendors = await Vendor.find();
    for (const vendor of allVendors) {
      await Product.updateMany(
        { vendor: vendor._id, 'specifications.key': 'Origin' },
        {
          $set: {
            'specifications.$.value': `Crafted & Inspected in ${vendor.location || 'India'}`,
          },
        }
      );
    }

    // Update customer addresses to India
    await User.updateMany(
      { role: 'customer', 'address.country': { $ne: 'India' } },
      {
        $set: {
          'address.country': 'India',
          'address.city': 'Bengaluru',
          'address.state': 'Karnataka',
          'address.zipCode': '560001',
        },
      }
    );

    console.log('Successfully completed vendor locations update!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating vendor locations:', err);
    process.exit(1);
  }
}

updateAll();
