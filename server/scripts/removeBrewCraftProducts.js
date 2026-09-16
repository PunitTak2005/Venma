/**
 * One-time script: Permanently remove 3 specific BrewCraft Coffee products
 * from the VENMA database and clean up all related references.
 *
 * Products removed:
 *  - Ceramic Burr Manual Hand Coffee Grinder           (BC-GRND-BUR-03)
 *  - Precision Hand-Hammered Copper Pour-Over Dripper  (BC-POUR-DRP-02)
 *  - Artisan Single-Origin Coorg Arabica Coffee Beans  (BC-COF-ARA-01)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product  = require('../models/Product');
const Vendor   = require('../models/Vendor');
const Order    = require('../models/Order');

// Try to load optional models gracefully
let Cart, Wishlist, Review;
try { Cart     = require('../models/Cart');     } catch (_) { Cart     = null; }
try { Wishlist = require('../models/Wishlist'); } catch (_) { Wishlist = null; }
try { Review   = require('../models/Review');  } catch (_) { Review   = null; }

const TARGET_SLUGS = [
  'ceramic-burr-manual-hand-coffee-grinder',
  'precision-hand-hammered-copper-pour-over-dripper',
  'artisan-single-origin-coorg-arabica-coffee-beans',
];

const TARGET_SKUS = ['BC-GRND-BUR-03', 'BC-POUR-DRP-02', 'BC-COF-ARA-01'];

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma';
  console.log(`\n=== VENMA — BrewCraft Product Removal Script ===\n`);
  console.log(`Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);
  console.log('Connected.\n');

  // ── 1. Locate the products ────────────────────────────────────────────────
  const products = await Product.find({
    $or: [
      { slug: { $in: TARGET_SLUGS } },
      { sku:  { $in: TARGET_SKUS  } },
    ],
  });

  if (products.length === 0) {
    console.log('No matching products found — they may have already been removed.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${products.length} product(s) to remove:`);
  products.forEach((p) => console.log(`  • [${p.sku}] ${p.name}  (id: ${p._id})`));
  console.log();

  const productIds = products.map((p) => p._id);

  // ── 2. Remove from Cart items (if model exists) ───────────────────────────
  if (Cart) {
    const cartResult = await Cart.updateMany(
      { 'items.product': { $in: productIds } },
      { $pull: { items: { product: { $in: productIds } } } }
    );
    console.log(`Cart cleanup: modified ${cartResult.modifiedCount} cart(s).`);
  }

  // ── 3. Remove from Wishlists (if model exists) ────────────────────────────
  if (Wishlist) {
    const wishResult = await Wishlist.updateMany(
      { products: { $in: productIds } },
      { $pull: { products: { $in: productIds } } }
    );
    console.log(`Wishlist cleanup: modified ${wishResult.modifiedCount} wishlist(s).`);
  }

  // ── 4. Remove reviews for these products (if model exists) ───────────────
  if (Review) {
    const reviewResult = await Review.deleteMany({ product: { $in: productIds } });
    console.log(`Review cleanup: deleted ${reviewResult.deletedCount} review(s).`);
  }

  // ── 5. Delete the products themselves ─────────────────────────────────────
  const deleteResult = await Product.deleteMany({ _id: { $in: productIds } });
  console.log(`Products deleted: ${deleteResult.deletedCount}\n`);

  // ── 6. Recalculate BrewCraft Coffee vendor stats ──────────────────────────
  const vendor = await Vendor.findOne({ storeSlug: 'brewcraft-coffee' });
  if (vendor) {
    const remaining = await Product.countDocuments({ vendor: vendor._id });
    vendor.totalProducts = remaining;
    // Unset featured flag if vendor now has no featured products
    const hasFeatured = await Product.findOne({ vendor: vendor._id, featured: true });
    if (!hasFeatured) {
      vendor.isFeatured = false;
    }
    await vendor.save();
    console.log(`BrewCraft Coffee vendor stats updated — totalProducts: ${remaining}`);
  } else {
    console.log('BrewCraft Coffee vendor record not found — skipping stat update.');
  }

  console.log('\n=== Removal complete. ===\n');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
