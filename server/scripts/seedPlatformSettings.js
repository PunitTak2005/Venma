require('dotenv').config();
const mongoose = require('mongoose');
const PlatformSettings = require('../models/PlatformSettings');

const seedSettings = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venma';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Platform Settings initialization...');

    const settingsData = {
      platformName: 'VENMA',
      legalEntity: 'VENMA Multi-Vendor Marketplace Inc.',
      tagline: 'Buy. Sell. Grow Together.',
      officialAddress: {
        street: '184 B Block, Sector 14, Hiran Magri',
        city: 'Udaipur',
        state: 'Rajasthan',
        country: 'India',
        formatted: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India',
        embedMapUrl:
          'https://maps.google.com/maps?q=184+B+Block,+Sector+14,+Hiran+Magri,+Udaipur,+Rajasthan,+India&t=&z=15&ie=UTF8&iwloc=&output=embed',
      },
      contact: {
        supportEmail: 'support@venma.com',
        helpline: '+91 6367088841',
        businessHours: 'Mon - Sat (9:00 AM - 7:00 PM IST)',
      },
    };

    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = await PlatformSettings.create(settingsData);
      console.log('Created fresh PlatformSettings in database:', settings);
    } else {
      settings.set(settingsData);
      await settings.save();
      console.log('Updated existing PlatformSettings in database with new Udaipur address:', settings);
    }

    console.log('Platform settings successfully seeded in MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed platform settings:', error);
    process.exit(1);
  }
};

seedSettings();
