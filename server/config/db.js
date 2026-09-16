const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/markethub'
    );
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
