const mongoose = require('mongoose');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');

  const fitmotion = await Vendor.findOne({ storeSlug: 'fitmotion-sports' });
  const prevVendor = await Vendor.findOne({ storeSlug: 'urban-living-co' });

  console.log('FitMotion Sports ID:', fitmotion._id);
  console.log('Urban Living ID:', prevVendor?._id);

  // Update product vendor directly with $set
  const updateRes = await Product.updateOne(
    { slug: 'smart-adjustable-dumbbell-set' },
    { $set: { vendor: fitmotion._id } }
  );
  console.log('Product update result:', updateRes);

  // Recount for FitMotion
  const fitProducts = await Product.find({ vendor: fitmotion._id });
  console.log(`\nFitMotion products (total: ${fitProducts.length}):`);
  fitProducts.forEach(p => {
    console.log(`- ${p.name} | slug: ${p.slug} | imageValid: ${p.imageValid} | isPublished: ${p.isPublished}`);
  });
  fitmotion.totalProducts = fitProducts.filter(p => p.imageValid && p.isPublished).length;
  if (!fitmotion.categoriesSold.includes('Sports')) {
    fitmotion.categoriesSold.push('Sports');
  }
  await fitmotion.save();
  console.log('FitMotion totalProducts saved:', fitmotion.totalProducts);

  // Recount for Urban Living
  if (prevVendor) {
    const prevProducts = await Product.find({ vendor: prevVendor._id });
    console.log(`\nUrban Living products (total: ${prevProducts.length}):`);
    prevProducts.forEach(p => {
      console.log(`- ${p.name} | slug: ${p.slug} | imageValid: ${p.imageValid} | isPublished: ${p.isPublished}`);
    });
    prevVendor.totalProducts = prevProducts.filter(p => p.imageValid && p.isPublished).length;
    await prevVendor.save();
    console.log('Urban Living totalProducts saved:', prevVendor.totalProducts);
  }

  // Populate test
  const dumbbell = await Product.findOne({ slug: 'smart-adjustable-dumbbell-set' }).populate('vendor');
  console.log('\nDumbbell vendor populated:');
  console.log({
    productName: dumbbell.name,
    vendorName: dumbbell.vendor?.storeName,
    vendorSlug: dumbbell.vendor?.storeSlug,
    vendorId: dumbbell.vendor?._id,
  });

  await mongoose.disconnect();
}

run().catch(console.error);
