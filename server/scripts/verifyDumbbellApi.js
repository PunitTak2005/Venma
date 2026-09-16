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
  console.log('1. Checking product by slug: /api/products/smart-adjustable-dumbbell-set');
  const prodRes = await request('/api/products/smart-adjustable-dumbbell-set');
  console.log('Product Name:', prodRes.data?.name);
  console.log('Vendor in Product:', {
    _id: prodRes.data?.vendor?._id,
    storeName: prodRes.data?.vendor?.storeName,
    storeSlug: prodRes.data?.vendor?.storeSlug,
  });

  console.log('\n2. Checking FitMotion Sports storefront: /api/vendors/fitmotion-sports');
  const fitRes = await request('/api/vendors/fitmotion-sports');
  console.log('FitMotion Store Name:', fitRes.data?.storeName);
  console.log('FitMotion Products Count:', fitRes.products?.length);
  fitRes.products?.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (slug: ${p.slug})`);
  });

  console.log('\n3. Checking Urban Living Co. storefront: /api/vendors/urban-living-co');
  const urbanRes = await request('/api/vendors/urban-living-co');
  console.log('Urban Living Store Name:', urbanRes.data?.storeName);
  console.log('Urban Living Products Count:', urbanRes.products?.length);
  urbanRes.products?.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (slug: ${p.slug})`);
  });

  console.log('\n4. Checking keyword search for Dumbbell: /api/products?keyword=Dumbbell');
  const searchRes = await request('/api/products?keyword=Dumbbell');
  console.log('Search results count:', searchRes.count);
  searchRes.data?.forEach(p => {
    console.log(`- ${p.name} | Vendor: ${p.vendor?.storeName} (${p.vendor?.storeSlug})`);
  });
}

verify().catch(console.error);
