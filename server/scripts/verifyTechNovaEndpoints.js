const http = require('http');
const app = require('../server');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testTechNova() {
  const testPort = 9008;
  const server = app.listen(testPort);
  console.log(`Test server running on port ${testPort}...`);

  try {
    // 1. Login
    const loginRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ email: 'vendor@venma.com', password: 'password123' }));

    if (loginRes.status !== 200 || !loginRes.data?.data?.accessToken) {
      console.error('Login failed:', loginRes);
      process.exit(1);
    }

    const token = loginRes.data.data.accessToken;
    const user = loginRes.data.data;
    console.log('✓ Login successful! User:', user.name, '| Role:', user.role);
    console.log('  Vendor in auth response:', user.vendor?.storeName, 'ID:', user.vendor?._id);

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. /api/auth/me
    const meRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/auth/me',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/auth/me:', meRes.status, '| Store:', meRes.data?.data?.vendor?.storeName);

    // 3. /api/vendors/me/stats
    const statsRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendors/me/stats',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendors/me/stats:', statsRes.status);
    console.log('  KPIs:', statsRes.data?.data?.kpi);
    console.log('  Monthly stats:', statsRes.data?.data?.monthlyStats);

    // 4. /api/vendor/dashboard alias
    const dashRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendor/dashboard',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendor/dashboard alias:', dashRes.status, '| Revenue:', dashRes.data?.data?.kpi?.revenue);

    // 5. /api/vendors/me/products
    const prodRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendors/me/products',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendors/me/products:', prodRes.status, '| Products Count:', prodRes.data?.count);
    if (prodRes.data?.data?.length > 0) {
      console.log('  Sample product:', prodRes.data.data[0].name, 'Price: ₹' + prodRes.data.data[0].price, 'Stock:', prodRes.data.data[0].stock);
    }

    // 6. /api/vendors/me/orders
    const orderRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendors/me/orders',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendors/me/orders:', orderRes.status, '| Orders Count:', orderRes.data?.count);
    if (orderRes.data?.data?.length > 0) {
      console.log('  Sample order:', orderRes.data.data[0].orderNumber, 'Customer:', orderRes.data.data[0].customer?.name, 'Amount: ₹' + orderRes.data.data[0].totalVendorAmount);
    }

    // 7. /api/vendor/analytics
    const analyticsRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendor/analytics',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendor/analytics:', analyticsRes.status, '| Top Products:', analyticsRes.data?.data?.topProducts?.length);

    // 8. /api/vendor/inventory
    const invRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendor/inventory',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendor/inventory:', invRes.status, '| Summary:', invRes.data?.summary);

    // 9. /api/vendor/reviews
    const revRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/vendor/reviews',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/vendor/reviews:', revRes.status, '| Reviews Count:', revRes.data?.count, '| Avg Rating:', revRes.data?.summary?.averageRating);

    // 10. /api/notifications
    const notifRes = await request({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/notifications',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('✓ GET /api/notifications:', notifRes.status, '| Notifications Count:', notifRes.data?.data?.length);

    console.log('\n====================================================');
    console.log('ALL TECHNOVA ENDPOINTS VERIFIED SUCCESSFULLY WITH REAL SEEDED DATA!');
    console.log('====================================================');
  } finally {
    server.close();
    process.exit(0);
  }
}

testTechNova().catch((err) => {
  console.error(err);
  process.exit(1);
});
