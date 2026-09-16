import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Store,
  ShieldCheck,
  Zap,
  Package,
  Cpu,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Watch,
  Utensils,
  Smile,
  HeartPulse,
  Car,
  Briefcase,
  Footprints,
  Trees,
  Layers,
  Lamp,
  PawPrint,
  Baby,
  ToyBrick,
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/customer/ProductCard';
import HeroCarousel from '../../components/common/HeroCarousel';
import StatsCounter from '../../components/common/StatsCounter';
import VendorShowcaseSection from '../../components/vendor/VendorShowcaseSection';

const categoryIconMap = {
  Cpu,
  Shirt,
  Home: HomeIcon,
  Sparkles,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Watch,
  Utensils,
  Smile,
  HeartPulse,
  Car,
  Briefcase,
  Footprints,
  Trees,
  Lamp,
  PawPrint,
  Baby,
  ToyBrick,
  Layers,
  Package,
  Zap,
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [highestRated, setHighestRated] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(8);
  const [vendors, setVendors] = useState([]);
  const [totalVendorsCount, setTotalVendorsCount] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, bestRes, newRes, ratedRes, catRes, vendRes] = await Promise.all([
          api.get('/products?sort=curated&limit=4'),
          api.get('/products?sort=popular&limit=8'),
          api.get('/products?sort=newest&limit=8'),
          api.get('/products?sort=rating&limit=8'),
          api.get('/categories'),
          api.get('/vendors'),
        ]);

        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.data.slice(0, 4));
          setTotalProductsCount(prodRes.data.total || 0);
        }
        if (bestRes.data.success) setBestSellers(bestRes.data.data);
        if (newRes.data.success) setNewArrivals(newRes.data.data);
        if (ratedRes.data.success) setHighestRated(ratedRes.data.data);
        if (catRes.data.success) {
          setTotalCategoriesCount(catRes.data.data.length);
          setCategories(catRes.data.data.slice(0, 10));
        }
        if (vendRes.data.success) {
          setTotalVendorsCount(vendRes.data.data.length || 7);
          setVendors(vendRes.data.data.slice(0, 7));
        }
      } catch (err) {
        console.error('Home data load error', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Promotional Carousel */}
      <HeroCarousel />

      {/* 2. Live Database Statistics Counter */}
      <StatsCounter />

      {/* 3. Featured Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C67C4E]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C67C4E]">Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">Shop by Category</h2>
            <p className="text-xs sm:text-sm text-[#8E8E93] dark:text-[#A1A1A6] mt-1">Browse our top selected retail departments curated by verified vendors</p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center self-start sm:self-auto space-x-1.5 px-4 py-2 rounded-full border border-[#C67C4E] text-[#C67C4E] hover:bg-[#C67C4E] hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#C67C4E] focus:ring-offset-2 dark:focus:ring-offset-[#121214]"
          >
            <span>View All ({totalCategoriesCount} Categories)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const IconComponent = categoryIconMap[cat.icon] || Layers;
            return (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                aria-label={`Shop ${cat.name}`}
                className="group h-[175px] sm:h-[185px] p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] hover:border-[#C67C4E] dark:hover:border-[#C67C4E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(28,28,30,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-200 text-center flex flex-col items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#C67C4E] focus:ring-offset-2 dark:focus:ring-offset-[#121214]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F7F5F2] dark:bg-[#2B2B2F] flex items-center justify-center text-[#C67C4E] group-hover:scale-110 group-hover:bg-[#F3EAE2] dark:group-hover:bg-[#343439] transition-all duration-200 shadow-xs mt-1">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
                </div>
                <span
                  className="text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-[#F8F7F5] group-hover:text-[#C67C4E] dark:group-hover:text-[#C67C4E] transition-colors leading-[1.35] text-center w-full flex items-center justify-center min-h-[44px] px-1 break-words"
                  style={{
                    textWrap: 'balance',
                    overflowWrap: 'anywhere',
                    whiteSpace: 'normal',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                  title={cat.name}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Curated Products */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#C67C4E]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#C67C4E]">Marketplace picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">Curated Products</h2>
            <p className="text-xs sm:text-sm text-[#8E8E93] dark:text-[#A1A1A6] mt-1">Explore 4 handpicked products from our marketplace.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-[460px] rounded-[20px] bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))
            : featuredProducts.map((product) => <ProductCard key={product._id} product={product} variant="curated" />)}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 2. Best Sellers */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#C67C4E]" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Best Sellers</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Most purchased customer favorites across verified merchant stores
            </p>
          </div>
          <Link
            to="/products?sort=popular"
            className="text-xs font-bold text-[#C67C4E] hover:underline flex items-center space-x-1"
          >
            <span>See All Best Sellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#C67C4E]" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">New Arrivals</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Freshly cataloged merchandise from specialized brand creators
              </p>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-xs font-bold text-[#C67C4E] hover:underline flex items-center space-x-1"
            >
              <span>View All New</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Highest Rated */}
      {highestRated.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#C67C4E]" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Highest Rated</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Top tier customer rated goods with ★ 4.8+ average feedback
              </p>
            </div>
            <Link
              to="/products?sort=rating"
              className="text-xs font-bold text-[#C67C4E] hover:underline flex items-center space-x-1"
            >
              <span>View Top Rated</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highestRated.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Vendor Spotlight Banner */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#1C1C1E] via-[#2A2A2E] to-[#C67C4E] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="bg-[#C67C4E]/20 text-[#D4A24C] text-xs font-bold px-3 py-1 rounded-full border border-[#C67C4E]/30">
              Vendor Spotlight • TechNova Electronics
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Crafting Superior Acoustic Sound & Ergonomics.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              TechNova is one of our top-tier rated stores with 4.9 stars across hundreds of verified deliveries. Browse their exclusive headphones, mechanical keys, and desk peripherals.
            </p>
            <div className="pt-2">
              <Link
                to="/vendors/technova-electronics"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-md transition"
              >
                <span>Visit TechNova Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="/generated-products/electronics/wireless-headphones-main.webp"
              alt="Spotlight Product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. Top-Rated Vendors Showcase */}
      <VendorShowcaseSection vendors={vendors} totalVendors={totalVendorsCount} loading={loading} />

      {/* 9. Customer Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Customer Experiences</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real feedback from verified buyers across 250+ completed multi-vendor orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex text-amber-400 mb-3">{'★'.repeat(5)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "Ordering from multiple vendors on VENMA is remarkably seamless. I bought headphones from TechNova and streetwear from Urban Fashion in one single checkout!"
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1E] text-[#C67C4E] border border-[#C67C4E]/40 font-bold flex items-center justify-center text-xs">
                JD
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">James Davidson</h5>
                <span className="text-[10px] text-slate-400">Verified Buyer • Seattle</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex text-amber-400 mb-3">{'★'.repeat(5)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "The PDF invoices generated automatically with item breakdowns made expense reports effortless. Outstanding marketplace platform!"
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#C67C4E] text-white font-bold flex items-center justify-center text-xs">
                SL
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">Sophia Lin</h5>
                <span className="text-[10px] text-slate-400">Verified Buyer • New York</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex text-amber-400 mb-3">{'★'.repeat(5)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "As a vendor, having a dedicated dashboard with live monthly sales charts and instant order fulfillment controls has doubled my monthly growth."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#D4A24C] text-[#1C1C1E] font-bold flex items-center justify-center text-xs">
                HC
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Vance</h5>
                <span className="text-[10px] text-[#C67C4E] font-semibold">Vendor Partner • HomeCraft</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Newsletter */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-[#1C1C1E] p-8 sm:p-12 text-center text-white relative overflow-hidden border border-[#2A2A2E]">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black">Stay Ahead with Exclusive Deals</h3>
            <p className="text-xs text-slate-300">
              Subscribe to get curated discounts, new vendor launches, and weekend coupons delivered directly to your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to VENMA newsletter!'); }} className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-[#2A2A2E] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C67C4E]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-md transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
