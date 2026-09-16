import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Store, Eye, X, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const primaryImage = product.thumbnail || product.images?.[0] || '/generated-products/electronics/wireless-headphones-main.webp';
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleQuickAdd = () => {
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  if (variant === 'curated') {
    return (
      <Link
        to={`/products/${product.slug || product._id}`}
        className="group bg-white dark:bg-[#1E1E20] rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40]/80 overflow-hidden shadow-[0_10px_30px_rgba(28,28,30,0.08)] hover:shadow-[0_16px_36px_-6px_rgba(198,124,78,0.22)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative"
      >
        {/* Product Image & Badges */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] overflow-hidden bg-[#F7F5F2] dark:bg-[#121212]">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#C0392B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
              -{discountPercent}% OFF
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product._id);
            }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              inWishlist
                ? 'bg-red-50 text-red-500 dark:bg-red-950/80'
                : 'bg-white/90 text-slate-600 hover:text-red-500 dark:bg-[#1E1E20]/90 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-500' : ''}`} />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Category badge & Stock status */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 px-2.5 py-1 rounded-full">
                {product.category?.name || 'Curated'}
              </span>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  product.stock > 10
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    : product.stock > 0
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    : 'bg-red-100 dark:bg-red-950/60 text-red-700'
                }`}
              >
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-base sm:text-lg font-bold text-[#1C1C1E] dark:text-[#F8F7F5] group-hover:text-[#C67C4E] dark:group-hover:text-[#C67C4E] transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Vendor & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center space-x-1.5 truncate max-w-[60%]">
                <Store className="w-3.5 h-3.5 text-[#C67C4E] flex-shrink-0" />
                <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                  {product.vendor?.storeName || 'Verified Vendor'}
                </span>
              </div>
              <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-[#D4A24C] fill-[#D4A24C]" />
                <span>{product.rating || '4.8'}</span>
                <span className="text-[10px] text-slate-400">({product.numReviews || 0})</span>
              </div>
            </div>
          </div>

          {/* Price & View Product Button */}
          <div className="mt-5 pt-4 border-t border-[#DDD6CE]/60 dark:border-[#3A3A40]/60 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
                  ₹{Number(effectivePrice).toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-[#6B6B70] dark:text-[#A1A1AA] line-through">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C67C4E] text-white text-xs sm:text-sm font-bold shadow-sm group-hover:bg-[#A9653C] transition-colors">
              <span>View Product</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <>
      <div className="group bg-white dark:bg-[#1E1E20] rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40]/80 overflow-hidden shadow-[0_10px_30px_rgba(28,28,30,0.08)] hover:shadow-[0_14px_35px_-5px_rgba(198,124,78,0.18)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative">
        {/* Product Image & Badges */}
        <div className="relative aspect-square overflow-hidden bg-[#F7F5F2] dark:bg-[#121212]">
          <Link to={`/products/${product.slug || product._id}`}>
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#C0392B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
              -{discountPercent}% OFF
            </span>
          )}

          {/* Stock Alert */}
          {product.stock <= 5 && product.stock > 0 ? (
            <span className="absolute bottom-3 left-3 bg-[#C0392B]/90 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow">
              Only {product.stock} left
            </span>
          ) : product.stock === 0 ? (
            <span className="absolute bottom-3 left-3 bg-slate-700/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
              Out of Stock
            </span>
          ) : null}

          {/* Floating Action Buttons (Wishlist + Quick View) */}
          <div className="absolute top-3 right-3 flex flex-col space-y-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => toggleWishlist(product._id)}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                inWishlist
                  ? 'bg-red-50 text-red-500 dark:bg-red-950/80'
                  : 'bg-white/90 text-slate-600 hover:text-red-500 dark:bg-[#1E1E20]/90 dark:text-slate-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-500' : ''}`} />
            </button>

            <button
              onClick={() => setShowQuickView(true)}
              aria-label="Quick View"
              className="p-2 rounded-full backdrop-blur-md bg-white/90 text-[#1C1C1E] hover:text-[#C67C4E] dark:hover:text-[#C67C4E] dark:bg-[#1E1E20]/90 dark:text-slate-300 transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Stock Indicators */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md truncate">
                {product.category?.name || 'General'}
              </span>
              <span className={`text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded ${
                product.stock > 10
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  : product.stock > 0
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  : 'bg-red-100 dark:bg-red-950/60 text-red-700'
              }`}>
                Stock: {product.stock}
              </span>
            </div>

            {/* Vendor Name & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <Link
                to={`/vendors/${product.vendor?.storeSlug || product.vendor?.slug || product.vendor?._id || ''}`}
                className="flex items-center space-x-1 truncate max-w-[140px] hover:text-[#C67C4E] dark:hover:text-[#D8956A] transition-colors"
                title={`Visit ${product.vendor?.storeName || 'Vendor'}`}
              >
                <Store className="w-3 h-3 text-[#C67C4E] flex-shrink-0" />
                <span className="truncate text-slate-600 dark:text-slate-400 font-medium">{product.vendor?.storeName || 'Verified Vendor'}</span>
              </Link>
              <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-[#D4A24C] fill-[#D4A24C]" />
                <span>{product.rating || '4.8'}</span>
                <span className="text-[10px] text-slate-400">({product.numReviews || 0})</span>
              </div>
            </div>

            {/* Title */}
            <Link
              to={`/products/${product.slug || product._id}`}
              className="block text-sm font-semibold text-[#1C1C1E] dark:text-[#F8F7F5] hover:text-[#C67C4E] dark:hover:text-[#C67C4E] transition-colors line-clamp-2 mt-1"
            >
              {product.name}
            </Link>
          </div>

          {/* Price and Cart Button */}
          <div className="mt-4 pt-3 border-t border-[#DDD6CE]/60 dark:border-[#3A3A40]/60 flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
                  ₹{Number(effectivePrice).toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-[#6B6B70] dark:text-[#A1A1AA] line-through">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1 ${
                addedAnimation
                  ? 'bg-[#C67C4E] text-white'
                  : 'bg-[#F7F5F2] dark:bg-[#2B2B2F] text-[#1C1C1E] dark:text-[#F8F7F5] hover:bg-[#C67C4E] hover:text-white dark:hover:bg-[#C67C4E]'
              }`}
              title={product.stock === 0 ? 'Out of Stock' : 'Quick Add to Cart'}
            >
              {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setShowQuickView(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  {product.category?.name || 'Category'}
                </span>

                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h3>

                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center text-amber-400">
                    {'★'.repeat(Math.round(product.rating || 5))}
                  </span>
                  <span>({product.numReviews || 0} reviews)</span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{Number(effectivePrice).toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      setShowQuickView(false);
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 py-3 rounded-xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-md shadow-[#C67C4E]/20 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    to={`/products/${product.slug || product._id}`}
                    onClick={() => setShowQuickView(false)}
                    className="px-4 py-3 rounded-xl border border-[#DDD6CE] dark:border-[#3A3A40] hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F] text-[#1C1C1E] dark:text-[#F8F7F5] font-bold text-xs transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
