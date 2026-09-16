const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log('1. Testing GET /api/vendors (guest)...');
  const res1 = await request({
    hostname: 'localhost',
    port: 9006,
    path: '/api/vendors',
    method: 'GET',
  });
  console.log('Guest vendors response count:', res1.data.count);
  const sample = res1.data.data.find(v => v.storeSlug === 'fitmotion-sports') || res1.data.data[0];
  console.log('Sample vendor:', sample.storeName, '| isFollowing:', sample.isFollowing, '| followerCount:', sample.followerCount);

  console.log('\n2. Logging in as buyer...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 9006,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'buyer@venma.com', password: 'password123' }
  );

  const token = loginRes.data.data?.accessToken;
  console.log('Login status:', loginRes.status, '| User:', loginRes.data.data?.name, '| Token present:', !!token);

  console.log('\n3. Follow vendor (fitmotion-sports)...');
  const followRes = await request({
    hostname: 'localhost',
    port: 9006,
    path: '/api/vendors/fitmotion-sports/follow',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  console.log('Follow response:', followRes.data);

  console.log('\n4. Check follow status...');
  const statusRes = await request({
    hostname: 'localhost',
    port: 9006,
    path: '/api/vendors/fitmotion-sports/follow-status',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  console.log('Follow status response:', statusRes.data);

  console.log('\n5. Duplicate follow test...');
  const dupRes = await request({
    hostname: 'localhost',
    port: 9006,
    path: '/api/vendors/fitmotion-sports/follow',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  console.log('Duplicate follow response:', dupRes.data);

  console.log('\n6. Unfollow vendor...');
  const unfollowRes = await request({
    hostname: 'localhost',
    port: 9006,
    path: '/api/vendors/fitmotion-sports/follow',
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  console.log('Unfollow response:', unfollowRes.data);

  console.log('\n7. Final follow status check...');
  const finalStatus = await request({
    hostname: 'localhost',
    port: 9006,
    path: '/api/vendors/fitmotion-sports/follow-status',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  console.log('Final status response:', finalStatus.data);
}

run().catch(console.error);
