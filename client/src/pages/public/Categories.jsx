import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Store, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Categories() {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/categories/featured-products');
        if (isMounted) {
          const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          setFeaturedCategories(items);
        }
      } catch (err) {
        console.error('Failed to load featured category products', err);
        if (isMounted) {
          setError('Unable to load featured products by category. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C67C4E]"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C67C4E]">Featured Category Showcase</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
          Featured Product per Category
        </h1>
        <p className="text-xs sm:text-sm text-[#8E8E93] dark:text-[#A1A1A6] mt-1">
          Explore representative premier products curated directly across active departments by verified merchants.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1E1E20] rounded-3xl border border-[#DDD6CE] dark:border-[#3A3A40] overflow-hidden flex flex-col h-[420px] animate-pulse"
            >
              <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700/60" />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                  <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : featuredCategories.length === 0 && !error ? (
        <div className="text-center py-16 bg-white dark:bg-[#1E1E20] rounded-3xl border border-[#DDD6CE] dark:border-[#3A3A40] p-8 space-y-3">
          <Sparkles className="w-8 h-8 mx-auto text-[#C67C4E]" />
          <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-[#F8F7F5]">No Featured Categories Available</h3>
          <p className="text-xs text-[#8E8E93] dark:text-[#A1A1A6]">
            Categories will appear here automatically once products are added to the marketplace.
          </p>
        </div>
      ) : (
        /* Responsive Grid: 4 cols desktop, 2 cols tablet, 1 col mobile */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((item) => {
            const product = item.product;
            if (!product) return null;

            const categoryName = item.category || product.category?.name || 'Department';
            const primaryImage =
              product.thumbnail ||
              (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
              '/generated-products/electronics/wireless-headphones-main.webp';
            const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
            const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
            const price = Number(effectivePrice).toLocaleString('en-IN');
            const originalPrice = Number(product.price).toLocaleString('en-IN');
            const vendorName = product.vendor?.storeName || 'Verified Vendor';
            const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : '4.8';
            const stockCount = typeof product.stock === 'number' ? product.stock : 10;
            const productUrl = `/products/${product.slug || product._id}`;

            return (
              <Link
                key={product._id || item.categorySlug}
                to={productUrl}
                className="group bg-white dark:bg-[#1E1E20] rounded-3xl border border-[#DDD6CE] dark:border-[#3A3A40] hover:border-[#C67C4E] dark:hover:border-[#C67C4E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(28,28,30,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-200 flex flex-col h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#C67C4E] focus:ring-offset-2 dark:focus:ring-offset-[#121214]"
              >
                {/* 1. Product Image with Category Badge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F5F2] dark:bg-[#121214] shrink-0">
                  <img
                    src={primaryImage}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/generated-products/electronics/wireless-headphones-main.webp';
                    }}
                  />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 dark:bg-[#1E1E20]/95 text-[#C67C4E] dark:text-[#E0A97E] shadow-sm backdrop-blur-xs border border-[#DDD6CE]/60 dark:border-[#3A3A40]/60">
                      {categoryName}
                    </span>
                  </div>

                  {/* Featured Tag Indicator */}
                  {product.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C67C4E] text-white shadow-sm">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Equal-height Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Vendor Name & Rating */}
                    <div className="flex items-center justify-between text-xs text-[#8E8E93] dark:text-[#A1A1A6]">
                      <span className="flex items-center space-x-1.5 truncate max-w-[65%] font-medium">
                        <Store className="w-3.5 h-3.5 text-[#C67C4E] shrink-0" />
                        <span className="truncate">{vendorName}</span>
                      </span>

                      <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                        <Star className="w-3.5 h-3.5 text-[#D4A24C] fill-[#D4A24C]" />
                        <span>{ratingValue}</span>
                        {product.numReviews > 0 && (
                          <span className="text-[10px] text-[#8E8E93] dark:text-[#A1A1A6]">
                            ({product.numReviews})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base font-bold text-[#1C1C1E] dark:text-[#F8F7F5] group-hover:text-[#C67C4E] dark:group-hover:text-[#C67C4E] transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* 3. Bottom Section: Price, Stock Status, "View Product" Button */}
                  <div className="pt-3 border-t border-[#F2ECE4] dark:border-[#2B2B2F] space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-lg sm:text-xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
                          ₹{price}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-[#8E8E93] dark:text-[#A1A1A6] line-through">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Stock status badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          stockCount > 10
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : stockCount > 0
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                            : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40'
                        }`}
                      >
                        {stockCount > 10 ? 'In Stock' : stockCount > 0 ? `Stock: ${stockCount}` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* "View Product" action button */}
                    <div className="w-full py-2.5 px-4 rounded-2xl bg-[#F7F5F2] dark:bg-[#2B2B2F] group-hover:bg-[#C67C4E] text-[#1C1C1E] dark:text-[#F8F7F5] group-hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-xs">
                      <span>View Product</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

