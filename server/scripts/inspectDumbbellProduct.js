const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));

  const product = await Product.findOne({
    $or: [{ slug: 'smart-adjustable-dumbbell-set' }, { name: /Adjustable Dumbbell/i }]
  });
  console.log('Product details:');
  if (product) {
    console.log({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      vendor: product.vendor,
      brand: product.brand,
      category: product.category,
      price: product.price,
    });
  } else {
    console.log('Product not found!');
  }

  const fitmotion = await Vendor.findOne({
    $or: [{ storeSlug: 'fitmotion-sports' }, { storeName: /FitMotion/i }]
  });
  console.log('\nFitMotion Vendor details:');
  if (fitmotion) {
    console.log({
      _id: fitmotion._id,
      storeName: fitmotion.storeName,
      storeSlug: fitmotion.storeSlug,
      totalProducts: fitmotion.totalProducts,
    });
  } else {
    console.log('FitMotion Vendor not found!');
  }

  if (product && product.vendor) {
    const prevVendor = await Vendor.findById(product.vendor);
    console.log('\nCurrent/Previous Vendor details:');
    if (prevVendor) {
      console.log({
        _id: prevVendor._id,
        storeName: prevVendor.storeName,
        storeSlug: prevVendor.storeSlug,
        totalProducts: prevVendor.totalProducts,
      });
    } else {
      console.log('Previous vendor ID not found in Vendor collection:', product.vendor);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
