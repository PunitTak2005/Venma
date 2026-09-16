/**
 * VENMA — Remove Zero-Product Vendors
 *
 * Strategy:
 *  • Vendors with 0 products AND 0 orders → permanently deleted
 *  • Vendors with 0 products BUT with order history → set status='suspended'
 *    so they are excluded from all public listings while preserving referential
 *    integrity for existing order records.
 *
 * Safe to delete (no orders):
 *   - BrewCraft Coffee
 *   - UrbanStride
 *   - Elite Workspace
 *
 * Hidden from listings (have orders):
 *   - GlowLeaf Skincare
 *   - ChronoLux
 *   - Occasion Events
 *   - Qezmora Education
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Vendor      = require('../models/Vendor');
const Product     = require('../models/Product');
const Order       = require('../models/Order');
const VendorFollow = require('../models/VendorFollow');

// Try to load optional Wishlist model
let Wishlist;
try { Wishlist = require('../models/Wishlist'); } catch (_) { Wishlist = null; }

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/markethub';
  console.log('\n=== VENMA — Zero-Product Vendor Cleanup ===\n');
  console.log(`Connecting to: ${mongoUri}`);
  await mongoose.connect(mongoUri);
  console.log('Connected.\n');

  const vendors = await Vendor.find().lean();
  console.log(`Auditing ${vendors.length} vendor(s)...\n`);

  const toDelete   = []; // 0 products, 0 orders
  const toSuspend  = []; // 0 products, has orders

  for (const v of vendors) {
    const productCount = await Product.countDocuments({ vendor: v._id });
    if (productCount > 0) continue; // has products — leave untouched

    const orderCount = await Order.countDocuments({ 'items.vendor': v._id });
    if (orderCount > 0) {
      toSuspend.push({ ...v, orderCount });
    } else {
      toDelete.push({ ...v });
    }
  }

  // ── Phase 1: Permanently delete fully orphaned vendors ──────────────────
  if (toDelete.length > 0) {
    console.log(`Phase 1: Permanently deleting ${toDelete.length} orphaned vendor(s)...`);
    for (const v of toDelete) {
      // Remove follow records
      const followResult = await VendorFollow.deleteMany({ vendorId: v._id });

      // Remove vendor user account link (set vendor role back to 'buyer' if needed)
      // Note: We delete only the Vendor document; the User account is kept.
      const vendorDoc = await Vendor.findByIdAndDelete(v._id);

      console.log(
        `  ✓ Deleted: ${v.storeName} (${v.storeSlug})` +
        `  follows removed: ${followResult.deletedCount}`
      );
    }
  } else {
    console.log('Phase 1: No fully orphaned vendors to delete.\n');
  }

  // ── Phase 2: Suspend vendors with order history ─────────────────────────
  if (toSuspend.length > 0) {
    console.log(`\nPhase 2: Suspending ${toSuspend.length} vendor(s) with order history...`);
    for (const v of toSuspend) {
      await Vendor.findByIdAndUpdate(v._id, {
        status: 'suspended',
        totalProducts: 0,
      });
      console.log(
        `  ⚠ Suspended: ${v.storeName} (${v.storeSlug})  [${v.orderCount} orders preserved]`
      );
    }
  } else {
    console.log('Phase 2: No vendors with order history to suspend.\n');
  }

  // ── Phase 3: Recalculate totalProducts for all remaining vendors ─────────
  console.log('\nPhase 3: Recalculating totalProducts for active vendors...');
  const activeVendors = await Vendor.find({ status: 'approved' });
  let statsUpdated = 0;
  for (const v of activeVendors) {
    const count = await Product.countDocuments({ vendor: v._id, imageValid: true });
    await Vendor.findByIdAndUpdate(v._id, { totalProducts: count });
    statsUpdated++;
  }
  console.log(`  Updated totalProducts for ${statsUpdated} active vendor(s).`);

  // ── Summary ──────────────────────────────────────────────────────────────
  const remainingTotal    = await Vendor.countDocuments();
  const remainingApproved = await Vendor.countDocuments({ status: 'approved' });
  const remainingSuspended = await Vendor.countDocuments({ status: 'suspended' });

  console.log('\n=== Cleanup Summary ===');
  console.log(`  Vendors deleted:   ${toDelete.length}`);
  console.log(`  Vendors suspended: ${toSuspend.length}`);
  console.log(`  Active (approved): ${remainingApproved}`);
  console.log(`  Suspended:         ${remainingSuspended}`);
  console.log(`  Total in DB:       ${remainingTotal}`);
  console.log('\nDone.\n');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
