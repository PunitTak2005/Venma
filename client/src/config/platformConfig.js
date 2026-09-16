/**
 * VENMA Official Platform Configuration & Corporate Address
 * Database-backed with fallback defaults for seamless offline & instant render support
 */

export const PLATFORM_CONFIG = {
  name: 'VENMA',
  legalEntity: 'VENMA Multi-Vendor Marketplace Inc.',
  tagline: 'Buy. Sell. Grow Together.',
  address: {
    street: '184 B Block, Sector 14, Hiran Magri',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    formatted: '184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India',
    shortFormatted: 'Hiran Magri, Udaipur, Rajasthan, India',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India',
    embedMapUrl:
      'https://maps.google.com/maps?q=184+B+Block,+Sector+14,+Hiran+Magri,+Udaipur,+Rajasthan,+India&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  contact: {
    helpline: '+91 6367088841',
    supportEmail: 'support@venma.com',
    businessHours: 'Mon - Sat (9:00 AM - 7:00 PM IST)',
  },
};

export default PLATFORM_CONFIG;
