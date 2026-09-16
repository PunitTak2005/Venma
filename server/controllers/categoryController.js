const Category = require('../models/Category');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get one featured product per category (Real database data)
// @route   GET /api/categories/featured-products
// @access  Public
exports.getFeaturedProductsByCategory = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const results = [];
    const usedProductIds = new Set();

    for (const cat of categories) {
      // Query 1 product using priority:
      // 1. Featured product (if available) -> featured: -1
      // 2. Highest-rated product -> rating: -1
      // 3. Best-selling product -> numReviews: -1
      // 4. Most recently added product -> createdAt: -1
      let product = null;

      if (usedProductIds.size > 0) {
        product = await Product.findOne({
          category: cat._id,
          isPublished: { $ne: false },
          imageValid: true,
          _id: { $nin: Array.from(usedProductIds) },
        })
          .populate('category', 'name slug description image icon banner')
          .populate('vendor', 'storeName storeSlug logo rating specialty')
          .sort({
            featured: -1,
            rating: -1,
            numReviews: -1,
            createdAt: -1,
          });
      }

      if (!product) {
        product = await Product.findOne({
          category: cat._id,
          isPublished: { $ne: false },
          imageValid: true,
        })
          .populate('category', 'name slug description image icon banner')
          .populate('vendor', 'storeName storeSlug logo rating specialty')
          .sort({
            featured: -1,
            rating: -1,
            numReviews: -1,
            createdAt: -1,
          });
      }

      // If category has no products, hide that category instead of showing placeholders
      if (product) {
        usedProductIds.add(product._id.toString());
        results.push({
          category: cat.name,
          categorySlug: cat.slug,
          categoryDetails: {
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            banner: cat.banner,
            image: cat.image,
          },
          product,
        });
      }
    }

    // Support both wrapped and direct array responses
    if (req.query.wrap === 'true') {
      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon, banner, featured } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      icon,
      banner,
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

