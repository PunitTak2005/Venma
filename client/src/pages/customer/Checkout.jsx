import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Home,
  Briefcase,
  MapPin,
  QrCode,
  Store,
  Calendar,
  PackageCheck,
  FileText,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import orderService from '../../services/orderService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import InitialsBadge from '../../components/common/InitialsBadge';

export default function Checkout() {
  const { cartItems, subtotal, shippingFee, tax, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Wizard Step: 1 = Customer Info, 2 = Delivery Address, 3 = Review & Payment, 4 = Confirmation
  const [step, setStep] = useState(1);
  const [highestStepVisited, setHighestStepVisited] = useState(1);

  // Step 1: Customer Information Form
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    altPhone: '',
  });

  // Step 2: Delivery Address Form
  const [deliveryAddress, setDeliveryAddress] = useState({
    flatNo: '',
    street: user?.address?.street || '',
    landmark: '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    addressType: 'home', // 'home' | 'work' | 'other'
    saveForFuture: true,
  });

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '4532 8921 4455 1290',
    cardName: user?.name ? user.name.toUpperCase() : 'JOHN DOE',
    expiry: '09/28',
    cvv: '882',
  });

  // Submission & Validation States
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleInvoiceDownload = async () => {
    try {
      await orderService.downloadInvoice(completedOrder._id);
    } catch (err) {
      setSubmitError(err.response?.status === 401 ? 'Your session has expired. Please log in again.' : 'Unable to download invoice.');
    }
  };

  // Update customer info if user loads asynchronously
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      setDeliveryAddress((prev) => ({
        ...prev,
        street: prev.street || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || '',
        pincode: prev.pincode || user.address?.zipCode || '',
      }));
    }
  }, [user]);

  // Group cart products by vendor for marketplace packaging
  const vendorPackages = useMemo(() => {
    const map = new Map();
    cartItems.forEach((item) => {
      const vKey = item.vendor?._id || item.vendor || 'marketplace-direct';
      const vName = item.vendor?.storeName || (typeof item.vendor === 'string' ? 'Marketplace Merchant' : 'Verified Merchant');
      const vLogo = item.vendor?.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=80&q=80';

      if (!map.has(vKey)) {
        map.set(vKey, {
          vendorId: vKey,
          storeName: vName,
          logo: vLogo,
          items: [],
          packageSubtotal: 0,
        });
      }
      const pkg = map.get(vKey);
      pkg.items.push(item);
      pkg.packageSubtotal += item.price * item.quantity;
    });
    return Array.from(map.values());
  }, [cartItems]);

  // Dynamic estimated delivery date (3 days from now)
  const deliveryDateFormatted = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

  // Validation functions
  const validateStep1 = () => {
    const errors = {};
    if (!customerInfo.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!customerInfo.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Please provide a valid email address';
    }
    const cleanPhone = customerInfo.phone.replace(/\D/g, '');
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Mobile phone number is required';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!deliveryAddress.street.trim()) errors.street = 'Street / Colony Address is required';
    if (!deliveryAddress.city.trim()) errors.city = 'City is required';
    if (!deliveryAddress.state.trim()) errors.state = 'State / Region is required';
    const cleanPin = deliveryAddress.pincode.replace(/\s/g, '');
    if (!cleanPin) {
      errors.pincode = 'PIN / Postal code is required';
    } else if (cleanPin.length < 5 || cleanPin.length > 8) {
      errors.pincode = 'Enter a valid PIN / Postal code (e.g. 560001)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        errors.upiId = 'Enter a valid UPI ID (e.g. yourname@oksbi)';
      }
    } else if (paymentMethod === 'card') {
      const cleanNum = cardData.cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) errors.cardNumber = 'Enter a valid 16-digit card number';
      if (!cardData.cardName.trim()) errors.cardName = 'Name on card is required';
      if (!cardData.expiry.trim() || !cardData.expiry.includes('/')) errors.expiry = 'MM/YY required';
      if (cardData.cvv.length < 3) errors.cvv = 'CVV required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToNextStep = () => {
    setSubmitError('');
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      setHighestStepVisited((prev) => Math.max(prev, 2));
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
      setHighestStepVisited((prev) => Math.max(prev, 3));
    }
  };

  const handleStepClick = (targetStep) => {
    if (targetStep <= highestStepVisited) {
      setFormErrors({});
      setStep(targetStep);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const combinedStreet = deliveryAddress.flatNo
        ? `${deliveryAddress.flatNo}, ${deliveryAddress.street}`
        : deliveryAddress.street;

      const payload = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: customerInfo.fullName,
          street: combinedStreet,
          landmark: deliveryAddress.landmark,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zipCode: deliveryAddress.pincode,
          country: deliveryAddress.country,
          phone: customerInfo.phone,
          alternatePhone: customerInfo.altPhone,
          addressType: deliveryAddress.addressType,
        },
        paymentMethod: paymentMethod === 'card' ? 'stripe' : paymentMethod,
        couponCode: coupon?.code || null,
      };

      const res = await api.post('/orders', payload);
      if (res.data?.success) {
        setCompletedOrder(res.data.data);
        setStep(4);
        clearCart();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Order checkout error', err);
      setSubmitError(
        err.response?.data?.message || 'Failed to authorize and place order. Please inspect details and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // Empty cart guard
  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[#C67C4E]/10 dark:bg-slate-800 text-[#C67C4E] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2">
          Add items from verified sellers to your cart to proceed through our secure checkout wizard.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-xs font-bold shadow-md hover:bg-[#2A2A2E] transition"
        >
          <span>Explore Product Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // STEP 4: Order Confirmation Screen with 5-Stage Timeline
  if (step === 4 && completedOrder) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-xl overflow-hidden">
          {/* Top Celebration Banner */}
          <div className="bg-gradient-to-r from-[#1C1C1E] via-[#2A2A2E] to-[#C67C4E] p-8 text-center text-white relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full">
              Order Successfully Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Thank You For Your Order!</h1>
            <p className="text-xs text-[#EFEAE3] mt-1 max-w-md mx-auto">
              A confirmation invoice has been generated and notifications have been dispatched to the merchants.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Metadata Pill Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Order ID</span>
                <span className="font-mono font-bold text-[#C67C4E] dark:text-[#D8956A] text-sm">
                  #{completedOrder.orderNumber || completedOrder._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Delivery</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {deliveryDateFormatted}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                  {completedOrder.paymentMethod || 'Credit Card'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Charged</span>
                <span className="font-bold text-[#2E8B57] text-sm">
                  ₹{completedOrder.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C67C4E]" />
                What happens next?
              </h4>
              <p>
                Our merchant partners are preparing your shipment. You will receive an SMS and email notification with your tracking link as soon as packages are dispatched.
              </p>
            </div>

            {/* Actions: View Orders / Download Invoice */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={handleInvoiceDownload}
                className="px-6 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
              >
                <FileText className="w-4 h-4 text-[#C67C4E]" />
                <span>Download Official Tax Invoice (PDF)</span>
              </button>
              <Link
                to="/orders"
                className="px-6 py-3 rounded-2xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
              >
                <PackageCheck className="w-4 h-4" />
                <span>View Order History</span>
              </Link>
            </div>

            {/* 5-Stage Tracking Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Shipment Tracking Timeline
              </h3>
              <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-2">
                {[
                  { title: 'Order Placed', desc: 'Received & Logged', active: true, done: true },
                  { title: 'Confirmed', desc: 'Merchant Accepted', active: true, done: true },
                  { title: 'Packed', desc: 'Secure Packaging', active: false, done: false },
                  { title: 'Shipped', desc: 'Carrier Dispatched', active: false, done: false },
                  { title: 'Delivered', desc: 'Arrival at Doorstep', active: false, done: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex sm:flex-col items-center sm:text-center space-x-3 sm:space-x-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                        item.done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.done ? '✓' : idx + 1}
                    </div>
                    <div className="mt-1.5">
                      <p className={`text-xs font-bold ${item.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Customer Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700/60">
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">Delivery Destination</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {completedOrder.shippingAddress?.name || customerInfo.fullName}
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  {completedOrder.shippingAddress?.street}
                  {completedOrder.shippingAddress?.landmark && ` (Near ${completedOrder.shippingAddress.landmark})`}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {completedOrder.shippingAddress?.city}, {completedOrder.shippingAddress?.state} - {completedOrder.shippingAddress?.zipCode}
                </p>
                <p className="text-slate-500 mt-1">
                  Phone: {completedOrder.shippingAddress?.phone}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">Merchant Fulfillment</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {completedOrder.items?.length || 1} line item(s) packaged across verified marketplace sellers.
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Free Standard Shipping & Transit Insurance</span>
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">
                  Tracking updates will be sent via SMS & Email.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                type="button"
                onClick={handleInvoiceDownload}
                className="px-6 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
              >
                <FileText className="w-4 h-4 text-[#C67C4E]" />
                <span>Download Official Tax Invoice (PDF)</span>
              </button>
              <Link
                to="/orders"
                className="px-6 py-3 rounded-2xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition"
              >
                <PackageCheck className="w-4 h-4" />
                <span>View Order History</span>
              </Link>
            </div>

            {/* Registered Platform Business Address */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
              <p>
                Official Marketplace Operator:{' '}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  VENMA (VENMA Multi-Vendor Marketplace Inc.)
                </span>{' '}
                • 184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India
              </p>
              <p className="mt-0.5 text-[10px]">
                Support Helpline: +91 6367088841 | support@venma.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* 4-Step Wizard Navigation Indicator */}
      <div className="bg-white dark:bg-[#1E1E20] p-4 sm:p-5 rounded-3xl border border-[#DDD6CE] dark:border-[#3A3A40] shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Customer Info' },
            { num: 2, label: 'Delivery Address' },
            { num: 3, label: 'Review & Pay' },
            { num: 4, label: 'Complete' },
          ].map((s, idx, arr) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            const isClickable = s.num <= highestStepVisited;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => handleStepClick(s.num)}
                  disabled={!isClickable}
                  className={`flex items-center space-x-2 text-left focus:outline-none transition ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCompleted
                        ? 'bg-[#C67C4E] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#1C1C1E] text-white ring-4 ring-[#C67C4E]/20 dark:ring-[#C67C4E]/40 shadow-md'
                        : 'bg-slate-100 dark:bg-[#2B2B2F] text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isCurrent
                          ? 'text-[#C67C4E] dark:text-[#D8956A]'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      {isCompleted ? 'Finished' : isCurrent ? 'Active Step' : 'Pending'}
                    </span>
                  </div>
                </button>

                {idx < arr.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                      step > s.num ? 'bg-[#C67C4E]' : 'bg-slate-200 dark:bg-[#3A3A40]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Global Error Banner */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-center space-x-2 max-w-3xl mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Form Grid + Right Sticky Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Customer Information */}
          {step === 1 && (
            <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>1. Customer Information</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We will send order confirmations and real-time delivery dispatches here.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">Step 1 of 3</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                      formErrors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="name@domain.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                      formErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Phone & Alternate Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      10-Digit Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+91 6367088841"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alternate Contact (Optional)
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.alternatePhone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, alternatePhone: e.target.value })}
                      placeholder="+91 6367088841"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Nav Action */}
              <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-7 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs flex items-center space-x-2 shadow-md hover:shadow-lg transition"
                >
                  <span>Continue to Delivery Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Address Form */}
          {step === 2 && (
            <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>2. Delivery Address</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Where should the merchant packages be dispatched to?
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">Step 2 of 3</span>
              </div>

              {/* Address Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 text-xs">
                  Select Address Category
                </label>
                <div className="flex items-center space-x-3">
                  {[
                    { id: 'home', label: 'Home (7 AM - 9 PM)', icon: Home },
                    { id: 'work', label: 'Work (9 AM - 6 PM)', icon: Briefcase },
                    { id: 'other', label: 'Other', icon: MapPin },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = deliveryAddress.addressType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setDeliveryAddress({ ...deliveryAddress, addressType: type.id })}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                          isSelected
                            ? 'bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 border-[#C67C4E] text-[#C67C4E]'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* Flat / House Number & Building */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Flat / House No. / Building
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.flatNo}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, flatNo: e.target.value })}
                      placeholder="e.g. Apt 4B, Silicon Heights"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.landmark}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                      placeholder="Near Apollo Pharmacy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Street Address / Colony <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    placeholder="123 MG Road, Koramangala 4th Block"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                      formErrors.street ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.street && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.street}</span>
                    </p>
                  )}
                </div>

                {/* City, State & PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      placeholder="Bengaluru"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                        formErrors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      placeholder="Karnataka"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                        formErrors.state ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.state && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      6-Digit PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                      placeholder="560001"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs outline-none transition focus:ring-2 focus:ring-[#C67C4E] ${
                        formErrors.pincode ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.country}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  />
                </div>

                {/* Save address checkbox */}
                <div className="pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryAddress.saveForFuture}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, saveForFuture: e.target.checked })}
                      className="rounded text-[#C67C4E] focus:ring-[#C67C4E]"
                    />
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      Save this delivery address to my account for faster future checkout
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 flex justify-between border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center space-x-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Customer Info</span>
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-7 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs flex items-center space-x-2 shadow-md hover:shadow-lg transition"
                >
                  <span>Review Order & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Multi-Vendor Order Review & Payment Selection */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Delivery Information Banner */}
              <div className="bg-[#C67C4E]/10 dark:bg-[#1C1C1E] p-5 rounded-3xl border border-[#C67C4E]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1C1C1E] text-[#C67C4E] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#C67C4E]/30">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>Guaranteed Delivery by {deliveryDateFormatted}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black">
                        FREE SHIPPING
                      </span>
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      All packages dispatched with multi-vendor insured transit and tamper-evident packaging.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Vendor Grouped Packages */}
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Store className="w-4 h-4 text-[#C67C4E]" />
                    <span>Vendor Packages ({vendorPackages.length} Dispatches)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[11px] font-bold text-[#C67C4E] hover:underline"
                  >
                    Edit Destination
                  </button>
                </div>

                <div className="space-y-4">
                  {vendorPackages.map((pkg, idx) => (
                    <div
                      key={pkg.vendorId}
                      className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2 text-xs">
                        <div className="flex items-center space-x-2.5">
                          <InitialsBadge name={pkg.storeName} />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Package #{idx + 1} — {pkg.storeName}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          Subtotal: ₹{Number(pkg.packageSubtotal || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {pkg.items.map((item) => (
                          <div key={item._id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-xl object-cover bg-white border border-slate-100 dark:border-slate-700"
                              />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                                <span className="text-slate-400 text-[11px]">
                                  Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Payment Method</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All payment transactions are encrypted and processed through verified gateways.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                      paymentMethod === 'cod'
                        ? 'border-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      <DollarSign className="w-4 h-4 text-[#C67C4E]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Pay with cash upon arrival at your doorstep.</p>
                  </div>

                  {/* Option 2: UPI / QR Code */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                      paymentMethod === 'upi'
                        ? 'border-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      <QrCode className="w-4 h-4 text-[#C67C4E]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">UPI / QR Code</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Instant transfer via Google Pay, PhonePe, Paytm.</p>
                  </div>

                  {/* Option 3: Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                      paymentMethod === 'card'
                        ? 'border-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      <CreditCard className="w-4 h-4 text-[#C67C4E]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Credit / Debit Card</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay & Amex supported.</p>
                  </div>
                </div>

                {/* Sub-Interface for UPI */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Enter Virtual Payment Address (UPI ID)
                    </span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank or mobilenumber@paytm"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs outline-none ${
                        formErrors.upiId ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                    {formErrors.upiId && (
                      <p className="text-[11px] text-red-500">{formErrors.upiId}</p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      A payment request notification will be sent to your UPI app upon order placement.
                    </p>
                  </div>
                )}

                {/* Sub-Interface for Credit / Debit Card */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Cardholder Details</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>256-Bit Encrypted</span>
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-500 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-mono text-xs"
                        />
                        {formErrors.cardNumber && <p className="text-red-500 text-[10px]">{formErrors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 mb-1">Expires (MM/YY)</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">Security CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm & Place Order Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Address</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-black text-sm shadow-lg shadow-[#1C1C1E]/20 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C67C4E]" />
                    <span>
                      {isSubmitting ? 'Securing & Placing Order...' : `Place Order (₹${Number(total || 0).toLocaleString('en-IN')})`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Order Summary (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Order Summary</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {cartItems.length} Product{cartItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{Number(subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery / Shipping</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {shippingFee === 0 ? 'FREE' : `₹${Number(shippingFee || 0).toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span>₹{Number(tax || 0).toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Marketplace Coupon Savings</span>
                  <span>-₹{Number(discount || 0).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-baseline text-slate-900 dark:text-white">
                <div>
                  <span className="font-black text-sm block">Grand Total Due</span>
                  <span className="text-[10px] text-slate-400 font-normal">Inclusive of all applicable taxes</span>
                </div>
                <span className="font-black text-xl text-[#C67C4E]">
                  ₹{Number(total || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Buyer Protection & Guarantee Badges */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>VENMA Buyer Protection</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Every transaction is backed by our 30-day return policy and 100% verified merchant authentic product guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
