const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['pending', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
      phone: { type: String, required: true },
      alternatePhone: { type: String, default: '' },
      addressType: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod', 'card', 'upi'],
      default: 'cod',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingTimeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    couponCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
