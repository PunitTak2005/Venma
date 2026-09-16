const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri && process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI or MONGODB_URI must be configured in production');
    }

    const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/venma');
    console.log(`    MongoDB     : Connected (${conn.connection.host})`);

    // Clean up any leftover avatar fields from previous versions
    const cleanup = await User.collection.updateMany(
      { avatar: { $exists: true } },
      { $unset: { avatar: 1 } }
    );
    if (cleanup.modifiedCount > 0) {
      console.log(`    [DB] Removed avatar field from ${cleanup.modifiedCount} account(s)`);
    }
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
