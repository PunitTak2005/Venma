import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tooltip from '../../components/common/Tooltip';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Store,
  Package,
  RotateCcw,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    tax,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ error: '', success: '' });
  const [applying, setApplying] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponMsg({ error: '', success: '' });

    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponMsg({ error: '', success: res.message });
      setCouponInput('');
    } else {
      setCouponMsg({ error: res.message, success: '' });
    }
    setApplying(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-[#F8ECE3] dark:bg-[#1E1E20] text-[#C67C4E] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">Your Cart is Empty</h2>
        <p className="text-xs text-[#6B6B70] dark:text-[#A1A1AA] mt-2 mb-8 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore hundreds of deals from verified independent creators.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-lg shadow-black/20 transition-all hover:scale-105"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4 text-[#C67C4E]" />
        </Link>
      </div>
    );
  }

  // Group items by Vendor Storefront
  const vendorGroups = cartItems.reduce((acc, item) => {
    const vId = item.vendor?._id || item.vendor || 'general';
    const vName = item.vendor?.storeName || 'Verified Marketplace Vendor';
    const vSlug = item.vendor?.storeSlug || vId;
    if (!acc[vId]) {
      acc[vId] = { vendorName: vName, vendorSlug: vSlug, items: [] };
    }
    acc[vId].items.push(item);
    return acc;
  }, {});

  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Unified Multi-Vendor Cart
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Items from {Object.keys(vendorGroups).length} independent merchant{Object.keys(vendorGroups).length > 1 ? 's' : ''} combined into a single unified checkout.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            {totalUnits} Item{totalUnits > 1 ? 's' : ''} Total
          </span>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline px-2 py-1 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Clear entire shopping cart?</h3>
            <p className="text-xs text-slate-400">All items from all vendors will be removed from your cart.</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow"
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items Grouped by Vendor */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(vendorGroups).map(([vId, group]) => {
            const vendorSubtotal = group.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div
                key={vId}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4"
              >
                {/* Vendor Package Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <Link
                        to={'/vendors/' + group.vendorSlug}
                        className="font-bold text-slate-900 dark:text-white hover:text-[#10B981] transition flex items-center space-x-1"
                      >
                        <span>{group.vendorName}</span>
                      </Link>
                      <span className="text-[10px] text-[#10B981] font-semibold block">Dispatched directly from merchant</span>
                    </div>
                  </div>

                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Package Subtotal: ₹{Number(vendorSubtotal).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Items from this vendor */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {group.items.map((item) => (
                    <div
                      key={item._id}
                      className="py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                    >
                      <img
                        src={item.image || '/generated-products/electronics/wireless-headphones-main.webp'}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                      />

                      <div className="flex-1 text-center sm:text-left">
                        <Link
                          to={'/products/' + (item.slug || item._id)}
                          className="text-xs font-bold text-[#1C1C1E] dark:text-[#F8F7F5] hover:text-[#C67C4E] transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-2 flex items-center justify-center sm:justify-start space-x-3">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{Number(item.originalPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-[10px] text-[#10B981] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                            In Stock ({item.stock} left)
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 p-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val > 0) {
                                updateQuantity(item._id, Math.min(val, item.stock));
                              }
                            }}
                            className="w-10 text-center text-xs font-bold text-slate-900 dark:text-white bg-transparent outline-none"
                            aria-label="Quantity"
                          />

                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <Tooltip content="Remove item" position="top">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Unified Checkout Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Order Summary</h3>

            {/* Coupon input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. WELCOME20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-mono outline-none focus:ring-2 focus:ring-[#C67C4E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </form>

              {couponMsg.error && <p className="text-xs text-red-500 mt-2 font-medium">{couponMsg.error}</p>}
              {couponMsg.success && <p className="text-xs text-[#10B981] mt-2 font-medium">{couponMsg.success}</p>}

              {coupon && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold font-mono">{coupon.code} Applied</span>
                  <button onClick={removeCoupon} className="text-xs text-red-500 underline font-semibold">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Financial breakdown */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/60 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span>₹{Number(tax).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Consolidated Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-[#10B981]">FREE</strong> : `₹${Number(shippingFee).toLocaleString('en-IN')}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#10B981] font-bold">
                  <span>Promo Discount</span>
                  <span>-₹{Number(discount).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-baseline text-base font-black text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{Number(total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-sm shadow-lg shadow-[#1C1C1E]/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Proceed to Single Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Multi-Vendor Split Fulfillment Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
