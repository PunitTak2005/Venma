const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing /api/products/count ...');
  const countRes = await get('http://localhost:9006/api/products/count');
  console.log('Product Count Response:', countRes);

  console.log('Testing /api/public/metrics ...');
  const metricsRes = await get('http://localhost:9006/api/public/metrics');
  console.log('Public Metrics Response:', metricsRes);
  process.exit(0);
}

run();
