const Order = require('../models/Order');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const CommissionTransaction = require('../models/CommissionTransaction');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

// @desc    Create new multi-vendor order & trigger commission ledger and notifications
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    let subtotal = 0;
    const orderItems = [];
    const vendorMap = new Map(); // vendorId -> items array

    for (const item of items) {
      const product = await Product.findById(item.product).populate('vendor');
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${product.name}'. Available: ${product.stock}`,
        });
      }

      // Deduct inventory
      product.stock -= item.quantity;
      await product.save();

      // Check if low stock notification should be fired
      if (product.stock <= 5 && product.vendor?.user) {
        await Notification.create({
          recipient: product.vendor.user,
          title: 'Low Stock Alert',
          message: `Inventory for "${product.name}" has dropped to ${product.stock} units. Restock soon.`,
          link: '/vendor/products',
          type: 'vendor',
        });
      }

      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      subtotal += itemPrice * item.quantity;

      const orderItem = {
        product: product._id,
        vendor: product.vendor._id,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        price: itemPrice,
        quantity: item.quantity,
        status: 'pending',
      };
      orderItems.push(orderItem);

      // Group for vendor calculations
      const vId = product.vendor._id.toString();
      if (!vendorMap.has(vId)) {
        vendorMap.set(vId, { vendor: product.vendor, items: [] });
      }
      vendorMap.get(vId).items.push(orderItem);
    }

    const shippingFee = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    let discount = 0;

    // Coupon verification
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() <= new Date(coupon.validTo) && subtotal >= coupon.minPurchase) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        discount = Math.round(discount);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const totalAmount = Math.round(subtotal + tax + shippingFee - discount);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-2026-${randomSuffix}`;

    const isPaid = ['stripe', 'card', 'upi'].includes(paymentMethod);
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      isPaid,
      paidAt: isPaid ? Date.now() : null,
      paymentResult: isPaid
        ? {
            id: (paymentMethod === 'upi' ? 'upi_' : 'ch_') + Math.random().toString(36).substring(2, 15),
            status: 'succeeded',
            update_time: new Date().toISOString(),
            email_address: req.user.email,
          }
        : null,
      subtotal,
      tax,
      shippingFee,
      discount,
      totalAmount,
      orderStatus: 'processing',
      couponCode: couponCode || null,
      trackingTimeline: [
        {
          status: 'Order Placed',
          note: `Order registered via ${paymentMethod.toUpperCase()}`,
          timestamp: new Date(),
        },
        {
          status: 'Payment Authorized',
          note: isPaid ? `${paymentMethod.toUpperCase()} payment verified & captured` : 'Cash on Delivery selected',
          timestamp: new Date(),
        },
      ],
    });

    // Generate CommissionTransactions & vendor balances
    for (const [vendorId, vData] of vendorMap.entries()) {
      const vendorGross = vData.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const commissionRate = vData.vendor.commissionRate || 10;
      const platformFee = Math.round((vendorGross * commissionRate) / 100);
      const vendorNet = Math.round(vendorGross - platformFee);

      await CommissionTransaction.create({
        order: order._id,
        orderNumber: order.orderNumber,
        vendor: vData.vendor._id,
        vendorStoreName: vData.vendor.storeName,
        grossAmount: vendorGross,
        platformFee,
        vendorAmount: vendorNet,
        commissionRate,
        status: isPaid ? 'paid' : 'pending',
      });

      // Update vendor balance & sales totals
      vData.vendor.balance += vendorNet;
      vData.vendor.totalRevenue += vendorGross;
      await vData.vendor.save();

      // Notify vendor
      if (vData.vendor.user) {
        await Notification.create({
          recipient: vData.vendor.user,
          title: 'New Customer Order Received',
          message: `Order #${order.orderNumber} placed for ${vData.items.length} item(s). Net earnings: $${vendorNet.toFixed(2)}.`,
          link: '/vendor/orders',
          type: 'order',
        });
      }
    }

    // Notify customer
    await Notification.create({
      recipient: req.user._id,
      title: 'Order Confirmed!',
      message: `Your order #${order.orderNumber} has been placed successfully and is being prepared by our vendors.`,
      link: '/orders',
      type: 'order',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully with multi-vendor commission allocation',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.vendor', 'storeName phone address');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Download invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.downloadInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name sku')
      .populate('items.vendor', 'user');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isCustomer = order.customer?._id?.equals(req.user._id);
    const isVendor = req.user.role === 'vendor' && order.items.some(
      (item) => item.vendor?.user?.equals(req.user._id)
    );
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isVendor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not authorized to access this invoice' });
    }

    generateInvoicePDF(order, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Vendor/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    order.trackingTimeline.push({
      status: `Fulfillment status changed to ${status.toUpperCase()}`,
      note: note || `Order updated to ${status}`,
      timestamp: new Date(),
    });

    if (status === 'delivered') {
      order.isPaid = true;
      order.paidAt = order.paidAt || new Date();
    }

    await order.save();

    // Notify customer on status update
    await Notification.create({
      recipient: order.customer,
      title: `Order #${order.orderNumber} Update`,
      message: `Your order status has changed to "${status.toUpperCase()}".`,
      link: '/orders',
      type: 'order',
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
