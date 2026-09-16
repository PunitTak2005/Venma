const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { getValidProductImages } = require('../utils/productImageValidation');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma');

  const products = await Product.find({}).lean();
  const invalidIds = [];
  const repairs = [];

  for (const product of products) {
    const validImages = getValidProductImages(product);
    if (!validImages.length) {
      invalidIds.push(product._id);
      continue;
    }

    const currentImages = Array.isArray(product.images) ? product.images : [];
    const needsRepair = product.thumbnail !== validImages[0]
      || currentImages.length !== validImages.length
      || currentImages.some((image, index) => image !== validImages[index])
      || product.imageValid !== true;

    if (needsRepair) {
      repairs.push(Product.updateOne(
        { _id: product._id },
        { $set: { thumbnail: validImages[0], images: validImages, imageValid: true } },
      ));
    }
  }

  if (repairs.length) await Promise.all(repairs);
  const deleted = invalidIds.length ? await Product.deleteMany({ _id: { $in: invalidIds } }) : { deletedCount: 0 };

  const vendorCounts = await Product.aggregate([
    { $match: { imageValid: true } },
    { $group: { _id: '$vendor', totalProducts: { $sum: 1 } } },
  ]);
  await Promise.all(vendorCounts.map(({ _id, totalProducts }) => Vendor.updateOne({ _id }, { $set: { totalProducts } })));
  await Vendor.updateMany({ _id: { $nin: vendorCounts.map(({ _id }) => _id) } }, { $set: { totalProducts: 0 } });

  console.log(JSON.stringify({
    scanned: products.length,
    removed: deleted.deletedCount,
    remaining: products.length - deleted.deletedCount,
    repaired: repairs.length,
    remainingWithoutValidImages: 0,
  }, null, 2));

  await mongoose.disconnect();
}

cleanup().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
