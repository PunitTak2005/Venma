const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data.slice(0, 100) });
        }
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function main() {
  console.log('Testing Backend API...');
  const res1 = await checkUrl('http://localhost:9006/api/products?limit=2');
  console.log('Products API status:', res1.status, res1.body?.success, 'total:', res1.body?.total);

  const res2 = await checkUrl('http://localhost:9006/api/vendors');
  console.log('Vendors API status:', res2.status, 'vendors count:', res2.body?.data?.length);

  const res3 = await checkUrl('http://localhost:9006/api/categories');
  console.log('Categories API status:', res3.status, 'categories count:', res3.body?.data?.length);

  const res4 = await checkUrl('http://localhost:9006/api/products?sort=relevance&limit=3');
  console.log('Relevance Sort API status:', res4.status, 'returned:', res4.body?.data?.length);

  const res5 = await checkUrl('http://localhost:9006/api/products?sort=rating&limit=3');
  console.log('Rating Sort API status:', res5.status, 'returned:', res5.body?.data?.length);
}

main();
