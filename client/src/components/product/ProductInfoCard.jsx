import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Plus,
  Minus,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function ProductInfoCard({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
  inWishlist,
  onToggleWishlist,
  onScrollToReviews,
}) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const savings = hasDiscount ? Math.round(product.price - product.discountPrice).toLocaleString('en-IN') : 0;

  // Handle Share to Clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy product URL', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header: Brand, SKU & Share */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C87D55] bg-[#C87D55]/10 dark:bg-[#C87D55]/20 px-3 py-1 rounded-full">
            {product.brand || 'VENMA Official'}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            SKU: {product.sku || 'VN-9840'}
          </span>
        </div>

        {/* Share Button with Animated Tooltip */}
        <div className="relative">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#C87D55] dark:hover:text-[#C87D55] hover:border-[#C87D55]/50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Share this product"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Product Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1C1E] dark:text-[#F8F7F5] tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* Sold By & Vendor Location */}
      {product.vendor && (
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-slate-400">Sold by:</span>
          <Link
            to={`/vendors/${product.vendor.storeSlug || product.vendor._id || ''}`}
            className="font-bold text-[#C87D55] hover:underline"
          >
            {product.vendor.storeName || 'Official Merchant'}
          </Link>
          {(product.vendor.location || product.vendor.address?.city) && (
            <span className="inline-flex items-center space-x-1 text-slate-500 dark:text-slate-400 ml-1">
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <MapPin className="w-3.5 h-3.5 text-[#C87D55] flex-shrink-0" />
              <span>{product.vendor.location || `${product.vendor.address.city}, ${product.vendor.address.state}`}</span>
            </span>
          )}
        </div>
      )}

      {/* 3. Rating & Stock Status Row */}
      <div className="flex items-center flex-wrap gap-3 text-xs">
        <button
          type="button"
          onClick={onScrollToReviews}
          className="flex items-center space-x-1.5 group hover:opacity-80 transition"
        >
          <div className="flex items-center text-[#D4A24C]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(product.rating || 5)
                    ? 'fill-[#D4A24C] text-[#D4A24C]'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {Number(product.rating || 4.9).toFixed(1)}
          </span>
          <span className="text-slate-400 group-hover:underline">
            ({product.numReviews || 12} reviews)
          </span>
        </button>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        {product.stock > 5 ? (
          <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            In Stock ({product.stock} available)
          </span>
        ) : product.stock > 0 ? (
          <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-ping" />
            Only {product.stock} units left — order soon
          </span>
        ) : (
          <span className="inline-flex items-center text-red-500 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Temporarily Sold Out
          </span>
        )}
      </div>

      {/* 4. Price & Discount Card */}
      <div className="p-5 rounded-2xl bg-[#F7F5F2] dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] space-y-2">
        <div className="flex items-baseline space-x-3 flex-wrap gap-y-2">
          <span className="text-3xl sm:text-4xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
            ₹{Number(effectivePrice).toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-base text-slate-400 line-through">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-extrabold text-[#C87D55] bg-[#C87D55]/15 dark:bg-[#C87D55]/25 px-2.5 py-1 rounded-md">
              -{discountPercent}% OFF
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Save ₹{savings}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Price includes applicable GST/VAT. Free standard shipping on orders over ₹499.
        </p>
      </div>

      {/* 5. Quantity Stepper & Primary Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Stepper */}
          <div className="flex items-center justify-between border border-[#DDD6CE] dark:border-[#3A3A40] rounded-2xl bg-white dark:bg-[#1A1A1D] p-1.5 sm:w-36 flex-shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || product.stock === 0}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition rounded-xl"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-bold text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
              disabled={quantity >= (product.stock || 10) || product.stock === 0}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition rounded-xl"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart: Copper Accent with Live Total */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={product.stock === 0}
            className="flex-1 py-4 px-5 rounded-2xl bg-[#C87D55] hover:bg-[#A9653C] text-white font-bold text-sm shadow-lg shadow-[#C87D55]/20 hover:shadow-[#C87D55]/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart • ₹{(effectivePrice * quantity).toFixed(2)}</span>
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={onToggleWishlist}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
              inWishlist
                ? 'bg-red-50 text-red-500 border-red-200 dark:bg-red-950/40 dark:border-red-900 shadow-sm'
                : 'bg-white dark:bg-[#1A1A1D] text-slate-600 dark:text-slate-300 border-[#DDD6CE] dark:border-[#3A3A40] hover:text-red-500 hover:border-red-200'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-5 h-5 transition-transform active:scale-125 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Buy Now: Dark Slate Button */}
        <button
          type="button"
          onClick={onBuyNow}
          disabled={product.stock === 0}
          className="w-full py-3.5 rounded-2xl bg-[#1C1C1E] dark:bg-[#2B2B2F] hover:bg-[#2A2A2E] dark:hover:bg-[#3A3A40] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>Buy Now with 1-Click Checkout</span>
        </button>
      </div>
    </div>
  );
}
