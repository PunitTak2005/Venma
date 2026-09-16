const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

async function verify() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma');
    console.log('Connected to DB');

    const vendors = await Vendor.find({});
    console.log(`\n=== VENDORS COUNT: ${vendors.length} ===`);
    for (const v of vendors) {
      const prods = await Product.find({ vendor: v._id }).populate('category');
      const catNames = [...new Set(prods.map((p) => p.category?.name))];
      const subcats = [...new Set(prods.map((p) => p.subcategory))];
      console.log(`\nVendor: ${v.storeName}`);
      console.log(`  Specialty: ${v.specialty}`);
      console.log(`  Logo: ${v.logo}`);
      console.log(`  Products Count: ${prods.length} (Stored totalProducts: ${v.totalProducts})`);
      console.log(`  Categories Sold: ${catNames.join(', ')}`);
      console.log(`  Subcategories: ${subcats.join(', ')}`);
    }

    const unassigned = await Product.countDocuments({
      $or: [
        { vendor: null },
        { category: null },
        { subcategory: { $in: ['', null] } },
      ],
    });
    console.log(`\n=== UNASSIGNED OR INCOMPLETE PRODUCTS: ${unassigned} ===`);

    const totalProducts = await Product.countDocuments({});
    console.log(`=== TOTAL PRODUCTS IN DB: ${totalProducts} ===\n`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verify();
