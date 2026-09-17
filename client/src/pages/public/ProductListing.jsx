import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  RotateCcw,
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/customer/ProductCard';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const vendorParam = searchParams.get('vendor');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Filters state from searchParams
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const page = searchParams.get('page') || '1';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') || '';

  useEffect(() => {
    if (vendorParam) return;
    const fetchMetadata = async () => {
      try {
        const catRes = await api.get('/categories');
        if (catRes.data.success) setCategories(catRes.data.data);
      } catch (err) {
        console.error('Failed to load filter metadata');
      }
    };
    fetchMetadata();
  }, [vendorParam]);

  useEffect(() => {
    if (vendorParam) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        const res = await api.get('/products?' + queryParams.toString());
        if (res.data.success) {
          setProducts(res.data.data);
          setTotalProducts(res.data.total);
          setTotalPages(res.data.pages);
        }
      } catch (err) {
        console.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, vendorParam]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const removeFilter = (key) => {
    updateParam(key, '');
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Redirect legacy or direct /products?vendor=... URLs to the unified Vendor Profile page
  if (vendorParam) {
    const pageParam = searchParams.get('page');
    const targetUrl = `/vendors/${vendorParam}${pageParam && pageParam !== '1' ? `?page=${pageParam}` : ''}`;
    return <Navigate to={targetUrl} replace />;
  }

  // Check which filters are active
  const hasActiveFilters = Boolean(keyword || category || minPrice || maxPrice || rating || inStock);

  // Helper names
  const activeCategoryDoc = categories.find((c) => c.slug === category || c._id === category);
  const activeCategoryName = activeCategoryDoc?.name;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {keyword ? ('Search Results for "' + keyword + '"') : (activeCategoryName || 'Marketplace Product Catalog')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showing <strong className="text-slate-900 dark:text-white">{products.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalProducts}</strong> curated products from verified vendors
          </p>
        </div>

        {/* Sort and View Toggle Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="hidden sm:inline font-semibold">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#C67C4E]"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-[#C67C4E] shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-[#C67C4E] shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Applied Filter Chips Strip */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mr-1">Active Filters:</span>

          {keyword && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] font-medium">
              <span>Keyword: "{keyword}"</span>
              <button onClick={() => removeFilter('keyword')} className="ml-1.5 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          )}

          {category && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-300 font-medium">
              <span>Category: {activeCategoryName || category}</span>
              <button onClick={() => removeFilter('category')} className="ml-1.5 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
              <span>Price: ₹{minPrice ? Number(minPrice).toLocaleString('en-IN') : '0'} - ₹{maxPrice ? Number(maxPrice).toLocaleString('en-IN') : '∞'}</span>
              <button onClick={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }} className="ml-1.5 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          )}

          {rating && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 font-medium">
              <span>★ {rating}+ Stars</span>
              <button onClick={() => removeFilter('rating')} className="ml-1.5 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          )}

          {inStock === 'true' && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-300 font-medium">
              <span>In Stock Only</span>
              <button onClick={() => removeFilter('inStock')} className="ml-1.5 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="ml-auto text-xs font-bold text-red-500 hover:text-red-600 underline px-2 py-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Sidebar (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#C67C4E]" />
                <span>Filter Catalog</span>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-slate-500 hover:text-red-500 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Categories
              </h4>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-xl transition ${!category ? 'bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  All Categories
                </button>
                {categories.map((c) => {
                  const isSelected = category === c.slug || category === c._id;
                  return (
                    <button
                      key={c._id}
                      onClick={() => updateParam('category', isSelected ? '' : (c.slug || c._id))}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded-xl transition truncate flex items-center justify-between ${isSelected ? 'bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                      <span className="truncate">{c.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-[#C67C4E]/20 px-1.5 py-0.5 rounded-md text-[#C67C4E]">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Bounds */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Price Bounds (₹)
              </h4>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Customer Rating
              </h4>
              <div className="space-y-1">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => updateParam('rating', rating === String(stars) ? '' : String(stars))}
                    className={`w-full flex items-center space-x-2 text-xs py-1 px-2.5 rounded-xl transition ${rating === String(stars) ? 'bg-amber-50 dark:bg-amber-950/60 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    <div className="flex text-amber-400">
                      {'★'.repeat(stars)}
                      <span className="text-slate-300">{'★'.repeat(5 - stars)}</span>
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock === 'true'}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-[#C67C4E] focus:ring-[#C67C4E]"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Product Grid/List View */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#C67C4E]/10 dark:bg-slate-700 text-[#C67C4E] flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
              <p className="text-xs text-slate-500 mt-1">
                No catalog items match your search criteria. Try loosening your price bounds or clearing active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-5 px-6 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-xs font-bold shadow-md hover:bg-[#2A2A2E] transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={product.thumbnail || product.images?.[0] || '/generated-products/electronics/wireless-headphones-main.webp'}
                    alt={product.name}
                    className="w-24 h-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.description}</p>
                    <span className="text-[11px] text-[#10B981] font-semibold mt-2 block">
                      Vendor:{' '}
                      <Link
                        to={`/vendors/${product.vendor?.storeSlug || product.vendor?._id || ''}`}
                        className="hover:underline hover:text-[#C67C4E] dark:hover:text-[#D8956A] transition-colors"
                      >
                        {product.vendor?.storeName || 'Verified Merchant'}
                      </Link>
                    </span>
                  </div>
                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{Number((product.discountPrice > 0 ? product.discountPrice : product.price) || 0).toLocaleString('en-IN')}
                      </span>
                      {product.discountPrice > 0 && product.discountPrice < product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <Link
                      to={'/products/' + (product.slug || product._id)}
                      className="mt-2 px-5 py-2 rounded-xl bg-[#1C1C1E] text-white text-xs font-semibold hover:bg-[#2A2A2E] transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center space-x-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateParam('page', String(pageNum))}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${String(pageNum) === String(page) ? 'bg-[#1C1C1E] text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[#C67C4E]" />
                  <span>Filter Products</span>
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Categories</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => { updateParam('category', ''); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-xl transition ${!category ? 'bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => {
                    const isSelected = category === c.slug || category === c._id;
                    return (
                      <button
                        key={c._id}
                        onClick={() => { updateParam('category', isSelected ? '' : (c.slug || c._id)); setIsMobileFilterOpen(false); }}
                        className={`w-full text-left text-xs py-1.5 px-2.5 rounded-xl transition truncate flex items-center justify-between ${isSelected ? 'bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        <span className="truncate">{c.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#C67C4E]/20 px-1.5 py-0.5 rounded-md text-[#C67C4E]">Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Price Bounds (₹)</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Mobile In Stock Only */}
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={inStock === 'true'}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-[#C67C4E]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => { clearAllFilters(); setIsMobileFilterOpen(false); }}
                className="w-full py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 text-xs font-bold bg-[#1C1C1E] text-white rounded-xl shadow-md hover:bg-[#2A2A2E]"
              >
                Apply & View ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
