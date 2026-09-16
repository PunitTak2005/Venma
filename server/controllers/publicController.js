const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Review = require('../models/Review');
const PlatformSettings = require('../models/PlatformSettings');

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// @desc    Get official platform settings (including address & contact)
// @route   GET /api/public/settings
// @access  Public
exports.getPlatformSettings = async (req, res, next) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = await PlatformSettings.create({
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
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live marketplace metrics & counters for landing page
// @route   GET /api/public/metrics
// @access  Public
exports.getMarketplaceMetrics = async (req, res, next) => {
  try {
    const [productsCount, vendorsCount, customersCount, ordersCount, categoriesCount, reviewsCount] = await Promise.all([
      Product.countDocuments({ isPublished: true, imageValid: true }),
      Vendor.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Category.countDocuments(),
      Review.countDocuments ? Review.countDocuments() : 0,
    ]);

    res.json({
      success: true,
      data: {
        totalProducts: productsCount,
        totalVendors: vendorsCount,
        totalCustomers: customersCount,
        totalOrders: ordersCount,
        totalCategories: categoriesCount,
        totalReviews: reviewsCount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get autocomplete and search suggestions
// @route   GET /api/public/search-suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.json({
        success: true,
        products: [],
        vendors: [],
        categories: [],
      });
    }

    const searchTerm = escapeRegex(q.trim());

    const [products, vendors, categories] = await Promise.all([
      Product.find({
        name: { $regex: searchTerm, $options: 'i' },
        isPublished: true,
      })
        .limit(5)
        .select('name slug images vendor')
        .populate('vendor', 'storeName'),
      Vendor.find({
        $or: [
          { storeName: { $regex: searchTerm, $options: 'i' } },
          { location: { $regex: searchTerm, $options: 'i' } },
          { 'address.city': { $regex: searchTerm, $options: 'i' } },
          { 'address.state': { $regex: searchTerm, $options: 'i' } },
        ],
        status: 'approved',
      })
        .limit(4)
        .select('storeName storeSlug logo location address'),
      Category.find({
        name: { $regex: searchTerm, $options: 'i' },
      })
        .limit(4)
        .select('name slug icon image'),
    ]);

    res.json({
      success: true,
      products,
      vendors,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
