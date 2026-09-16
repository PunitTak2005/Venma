const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Category = require('../models/Category');
const Vendor = require('../models/Vendor');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');
const Order = require('../models/Order');

const categoryPlan = [
  { name: 'Electronics', slug: 'electronics', aliases: ['electronics'] },
  { name: 'Fashion', slug: 'fashion', aliases: ['fashion'] },
  { name: 'Home & Living', slug: 'home-living', aliases: ['home-living'] },
  { name: 'Sports', slug: 'sports', aliases: ['sports', 'sports-fitness', 'fitness'] },
  { name: 'Beauty', slug: 'beauty', aliases: ['beauty', 'beauty-wellness', 'eco-lifestyle'] },
  { name: 'Office', slug: 'office', aliases: ['office', 'office-furniture', 'workspace-accessories'] },
  { name: 'Kitchen', slug: 'kitchen', aliases: ['kitchen'] },
  { name: 'Books', slug: 'books', aliases: ['books', 'books-stationery'] },
  { name: 'Automotive', slug: 'automotive', aliases: ['automotive', 'automotive-tools'] },
  { name: 'Toys', slug: 'toys', aliases: ['toys', 'toys-hobbies', 'toys-kids'] },
];

const productPlan = [
  { category: 'automotive', match: /Ceramic Car Wax/i, vendorSlug: 'autoshine-garage', brand: 'AutoShine' },
  { category: 'sports', match: /Smart Adjustable Dumbbell/i, vendorSlug: 'fitmotion-sports', brand: 'FitMotion' },
  { category: 'electronics', match: /Wireless Gaming Keyboard|Headphone/i, vendorSlug: 'technova-electronics', brand: 'TechNova' },
  { category: 'fashion', match: /Nordic Sneakers|Sneakers|Watch/i, vendorSlug: 'luxewear', brand: 'LuxeWear' },
  { category: 'home-living', match: /Desk Lamp|Lounge/i, vendorSlug: 'urban-living-co', brand: 'Urban Living' },
  { category: 'office', match: /Desk|Lounge/i, vendorSlug: 'oak-steel-workspace', brand: 'Oak & Steel' },
  { category: 'kitchen', match: /Ceramic Mug|Espresso/i, vendorSlug: 'kitchencraft-essentials', brand: 'KitchenCraft' },
  { category: 'beauty', match: /Water Bottle|Serum/i, vendorSlug: 'greenleaf-lifestyle', brand: 'GreenLeaf' },
  { category: 'toys', match: /Robotics|Keyboard|Lounge/i, vendorSlug: 'technova-electronics', brand: 'TechNova' },
  {
    category: 'books',
    match: /Journal/i,
    vendorSlug: 'technova-electronics',
    replacement: {
      name: 'Leather Bound Journal',
      slug: 'leather-bound-journal',
      description: 'A premium leather-bound journal for notes, sketches, and daily ideas.',
      image: '/generated-products/books/leather-bound-journal-main.webp',
      images: [
        '/generated-products/books/leather-bound-journal-main.webp',
        '/generated-products/books/leather-bound-journal-lifestyle.webp',
        '/generated-products/books/leather-bound-journal-detail.webp',
      ],
    },
  },
];

async function cleanup() {
  const [categoriesBefore, productsBefore] = await Promise.all([Category.countDocuments(), Product.countDocuments()]);
  const retainedCategories = new Map();

  for (const spec of categoryPlan) {
    let category = await Category.findOne({ slug: { $in: spec.aliases } });
    if (!category) {
      category = await Category.create({
        name: spec.name,
        slug: spec.slug,
        description: `${spec.name} products curated for the VENMA marketplace.`,
        featured: true,
      });
    }
    category.name = spec.name;
    category.slug = spec.slug;
    await category.save();
    retainedCategories.set(spec.slug, category);
  }

  const usedIds = [];
  const retainedProducts = [];
  for (const spec of productPlan) {
    let product = await Product.findOne({ name: spec.match, imageValid: true, _id: { $nin: usedIds } }).sort({ featured: -1, rating: -1, numReviews: -1, createdAt: -1 });
    if (!product) {
      product = await Product.findOne({ imageValid: true, _id: { $nin: usedIds } }).sort({ featured: -1, rating: -1, numReviews: -1, createdAt: -1 });
    }
    if (!product) throw new Error(`No valid product is available for ${spec.category}`);

    product.category = retainedCategories.get(spec.category)._id;
    product.featured = true;

    if (spec.vendorSlug) {
      const v = await Vendor.findOne({ storeSlug: spec.vendorSlug });
      if (v) product.vendor = v._id;
      if (spec.brand) product.brand = spec.brand;
    }

    if (spec.replacement) Object.assign(product, {
      ...spec.replacement,
      thumbnail: spec.replacement.image,
      images: spec.replacement.images || [spec.replacement.image],
      imageValid: true,
    });
    await product.save();
    usedIds.push(product._id);
    retainedProducts.push(product);
  }

  const removedProductIds = (await Product.find({ _id: { $nin: usedIds } }).select('_id').lean()).map(({ _id }) => _id);
  await Promise.all([
    Product.deleteMany({ _id: { $in: removedProductIds } }),
    Wishlist.updateMany({}, { $pull: { products: { $in: removedProductIds } } }),
  ]);

  // Use the final retained-id set so every dependent document is checked, including
  // records created before a previous cleanup run.
  await Review.deleteMany({ product: { $nin: usedIds } });
  const validProductIds = new Set(usedIds.map((id) => id.toString()));
  const orders = await Order.find({});
  let ordersRemoved = 0;
  for (const order of orders) {
    const originalItemCount = order.items.length;
    order.items = order.items.filter((item) => validProductIds.has(item.product.toString()));
    if (order.items.length === originalItemCount) continue;
    if (!order.items.length) {
      await Order.deleteOne({ _id: order._id });
      ordersRemoved += 1;
      continue;
    }
    const subtotal = Math.round(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    order.subtotal = subtotal;
    order.tax = Math.round(subtotal * 0.18);
    order.shippingFee = subtotal > 999 ? 0 : 99;
    order.totalAmount = Math.round(order.subtotal + order.tax + order.shippingFee - (order.discount || 0));
    await order.save();
  }

  await Category.deleteMany({ _id: { $nin: Array.from(retainedCategories.values()).map(({ _id }) => _id) } });
  const vendorCounts = await Product.aggregate([{ $group: { _id: '$vendor', totalProducts: { $sum: 1 } } }]);
  await Vendor.updateMany({}, { $set: { totalProducts: 0, categoriesSold: [] } });
  await Promise.all(vendorCounts.map(async ({ _id, totalProducts }) => {
    const vendorProducts = await Product.find({ vendor: _id }).populate('category', 'name').lean();
    const categoriesSold = [...new Set(vendorProducts.map(({ category }) => category?.name).filter(Boolean))];
    await Vendor.updateOne({ _id }, { $set: { totalProducts, categoriesSold } });
  }));

  return {
    productsBefore,
    productsAfter: await Product.countDocuments(),
    categoriesBefore,
    categoriesAfter: await Category.countDocuments(),
    ordersRemoved,
    brokenReferencesFixed: removedProductIds.length,
    vendorCountsUpdated: true,
  };
}

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/markethub')
    .then(cleanup)
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .then(() => mongoose.disconnect())
    .catch(async (error) => { console.error(error); await mongoose.disconnect(); process.exit(1); });
}

module.exports = { cleanup };
