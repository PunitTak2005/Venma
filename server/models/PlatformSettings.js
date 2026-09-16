const mongoose = require('mongoose');

const PlatformSettingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: 'VENMA',
    },
    legalEntity: {
      type: String,
      default: 'VENMA Multi-Vendor Marketplace Inc.',
    },
    tagline: {
      type: String,
      default: 'Buy. Sell. Grow Together.',
    },
    officialAddress: {
      street: {
        type: String,
        default: '184 B Block, Sector 14, Hiran Magri',
      },
      city: {
        type: String,
        default: 'Udaipur',
      },
      state: {
        type: String,
        default: 'Rajasthan',
      },
      country: {
        type: String,
        default: 'India',
      },
      formatted: {
        type: String,
        default: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
      },
      googleMapsUrl: {
        type: String,
        default:
          'https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India',
      },
      embedMapUrl: {
        type: String,
        default:
          'https://maps.google.com/maps?q=184+B+Block,+Sector+14,+Hiran+Magri,+Udaipur,+Rajasthan,+India&t=&z=15&ie=UTF8&iwloc=&output=embed',
      },
    },
    contact: {
      supportEmail: {
        type: String,
        default: 'support@markethub.com',
      },
      helpline: {
        type: String,
        default: '+91 6367088841',
      },
      businessHours: {
        type: String,
        default: 'Mon - Sat (9:00 AM - 7:00 PM IST)',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlatformSettings', PlatformSettingsSchema);
