const Product = require('../models/Product');
const Category = require('../models/Category');
const Vendor = require('../models/Vendor');
const { getValidProductImages } = require('../utils/productImageValidation');

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      vendor,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page = 1,
      limit = 16,
      featured,
    } = req.query;

    let query = { isPublished: true, imageValid: true };

    // Search keyword
    if (keyword && keyword.trim()) {
      const escaped = escapeRegex(keyword.trim());
      const matchingVendors = await Vendor.find({
        $or: [
          { storeName: { $regex: escaped, $options: 'i' } },
          { location: { $regex: escaped, $options: 'i' } },
          { 'address.city': { $regex: escaped, $options: 'i' } },
          { 'address.state': { $regex: escaped, $options: 'i' } },
        ],
      }).select('_id');
      const matchingVendorIds = matchingVendors.map((v) => v._id);

      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { brand: { $regex: escaped, $options: 'i' } },
        { tags: { $in: [new RegExp(escaped, 'i')] } },
      ];

      if (matchingVendorIds.length > 0) {
        query.$or.push({ vendor: { $in: matchingVendorIds } });
      }
    }

    // Category filter (id or slug)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) query.category = catDoc._id;
      }
    }

    // Vendor filter
    if (vendor) {
      query.vendor = vendor;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Stock availability filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured only
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
    else if (sort === 'popular') sortOption = { numReviews: -1, rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'relevance') sortOption = { rating: -1, featured: -1 };
    // Homepage curation: featured first, then highest rated, best-selling, and newest.
    else if (sort === 'curated') sortOption = { featured: -1, rating: -1, numReviews: -1, createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 16;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug description image icon')
      .populate('vendor', 'storeName storeSlug logo rating specialty categoriesSold totalProducts location address')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get total count of published products
// @route   GET /api/products/count
// @access  Public
exports.getProductCount = async (req, res, next) => {
  try {
    const count = await Product.countDocuments({ isPublished: true, imageValid: true });
    res.json({
      success: true,
      count,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id or slug
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findOne({ _id: req.params.id, isPublished: true, imageValid: true })
        .populate('category', 'name slug')
        .populate({
          path: 'vendor',
          select: 'storeName storeSlug logo description rating numReviews phone address location',
        });
    } else {
      product = await Product.findOne({ slug: req.params.id, isPublished: true, imageValid: true })
        .populate('category', 'name slug')
        .populate('vendor', 'storeName storeSlug logo description rating numReviews phone address location');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Also fetch related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isPublished: true,
      imageValid: true,
    })
      .limit(4)
      .populate('vendor', 'storeName');

    res.json({
      success: true,
      data: product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Vendor only)
// @route   POST /api/products
// @access  Private/Vendor
exports.createProduct = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(403).json({ success: false, message: 'Vendor store profile not found' });
    }

    const {
      name,
      description,
      category,
      price,
      discountPrice,
      stock,
      sku,
      brand,
      images,
      specifications,
      tags,
      featured,
    } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const generatedSku = sku || 'SKU-' + Math.floor(100000 + Math.random() * 900000);

    const validImages = getValidProductImages({ images, thumbnail: req.body.thumbnail });
    if (!validImages.length) {
      return res.status(400).json({ success: false, message: 'A valid local product image is required' });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      vendor: vendor._id,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      sku: generatedSku,
      brand: brand || vendor.storeName,
      images: validImages,
      thumbnail: validImages[0],
      imageValid: true,
      specifications: specifications || [],
      tags: tags || [],
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Vendor/Admin)
// @route   PUT /api/products/:id
// @access  Private/Vendor/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'images') || Object.prototype.hasOwnProperty.call(req.body, 'thumbnail')) {
      const validImages = getValidProductImages({
        images: Object.prototype.hasOwnProperty.call(req.body, 'images') ? req.body.images : product.images,
        thumbnail: Object.prototype.hasOwnProperty.call(req.body, 'thumbnail') ? req.body.thumbnail : product.thumbnail,
      });
      if (!validImages.length) {
        return res.status(400).json({ success: false, message: 'A valid local product image is required' });
      }
      req.body.images = validImages;
      req.body.thumbnail = validImages[0];
      req.body.imageValid = true;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Vendor/Admin)
// @route   DELETE /api/products/:id
// @access  Private/Vendor/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
