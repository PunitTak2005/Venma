import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { formatProductCount } from '../../utils/formatters';
import {
  Store,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Users,
  MessageSquare,
  Package,
  Share2,
  ChevronLeft,
  ChevronRight,
  Truck,
  Award,
  UserPlus,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import ProductCard from '../../components/customer/ProductCard';
import InitialsBadge from '../../components/common/InitialsBadge';

export default function VendorStore() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // products, about, reviews, contact
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [productFilter, setProductFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [copiedLink, setCopiedLink] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  }, []);

  // Derive pagination state directly from URL query param
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const itemsPerPage = 8;

  const executeFollow = useCallback(
    async (vendorId, shouldFollow) => {
      setFollowLoading(true);
      const prevFollowing = isFollowing;
      const prevCount = followerCount;

      // Optimistic update
      setIsFollowing(shouldFollow);
      setFollowerCount((prev) => (shouldFollow ? prev + 1 : Math.max(0, prev - 1)));

      try {
        if (shouldFollow) {
          const res = await vendorService.followVendor(vendorId);
          if (res.success) {
            setIsFollowing(true);
            setFollowerCount(res.followerCount);
            showToast(res.message || 'You are now following this store', 'success');
          }
        } else {
          const res = await vendorService.unfollowVendor(vendorId);
          if (res.success) {
            setIsFollowing(false);
            setFollowerCount(res.followerCount);
            showToast(res.message || 'You unfollowed this store', 'success');
          }
        }
      } catch (err) {
        console.error('Follow error:', err);
        // Rollback
        setIsFollowing(prevFollowing);
        setFollowerCount(prevCount);
        if (err.response?.status === 401) {
          showToast('Please log in to follow stores', 'error');
          sessionStorage.setItem('venma_pending_follow', vendorId);
          navigate('/login', { state: { from: location.pathname } });
        } else {
          showToast(err.response?.data?.message || 'Failed to update follow status', 'error');
        }
      } finally {
        setFollowLoading(false);
      }
    },
    [isFollowing, followerCount, location.pathname, navigate, showToast]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const res = await vendorService.getVendorBySlug(slug);
        if (!isMounted) return;

        if (res.success) {
          setVendor(res.data);
          setProducts(res.products || []);
          setIsFollowing(!!res.isFollowing);
          setFollowerCount(res.followerCount || res.data.followersCount || 0);

          // Handle pending follow intent after guest login
          const pendingFollow = sessionStorage.getItem('venma_pending_follow');
          if (
            pendingFollow &&
            isAuthenticated &&
            (pendingFollow === res.data._id || pendingFollow === slug || pendingFollow === res.data.storeSlug)
          ) {
            sessionStorage.removeItem('venma_pending_follow');
            // Auto follow after returning from login
            executeFollow(res.data._id, true);
          }
        }
      } catch (err) {
        console.error('Failed to load vendor store:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVendorData();

    return () => {
      isMounted = false;
    };
  }, [slug, isAuthenticated, executeFollow]);

  const toggleFollow = () => {
    if (!vendor) return;

    if (!isAuthenticated) {
      // Preserve pending follow intent and redirect to login
      sessionStorage.setItem('venma_pending_follow', vendor._id || slug);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (followLoading) return;

    executeFollow(vendor._id, !isFollowing);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
        <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-400 font-medium">Loading merchant storefront, catalog, and reviews...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Merchant Store Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">This storefront may be temporarily suspended or relocated.</p>
        <Link to="/vendors" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-xs font-bold shadow hover:bg-[#2A2A2E] transition">
          Browse Verified Vendors
        </Link>
      </div>
    );
  }

  // Filter and sort vendor products
  const filteredProducts = products
    .filter((p) => {
      if (productFilter === 'inStock') return p.stock > 0;
      if (productFilter === 'sale') return p.discountPrice > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'price_desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalVendorProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalVendorProducts / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const updatePageParam = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page > 1) {
        next.set('page', String(page));
      } else {
        next.delete('page');
      }
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    updatePageParam(newPage);
    const el = document.getElementById('vendor-products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterChange = (filter) => {
    setProductFilter(filter);
    updatePageParam(1);
  };

  const handleSortChange = (sortVal) => {
    setSortBy(sortVal);
    updatePageParam(1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Clickable Breadcrumb Bar */}
      <div className="container mx-auto px-4 pt-4">
        <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium overflow-x-auto">
          <Link to="/" className="hover:text-[#C67C4E] transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link to="/vendors" className="hover:text-[#C67C4E] transition">Verified Stores</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-900 dark:text-white font-semibold truncate">{vendor.storeName}</span>
        </nav>
      </div>

      {/* 2. Store Hero Section & Branded Banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden bg-slate-950">
        <img
          src={vendor.banner || '/generated-vendors/technova-electronics-banner.webp'}
          alt={vendor.storeName}
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            <div className="text-white space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <InitialsBadge
                  name={vendor.storeName}
                  className="ring-2 ring-white/20 shadow-lg bg-black/50 text-[#F8ECE3] border-white/30"
                />
                <h1 className="text-2xl sm:text-3xl font-black">{vendor.storeName}</h1>
                <span className="bg-[#10B981] px-2 py-0.5 rounded-full text-white text-[10px] font-bold flex items-center shadow-sm" title="Verified Marketplace Seller">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Merchant
                </span>
              </div>

                {/* Specialization Badge */}
                <div className="flex items-center justify-center sm:justify-start">
                  <span className="text-xs font-bold text-[#D4A24C] bg-[#D4A24C]/20 border border-[#D4A24C]/30 px-2.5 py-0.5 rounded-full">
                    {vendor.specialty || 'General Marketplace Merchant'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-lg line-clamp-2">{vendor.description}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 pt-1">
                  <span className="flex items-center space-x-1 font-semibold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <strong className="text-white">{vendor.rating || '4.8'}</strong> ({vendor.numReviews || 0} reviews)
                  </span>
                  <span>•</span>
                  <span>{formatProductCount(products.length)}</span>
                  <span>•</span>
                  <span>{followerCount} Followers</span>
                  <span>•</span>
                  <span>Member since {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}</span>
                  {(vendor.location || vendor.address?.city) && (
                    <>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C67C4E]" />
                        <span>{vendor.location || `${vendor.address?.city}, ${vendor.address?.state}`}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Categories Sold Chips */}
                {vendor.categoriesSold && vendor.categoriesSold.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Categories:</span>
                    {vendor.categoriesSold.map((cat, idx) => (
                      <span key={idx} className="text-[10px] font-bold bg-white/10 text-slate-200 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleShare}
                className="min-h-[44px] h-[44px] px-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition text-xs font-bold flex items-center space-x-1.5"
                title="Share Store Link"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                id="vendor-follow-button"
                onClick={toggleFollow}
                disabled={followLoading}
                className={`min-h-[44px] h-[44px] px-5 sm:px-6 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-95 flex items-center space-x-2 select-none ${
                  followLoading
                    ? 'opacity-80 cursor-wait bg-slate-700 text-white'
                    : isFollowing
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 hover:-translate-y-0.5 shadow-sm'
                    : 'bg-[#C67C4E] hover:bg-[#B36B3D] text-white shadow-[#C67C4E]/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C67C4E]/30'
                }`}
                aria-label={isFollowing ? 'Unfollow Store' : 'Follow Store'}
              >
                {followLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>Updating...</span>
                  </>
                ) : isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 flex-shrink-0" />
                    <span>+ Follow Store</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KPI Highlights Cards Bar */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-[20px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE]/80 dark:border-[#3A3A40]/80 shadow-[0_10px_30px_rgba(28,28,30,0.08)] text-center">
            <Award className="w-5 h-5 text-[#C67C4E] mx-auto mb-1" />
            <span className="text-xs text-slate-400 block font-medium">Customer Rating</span>
            <span className="text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5]">★ {vendor.rating || '4.8'} / 5.0</span>
          </div>

          <div className="p-4 rounded-[20px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE]/80 dark:border-[#3A3A40]/80 shadow-[0_10px_30px_rgba(28,28,30,0.08)] text-center">
            <Package className="w-5 h-5 text-[#C67C4E] mx-auto mb-1" />
            <span className="text-xs text-slate-400 block font-medium">Catalog Inventory</span>
            <span className="text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5]">{products.length} Items</span>
          </div>

          <div className="p-4 rounded-[20px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE]/80 dark:border-[#3A3A40]/80 shadow-[0_10px_30px_rgba(28,28,30,0.08)] text-center">
            <Truck className="w-5 h-5 text-[#D4A24C] mx-auto mb-1" />
            <span className="text-xs text-slate-400 block font-medium">Dispatch Speed</span>
            <span className="text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5]">Under 24 Hours</span>
          </div>

          <div className="p-4 rounded-[20px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE]/80 dark:border-[#3A3A40]/80 shadow-[0_10px_30px_rgba(28,28,30,0.08)] text-center">
            <ShieldCheck className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
            <span className="text-xs text-slate-400 block font-medium">Merchant Status</span>
            <span className="text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5]">Verified Genuine</span>
          </div>
        </div>
      </div>

      {/* 4. Storefront Tabs Navigation */}
      <div className="container mx-auto px-4 sticky top-16 z-30 bg-[#F7F5F2]/95 dark:bg-[#121212]/95 backdrop-blur-md pt-2">
        <div className="flex border-b border-[#DDD6CE] dark:border-[#3A3A40] text-xs font-bold space-x-6 sm:space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3.5 transition flex items-center space-x-1.5 ${
              activeTab === 'products'
                ? 'border-b-2 border-[#C67C4E] text-[#C67C4E]'
                : 'text-slate-500 hover:text-[#1C1C1E] dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Store Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3.5 transition flex items-center space-x-1.5 ${
              activeTab === 'about'
                ? 'border-b-2 border-[#C67C4E] text-[#C67C4E]'
                : 'text-slate-500 hover:text-[#1C1C1E] dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>About Merchant & Policies</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 transition flex items-center space-x-1.5 ${
              activeTab === 'reviews'
                ? 'border-b-2 border-[#C67C4E] text-[#C67C4E]'
                : 'text-slate-500 hover:text-[#1C1C1E] dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Store Reviews & Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3.5 transition flex items-center space-x-1.5 ${
              activeTab === 'contact'
                ? 'border-b-2 border-[#C67C4E] text-[#C67C4E]'
                : 'text-slate-500 hover:text-[#1C1C1E] dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Seller</span>
          </button>
        </div>
      </div>

      {/* 5. Tab Contents */}
      <div className="container mx-auto px-4" id="vendor-products-section">
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Catalog Filter Controls */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-500">Stock:</span>
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      productFilter === 'all'
                        ? 'bg-[#1C1C1E] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    All Items ({products.length})
                  </button>
                  <button
                    onClick={() => handleFilterChange('sale')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      productFilter === 'sale'
                        ? 'bg-[#F97316] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Discounted Deals
                  </button>
                  <button
                    onClick={() => handleFilterChange('inStock')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      productFilter === 'inStock'
                        ? 'bg-[#10B981] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    In Stock Only
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="hidden sm:inline text-slate-400 text-[11px]">
                    Showing <strong className="text-slate-700 dark:text-slate-200">{totalVendorProducts > 0 ? startIndex + 1 : 0}</strong>–<strong className="text-slate-700 dark:text-slate-200">{Math.min(startIndex + itemsPerPage, totalVendorProducts)}</strong> of <strong className="text-slate-700 dark:text-slate-200">{totalVendorProducts}</strong>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-500">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-1.5 font-bold outline-none text-slate-700 dark:text-slate-200"
                    >
                      <option value="newest">Newest Additions</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto p-8">
                <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No products found</h3>
                <p className="text-xs text-slate-400 mt-1">Try switching your filter selection to view more items.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Showing products <strong className="text-slate-900 dark:text-white">{startIndex + 1}</strong> to <strong className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, totalVendorProducts)}</strong> of <strong className="text-slate-900 dark:text-white">{totalVendorProducts}</strong> (Page {safePage} of {totalPages})
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(safePage - 1)}
                        disabled={safePage <= 1}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                              pageNum === safePage
                                ? 'bg-[#1C1C1E] text-white shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(safePage + 1)}
                        disabled={safePage >= totalPages}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold text-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 px-2.5 py-1 rounded-md">
                  {vendor.specialty || 'Verified Specialty Merchant'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">Joined {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Merchant Biography & Mission</h3>
              <p className="leading-relaxed text-sm">{vendor.description}</p>
            </div>

            {/* Categories Sold */}
            {vendor.categoriesSold && vendor.categoriesSold.length > 0 && (
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Official Categories Sold:</h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.categoriesSold.map((cat, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <Phone className="w-3.5 h-3.5 text-[#C67C4E]" />
                  <span>Customer Support</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{vendor.phone || '+91 80 4123 4567'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#C67C4E]" />
                  <span>Headquarters</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {vendor.location ? `${vendor.location}, India` : (vendor.address?.city ? `${vendor.address.city}, ${vendor.address.state}, India` : 'India')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verification Status</span>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Identity & Business Verified</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">Store Policies</span>
                <p className="leading-relaxed">
                  Every order placed through VENMA is covered by our 30-day effortless return guarantee. Items returned within 30 days in original packaging are eligible for a full refund or exchange.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">Fulfillment & Shipping Zones</span>
                <p className="leading-relaxed">
                  This seller dispatches products within 24–48 business hours with complete multi-vendor item tracking provided upon carrier handoff.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-4xl space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-xs space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                {'★'.repeat(5)}
                <span className="font-bold text-slate-900 dark:text-white ml-2 text-sm">
                  {vendor.rating || '4.8'} Out of 5 Stars ({vendor.numReviews || 0} Verified Ratings)
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Customers consistently rate this merchant for fast delivery, accurate descriptions, and responsive customer service. Verified deliveries are backed by VENMA Buyer Protection.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Direct Merchant Inquiry</h3>
              <p className="text-slate-400">Send an inquiry regarding products, custom orders, or shipping timelines.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center space-x-2.5">
                <InitialsBadge name={vendor.storeName} />
                <span className="font-bold text-slate-900 dark:text-white">{vendor.storeName}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Phone className="w-3.5 h-3.5" />
                <span>{vendor.phone || '+91 80 4123 4567'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>{vendor.address?.street ? `${vendor.address.street}, ${vendor.address.city}, ${vendor.address.state}` : (vendor.location || 'India')}</span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry sent directly to the merchant!'); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Question about product availability or bulk orders"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#C67C4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Message</label>
                <textarea
                  rows="4"
                  placeholder="Describe your inquiry..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#C67C4E]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-md transition"
              >
                Send Message to Store
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating Toast Feedback Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-red-950/95 text-red-200 border-red-800/80 shadow-red-950/40'
              : 'bg-[#1C1C1E]/95 text-white border-slate-700/80 shadow-black/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
