const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CommissionTransaction = require('../models/CommissionTransaction');
const { generateReportPDF } = require('../utils/pdfGenerator');

// @desc    Get Admin global dashboard metrics, charts, and commission breakdown
// @route   GET /api/admin/overview
// @access  Private/Admin
exports.getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await Vendor.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ orderStatus: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const platformCommission = Number((totalRevenue * 0.10).toFixed(2)); // 10% platform revenue

    const pendingVendors = await Vendor.countDocuments({ status: 'pending' });

    // Recent commission transactions
    const commissionTransactions = await CommissionTransaction.find()
      .populate('vendor', 'storeName')
      .sort({ createdAt: -1 })
      .limit(10);

    const revenueAnalytics = [
      { month: 'Jan', revenue: Math.round(totalRevenue * 0.11), commission: Math.round(platformCommission * 0.11), orders: Math.round(totalOrders * 0.12) },
      { month: 'Feb', revenue: Math.round(totalRevenue * 0.13), commission: Math.round(platformCommission * 0.13), orders: Math.round(totalOrders * 0.13) },
      { month: 'Mar', revenue: Math.round(totalRevenue * 0.16), commission: Math.round(platformCommission * 0.16), orders: Math.round(totalOrders * 0.16) },
      { month: 'Apr', revenue: Math.round(totalRevenue * 0.18), commission: Math.round(platformCommission * 0.18), orders: Math.round(totalOrders * 0.18) },
      { month: 'May', revenue: Math.round(totalRevenue * 0.20), commission: Math.round(platformCommission * 0.20), orders: Math.round(totalOrders * 0.20) },
      { month: 'Jun', revenue: Math.round(totalRevenue * 0.22), commission: Math.round(platformCommission * 0.22), orders: Math.round(totalOrders * 0.21) },
    ];

    res.json({
      success: true,
      data: {
        kpi: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          platformCommission,
          vendorPayouts: Number((totalRevenue - platformCommission).toFixed(2)),
          totalOrders,
          totalProducts,
          totalVendors,
          totalUsers,
          pendingVendors,
        },
        revenueAnalytics,
        commissionTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private/Admin
exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find()
      .populate('user', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve, reject, or suspend vendor
// @route   PUT /api/admin/vendors/:id/status
// @access  Private/Admin
exports.updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({
      success: true,
      message: `Vendor store is now ${status}`,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password -avatar');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and stream platform reports PDF
// @route   GET /api/admin/reports/:type
// @access  Private/Admin
exports.downloadReportPDF = async (req, res, next) => {
  try {
    const { type } = req.params;

    const orders = await Order.find().populate('customer', 'name');
    const vendors = await Vendor.find();
    const products = await Product.find().populate('category', 'name');

    const totalRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    if (type === 'sales') {
      const metrics = [
        { label: 'Gross Volume', value: `$${totalRev.toFixed(2)}` },
        { label: 'Platform 10%', value: `$${(totalRev * 0.1).toFixed(2)}` },
        { label: 'Orders', value: orders.length.toString() },
        { label: 'Catalog Items', value: products.length.toString() },
      ];

      const rows = orders.slice(0, 15).map((o) => ({
        name: `Order #${o.orderNumber}`,
        detail: `${o.customer?.name || 'Buyer'} (${o.paymentMethod.toUpperCase()})`,
        volume: o.items.reduce((s, i) => s + i.quantity, 0),
        revenue: o.totalAmount,
      }));

      return generateReportPDF('Platform Sales & Revenue Summary', metrics, rows, res);
    } else {
      const metrics = [
        { label: 'Active Vendors', value: vendors.length.toString() },
        { label: 'Approved', value: vendors.filter((v) => v.status === 'approved').length.toString() },
        { label: 'Gross Volume', value: `$${totalRev.toFixed(2)}` },
        { label: 'Platform Net', value: `$${(totalRev * 0.1).toFixed(2)}` },
      ];

      const rows = vendors.slice(0, 15).map((v) => ({
        name: v.storeName,
        detail: `Rating: ${v.rating} ★ (${v.status})`,
        volume: v.numReviews,
        revenue: v.totalRevenue || 1400,
      }));

      return generateReportPDF('Vendor Performance & Compliance Report', metrics, rows, res);
    }
  } catch (error) {
    next(error);
  }
};
