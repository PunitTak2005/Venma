const http = require('http');

function request(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 9006, path }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    }).on('error', reject);
  });
}

async function verify() {
  console.log('1. Checking product details for Ceramic Car Wax:');
  const waxRes = await request('/api/products/ceramic-car-wax');
  console.log('Product:', waxRes.data?.name);
  console.log('Seller / Vendor:', waxRes.data?.vendor?.storeName, `(slug: ${waxRes.data?.vendor?.storeSlug})`);
  console.log('Price:', waxRes.data?.price, '| DiscountPrice:', waxRes.data?.discountPrice);
  console.log('Images:', waxRes.data?.images?.length, 'images present');

  console.log('\n2. Checking AutoShine Garage storefront:');
  const vendorRes = await request('/api/vendors/autoshine-garage');
  console.log('Store Name:', vendorRes.data?.storeName);
  console.log('Store Slug:', vendorRes.data?.storeSlug);
  console.log('Rating:', vendorRes.data?.rating, '| Reviews:', vendorRes.data?.numReviews);
  console.log('Location:', `${vendorRes.data?.address?.city}, ${vendorRes.data?.address?.state}, ${vendorRes.data?.address?.country}`);
  console.log('Member Since:', vendorRes.data?.createdAt);
  console.log('Products Count in Catalog:', vendorRes.products?.length);
  vendorRes.products?.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (₹${p.price})`);
  });

  console.log('\n3. Checking Previous Vendor (Urban Living Co.):');
  const prevRes = await request('/api/vendors/urban-living-co');
  console.log('Urban Living Products Count:', prevRes.products?.length);
  prevRes.products?.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name}`);
  });

  console.log('\n4. Checking Vendor Listing /api/vendors:');
  const listRes = await request('/api/vendors');
  const found = listRes.data?.find(v => v.storeSlug === 'autoshine-garage');
  console.log('AutoShine Garage in /api/vendors:', !!found ? `${found.storeName} (${found.totalProducts} products)` : 'NOT FOUND');
}

verify().catch(console.error);
