import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { formatProductCount } from '../../utils/formatters';
import {
  Store,
  Star,
  ShieldCheck,
  ArrowRight,
  Search,
  Package,
  Check,
  UserPlus,
  Loader2,
  AlertCircle,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import InitialsBadge from '../../components/common/InitialsBadge';

export default function VendorsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [followedVendors, setFollowedVendors] = useState({});
  const [followCounts, setFollowCounts] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await vendorService.getVendors();
        if (res.success) {
          setVendors(res.data);
          const initialFollows = {};
          const initialCounts = {};
          res.data.forEach((v) => {
            initialFollows[v._id] = !!v.isFollowing;
            initialCounts[v._id] = v.followerCount || v.followersCount || 0;
          });
          setFollowedVendors(initialFollows);
          setFollowCounts(initialCounts);
        }
      } catch (err) {
        console.error('Failed to load vendors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const toggleFollow = async (vendor) => {
    if (!vendor) return;

    if (!isAuthenticated) {
      sessionStorage.setItem('venma_pending_follow', vendor._id || vendor.storeSlug);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const vendorId = vendor._id;
    if (followLoading[vendorId]) return;

    const isCurrentlyFollowed = !!followedVendors[vendorId];
    const targetFollowState = !isCurrentlyFollowed;

    // Optimistic update
    setFollowLoading((prev) => ({ ...prev, [vendorId]: true }));
    setFollowedVendors((prev) => ({ ...prev, [vendorId]: targetFollowState }));
    setFollowCounts((prev) => ({
      ...prev,
      [vendorId]: targetFollowState ? (prev[vendorId] || 0) + 1 : Math.max(0, (prev[vendorId] || 1) - 1),
    }));

    try {
      if (targetFollowState) {
        const res = await vendorService.followVendor(vendorId);
        if (res.success) {
          setFollowCounts((prev) => ({ ...prev, [vendorId]: res.followerCount }));
          showToast(res.message || `You are now following ${vendor.storeName}`, 'success');
        }
      } else {
        const res = await vendorService.unfollowVendor(vendorId);
        if (res.success) {
          setFollowCounts((prev) => ({ ...prev, [vendorId]: res.followerCount }));
          showToast(res.message || `You unfollowed ${vendor.storeName}`, 'success');
        }
      }
    } catch (err) {
      // Rollback on error
      setFollowedVendors((prev) => ({ ...prev, [vendorId]: isCurrentlyFollowed }));
      setFollowCounts((prev) => ({
        ...prev,
        [vendorId]: isCurrentlyFollowed ? (prev[vendorId] || 0) + 1 : Math.max(0, (prev[vendorId] || 1) - 1),
      }));
      if (err.response?.status === 401) {
        showToast('Please sign in to follow stores', 'error');
        navigate('/login', { state: { from: location.pathname } });
      } else {
        showToast(err.response?.data?.message || 'Failed to update follow status', 'error');
      }
    } finally {
      setFollowLoading((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  // Derive unique specializations from vendors
  const allSpecializations = ['All', ...new Set(vendors.map((v) => v.specialty).filter(Boolean))];

  const filteredVendors = vendors
    .filter((v) => {
      const searchLower = search.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        v.storeName?.toLowerCase().includes(searchLower) ||
        v.description?.toLowerCase().includes(searchLower) ||
        v.specialty?.toLowerCase().includes(searchLower) ||
        v.location?.toLowerCase().includes(searchLower) ||
        v.address?.city?.toLowerCase().includes(searchLower) ||
        v.address?.state?.toLowerCase().includes(searchLower);
      const matchesRating = Number(v.rating || 0) >= Number(minRating);
      const matchesSpecialty = selectedCategory === 'All' || v.specialty === selectedCategory;
      return matchesSearch && matchesRating && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'products_desc') return (b.totalProducts || 0) - (a.totalProducts || 0);
      if (sortBy === 'reviews_desc') return (b.numReviews || 0) - (a.numReviews || 0);
      if (sortBy === 'name_asc') return a.storeName.localeCompare(b.storeName);
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#1C1C1E] p-8 sm:p-12 text-white overflow-hidden shadow-2xl border border-slate-700/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C67C4E]/20 text-[#C67C4E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Marketplace Brands</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Discover Verified Creators & Stores
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Support authentic brand merchants across electronics, artisan decor, fashion, and sports fitness.
            Follow your favorite brands to stay updated with newest product drops.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-[#C67C4E]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allSpecializations.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedCategory(spec)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === spec
                ? 'bg-[#C67C4E] text-white shadow-md shadow-[#C67C4E]/25 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stores by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#C67C4E]"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="0">All Ratings</option>
            <option value="4.8">★ 4.8 & Up</option>
            <option value="4.5">★ 4.5 & Up</option>
            <option value="4.0">★ 4.0 & Up</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="products_desc">Most Products</option>
            <option value="reviews_desc">Most Reviews</option>
            <option value="name_asc">Store Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
          <Store className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No merchant stores found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search terms or filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setMinRating('0');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#C67C4E] text-white text-xs font-bold shadow hover:bg-[#A9653C] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Vendor Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVendors.map((vendor) => {
            const isFollowed = !!followedVendors[vendor._id];
            const followerCount = followCounts[vendor._id] ?? (vendor.followerCount || vendor.followersCount || 0);
            const isBtnLoading = !!followLoading[vendor._id];

            return (
              <div
                key={vendor._id}
                className="group bg-white dark:bg-slate-800/90 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner & Logo (16:9 aspect ratio) */}
                <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-900">
                  <img
                    src={vendor.banner || '/generated-vendors/technova-electronics-banner.webp'}
                    alt={vendor.storeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-3.5 left-5 shadow-md rounded-full ring-2 ring-white dark:ring-slate-800 bg-white dark:bg-slate-800">
                    <InitialsBadge name={vendor.storeName} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#C67C4E] transition-colors truncate max-w-[150px]">
                        {vendor.storeName}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{vendor.rating || '4.8'}</span>
                      </div>
                    </div>

                    {/* Specialization Badge */}
                    <div className="mb-2">
                      <span className="inline-block text-[11px] font-bold text-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 px-2 py-0.5 rounded-lg truncate max-w-full">
                        {vendor.specialty || 'General Marketplace'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-[#10B981] font-semibold mb-2">
                      <span className="flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-0.5" />
                        Verified Merchant
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-slate-600 dark:text-slate-300 font-bold flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        {formatProductCount(vendor.totalProducts || 0)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {followerCount} {followerCount === 1 ? 'Follower' : 'Followers'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {vendor.description || 'Quality merchandise curated directly from verified brand creators.'}
                    </p>

                    {/* Categories Sold Tags */}
                    {vendor.categoriesSold && vendor.categoriesSold.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {vendor.categoriesSold.slice(0, 2).map((cat, ci) => (
                          <span key={ci} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Location Badge */}
                    {(vendor.location || vendor.address?.city) && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C67C4E] flex-shrink-0" />
                        <span className="truncate">{vendor.location || `${vendor.address?.city}, ${vendor.address?.state}`}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleFollow(vendor)}
                      disabled={isBtnLoading}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 flex items-center space-x-1.5 select-none ${
                        isBtnLoading
                          ? 'opacity-75 cursor-wait bg-slate-200 dark:bg-slate-700 text-slate-500'
                          : isFollowed
                          ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#C67C4E] hover:bg-[#B36B3D] text-white shadow-sm hover:shadow'
                      }`}
                    >
                      {isBtnLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isFollowed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ Follow</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/vendors/${vendor.storeSlug || vendor._id}`}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-sm flex items-center space-x-1 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Visit Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle Toast Feedback Notification */}
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
