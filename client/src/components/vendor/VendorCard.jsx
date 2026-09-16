import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, Check, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import VendorBanner from './VendorBanner';
import InitialsBadge from '../common/InitialsBadge';
import VerifiedBadge from './VerifiedBadge';
import VendorTags from './VendorTags';
import VendorStats from './VendorStats';
import { formatProductCount } from '../../utils/formatters';
import VendorCTAButton from './VendorCTAButton';

// Exact category tags mapping for vendors
const vendorTagsMap = {
  'technova-electronics': ['Audio Fidelity', 'Smart IoT', 'Computing'],
  'homecraft-artisan-studio': ['Artisan Wood', 'Nordic Decor', 'Ceramics'],
  'apex-gaming-hardware': ['OLED Displays', 'Mechanical Keys', 'Esports'],
  'chronolux-timepieces': ['Automatic Chrono', 'Sapphire Glass', 'Heritage'],
  'bookworm-quill': ['Fine Stationery', 'Collector Editions', 'Fountain Pens'],
  'urban-fashion-collective': ['Streetwear', 'Ethical Textiles', 'Tailored'],
  'sportspro-athletics': ['Adjustable Weights', 'Endurance', 'Gym Gear'],
  'culinary-masterworks': ['Espresso Tools', 'Damascus Steel', 'Cookware'],
  'beautybloom-organics': ['Cold-Pressed', 'Clean Beauty', 'Botanical Oils'],
  'velocity-auto-detailing': ['Ceramic Coatings', 'Microfiber', 'Auto Detailing'],
  'fitmotion-sports': ['Resistance Bands', 'Gym Gear', 'Home Fitness'],
  'autoshine-garage': ['Ceramic Coatings', 'Auto Detailing', 'Car Care'],
};

export default function VendorCard({ vendor, onToast }) {
  if (!vendor) return null;

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [isFollowing, setIsFollowing] = useState(!!vendor.isFollowing);
  const [followerCount, setFollowerCount] = useState(vendor.followerCount || vendor.followersCount || 0);
  const [loading, setLoading] = useState(false);

  const vendorSlug = vendor.storeSlug || vendor._id;
  const storeUrl = `/vendors/${vendorSlug}`;
  const tags = vendorTagsMap[vendor.storeSlug] || ['Verified Seller', 'Marketplace Partner'];

  const handleFollowClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      sessionStorage.setItem('venma_pending_follow', vendor._id || vendorSlug);
      navigate('/login', { state: { from: storeUrl } });
      return;
    }

    if (loading) return;

    const targetState = !isFollowing;
    const prevFollowing = isFollowing;
    const prevCount = followerCount;

    // Optimistic update
    setLoading(true);
    setIsFollowing(targetState);
    setFollowerCount((prev) => (targetState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (targetState) {
        const res = await vendorService.followVendor(vendor._id || vendorSlug);
        if (res.success) {
          setIsFollowing(true);
          setFollowerCount(res.followerCount);
          if (onToast) onToast(res.message || `You are now following ${vendor.storeName}`, 'success');
        }
      } else {
        const res = await vendorService.unfollowVendor(vendor._id || vendorSlug);
        if (res.success) {
          setIsFollowing(false);
          setFollowerCount(res.followerCount);
          if (onToast) onToast(res.message || `You unfollowed ${vendor.storeName}`, 'success');
        }
      }
    } catch (err) {
      // Rollback
      setIsFollowing(prevFollowing);
      setFollowerCount(prevCount);
      if (err.response?.status === 401) {
        if (onToast) onToast('Please log in to follow stores', 'error');
        navigate('/login', { state: { from: storeUrl } });
      } else {
        if (onToast) onToast(err.response?.data?.message || 'Failed to update follow status', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group relative bg-white dark:bg-[#1E1E22] rounded-[28px] border border-slate-200/80 dark:border-[#2C2C32] overflow-hidden shadow-[0_8px_24px_rgba(28,28,30,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(198,124,78,0.14)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] transition-all duration-220 ease-out flex flex-col justify-between h-full min-h-[500px]">
      {/* 1. Banner Image (16:9) */}
      <Link to={storeUrl} tabIndex={-1} aria-hidden="true" className="block flex-shrink-0">
        <VendorBanner banner={vendor.banner} storeName={vendor.storeName} />
      </Link>

      {/* 2. Initials Badge & 3. Verified Badge Row */}
      <div className="px-6 -mt-4 flex items-center justify-between flex-shrink-0 z-10">
        <InitialsBadge
          name={vendor.storeName}
          className="shadow-sm ring-2 ring-white dark:ring-[#1E1E22] bg-white dark:bg-[#1E1E22]"
        />
        <div className="mb-0">
          <VerifiedBadge />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pt-3 pb-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* 4. Vendor Name */}
          <Link to={storeUrl} className="block group/title">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F8F7F5] group-hover/title:text-[#C87D55] transition-colors line-clamp-1 leading-snug">
              {vendor.storeName}
            </h3>
          </Link>

          {/* Location Badge */}
          {(vendor.location || vendor.address?.city) && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#C67C4E] flex-shrink-0" />
              <span className="truncate">{vendor.location || `${vendor.address?.city}, ${vendor.address?.state}`}</span>
            </div>
          )}

          {/* 5. Category Tags */}
          <VendorTags tags={tags} />

          {/* 6. Store Description */}
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed min-h-[58px]">
            {vendor.description || 'Curated independent storefront offering guaranteed authentic merchandise.'}
          </p>
        </div>

        {/* Bottom Container: 7. Statistics Row & 8. Action Buttons (Follow + Visit Store) */}
        <div className="space-y-4 pt-1">
          <VendorStats
            rating={vendor.rating || 4.9}
            productsCount={formatProductCount(vendor.totalProducts || 0)}
            satisfaction="98%"
          />

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleFollowClick}
              disabled={loading}
              className={`h-12 min-h-[44px] px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-95 select-none ${
                loading
                  ? 'opacity-75 cursor-wait bg-slate-200 dark:bg-slate-700 text-slate-500'
                  : isFollowing
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#C67C4E] hover:bg-[#B36B3D] text-white shadow-sm hover:shadow'
              }`}
              aria-label={isFollowing ? 'Unfollow Store' : 'Follow Store'}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isFollowing ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 flex-shrink-0" />
                  <span>Follow</span>
                </>
              )}
            </button>
            <VendorCTAButton to={storeUrl} label="Visit Store" />
          </div>
        </div>
      </div>
    </article>
  );
}
