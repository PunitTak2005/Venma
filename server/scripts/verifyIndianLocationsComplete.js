const http = require('http');
const mongoose = require('mongoose');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== VENMA INDIAN VENDOR LOCATIONS VERIFICATION ===\n');

  // 1. Check MongoDB directly
  console.log('[1/4] Checking MongoDB Database Records...');
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');
  const Vendor = require('../models/Vendor');
  const Product = require('../models/Product');

  const vendors = await Vendor.find().select('storeName storeSlug location address phone');
  console.log(`Found ${vendors.length} vendors in database.`);

  const foreignMatches = vendors.filter(
    (v) =>
      v.address?.country !== 'India' ||
      v.address?.city === 'San Jose' ||
      v.address?.city === 'Seattle' ||
      v.address?.city === 'Brooklyn' ||
      v.address?.city === 'New York' ||
      v.address?.city === 'Boulder' ||
      v.address?.city === 'Portland' ||
      v.address?.city === 'Grand Rapids'
  );

  if (foreignMatches.length > 0) {
    console.error('FAIL: Found foreign placeholder locations in MongoDB:', foreignMatches);
    process.exit(1);
  } else {
    console.log('PASS: Zero foreign placeholder locations found in MongoDB.');
  }

  // Verify each prompt vendor location
  const required = [
    { name: 'TechNova Electronics', location: 'Bengaluru, Karnataka' },
    { name: 'FitMotion Sports', location: 'Mumbai, Maharashtra' },
    { name: 'BrewCraft Coffee', location: 'Coorg, Karnataka' },
    { name: 'GlowLeaf Skincare', location: 'Jaipur, Rajasthan' },
    { name: 'UrbanStride', location: 'Delhi, Delhi' },
    { name: 'ChronoLux', location: 'Surat, Gujarat' },
    { name: 'AutoShine Garage', location: 'Pune, Maharashtra' },
    { name: 'Elite Workspace', location: 'Hyderabad, Telangana' },
    { name: 'Occasion Events', location: 'Udaipur, Rajasthan' },
    { name: 'Qezmora Education', location: 'Indore, Madhya Pradesh' },
  ];

  for (const item of required) {
    const v = vendors.find((vend) => vend.storeName === item.name);
    if (!v) {
      console.error(`FAIL: Vendor not found in DB: ${item.name}`);
      process.exit(1);
    }
    if (v.location !== item.location) {
      console.error(`FAIL: Vendor ${item.name} has location "${v.location}", expected "${item.location}"`);
      process.exit(1);
    }
    console.log(`  ✓ ${item.name.padEnd(25)} -> ${v.location} (PIN: ${v.address?.zipCode}, Phone: ${v.phone})`);
  }

  // 2. Check API /api/vendors
  console.log('\n[2/4] Testing /api/vendors Public Endpoint...');
  const vendorsApi = await fetchJson('http://localhost:9006/api/vendors');
  if (!vendorsApi.success || !Array.isArray(vendorsApi.data)) {
    console.error('FAIL: /api/vendors failed to return data array');
    process.exit(1);
  }
  console.log(`PASS: /api/vendors returned ${vendorsApi.data.length} active approved vendors.`);

  // 3. Check City Search Queries
  console.log('\n[3/4] Testing City Search Queries across Backend...');
  const testSearches = [
    { query: 'Bengaluru', expected: 'TechNova Electronics' },
    { query: 'Mumbai', expected: 'FitMotion Sports' },
    { query: 'Coorg', expected: 'BrewCraft Coffee' },
    { query: 'Jaipur', expected: 'GlowLeaf Skincare' },
    { query: 'Delhi', expected: 'UrbanStride' },
    { query: 'Surat', expected: 'ChronoLux' },
    { query: 'Pune', expected: 'AutoShine Garage' },
    { query: 'Hyderabad', expected: 'Elite Workspace' },
    { query: 'Udaipur', expected: 'Occasion Events' },
    { query: 'Indore', expected: 'Qezmora Education' },
  ];

  for (const s of testSearches) {
    const res = await fetchJson(`http://localhost:9006/api/vendors?search=${encodeURIComponent(s.query)}`);
    const found = res.data.some((v) => v.storeName === s.expected);
    if (!found) {
      console.error(`FAIL: Search for "${s.query}" did not find "${s.expected}"`);
      process.exit(1);
    }
    console.log(`  ✓ Search "${s.query.padEnd(10)}" successfully returned "${s.expected}"`);
  }

  // Check Autocomplete Suggestions
  console.log('\n[4/4] Testing /api/public/search-suggestions for Cities...');
  const sugBengaluru = await fetchJson('http://localhost:9006/api/public/search-suggestions?q=Bengaluru');
  const hasTechNova = sugBengaluru.vendors?.some((v) => v.storeName === 'TechNova Electronics');
  if (!hasTechNova) {
    console.error('FAIL: Search suggestions for "Bengaluru" did not suggest TechNova Electronics');
    process.exit(1);
  }
  console.log('  ✓ Suggestions for "Bengaluru" returned TechNova Electronics with location:', sugBengaluru.vendors[0].location);

  const sugPune = await fetchJson('http://localhost:9006/api/public/search-suggestions?q=Pune');
  const hasAutoShine = sugPune.vendors?.some((v) => v.storeName === 'AutoShine Garage');
  if (!hasAutoShine) {
    console.error('FAIL: Search suggestions for "Pune" did not suggest AutoShine Garage');
    process.exit(1);
  }
  console.log('  ✓ Suggestions for "Pune" returned AutoShine Garage with location:', sugPune.vendors[0].location);

  // Check product populate
  const prodRes = await fetchJson('http://localhost:9006/api/products?limit=1');
  const sampleProd = prodRes.data[0];
  if (sampleProd?.vendor?.location) {
    console.log(`  ✓ Product vendor population includes location: "${sampleProd.vendor.location}"`);
  } else {
    console.log('  ! Note: sample product has vendor without direct location string');
  }

  console.log('\n======================================================');
  console.log('✨ ALL 4/4 INDIAN VENDOR LOCATIONS AUDIT CHECKS PASSED!');
  console.log('======================================================');
  process.exit(0);
}

verifyAll().catch((err) => {
  console.error('Audit script error:', err);
  process.exit(1);
});
