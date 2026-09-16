import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Package, Check, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';

// Modular Product Components
import ProductGallery from '../../components/product/ProductGallery';
import ProductInfoCard from '../../components/product/ProductInfoCard';
import DeliveryTrustCard from '../../components/product/DeliveryTrustCard';
import ProductHighlights from '../../components/product/ProductHighlights';
import ProductAccordions from '../../components/product/ProductAccordions';
import VendorSpotlight from '../../components/product/VendorSpotlight';
import ProductReviewsSection from '../../components/product/ProductReviewsSection';
import RelatedProductsCarousel from '../../components/product/RelatedProductsCarousel';
import StickyMobileBar from '../../components/product/StickyMobileBar';
import ProductDetailsSkeleton from '../../components/product/ProductDetailsSkeleton';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { recentlyViewed, addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartSuccessToast, setCartSuccessToast] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products/' + id);
        if (res.data.success) {
          const prodData = res.data.data;
          setProduct(prodData);
          setRelatedProducts(res.data.relatedProducts || []);
          setQuantity(1);

          // Record in recently viewed context
          addRecentlyViewed(prodData);

          // Fetch reviews
          const reviewRes = await api.get('/reviews/product/' + prodData._id);
          if (reviewRes.data.success) {
            setReviews(reviewRes.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setCartSuccessToast(true);
    setTimeout(() => setCartSuccessToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleScrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please log in to submit a review.');
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: newRating,
        title: newTitle,
        comment: newComment,
      });
      if (res.data.success) {
        setReviewSuccess('Thank you! Your verified review has been posted.');
        setReviews([res.data.data, ...reviews]);
        setNewTitle('');
        setNewComment('');
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Package className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-[#1C1C1E] dark:text-white">
          Product Listing Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          This product listing might be unavailable, out of stock, or removed by the merchant.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block px-6 py-3 rounded-xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white text-xs font-bold shadow-md transition"
        >
          Explore All Marketplace Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const categoryName = product.category?.name || 'Curated Goods';
  const categorySlug = product.category?.slug || '';

  // Gallery image list with fallbacks
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : ['/generated-products/electronics/wireless-headphones-main.webp'];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 max-w-7xl pb-24 lg:pb-12">
      {/* 1. Floating Cart Success Notification Toast */}
      {cartSuccessToast && (
        <aside
          aria-label="Cart notification"
          className="fixed top-20 right-5 z-50 bg-[#1C1C1E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-slideDown"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Added {quantity} unit(s) to Cart</p>
            <p className="text-slate-400 text-[11px] truncate max-w-xs">{product.name}</p>
          </div>
          <Link
            to="/cart"
            className="ml-3 px-3 py-1.5 rounded-lg bg-[#C87D55] text-white text-[11px] font-bold hover:bg-[#A9653C] transition"
          >
            View Cart
          </Link>
        </aside>
      )}

      {/* 2. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-400 font-medium overflow-x-auto pb-1">
        <Link to="/" className="hover:text-[#C87D55] transition">
          Home
        </Link>
        {categorySlug ? (
          <>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link
              to={'/products?category=' + categorySlug}
              className="hover:text-[#C87D55] transition"
            >
              {categoryName}
            </Link>
          </>
        ) : (
          <>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link to="/products" className="hover:text-[#C87D55] transition">
              Products
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* 3. Main Product Showcase & Purchasing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery, Highlights, Accordions & Vendor (7 Cols) */}
        <div className="lg:col-span-7 space-y-10">
          {/* Interactive Gallery with Zoom & Lightbox */}
          <ProductGallery images={galleryImages} productName={product.name} />

          {/* 4-Card Feature Highlights */}
          <ProductHighlights product={product} />

          {/* Animated Information Accordions */}
          <ProductAccordions product={product} />

          {/* Merchant Spotlight Card */}
          <VendorSpotlight vendor={product.vendor} />
        </div>

        {/* Right Column: Sticky Purchase Box & Delivery Trust Card (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {/* Main Info Card */}
          <ProductInfoCard
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            inWishlist={inWishlist}
            onToggleWishlist={() => toggleWishlist(product._id)}
            onScrollToReviews={handleScrollToReviews}
          />

          {/* Trust, Delivery & Dispatch Card */}
          <DeliveryTrustCard />
        </div>
      </div>

      {/* 4. Customer Reviews Section */}
      <ProductReviewsSection
        product={product}
        reviews={reviews}
        user={user}
        newRating={newRating}
        setNewRating={setNewRating}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newComment={newComment}
        setNewComment={setNewComment}
        handleReviewSubmit={handleReviewSubmit}
        reviewSubmitting={reviewSubmitting}
        reviewError={reviewError}
        reviewSuccess={reviewSuccess}
      />

      {/* 5. Related Products from same category */}
      {relatedProducts.length > 0 && (
        <RelatedProductsCarousel
          title={`More in ${categoryName}`}
          subtitle={`Popular items in ${categoryName} curated for you`}
          products={relatedProducts}
        />
      )}

      {/* 6. Recently Viewed Items */}
      {recentlyViewed.length > 1 && (
        <RelatedProductsCarousel
          title="Recently Viewed Items"
          subtitle="Pick up where you left off in your shopping session"
          products={recentlyViewed.filter((p) => p._id !== product._id).slice(0, 4)}
        />
      )}

      {/* 7. Floating Mobile Bottom Action Bar */}
      <StickyMobileBar
        product={product}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}
