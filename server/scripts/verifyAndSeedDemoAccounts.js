const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const DEMO_ACCOUNTS = [
  {
    name: 'Platform Admin',
    email: 'admin@venma.com',
    role: 'admin',
    address: { street: '184 B Block, Sector 14, Hiran Magri', city: 'Udaipur', state: 'Rajasthan', zipCode: '313002', country: 'India' },
  },
  {
    name: 'TechNova Electronics Owner',
    email: 'vendor@venma.com',
    role: 'vendor',
    address: { street: '104 Tech Boulevard, Outer Ring Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560103', country: 'India' },
  },
  {
    name: 'Demo Buyer',
    email: 'buyer@venma.com',
    role: 'customer',
    address: { street: '12 MG Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India' },
  },
];

async function verifyAndSeed() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not set in environment.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('Connected successfully.\n');

  const demoPassword = 'password123';

  const Vendor = require('../models/Vendor');

  // Check and clean any legacy @markethub.com accounts in DB if any exist
  const legacyMarkethubUsers = await User.find({ email: /@markethub\.com$/i });
  if (legacyMarkethubUsers.length > 0) {
    console.log(`Found ${legacyMarkethubUsers.length} legacy @markethub.com user(s). Migrating to @venma.com...`);
    for (const u of legacyMarkethubUsers) {
      const newEmail = u.email.replace(/@markethub\.com$/i, '@venma.com');
      const existing = await User.findOne({ email: newEmail });
      if (existing) {
        console.log(` - User already exists for ${newEmail}, removing old ${u.email}`);
        await User.deleteOne({ _id: u._id });
      } else {
        console.log(` - Migrating user ${u.email} -> ${newEmail}`);
        u.email = newEmail;
        await u.save();
      }
    }
  } else {
    console.log('✓ Zero @markethub.com user accounts in database.');
  }

  const legacyMarkethubVendors = await Vendor.find({ email: /@markethub\.com$/i });
  if (legacyMarkethubVendors.length > 0) {
    console.log(`Found ${legacyMarkethubVendors.length} legacy @markethub.com vendor(s). Migrating to @venma.com...`);
    for (const v of legacyMarkethubVendors) {
      const newEmail = v.email.replace(/@markethub\.com$/i, '@venma.com');
      console.log(` - Migrating vendor ${v.email} -> ${newEmail}`);
      v.email = newEmail;
      await v.save();
    }
  } else {
    console.log('✓ Zero @markethub.com vendor accounts in database.');
  }

  console.log('\n--- Verifying / Upserting VENMA Demo Accounts ---');
  for (const account of DEMO_ACCOUNTS) {
    let user = await User.findOne({ email: account.email }).select('+password');
    if (!user) {
      console.log(`Creating missing account: ${account.email} (${account.role})...`);
      user = await User.create({
        ...account,
        password: demoPassword,
      });
      console.log(`✓ Created: ${account.email}`);
    } else {
      let updated = false;
      if (user.role !== account.role) {
        user.role = account.role;
        updated = true;
      }
      const isMatch = await user.matchPassword(demoPassword);
      if (!isMatch) {
        console.log(`Updating password for ${account.email}...`);
        user.password = demoPassword;
        updated = true;
      }
      if (updated) {
        await user.save();
        console.log(`✓ Updated / Repaired: ${account.email}`);
      } else {
        console.log(`✓ Verified existing: ${account.email} (role: ${user.role}, password: valid)`);
      }
    }

    // Double check authentication
    const testUser = await User.findOne({ email: account.email }).select('+password');
    const authOk = await testUser.matchPassword(demoPassword);
    console.log(`  Auth check for ${account.email}: ${authOk ? 'SUCCESS (password123 matches)' : 'FAILED'}`);
  }

  console.log('\nAll VENMA production demo credentials verified.\n');
  await mongoose.disconnect();
  process.exit(0);
}

verifyAndSeed().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
