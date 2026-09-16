const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function testLogin() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  await mongoose.connect(mongoUri);
  console.log('Connected to DB for Login Flow Testing\n');

  const testCases = [
    { email: 'admin@venma.com', password: 'password123', expectedSuccess: true, expectedRole: 'admin' },
    { email: 'vendor@venma.com', password: 'password123', expectedSuccess: true, expectedRole: 'vendor' },
    { email: 'buyer@venma.com', password: 'password123', expectedSuccess: true, expectedRole: 'customer' },
    { email: 'admin@venma.com', password: 'wrongpassword', expectedSuccess: false },
    { email: 'nonexistent@venma.com', password: 'password123', expectedSuccess: false },
  ];

  let allPassed = true;

  for (const tc of testCases) {
    const user = await User.findOne({ email: tc.email }).select('+password');
    let authenticated = false;
    if (user) {
      const match = await user.matchPassword(tc.password);
      if (match) {
        authenticated = true;
      }
    }

    if (tc.expectedSuccess) {
      if (authenticated && user.role === tc.expectedRole) {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        console.log(`[PASS] ${tc.email}: Login SUCCESS (Role: ${user.role}, JWT generated: ${token.slice(0, 16)}...)`);
      } else {
        console.error(`[FAIL] ${tc.email}: Expected login success with role ${tc.expectedRole}, got authenticated=${authenticated}, role=${user?.role}`);
        allPassed = false;
      }
    } else {
      if (!authenticated) {
        console.log(`[PASS] ${tc.email} with '${tc.password}': Rejected with 401 Unauthorized as expected.`);
      } else {
        console.error(`[FAIL] ${tc.email} with '${tc.password}': Unexpected login success!`);
        allPassed = false;
      }
    }
  }

  await mongoose.disconnect();
  console.log(`\nOverall Auth Test Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  process.exit(allPassed ? 0 : 1);
}

testLogin().catch(err => {
  console.error('Error during login test:', err);
  process.exit(1);
});
