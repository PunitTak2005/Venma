const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const VendorFollow = require('../models/VendorFollow');

const escapeRegex = (str) => (str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// Helper to resolve vendor by ObjectId or storeSlug
const resolveVendor = async (idOrSlug) => {
  if (!idOrSlug) return null;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    return await Vendor.findById(idOrSlug).select('-bankDetails');
  }
  return await Vendor.findOne({ storeSlug: idOrSlug }).select('-bankDetails');
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
// @route   GET /api/vendors/me/stats
// @access  Private/Vendor
exports.getVendorDashboardStats = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const totalProducts = await Product.countDocuments({ vendor: vendor._id, imageValid: true });
    const orders = await Order.find({ 'items.vendor': vendor._id });

    let vendorRevenue = 0;
    let vendorOrderCount = orders.length;
    let customerIds = new Set();

    orders.forEach((order) => {
      customerIds.add(order.customer.toString());
      order.items.forEach((item) => {
        if (item.vendor.toString() === vendor._id.toString()) {
          vendorRevenue += item.price * item.quantity;
        }
      });
    });

    // Monthly revenue simulation aggregation for chart
    const monthlyStats = [
      { month: 'Jan', revenue: Math.round(vendorRevenue * 0.08), orders: Math.round(vendorOrderCount * 0.08) },
      { month: 'Feb', revenue: Math.round(vendorRevenue * 0.12), orders: Math.round(vendorOrderCount * 0.11) },
      { month: 'Mar', revenue: Math.round(vendorRevenue * 0.15), orders: Math.round(vendorOrderCount * 0.14) },
      { month: 'Apr', revenue: Math.round(vendorRevenue * 0.18), orders: Math.round(vendorOrderCount * 0.19) },
      { month: 'May', revenue: Math.round(vendorRevenue * 0.22), orders: Math.round(vendorOrderCount * 0.23) },
      { month: 'Jun', revenue: Math.round(vendorRevenue * 0.25), orders: Math.round(vendorOrderCount * 0.25) },
    ];

    res.json({
      success: true,
      data: {
        vendor,
        kpi: {
          revenue: Number(vendorRevenue.toFixed(2)),
          balance: Number(vendor.balance.toFixed(2)),
          totalOrders: vendorOrderCount,
          totalProducts,
          totalCustomers: customerIds.size,
          conversionRate: '3.4%',
        },
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor products list
// @route   GET /api/vendors/me/products
// @access  Private/Vendor
exports.getVendorProducts = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const products = await Product.find({ vendor: vendor._id, imageValid: true })
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
// @route   GET /api/vendors/me/orders
// @access  Private/Vendor
exports.getVendorOrders = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found' });
    }

    const orders = await Order.find({ 'items.vendor': vendor._id })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    // Filter items specific to this vendor
    const vendorSpecificOrders = orders.map((o) => {
      const vendorItems = o.items.filter((i) => i.vendor.toString() === vendor._id.toString());
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
        totalVendorAmount: vendorItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
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

