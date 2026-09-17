const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const VendorFollow = require('../models/VendorFollow');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// Helper to resolve vendor by ObjectId or storeSlug
const resolveVendor = async (idOrSlug) => {
  if (!idOrSlug) return null;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    return await Vendor.findById(idOrSlug).select('-bankDetails');
  }
  return await Vendor.findOne({ storeSlug: idOrSlug }).select('-bankDetails');
};

// Helper to resolve vendor for authenticated user with self-healing
const resolveVendorForUser = async (user) => {
  if (!user) return null;
  let vendor = await Vendor.findOne({ user: user._id });
  if (vendor) return vendor;

  // Auto-heal TechNova demo account if user is vendor@venma.com
  if (user.email === 'vendor@venma.com') {
    vendor = (await Vendor.findOne({ storeSlug: 'technova-electronics' })) || (await Vendor.findOne({ storeName: 'TechNova Electronics' }));
    if (vendor) {
      vendor.user = user._id;
      await vendor.save();
      return vendor;
    }
  }
  return null;
};

// @desc    Get all active vendors
// @route   GET /api/vendors
// @access  Public (OptionalAuth)
exports.getVendors = async (req, res, next) => {
  try {
    const { search, q, city, state } = req.query;
    const query = { status: 'approved', totalProducts: { $gt: 0 } };
    const term = (search || q || '').trim();

    if (term) {
      const escaped = escapeRegex(term);
      query.$or = [
        { storeName: { $regex: escaped, $options: 'i' } },
        { specialty: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { location: { $regex: escaped, $options: 'i' } },
        { 'address.city': { $regex: escaped, $options: 'i' } },
        { 'address.state': { $regex: escaped, $options: 'i' } },
      ];
    }
    if (city) {
      query['address.city'] = { $regex: escapeRegex(city.trim()), $options: 'i' };
    }
    if (state) {
      query['address.state'] = { $regex: escapeRegex(state.trim()), $options: 'i' };
    }

    const vendors = await Vendor.find(query)
      .select('-bankDetails')
      .sort({ rating: -1 });

    let followedVendorIds = new Set();
    if (req.user) {
      const userFollows = await VendorFollow.find({ userId: req.user._id }).select('vendorId');
      followedVendorIds = new Set(userFollows.map((f) => f.vendorId.toString()));
    }

    const vendorsWithFollow = vendors.map((v) => {
      const obj = v.toObject ? v.toObject() : { ...v };
      return {
        ...obj,
        isFollowing: followedVendorIds.has(v._id.toString()),
        followerCount: obj.followersCount || 0,
      };
    });

    res.json({
      success: true,
      count: vendorsWithFollow.length,
      data: vendorsWithFollow,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor store by slug or id
// @route   GET /api/vendors/:idOrSlug
// @access  Public (OptionalAuth)
exports.getVendorBySlug = async (req, res, next) => {
  try {
    const vendor = await resolveVendor(req.params.idOrSlug);

    // Return 404 for missing or suspended/non-approved vendors
    if (!vendor || vendor.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    let isFollowing = false;
    if (req.user) {
      const follow = await VendorFollow.findOne({ userId: req.user._id, vendorId: vendor._id });
      isFollowing = !!follow;
    }

    const products = await Product.find({ vendor: vendor._id, isPublished: true, imageValid: true })
      .populate('category', 'name slug');

    const vendorData = vendor.toObject ? vendor.toObject() : { ...vendor };
    vendorData.isFollowing = isFollowing;
    vendorData.followerCount = vendor.followersCount || 0;

    res.json({
      success: true,
      data: vendorData,
      isFollowing,
      followerCount: vendor.followersCount || 0,
      products,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get current vendor dashboard stats & analytics
// @route   GET /api/vendors/me/stats, /api/vendor/dashboard
// @access  Private/Vendor
exports.getVendorDashboardStats = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const totalProducts = await Product.countDocuments({ vendor: vendor._id });
    const activeProducts = await Product.countDocuments({ vendor: vendor._id, isPublished: true });
    const lowStockCount = await Product.countDocuments({ vendor: vendor._id, stock: { $lte: 15, $gt: 0 } });
    const outOfStockCount = await Product.countDocuments({ vendor: vendor._id, stock: 0 });

    const orders = await Order.find({ 'items.vendor': vendor._id }).sort({ createdAt: 1 });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthNames[d.getMonth()];
      monthlyMap[key] = { month: key, revenue: 0, orders: 0 };
    }

    let vendorRevenue = 0;
    let customerIds = new Set();

    orders.forEach((order) => {
      if (order.customer) customerIds.add(order.customer.toString());
      let orderVendorGross = 0;
      let orderHasVendor = false;

      order.items.forEach((item) => {
        if (item.vendor && item.vendor.toString() === vendor._id.toString()) {
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          vendorRevenue += itemTotal;
          orderVendorGross += itemTotal;
          orderHasVendor = true;
        }
      });

      if (orderHasVendor && order.createdAt) {
        const orderMonth = monthNames[new Date(order.createdAt).getMonth()];
        if (monthlyMap[orderMonth]) {
          monthlyMap[orderMonth].revenue += orderVendorGross;
          monthlyMap[orderMonth].orders += 1;
        }
      }
    });

    const monthlyStats = Object.values(monthlyMap);

    res.json({
      success: true,
      data: {
        vendor,
        kpi: {
          revenue: Number(vendorRevenue.toFixed(2)),
          balance: Number((vendor.balance || vendorRevenue * 0.9).toFixed(2)),
          totalOrders: orders.length,
          totalProducts,
          activeProducts,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
          totalCustomers: customerIds.size,
          averageRating: vendor.rating || 4.9,
          conversionRate: '3.8%',
        },
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor products list
// @route   GET /api/vendors/me/products, /api/vendor/products
// @access  Private/Vendor
exports.getVendorProducts = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const products = await Product.find({ vendor: vendor._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor orders
// @route   GET /api/vendors/me/orders, /api/vendor/orders
// @access  Private/Vendor
exports.getVendorOrders = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const orders = await Order.find({ 'items.vendor': vendor._id })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    const vendorSpecificOrders = orders.map((o) => {
      const vendorItems = o.items.filter((i) => i.vendor && i.vendor.toString() === vendor._id.toString());
      return {
        _id: o._id,
        orderNumber: o.orderNumber,
        customer: o.customer,
        shippingAddress: o.shippingAddress,
        items: vendorItems,
        orderStatus: o.orderStatus,
        paymentMethod: o.paymentMethod,
        isPaid: o.isPaid,
        createdAt: o.createdAt,
        totalVendorAmount: vendorItems.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0),
      };
    });

    res.json({
      success: true,
      count: vendorSpecificOrders.length,
      data: vendorSpecificOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor analytics & trends
// @route   GET /api/vendors/me/analytics, /api/vendor/analytics
// @access  Private/Vendor
exports.getVendorAnalytics = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const orders = await Order.find({ 'items.vendor': vendor._id }).sort({ createdAt: 1 });
    const products = await Product.find({ vendor: vendor._id }).populate('category', 'name');

    const productSales = {};
    let totalRevenue = 0;
    let totalUnitsSold = 0;
    const categorySales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.vendor && item.vendor.toString() === vendor._id.toString()) {
          const pId = item.product ? item.product.toString() : item.name;
          const qty = item.quantity || 1;
          const rev = (item.price || 0) * qty;

          totalRevenue += rev;
          totalUnitsSold += qty;

          if (!productSales[pId]) {
            productSales[pId] = {
              id: pId,
              name: item.name,
              unitsSold: 0,
              revenue: 0,
              image: item.image,
            };
          }
          productSales[pId].unitsSold += qty;
          productSales[pId].revenue += rev;
        }
      });
    });

    products.forEach((p) => {
      const catName = p.category?.name || 'Electronics';
      categorySales[catName] = (categorySales[catName] || 0) + (productSales[p._id.toString()]?.revenue || 0);
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthNames[d.getMonth()];
      monthlyMap[key] = { month: key, revenue: 0, orders: 0, units: 0 };
    }

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const orderMonth = monthNames[new Date(order.createdAt).getMonth()];
      if (monthlyMap[orderMonth]) {
        let oRev = 0;
        let oUnits = 0;
        order.items.forEach((item) => {
          if (item.vendor && item.vendor.toString() === vendor._id.toString()) {
            oRev += (item.price || 0) * (item.quantity || 1);
            oUnits += item.quantity || 1;
          }
        });
        if (oRev > 0) {
          monthlyMap[orderMonth].revenue += oRev;
          monthlyMap[orderMonth].orders += 1;
          monthlyMap[orderMonth].units += oUnits;
        }
      }
    });

    res.json({
      success: true,
      data: {
        vendorId: vendor._id,
        storeName: vendor.storeName,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalUnitsSold,
        totalOrders: orders.length,
        averageOrderValue: orders.length ? Number((totalRevenue / orders.length).toFixed(2)) : 0,
        monthlyTrends: Object.values(monthlyMap),
        topProducts,
        categoryPerformance: Object.entries(categorySales).map(([category, revenue]) => ({ category, revenue })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor inventory breakdown
// @route   GET /api/vendors/me/inventory, /api/vendor/inventory
// @access  Private/Vendor
exports.getVendorInventory = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const products = await Product.find({ vendor: vendor._id }).populate('category', 'name slug');
    const totalItems = products.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalUnits = 0;
    let totalValuation = 0;

    const inventoryList = products.map((p) => {
      totalUnits += p.stock || 0;
      totalValuation += (p.price || 0) * (p.stock || 0);

      let status = 'in_stock';
      if (p.stock === 0) {
        outOfStock++;
        status = 'out_of_stock';
      } else if (p.stock <= 15) {
        lowStock++;
        status = 'low_stock';
      } else {
        inStock++;
      }

      return {
        _id: p._id,
        name: p.name,
        sku: p.sku,
        category: p.category?.name || 'Uncategorized',
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        status,
        image: p.images?.[0] || p.thumbnail,
        rating: p.rating,
      };
    });

    res.json({
      success: true,
      summary: {
        totalItems,
        totalUnits,
        inStock,
        lowStock,
        outOfStock,
        totalValuation: Number(totalValuation.toFixed(2)),
      },
      data: inventoryList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer reviews for vendor products
// @route   GET /api/vendors/me/reviews, /api/vendor/reviews
// @access  Private/Vendor
exports.getVendorReviews = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const vendorProducts = await Product.find({ vendor: vendor._id }).select('_id name images thumbnail');
    const productIds = vendorProducts.map((p) => p._id);

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate('customer', 'name email avatar')
      .populate('product', 'name images thumbnail price sku')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

    res.json({
      success: true,
      summary: {
        totalReviews,
        averageRating,
      },
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor notifications
// @route   GET /api/vendors/me/notifications, /api/vendor/notifications
// @access  Private/Vendor
exports.getVendorNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor's own profile
// @route   GET /api/vendors/me/profile, /api/vendor/profile
// @access  Private/Vendor
exports.getVendorProfile = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor's own profile
// @route   PUT /api/vendors/me/profile, /api/vendor/profile
// @access  Private/Vendor
exports.updateVendorProfile = async (req, res, next) => {
  try {
    const vendor = await resolveVendorForUser(req.user);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }
    const updated = await Vendor.findByIdAndUpdate(vendor._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a vendor
// @route   POST /api/vendors/:vendorId/follow
// @access  Private
exports.followVendor = async (req, res, next) => {
  try {
    const vendor = await resolveVendor(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    // Check if user already follows this vendor
    const existingFollow = await VendorFollow.findOne({
      userId: req.user._id,
      vendorId: vendor._id,
    });

    if (!existingFollow) {
      await VendorFollow.create({
        userId: req.user._id,
        vendorId: vendor._id,
      });
    }

    // Calculate updated count
    const followerCount = await VendorFollow.countDocuments({ vendorId: vendor._id });
    await Vendor.findByIdAndUpdate(vendor._id, { followersCount: followerCount });

    res.json({
      success: true,
      isFollowing: true,
      followerCount,
      message: `You are now following ${vendor.storeName}`,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - already following
      const followerCount = await VendorFollow.countDocuments({ vendorId: req.params.vendorId });
      return res.json({
        success: true,
        isFollowing: true,
        followerCount,
        message: 'Already following this vendor',
      });
    }
    next(error);
  }
};

// @desc    Unfollow a vendor
// @route   DELETE /api/vendors/:vendorId/follow
// @access  Private
exports.unfollowVendor = async (req, res, next) => {
  try {
    const vendor = await resolveVendor(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    await VendorFollow.findOneAndDelete({
      userId: req.user._id,
      vendorId: vendor._id,
    });

    // Calculate updated count
    const followerCount = await VendorFollow.countDocuments({ vendorId: vendor._id });
    await Vendor.findByIdAndUpdate(vendor._id, { followersCount: followerCount });

    res.json({
      success: true,
      isFollowing: false,
      followerCount,
      message: `You unfollowed ${vendor.storeName}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get follow status for a vendor
// @route   GET /api/vendors/:vendorId/follow-status
// @access  Public (OptionalAuth)
exports.getFollowStatus = async (req, res, next) => {
  try {
    const vendor = await resolveVendor(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    let isFollowing = false;
    if (req.user) {
      const follow = await VendorFollow.findOne({
        userId: req.user._id,
        vendorId: vendor._id,
      });
      isFollowing = !!follow;
    }

    const followerCount = await VendorFollow.countDocuments({ vendorId: vendor._id });

    res.json({
      success: true,
      isFollowing,
      followerCount,
    });
  } catch (error) {
    next(error);
  }
};

